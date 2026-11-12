import type { Horario, Negocio, Servicio, SolicitudEstructurada } from "../types";

/**
 * Determina de forma pura si una hora dada pertenece a una franja horaria.
 */
function horaEnFranja(hora: string, franja: SolicitudEstructurada["franjaHora"]): boolean {
  const h = parseInt(hora.split(":")[0], 10);
  if (franja === "manana") return h >= 6 && h < 12;
  if (franja === "tarde") return h >= 12 && h < 19;
  if (franja === "noche") return h >= 19 || h < 6;
  return true;
}

/**
 * Filtra horarios disponibles de acuerdo con los criterios del usuario y el catálogo.
 * Función 100% pura: sin mutaciones ni efectos secundarios.
 */
export function filtrarDisponibilidad(
  horarios: readonly Horario[],
  negocios: readonly Negocio[],
  solicitud: SolicitudEstructurada
): Horario[] {
  return horarios.filter((h) => {
    if (!h.disponible) return false;

    const negocio = negocios.find((n) => n.id === h.negocioId);
    const servicio = negocio?.servicios.find((s: Servicio) => s.id === h.servicioId);
    if (!servicio) return false;

    const coincideServicio = servicio.nombre
      .toLowerCase()
      .includes(solicitud.servicio.toLowerCase());

    return coincideServicio && horaEnFranja(h.hora, solicitud.franjaHora);
  });
}

/**
 * Elige el mejor horario cronológicamente entre las opciones disponibles.
 */
export function elegirMejorHorario(opciones: readonly Horario[]): Horario | undefined {
  return [...opciones].sort((a, b) => a.hora.localeCompare(b.hora))[0];
}

