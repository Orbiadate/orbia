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
  return "sin_especificar";
}

function detectarFranjaFecha(texto: string): SolicitudEstructurada["franjaFecha"] {
  const t = texto.toLowerCase();
  if (t.includes("hoy")) return "hoy";
  if (t.includes("mañana") || t.includes("manana")) return "manana";
  if (t.includes("viernes") || t.includes("semana")) return "esta_semana";
  return "sin_especificar";
}

/**
 * Convierte una SolicitudUsuario (texto libre) en una SolicitudEstructurada.
 * Es una función pura: misma entrada -> misma salida, sin efectos secundarios.
 */
export function parsearSolicitud(solicitud: SolicitudUsuario): SolicitudEstructurada {
  const textoCompleto = `${solicitud.fechaPreferida ?? ""} ${solicitud.horaPreferida ?? ""}`;

  return {
    nombreUsuario: solicitud.nombreUsuario,
    intencion: "agendar",
    servicio: solicitud.servicio.toLowerCase().trim(),
    franjaFecha: detectarFranjaFecha(textoCompleto),
    franjaHora: detectarFranjaHora(textoCompleto),
    fechaPreferida: solicitud.fechaPreferida,
    horaPreferida: solicitud.horaPreferida,
  };
}