import { Router, Request, Response } from "express";
import crypto from "crypto";
import {
  validarRegistro,
  validarLogin,
  normalizarCorreo,
  aUsuarioPublico,
  type Usuario,
} from "../../tools/auth";
import { usuarioRepositorio } from "../usuario_repositorio";
import {
  hashearPassword,
  compararPassword,
  generarTokenJwt,
  verificarTokenJwt,
  extraerToken,
} from "../auth_jwt";

export const authRouter = Router();

export async function resolverUsuarioActual(req: Request): Promise<Usuario | null> {
  const authHeader = req.headers.authorization;
  const token = extraerToken(authHeader);
  if (!token) return null;

  const verificado = verificarTokenJwt(token);
  if (!verificado) return null;

  return usuarioRepositorio.buscarPorId(verificado.id);
}

authRouter.post("/registro", async (req: Request, res: Response) => {
  const {
    nombre = "",
    correo = "",
    contrasena = req.body?.password || "",
    confirmacion = req.body?.confirmarContrasena || req.body?.confirmarPassword,
  } = req.body || {};

  const validacion = validarRegistro({ nombre, correo, contrasena, confirmacion });
  if (!validacion.valido) {
    return res.status(400).json({ ok: false, error: "Datos inválidos", errores: validacion.errores });
  }

  const correoNorm = normalizarCorreo(correo);
  const existente = await usuarioRepositorio.buscarPorCorreo(correoNorm);
  if (existente) {
    return res.status(409).json({ ok: false, error: "El correo ya está registrado" });
  }

  const hash = await hashearPassword(contrasena);
  const nuevoUsuario: Usuario = {
    id: `usr-${crypto.randomUUID()}`,
    nombre: nombre.trim(),
    correo: correoNorm,
    hash,
    creadoEn: new Date().toISOString(),
  };

  await usuarioRepositorio.guardar(nuevoUsuario);
  const usuarioPublico = aUsuarioPublico(nuevoUsuario);
  const token = generarTokenJwt(usuarioPublico);

  return res.status(201).json({ ok: true, token, usuario: usuarioPublico });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const {
    correo = "",
    contrasena = req.body?.password || "",
  } = req.body || {};

  const validacion = validarLogin({ correo, contrasena });
  if (!validacion.valido) {
    return res.status(400).json({ ok: false, error: "Datos inválidos", errores: validacion.errores });
  }

  const correoNorm = normalizarCorreo(correo);
  const usuario = await usuarioRepositorio.buscarPorCorreo(correoNorm);
  if (!usuario) {
    return res.status(401).json({ ok: false, error: "Correo o contraseña incorrectos" });
  }

  const valida = await compararPassword(contrasena, usuario.hash);
  if (!valida) {
    return res.status(401).json({ ok: false, error: "Correo o contraseña incorrectos" });
  }

  const usuarioPublico = aUsuarioPublico(usuario);
  const token = generarTokenJwt(usuarioPublico);

  return res.json({ ok: true, token, usuario: usuarioPublico });
});

authRouter.get("/yo", async (req: Request, res: Response) => {
  const usuario = await resolverUsuarioActual(req);
  if (!usuario) {
    return res.status(401).json({ ok: false, error: "No autenticado o token inválido" });
  }
  return res.json({ ok: true, usuario: aUsuarioPublico(usuario) });
});
