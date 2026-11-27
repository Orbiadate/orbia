import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UsuarioPublico } from "../tools/auth";

const JWT_SECRET = process.env.JWT_SECRET || "orbia-super-secret-key-2026";
const EXPIRACION_TOKEN = "7d";

export async function hashearPassword(contrasena: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(contrasena, salt);
}

export async function compararPassword(contrasena: string, hash: string): Promise<boolean> {
  return bcrypt.compare(contrasena, hash);
}

export function generarTokenJwt(usuario: UsuarioPublico): string {
  return jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
    JWT_SECRET,
    { expiresIn: EXPIRACION_TOKEN }
  );
}

export function verificarTokenJwt(token: string): UsuarioPublico | null {
  try {
    const decodificado = jwt.verify(token, JWT_SECRET) as {
      id: string;
      nombre: string;
      correo: string;
    };
    return {
      id: decodificado.id,
      nombre: decodificado.nombre,
      correo: decodificado.correo,
      creadoEn: "",
    };
  } catch {
    return null;
  }
}

export function extraerToken(encabezadoAutorizacion?: string): string | null {
  if (!encabezadoAutorizacion) return null;
  if (encabezadoAutorizacion.startsWith("Bearer ")) {
    return encabezadoAutorizacion.substring(7).trim();
  }
  return encabezadoAutorizacion.trim();
}

