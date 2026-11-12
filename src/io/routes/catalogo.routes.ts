import { Router, Request, Response } from "express";
import { negociosMock } from "../../../data/negocios.mock";
import {
  lugaresMock,
  obtenerLugarPorId,
  obtenerLocalesDeLugar,
  obtenerLocalPorId,
} from "../../../data/lugares.mock";

export const catalogoRouter = Router();

catalogoRouter.get("/lugares", (_req: Request, res: Response) => {
  res.json({ ok: true, lugares: lugaresMock });
});

catalogoRouter.get("/lugares/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const lugar = obtenerLugarPorId(id);
  if (!lugar) return res.status(404).json({ ok: false, error: "Lugar no encontrado" });
  const locales = obtenerLocalesDeLugar(id);
  return res.json({ ok: true, lugar, locales });
});

catalogoRouter.get("/locales", (_req: Request, res: Response) => {
  res.json({ ok: true, locales: negociosMock });
});

catalogoRouter.get("/locales/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const local = obtenerLocalPorId(id) || negociosMock.find((n) => n.id === id);
  if (!local) return res.status(404).json({ ok: false, error: "Local no encontrado" });
  return res.json({ ok: true, local });
});

catalogoRouter.get("/servicios", (req: Request, res: Response) => {
  const localId = typeof req.query.localId === "string" ? req.query.localId : undefined;
  if (localId) {
    const local = negociosMock.find((n) => n.id === localId);
    return res.json({ ok: true, servicios: local?.servicios || [] });
  }
  const todos = negociosMock.flatMap((n) =>
    n.servicios.map((s) => ({ ...s, negocioId: n.id, negocioNombre: n.nombre }))
  );
  return res.json({ ok: true, servicios: todos });
});
