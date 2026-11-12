import type { Cita, Horario, Negocio, Servicio, Recordatorio } from "../types";

export function generarIdPuro(citasActuales: readonly Cita[]): string {
  return `cita-${citasActuales.length + 1}`;
}

export function reservarCita(
  citasActuales: readonly Cita[],
  usuario: string,
  horario: Horario
): Cita[] {
  const nuevaCita: Cita = {
    id: generarIdPuro(citasActuales),
    usuario,
    negocioId: horario.negocioId,
    servicioId: horario.servicioId,
    fecha: horario.fecha,
    hora: horario.hora,
    duracionMinutos: 30,
    estado: "confirmada",
    creadaEn: new Date().toISOString(),
  };

  return [...citasActuales, nuevaCita];
}

export function cancelarCita(citasActuales: readonly Cita[], citaId: string): Cita[] {
  return citasActuales.map((c) =>
    c.id === citaId ? { ...c, estado: "cancelada" } : c
  );
}

export function consultarCitas(
  citas: readonly Cita[],
  usuario: string,
  filtro?: { desde?: string; hasta?: string; incluirCanceladas?: boolean }
): Cita[] {
  const citasFiltradas = citas.filter((c) => {
    if (c.usuario.toLowerCase() !== usuario.toLowerCase()) return false;
    if (!filtro?.incluirCanceladas && c.estado === "cancelada") return false;
    if (filtro?.desde && c.fecha < filtro.desde) return false;
    if (filtro?.hasta && c.fecha > filtro.hasta) return false;
    return true;
  });

  return [...citasFiltradas].sort((a, b) => {
    const compFecha = a.fecha.localeCompare(b.fecha);
    if (compFecha !== 0) return compFecha;
    return a.hora.localeCompare(b.hora);
  });
}

export function modificarCita(
  citasActuales: readonly Cita[],
  citaId: string,
  nuevoHorario: Horario
): Cita[] {
  return citasActuales.map((c) =>
    c.id === citaId
      ? {
          ...c,
          negocioId: nuevoHorario.negocioId,
          servicioId: nuevoHorario.servicioId,
          fecha: nuevoHorario.fecha,
          hora: nuevoHorario.hora,
          estado: "modificada",
        }
      : c
  );
}

export function registrarDuracionServicio(
  negociosActuales: readonly Negocio[],
  negocioId: string,
  servicio: Servicio
): Negocio[] {
  return negociosActuales.map((n) => {
    if (n.id !== negocioId) return n;
    const existe = n.servicios.some((s) => s.id === servicio.id);
    const nuevos = existe
      ? n.servicios.map((s) => (s.id === servicio.id ? { ...s, ...servicio } : s))
      : [...n.servicios, servicio];
    return { ...n, servicios: nuevos };
  });
}

function calcularFechaLimite(fechaISO: string, dias: number): string {
  const [año, mes, dia] = fechaISO.split("-").map(Number);
  const fecha = new Date(Date.UTC(año, mes - 1, dia + dias));
  return fecha.toISOString().split("T")[0];
}

export function generarRecordatorios(
  citas: readonly Cita[],
  fechaActual: string,
  diasAntes: number = 1
): Recordatorio[] {
  const fechaLimite = calcularFechaLimite(fechaActual, diasAntes);
  return citas
    .filter((c) => {
      const valido = c.estado === "confirmada" || c.estado === "modificada";
      return valido && c.fecha >= fechaActual && c.fecha <= fechaLimite;
    })
    .map((c) => ({
      citaId: c.id,
      usuario: c.usuario,
      mensaje: `Recordatorio: Hola ${c.usuario}, tienes una cita programada el ${c.fecha} a las ${c.hora}.`,
    }));
}

