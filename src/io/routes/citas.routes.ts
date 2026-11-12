import { Router, Request, Response } from "express";
import type { Cita } from "../../types";
import { resolverUsuarioActual } from "./auth.routes";
import {
  consultarCitas,
  cancelarCita,
  modificarCita,
  reservarCita,
} from "../../tools/acciones";
import { horariosMock } from "../../../data/negocios.mock";

export const citasRouter = Router();

let estadoCitas: Cita[] = [
  {
    id: "cita-1",
    usuario: "carlos",
    negocioId: "negocio-1",
    servicioId: "corte-1",
    fecha: "2026-11-15",
    hora: "10:00",
    duracionMinutos: 30,
    estado: "confirmada",
    creadaEn: new Date().toISOString(),
  },
];

export function obtenerEstadoCitas(): Cita[] {
  return estadoCitas;
}

export function actualizarEstadoCitas(nuevas: Cita[]): void {
  estadoCitas = nuevas;
}

citasRouter.get("/", (req: Request, res: Response) => {
  const usuario = resolverUsuarioActual(req);
  const nombreUsuario = usuario ? usuario.nombre : (req.query.usuario as string) || "carlos";
  const citas = consultarCitas(estadoCitas, nombreUsuario, { incluirCanceladas: true });
  res.json({ ok: true, citas });
});

citasRouter.post("/", (req: Request, res: Response) => {
  const usuario = resolverUsuarioActual(req);
  const nombreUsuario = usuario ? usuario.nombre : (req.body?.usuario || "carlos");
  const { horarioId, horario } = req.body || {};

  let targetHorario = horario;
  if (!targetHorario && horarioId) {
    targetHorario = horariosMock.find((h) => h.id === horarioId);
  }

  if (!targetHorario) {
    return res.status(400).json({ ok: false, error: "Horario no especificado o inválido" });
  }

  estadoCitas = reservarCita(estadoCitas, nombreUsuario, targetHorario);
  const creada = estadoCitas[estadoCitas.length - 1];
  return res.json({ ok: true, cita: creada, citas: estadoCitas });
});

citasRouter.post("/:id/cancelar", (req: Request, res: Response) => {
  const citaId = String(req.params.id);
  estadoCitas = cancelarCita(estadoCitas, citaId);
  return res.json({ ok: true, mensaje: "Cita cancelada", citas: estadoCitas });
});

citasRouter.post("/:id/modificar", (req: Request, res: Response) => {
  const citaId = String(req.params.id);
  const { horarioId, horario } = req.body || {};
  let targetHorario = horario;
  if (!targetHorario && horarioId) {
    targetHorario = horariosMock.find((h) => h.id === horarioId);
  }
  if (!targetHorario) {
    return res.status(400).json({ ok: false, error: "Horario no especificado" });
  }
  estadoCitas = modificarCita(estadoCitas, citaId, targetHorario);
  return res.json({ ok: true, mensaje: "Cita modificada", citas: estadoCitas });
});
