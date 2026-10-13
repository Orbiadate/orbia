import type {
  SolicitudUsuario,
  SolicitudEstructurada,
  FranjaFecha,
  FranjaHora,
} from "../types";
import { parsearSolicitudLocal } from "../core/parse";

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
    role?: string;
  };
  finishReason?: string;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

interface LLMOutput {
  nombreUsuario: string;
  servicio: string;
  franjaFecha: FranjaFecha;
  franjaHora: FranjaHora;
}

// Códigos de estado HTTP que ameritan reintento por alta demanda o fallas transitorias
const HTTP_STATUS_REINTENTABLES = new Set([429, 500, 502, 503, 504]);
const MAX_REINTENTOS = 5;
const INTERVALO_MINIMO_API_MS = 1500;

// Mutex para garantizar que solo haya una petición a la API de Gemini activa a la vez
let mutexApi = Promise.resolve();
// Timestamp de finalización de la última llamada HTTP a la API de Gemini
let ultimoFinLlamadaApi = 0;

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Obtiene la lista de modelos configurados en orden de preferencia.
 * Permite configuración dinámica mediante variables de entorno GEMINI_MODELS
 * o GEMINI_MODEL (como principal con modelos de respaldo automáticos).
 */
export function obtenerModelosConfigurados(): string[] {
  if (process.env.GEMINI_MODELS) {
    const custom = process.env.GEMINI_MODELS.split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (custom.length > 0) return custom;
  }
  const principal = (process.env.GEMINI_MODEL || "gemini-3.8-flash").trim();
  const respaldos = ["gemini-2.5-flash", "gemini-flash-latest"];
  return [principal, ...respaldos.filter((m) => m !== principal)];
}

/**
 * Calcula la demora de reintento con backoff exponencial y jitter (aprox 2s, 4s, 8s, 16s, máx 30s).
 */
function calcularDemoraConBackoffYJitter(intento: number): number {
  const baseMs = Math.min(30000, 2000 * Math.pow(2, intento - 1));
  const variacionJitter = (Math.random() * 0.3 - 0.15) * baseMs; // +/- 15%
  const total = Math.round(baseMs + variacionJitter);
  return Math.min(30000, Math.max(1000, total));
}

/**
 * Analiza el encabezado Retry-After en segundos o formato de fecha HTTP.
 */
function obtenerDemoraRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const segundos = parseInt(header, 10);
  if (!isNaN(segundos) && segundos >= 0) {
    return segundos * 1000;
  }
  const timestamp = Date.parse(header);
  if (!isNaN(timestamp)) {
    const diff = timestamp - Date.now();
    return diff > 0 ? diff : 0;
  }
  return null;
}

/**
 * Ejecuta una operación garantizando un solo request a la vez (mutex)
 * y un mínimo de 1.5 s entre llamadas consecutivas a la API.
 */
async function ejecutarConControlDeTasa<T>(operacion: () => Promise<T>): Promise<T> {
  let resolverSiguiente: () => void = () => {};
  const esperarTurno = new Promise<void>((resolve) => {
    resolverSiguiente = resolve;
  });

  const turnoPrevio = mutexApi;
  mutexApi = (async () => {
    try {
      await turnoPrevio;
    } catch {
      // Continuar la cadena independientemente del resultado previo
    }
  })();

  await turnoPrevio;

  try {
    const ahora = Date.now();
    const tiempoDesdeUltima = ahora - ultimoFinLlamadaApi;
    if (ultimoFinLlamadaApi > 0 && tiempoDesdeUltima < INTERVALO_MINIMO_API_MS) {
      await esperar(INTERVALO_MINIMO_API_MS - tiempoDesdeUltima);
    }
    const res = await operacion();
    return res;
  } finally {
    ultimoFinLlamadaApi = Date.now();
    resolverSiguiente();
  }
}

/**
 * Realiza una llamada HTTP POST a la API de Gemini usando fetch con control de concurrencia y tasa.
 */
async function llamarApiGemini(
  modelo: string,
  apiKey: string,
  systemPrompt: string,
  userContent: string,
  intento: number
): Promise<{
  ok: boolean;
  status: number;
  data?: GeminiResponse;
  errorText?: string;
  retryAfterMs?: number | null;
}> {
  return ejecutarConControlDeTasa(async () => {
    console.log(
      `[LLM] Enviando solicitud | Modelo: ${modelo} | Intento: ${intento}/${MAX_REINTENTOS}`
    );

    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userContent }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );
    } catch (networkError) {
      console.warn(
        `[LLM] Error de conexión de red al consultar ${modelo}: ${(networkError as Error).message}`
      );
      return {
        ok: false,
        status: 503,
        errorText: (networkError as Error).message,
        retryAfterMs: null,
      };
    }

    const status = response.status;
    console.log(
      `[LLM] Respuesta recibida | Modelo: ${modelo} | Intento: ${intento}/${MAX_REINTENTOS} | Código HTTP: ${status}`
    );

    const retryAfterHeader = response.headers.get("retry-after");
    const retryAfterMs = obtenerDemoraRetryAfter(retryAfterHeader);

    if (response.ok) {
      const data = (await response.json()) as GeminiResponse;
      return { ok: true, status, data, retryAfterMs };
    }

    const errorBody = await response.text();
    return { ok: false, status, errorText: errorBody, retryAfterMs };
  });
}

/**
 * Ejecuta los reintentos para un modelo específico.
 * Reintenta solo en 429, 500, 502, 503, 504 con backoff y Retry-After.
 * Falla de inmediato ante errores 400, 401, 403, 404.
 */
async function consultarModeloConReintentos(
  modelo: string,
  apiKey: string,
  systemPrompt: string,
  userContent: string
): Promise<{ ok: true; data: GeminiResponse } | { ok: false; error: string; esNoReintentable: boolean }> {
  for (let intento = 1; intento <= MAX_REINTENTOS; intento++) {
    const res = await llamarApiGemini(modelo, apiKey, systemPrompt, userContent, intento);

    if (res.ok && res.data) {
      if (res.data.error) {
        console.warn(
          `[LLM] Error en cuerpo de respuesta | Modelo: ${modelo} | Mensaje: ${res.data.error.message}`
        );
        if (intento < MAX_REINTENTOS) {
          const demora = calcularDemoraConBackoffYJitter(intento);
          console.warn(`[LLM] Reintentando tras error en cuerpo en ${demora}ms...`);
          await esperar(demora);
          continue;
        }
        return { ok: false, error: res.data.error.message, esNoReintentable: false };
      }
      return { ok: true, data: res.data };
    }

    const status = res.status;
    if (HTTP_STATUS_REINTENTABLES.has(status)) {
      if (intento < MAX_REINTENTOS) {
        const demoraCalculada = calcularDemoraConBackoffYJitter(intento);
        const retryAfterVal = res.retryAfterMs;
        const demoraFinal =
          typeof retryAfterVal === "number" && retryAfterVal > 0
            ? Math.max(retryAfterVal, demoraCalculada)
            : demoraCalculada;

        console.warn(
          `[LLM] Código HTTP ${status} (reintentable) en modelo ${modelo}. Esperando ${demoraFinal}ms antes del reintento ${intento + 1}/${MAX_REINTENTOS}...`
        );
        await esperar(demoraFinal);
        continue;
      } else {
        console.warn(
          `[LLM] Se agotaron los ${MAX_REINTENTOS} intentos para el modelo ${modelo} (HTTP ${status}).`
        );
        return {
          ok: false,
          error: `Reintentos agotados para ${modelo} (HTTP ${status})`,
          esNoReintentable: false,
        };
      }
    } else {
      // 400, 401, 403, 404 u otros errores no reintentables: no reintentar
      const mensaje = `Error HTTP ${status} no reintentable en modelo ${modelo}`;
      console.error(`[LLM] ${mensaje}. Omitiendo más reintentos para este modelo.`);
      return { ok: false, error: mensaje, esNoReintentable: true };
    }
  }

  return {
    ok: false,
    error: `Intentos agotados para modelo ${modelo}`,
    esNoReintentable: false,
  };
}

/**
 * Valida el JSON devuelto por el LLM.
 * Devuelve el objeto parseado si es válido, o null si es inválido.
 */
function validarYExtraerJSON(rawText: string): Partial<LLMOutput> | null {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : rawText;
    const parsed = JSON.parse(jsonString);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Capa Impura (I/O Shell): Orquesta la extracción de datos con LLM.
 * Implementa reintentos con backoff exponencial, modelos de respaldo en cascada,
 * control estricto de concurrencia y tasa de llamadas, y Plan B determinista local
 * en caso de que todos los modelos fallen o devuelvan datos inválidos.
 */
export async function parsearSolicitudConLLM(
  solicitud: SolicitudUsuario
): Promise<SolicitudEstructurada> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[LLM] GEMINI_API_KEY no encontrada en .env. Activando Plan B (parser local determinista)."
    );
    return parsearSolicitudLocal(solicitud, true);
  }

  const systemPrompt = `Eres un extractor de datos para ORBIA, un sistema de agendamiento de citas.
Tu tarea es analizar la solicitud del usuario y devolver ÚNICAMENTE un objeto JSON válido, sin explicaciones ni markdown.
El JSON debe seguir estrictamente este esquema:
{
  "nombreUsuario": string,
  "servicio": string,
  "franjaFecha": "hoy" | "manana" | "esta_semana" | "sin_especificar",
  "franjaHora": "manana" | "tarde" | "noche" | "sin_especificar"
}

Reglas:
- franjaFecha: debe ser exactamente uno de ["hoy", "manana", "esta_semana", "sin_especificar"].
- franjaHora: debe ser exactamente uno de ["manana", "tarde", "noche", "sin_especificar"].
- servicio: servicio normalizado en minúsculas (ej. "corte de cabello", "cambio de aceite").
- nombreUsuario: nombre de la persona que solicita la cita.`;

  const userContent = JSON.stringify({
    nombreUsuario: solicitud.nombreUsuario,
    servicio: solicitud.servicio,
    fechaPreferida: solicitud.fechaPreferida,
    horaPreferida: solicitud.horaPreferida,
    mensajeOriginal: solicitud.mensajeOriginal ?? "",
  });

  const modelos = obtenerModelosConfigurados();

  for (let i = 0; i < modelos.length; i++) {
    const modelo = modelos[i];
    console.log(`[LLM] Evaluando modelo (${i + 1}/${modelos.length}): ${modelo}`);

    const resultado = await consultarModeloConReintentos(
      modelo,
      apiKey,
      systemPrompt,
      userContent
    );

    if (resultado.ok) {
      const rawText =
        resultado.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "{}";

      const parsed = validarYExtraerJSON(rawText);

      if (parsed) {
        console.log(`[LLM] JSON validado exitosamente del modelo: ${modelo}`);
        const estructurada: SolicitudEstructurada = {
          nombreUsuario: parsed.nombreUsuario || solicitud.nombreUsuario,
          intencion: "agendar",
          servicio: (parsed.servicio || solicitud.servicio).toLowerCase().trim(),
          franjaFecha: parsed.franjaFecha || "sin_especificar",
          franjaHora: parsed.franjaHora || "sin_especificar",
          fechaPreferida: solicitud.fechaPreferida,
          horaPreferida: solicitud.horaPreferida,
          modoLocal: false,
        };
        return estructurada;
      } else {
        console.warn(
          `[LLM] La respuesta del modelo ${modelo} no es un JSON válido: ${rawText}. Tratándolo como error controlado.`
        );
        // Si el JSON es inválido, continuar al siguiente modelo o al Plan B
      }
    } else {
      console.warn(
        `[LLM] Modelo ${modelo} no disponible: ${resultado.error}.`
      );
    }

    if (i < modelos.length - 1) {
      console.log(`[LLM] Pasando al siguiente modelo de respaldo en la lista...`);
    }
  }

  // Plan B sin LLM: si todos los modelos fallaron o agotaron sus reintentos
  console.warn(
    "[LLM] Todos los modelos de Gemini fallaron o no están disponibles. Activando Plan B (parser local determinista)."
  );
  return parsearSolicitudLocal(solicitud, true);
}
