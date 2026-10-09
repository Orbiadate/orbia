import type {
  SolicitudUsuario,
  SolicitudEstructurada,
  FranjaFecha,
  FranjaHora,
} from "../types";
import { parsearSolicitud } from "../core/parse";

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

const MODELO = "gemini-3.8-flash";

/**
 * Capa Impura (I/O Shell): Función asíncrona con efectos secundarios que se comunica
 * con la API de Google Gemini (gemini-3.8-flash) mediante fetch y GEMINI_API_KEY.
 *
 * Transforma una SolicitudUsuario en lenguaje natural a una SolicitudEstructurada formal,
 * permitiendo que el núcleo de la aplicación (src/core/) se mantenga 100% puro.
 */
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parsearSolicitudConLLM(
  solicitud: SolicitudUsuario
): Promise<SolicitudEstructurada> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "Aviso: GEMINI_API_KEY no encontrada en .env. Usando parsearSolicitud (modo local) como fallback."
    );
    return parsearSolicitud(solicitud);
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

  const maxReintentos = 2;
  let intento = 0;
  let response: Response;

  while (true) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`,
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

    if (response.status === 503 && intento < maxReintentos) {
      intento++;
      console.warn(
        `Aviso: Gemini API devolvió 503 (alta demanda). Reintentando en 2 segundos (intento ${intento} de ${maxReintentos})...`
      );
      await esperar(2000);
      continue;
    }

    break;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Error HTTP al consultar Gemini API (${response.status}): ${errorBody}`
    );
  }

  const data = (await response.json()) as GeminiResponse;

  if (data.error) {
    throw new Error(`Error en respuesta de Gemini API: ${data.error.message}`);
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "{}";

  // Extracción robusta de JSON si viene envuelto en delimitadores
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : rawText;

  let parsed: Partial<LLMOutput>;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error(
      `La respuesta de Gemini no es un JSON válido: ${rawText}`
    );
  }

  const estructurada: SolicitudEstructurada = {
    nombreUsuario: parsed.nombreUsuario || solicitud.nombreUsuario,
    intencion: "agendar",
    servicio: (parsed.servicio || solicitud.servicio).toLowerCase().trim(),
    franjaFecha: parsed.franjaFecha || "sin_especificar",
    franjaHora: parsed.franjaHora || "sin_especificar",
    fechaPreferida: solicitud.fechaPreferida,
    horaPreferida: solicitud.horaPreferida,
  };

  return estructurada;
}
