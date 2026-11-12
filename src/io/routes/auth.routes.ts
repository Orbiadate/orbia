import { Router, Request, Response } from "express";
import crypto from "crypto";
import {
  validarRegistro,
  normalizarCorreo,
  aUsuarioPublico,
  type Usuario,
} from "../../core/auth";
import {
  insertarUsuario,
  buscarUsuarioPorCorreo,
  guardarSesion,
  buscarSesionValida,
  eliminarSesion,
} from "../db";
import {
  hashearContrasena,
  verificarContrasena,
  generarTokenSesion,
  hashearToken,
  extraerTokenDeCookie,
  generarHeaderSetCookie,
  generarHeaderLimpiarCookie,
  verificarLimiteIntentos,
  registrarFalloAutenticacion,
  reiniciarIntentosExitosos,
} from "../auth";

export const authRouter = Router();

export function resolverUsuarioActual(req: Request): Usuario | null {
  const token = extraerTokenDeCookie(req.headers.cookie);
  if (!token) return null;
  const sesion = buscarSesionValida(hashearToken(token));
  return sesion?.usuario ?? null;
}

authRouter.post("/registro", async (req: Request, res: Response) => {
  const { nombre = "", correo = "", password = "" } = req.body || {};
  const errores = validarRegistro({ nombre, correo, contrasena: password });
  if (errores.length > 0) {
    return res.status(400).json({ ok: false, errores });
  }

  const correoNorm = normalizarCorreo(correo);
  const existente = buscarUsuarioPorCorreo(correoNorm);
  if (existente) {
    return res.status(409).json({ ok: false, error: "El correo ya está registrado" });
  }

  const hash = await hashearContrasena(password);
  const usuario: Usuario = {
    id: `usr-${crypto.randomUUID()}`,
    nombre: nombre.trim(),
    correo: correoNorm,
    hash,
    creadoEn: new Date().toISOString(),
  };

  insertarUsuario(usuario);
  const tokenInfo = generarTokenSesion();
  guardarSesion(tokenInfo.tokenHash, usuario.id, tokenInfo.expiraEn);

  res.setHeader("Set-Cookie", generarHeaderSetCookie(tokenInfo.tokenRaw, req.hostname));
  return res.json({ ok: true, usuario: aUsuarioPublico(usuario) });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { correo = "", password = "" } = req.body || {};
  const ip = req.ip || req.socket.remoteAddress || "desconocida";
  const correoNorm = normalizarCorreo(correo);

  const bloqueado = verificarLimiteIntentos(ip, correoNorm);
  if (bloqueado) {
    return res.status(429).json({ ok: false, error: "Demasiados intentos. Intenta más tarde." });
  }

  const usuario = buscarUsuarioPorCorreo(correoNorm);
  if (!usuario) {
    registrarFalloAutenticacion(ip, correoNorm);
    return res.status(401).json({ ok: false, error: "Correo o contraseña incorrectos" });
  }

  const passValida = await verificarContrasena(password, usuario.hash);
  if (!passValida) {
    registrarFalloAutenticacion(ip, correoNorm);
    return res.status(401).json({ ok: false, error: "Correo o contraseña incorrectos" });
  }

  reiniciarIntentosExitosos(ip, correoNorm);
  const tokenInfo = generarTokenSesion();
  guardarSesion(tokenInfo.tokenHash, usuario.id, tokenInfo.expiraEn);

  res.setHeader("Set-Cookie", generarHeaderSetCookie(tokenInfo.tokenRaw, req.hostname));
  return res.json({ ok: true, usuario: aUsuarioPublico(usuario) });
});

authRouter.post("/logout", (req: Request, res: Response) => {
  const token = extraerTokenDeCookie(req.headers.cookie);
  if (token) eliminarSesion(hashearToken(token));
  res.setHeader("Set-Cookie", generarHeaderLimpiarCookie());
  return res.json({ ok: true });
});

authRouter.get("/yo", (req: Request, res: Response) => {
  const usuario = resolverUsuarioActual(req);
  if (!usuario) return res.status(401).json({ ok: false, error: "No autenticado" });
  return res.json({ ok: true, usuario: aUsuarioPublico(usuario) });
});
