

import type { Horario, Negocio, Servicio, SolicitudEstructurada } from "../types";

function horaEnFranja(hora: string, franja: SolicitudEstructurada["franjaHora"]): boolean {
  const h = parseInt(hora.split(":")[0], 10);
  if (franja === "manana") return h >= 6 && h < 12;
  if (franja === "tarde") return h >= 12 && h < 19;
  if (franja === "noche") return h >= 19 || h < 6;
  return true;
}

export function filtrarDisponibilidad(
    horarios: Horario[],
    negocios: Negocio[],
    solicitud: SolicitudEstructurada
  ): Horario[] {
    return horarios.filter((h) => {
      if (!h.disponible) return false;

      const negocio = negocios.find((n) => n.id === h.negocioId);
      const servicio = negocio?.servicios.find((s: Servicio) => s.id === h.servicioId);
      if (!servicio) return false;

      const coincideServicio = servicio.nombre
        .toLowerCase()
        .includes(solicitud.servicio);

      return coincideServicio && horaEnFranja(h.hora, solicitud.franjaHora);
    });
  }


  export function elegirMejorHorario(opciones: Horario[]): Horario | undefined {
    return [...opciones].sort((a, b) => a.hora.localeCompare(b.hora))[0];
  }