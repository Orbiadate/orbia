import type { SolicitudUsuario, SolicitudEstructurada, FranjaHora, FranjaFecha, IntencionUsuario } from "../types";

const PALABRAS_TARDE = ["tarde"];
const PALABRAS_MANANA = ["mañana", "manana"];
const PALABRAS_NOCHE = ["noche"];

export function detectarFranjaHora(texto: string): FranjaHora {
  const t = texto.toLowerCase();
  if (PALABRAS_TARDE.some((p) => t.includes(p))) return "tarde";
  if (PALABRAS_NOCHE.some((p) => t.includes(p))) return "noche";
  if (PALABRAS_MANANA.some((p) => t.includes(p))) return "manana";

  const matchHora = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (matchHora) {
    let hora = parseInt(matchHora[1], 10);
    const ampm = matchHora[3]?.toLowerCase();
    if (ampm === "pm" && hora < 12) hora += 12;
    if (ampm === "am" && hora === 12) hora = 0;
    if (hora >= 6 && hora < 12) return "manana";
    if (hora >= 12 && hora < 19) return "tarde";
    if (hora >= 19 || hora < 6) return "noche";
  }

  return "sin_especificar";
}

export function detectarFranjaFecha(texto: string): FranjaFecha {
  const t = texto.toLowerCase();
  if (t.includes("hoy")) return "hoy";
  if (t.includes("mañana") || t.includes("manana")) return "manana";
  if (
    t.includes("viernes") ||
    t.includes("sabado") ||
    t.includes("domingo") ||
    t.includes("lunes") ||
    t.includes("martes") ||
    t.includes("miercoles") ||
    t.includes("jueves") ||
    t.includes("semana") ||
    /\d{4}-\d{2}-\d{2}/.test(t) ||
    /\d{1,2}\/\d{1,2}/.test(t)
  ) {
    return "esta_semana";
  }
  return "sin_especificar";
}

export function detectarServicio(texto: string): string {
  const t = texto.toLowerCase();
  const servicios = [
    "corte de cabello y barba",
    "corte y barba",
    "corte de cabello",
    "corte degradado",
    "corte clásico",
    "corte",
    "arreglo de barba",
    "barba express",
    "perfilado de barba",
    "afeitado tradicional",
    "barba",
    "tinte",
    "manicura",
    "pedicura",
    "masaje",
    "facial",
  ];
  for (const s of servicios) {
    if (t.includes(s)) return s;
  }
  return "corte";
}

export function detectarIntencion(texto: string): IntencionUsuario {
  const t = texto.toLowerCase();
  if (t.includes("cancelar") || t.includes("anular")) return "cancelar";
  if (t.includes("cambiar") || t.includes("modificar") || t.includes("reprogramar")) return "modificar";
  if (t.includes("consultar") || t.includes("ver mis") || t.includes("mis citas")) return "consultar";
  return "agendar";
}

export function parsearSolicitudLocal(
  solicitud: SolicitudUsuario,
  marcarModoLocal: boolean = true
): SolicitudEstructurada {
  const mensaje = solicitud.mensajeOriginal || solicitud.servicio || "";
  const franjaHora = detectarFranjaHora(mensaje);
  const franjaFecha = detectarFranjaFecha(mensaje);
  const servicio = solicitud.servicio || detectarServicio(mensaje);
  const intencion = detectarIntencion(mensaje);

  return {
    nombreUsuario: solicitud.nombreUsuario,
    intencion,
    servicio,
    franjaFecha,
    franjaHora,
    fechaPreferida: solicitud.fechaPreferida || "2026-11-15",
    horaPreferida: solicitud.horaPreferida || "10:00",
    ...(marcarModoLocal ? { modoLocal: true } : {}),
  };
}

export const parsearSolicitud = parsearSolicitudLocal;

export {
  parsearSolicitudConLLM,
  parsearSolicitudConResiliencia,
} from "../io/llm";
