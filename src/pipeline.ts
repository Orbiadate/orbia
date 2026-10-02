import type { SolicitudUsuario, Cita, Negocio, Horario, Servicio, Recordatorio } from "./types";
import { parsearSolicitudConLLM } from "./io/llm";
import { parsearSolicitud } from "./core/parse";
import { filtrarDisponibilidad, elegirMejorHorario } from "./core/disponibilidad";
import { reservarCita, cancelarCita, modificarCita, registrarDuracionServicio, consultarCitas, generarRecordatorios } from "./core/acciones";

export interface ResultadoAgente {
  exito: boolean;
  mensaje: string;
  cita?: Cita;
}

export interface ResultadoConsulta {
  exito: boolean;
  mensaje: string;
  citas: Cita[];
}

export interface ResultadoRecordatorios {
  exito: boolean;
  mensaje: string;
  recordatorios: Recordatorio[];
}

export async function procesarSolicitud(
  solicitud: SolicitudUsuario,
  negocios: Negocio[],
  horarios: Horario[],
  citasActuales: Cita[]
): Promise<{ resultado: ResultadoAgente; citas: Cita[] }> {
  const estructurada = await parsearSolicitudConLLM(solicitud);
  const opciones = filtrarDisponibilidad(horarios, negocios, estructurada);
  const mejorOpcion = elegirMejorHorario(opciones);

  if (!mejorOpcion) {
    return {
      resultado: {
        exito: false,
        mensaje: `No encontré disponibilidad para "${solicitud.servicio}" en la franja solicitada.`,
      },
      citas: citasActuales,
    };
  }

  const nuevasCitas = reservarCita(citasActuales, solicitud.nombreUsuario, mejorOpcion);
  const citaCreada = nuevasCitas[nuevasCitas.length - 1];

  return {
    resultado: {
      exito: true,
      mensaje: `Cita confirmada para ${solicitud.nombreUsuario} el ${citaCreada.fecha} a las ${citaCreada.hora}.`,
      cita: citaCreada,
    },
    citas: nuevasCitas,
  };
}

export function cancelarCitaAgente(
  citasActuales: Cita[],
  citaId: string
): { resultado: ResultadoAgente; citas: Cita[] } {
  const citaExistente = citasActuales.find((c) => c.id === citaId);
  if (!citaExistente) {
    return {
      resultado: {
        exito: false,
        mensaje: `No se encontró ninguna cita con el ID "${citaId}".`,
      },
      citas: citasActuales,
    };
  }

  const nuevasCitas = cancelarCita(citasActuales, citaId);
  const citaCancelada = nuevasCitas.find((c) => c.id === citaId);

  return {
    resultado: {
      exito: true,
      mensaje: `Cita "${citaId}" cancelada exitosamente.`,
      cita: citaCancelada,
    },
    citas: nuevasCitas,
  };
}

export function modificarCitaAgente(
  citasActuales: Cita[],
  citaId: string,
  negocios: Negocio[],
  horarios: Horario[],
  nuevaSolicitud: SolicitudUsuario
): { resultado: ResultadoAgente; citas: Cita[] } {
  const citaExistente = citasActuales.find((c) => c.id === citaId);
  if (!citaExistente) {
    return {
      resultado: {
        exito: false,
        mensaje: `No se encontró ninguna cita con el ID "${citaId}".`,
      },
      citas: citasActuales,
    };
  }

  const estructurada = parsearSolicitud(nuevaSolicitud);
  const opciones = filtrarDisponibilidad(horarios, negocios, estructurada);
  const nuevoHorario = elegirMejorHorario(opciones);

  if (!nuevoHorario) {
    return {
      resultado: {
        exito: false,
        mensaje: `No encontré disponibilidad para modificar la cita a "${nuevaSolicitud.servicio}" en la franja solicitada.`,
      },
      citas: citasActuales,
    };
  }

  const nuevasCitas = modificarCita(citasActuales, citaId, nuevoHorario);
  const citaModificada = nuevasCitas.find((c) => c.id === citaId);

  return {
    resultado: {
      exito: true,
      mensaje: `Cita "${citaId}" modificada exitosamente para el ${nuevoHorario.fecha} a las ${nuevoHorario.hora}.`,
      cita: citaModificada,
    },
    citas: nuevasCitas,
  };
}

export function configurarServicioAgente(
  negociosActuales: Negocio[],
  negocioId: string,
  servicio: Servicio
): { resultado: ResultadoAgente; negocios: Negocio[] } {
  const negocioExistente = negociosActuales.find((n) => n.id === negocioId);
  if (!negocioExistente) {
    return {
      resultado: {
        exito: false,
        mensaje: `No se encontró ningún negocio con el ID "${negocioId}".`,
      },
      negocios: negociosActuales,
    };
  }

  const nuevosNegocios = registrarDuracionServicio(negociosActuales, negocioId, servicio);
  const yaExistia = negocioExistente.servicios.some((s) => s.id === servicio.id);
  const accion = yaExistia ? "actualizada" : "registrada";

  return {
    resultado: {
      exito: true,
      mensaje: `Duración del servicio "${servicio.nombre}" (${servicio.duracionMinutos} min) ${accion} exitosamente para el negocio "${negocioExistente.nombre}".`,
    },
    negocios: nuevosNegocios,
  };
}

export function consultarCitasAgente(
  citas: Cita[],
  usuario: string,
  filtro?: { desde?: string; hasta?: string }
): ResultadoConsulta {
  const citasEncontradas = consultarCitas(citas, usuario, filtro);
  const total = citasEncontradas.length;
  const rango = filtro?.desde || filtro?.hasta
    ? ` en el rango [${filtro.desde ?? "inicio"} a ${filtro.hasta ?? "fin"}]`
    : "";
  const mensaje = total === 1
    ? `Se encontró 1 cita para el usuario "${usuario}"${rango}.`
    : `Se encontraron ${total} citas para el usuario "${usuario}"${rango}.`;

  return {
    exito: true,
    mensaje,
    citas: citasEncontradas,
  };
}

export function generarRecordatoriosAgente(
  citas: Cita[],
  fechaActual: string,
  diasAntes: number = 1
): ResultadoRecordatorios {
  const recordatorios = generarRecordatorios(citas, fechaActual, diasAntes);
  const total = recordatorios.length;
  const mensaje =
    total === 1
      ? `Se generó 1 recordatorio para las citas próximas.`
      : `Se generaron ${total} recordatorios para las citas próximas.`;

  return {
    exito: true,
    mensaje,
    recordatorios,
  };
}
