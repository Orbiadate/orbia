export interface GeminiPart {
  text?: string;
}

export interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
    role?: string;
  };
  finishReason?: string;
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

const HTTP_STATUS_REINTENTABLES = new Set([429, 500, 502, 503, 504]);
export const MAX_REINTENTOS = 5;
const INTERVALO_MINIMO_API_MS = 1500;

let mutexApi = Promise.resolve();
let ultimoFinLlamadaApi = 0;

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function obtenerModelosConfigurados(): string[] {
  if (process.env.GEMINI_MODELS) {
    const custom = process.env.GEMINI_MODELS.split(",").map((m) => m.trim()).filter(Boolean);
    if (custom.length > 0) return custom;
  }
  const principal = (process.env.GEMINI_MODEL || "gemini-3.8-flash").trim();
  const respaldos = ["gemini-2.5-flash", "gemini-flash-latest"];
  return [principal, ...respaldos.filter((m) => m !== principal)];
}

export function calcularDemoraConBackoffYJitter(intento: number): number {
  const baseMs = Math.min(30000, 2000 * Math.pow(2, intento - 1));
  const variacionJitter = (Math.random() * 0.3 - 0.15) * baseMs;
  const total = Math.round(baseMs + variacionJitter);
  return Math.min(30000, Math.max(1000, total));
}

export function obtenerDemoraRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const segundos = parseInt(header, 10);
  if (!isNaN(segundos) && segundos >= 0) return segundos * 1000;
  const timestamp = Date.parse(header);
  if (!isNaN(timestamp)) {
    const diff = timestamp - Date.now();
    return diff > 0 ? diff : 0;
  }
  return null;
}

async function ejecutarConControlDeTasa<T>(operacion: () => Promise<T>): Promise<T> {
  let resolverSiguiente: () => void = () => {};
  const esperarTurno = new Promise<void>((resolve) => {
    resolverSiguiente = resolve;
  });
  const turnoPrevio = mutexApi;
  mutexApi = (async () => {
    try { await turnoPrevio; } catch {}
  })();
  await turnoPrevio;
  try {
    const ahora = Date.now();
    const tiempoDesdeUltima = ahora - ultimoFinLlamadaApi;
    if (ultimoFinLlamadaApi > 0 && tiempoDesdeUltima < INTERVALO_MINIMO_API_MS) {
      await esperar(INTERVALO_MINIMO_API_MS - tiempoDesdeUltima);
    }
    return await operacion();
  } finally {
    ultimoFinLlamadaApi = Date.now();
    resolverSiguiente();
  }
}

export async function llamarApiGemini(
  modelo: string,
  apiKey: string,
  systemPrompt: string,
  userContent: string,
  intento: number
): Promise<{ ok: boolean; status: number; data?: GeminiResponse; errorText?: string; retryAfterMs?: number | null }> {
  return ejecutarConControlDeTasa(async () => {
    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userContent }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );
    } catch (networkError) {
      return { ok: false, status: 503, errorText: (networkError as Error).message, retryAfterMs: null };
    }

    const status = response.status;
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

export async function consultarModeloConReintentos(
  modelo: string,
  apiKey: string,
  systemPrompt: string,
  userContent: string
): Promise<{ ok: true; data: GeminiResponse } | { ok: false; error: string; esNoReintentable: boolean }> {
  for (let intento = 1; intento <= MAX_REINTENTOS; intento++) {
    const res = await llamarApiGemini(modelo, apiKey, systemPrompt, userContent, intento);
    if (res.ok && res.data) {
      if (res.data.error) {
        if (intento < MAX_REINTENTOS) {
          await esperar(calcularDemoraConBackoffYJitter(intento));
          continue;
        }
        return { ok: false, error: res.data.error.message, esNoReintentable: false };
      }
      return { ok: true, data: res.data };
    }
    if (HTTP_STATUS_REINTENTABLES.has(res.status)) {
      if (intento < MAX_REINTENTOS) {
        const demora = res.retryAfterMs ?? calcularDemoraConBackoffYJitter(intento);
        await esperar(demora);
        continue;
      }
      return { ok: false, error: `Reintentos agotados (${res.status})`, esNoReintentable: false };
    }
    return { ok: false, error: `Error HTTP ${res.status} no reintentable`, esNoReintentable: true };
  }
  return { ok: false, error: `Intentos agotados para ${modelo}`, esNoReintentable: false };
}

