// Fase 1-2: función PURA (sin IO, sin llamadas externas).
// Más adelante, en io/llm.ts, se reemplaza esta lógica por una llamada real
// a un modelo de lenguaje, pero el resto del pipeline no cambia.

import type { SolicitudUsuario, SolicitudEstructurada } from "../types";

const PALABRAS_TARDE = ["tarde"];
const PALABRAS_MANANA = ["mañana", "manana"];
const PALABRAS_NOCHE = ["noche"];

function detectarFranjaHora(texto: string): SolicitudEstructurada["franjaHora"] {
  const t = texto.toLowerCase();
  if (PALABRAS_TARDE.some((p) => t.includes(p))) return "tarde";
  if (PALABRAS_NOCHE.some((p) => t.includes(p))) return "noche";
  if (PALABRAS_MANANA.some((p) => t.includes(p))) return "manana";

  // Detección determinista por expresión regular para horas (ej: 14:00, 16:30, 9am, 4pm, 10:00)
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

function detectarFranjaFecha(texto: string): SolicitudEstructurada["franjaFecha"] {
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

/**
 * Convierte una SolicitudUsuario en una SolicitudEstructurada mediante un parser local determinista.
 * Función 100% pura: misma entrada -> misma salida, sin I/O ni efectos secundarios.
 * Se utiliza como Plan B de respaldo cuando los servicios LLM externos no están disponibles.
 */
export function parsearSolicitudLocal(
  solicitud: SolicitudUsuario,
  marcarModoLocal: boolean = true
): SolicitudEstructurada {
  const textoFechaHora = `${solicitud.fechaPreferida ?? ""} ${solicitud.horaPreferida ?? ""}`;
  const textoCompleto = `${solicitud.mensajeOriginal ?? ""} ${textoFechaHora}`.trim();

  let servicio = solicitud.servicio?.trim().toLowerCase() || "";
  if (!servicio && solicitud.mensajeOriginal) {
    const matchServicio = solicitud.mensajeOriginal.match(
      /(?:para|servicio|de)\s+([a-záéíóúñ\s]+?)(?:\s+(?:el|a las|en|hoy|mañana)|\.|$)/i
    );
    if (matchServicio && matchServicio[1]) {
      servicio = matchServicio[1].trim().toLowerCase();
    }
  }

  return {
    nombreUsuario: solicitud.nombreUsuario.trim(),
    intencion: "agendar",
    servicio: servicio || solicitud.servicio.trim().toLowerCase(),
    franjaFecha: detectarFranjaFecha(textoFechaHora || textoCompleto),
    franjaHora: detectarFranjaHora(textoFechaHora || textoCompleto),
    fechaPreferida: solicitud.fechaPreferida,
    horaPreferida: solicitud.horaPreferida,
    ...(marcarModoLocal ? { modoLocal: true } : {}),
  };
}

/**
 * Alias de compatibilidad hacia atrás para parsearSolicitud
 */
export const parsearSolicitud = parsearSolicitudLocal;