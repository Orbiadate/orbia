import { Router, Request, Response } from "express";
import { parsearSolicitudConResiliencia } from "../llm";
import { filtrarDisponibilidad, elegirMejorHorario } from "../../tools/disponibilidad";
import {
  reservarCita,
  cancelarCita,
  consultarCitas,
  modificarCita,
} from "../../tools/acciones";
import { horariosMock, negociosMock } from "../../../data/negocios.mock";
import type { SolicitudEstructurada, SolicitudUsuario } from "../../types";

export const toolsRouter = Router();

toolsRouter.post("/parse", async (req: Request, res: Response) => {
  const mensaje = req.body?.mensaje || "";
  const nombreUsuario = req.body?.nombreUsuario || "cliente";
  const solicitud: SolicitudUsuario = {
    nombreUsuario,
    mensajeOriginal: mensaje,
    servicio: req.body?.servicio || "",
    fechaPreferida: req.body?.fechaPreferida || "2026-11-15",
    horaPreferida: req.body?.horaPreferida || "10:00",
  };
  try {
    const resultado = await parsearSolicitudConResiliencia(solicitud);
    res.json({ ok: true, data: resultado });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

toolsRouter.get("/disponibilidad", (req: Request, res: Response) => {
  const { negocioId, servicio, franjaHora, franjaFecha } = req.query;
  const solicitud: SolicitudEstructurada = {
    nombreUsuario: "cliente",
    intencion: "agendar",
    servicio: typeof servicio === "string" ? servicio : "",
    franjaHora: (franjaHora as any) || "sin_especificar",
    franjaFecha: (franjaFecha as any) || "sin_especificar",
    fechaPreferida: "2026-11-15",
    horaPreferida: "10:00",
  };

  const pool = typeof negocioId === "string"
    ? horariosMock.filter((h) => h.negocioId === negocioId)
    : horariosMock;

  const disponibles = filtrarDisponibilidad(pool, negociosMock, solicitud);
  const mejor = elegirMejorHorario(disponibles);
  res.json({ ok: true, horarios: disponibles, mejor });
});

toolsRouter.post("/acciones", (req: Request, res: Response) => {
  const { accion, citas = [], ...payload } = req.body || {};
  switch (accion) {
    case "reservar": {
      const { usuario, horario } = payload;
      const nuevas = reservarCita(citas, usuario, horario);
      return res.json({ ok: true, citas: nuevas });
    }
    case "cancelar": {
      const { citaId } = payload;
      const nuevas = cancelarCita(citas, citaId);
      return res.json({ ok: true, citas: nuevas });
    }
    case "consultar": {
      const { usuario, filtro } = payload;
      const encontradas = consultarCitas(citas, usuario, filtro);
      return res.json({ ok: true, citas: encontradas });
    }
    case "modificar": {
      const { citaId, nuevoHorario } = payload;
      const nuevas = modificarCita(citas, citaId, nuevoHorario);
      return res.json({ ok: true, citas: nuevas });
    }
    default:
      return res.status(400).json({ ok: false, error: "Acción no reconocida" });
  }
});
