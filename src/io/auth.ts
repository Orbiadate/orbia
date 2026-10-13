/**
 * Seguridad y Gestión de Sesiones (src/io/auth.ts)
 * Capa Impura (I/O Shell)
 * - Hasheo de contraseñas con crypto.scrypt + sal aleatoria
 * - Comparación en tiempo constante con crypto.timingSafeEqual
 * - Tokens de sesión criptográficos de 32 bytes (guardando solo su SHA-256 en DB)
 * - Cookies HttpOnly, SameSite=Lax, Path=/ con expiración de 7 días
 * - Rate limiting en memoria (máx 5 intentos fallidos por correo/IP en 10 minutos)
 */

import crypto from "crypto";
import { promisify } from "util";
import { normalizarCorreo } from "../core/auth";

const scryptAsync = promisify(crypto.scrypt);
const KEY_LEN = 64;

export const NOMBRE_COOKIE_SESION = "orbia_sesion";
const DURACION_SESION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

/**
 * Hashea una contraseña usando crypto.scrypt de Node.js con sal aleatoria única por usuario.
 * NUNCA almacena ni expone contraseñas en texto plano.
 * Formato almacenado: "salHex:hashHex"
 */
export async function hashearContrasena(contrasena: string): Promise<string> {
  const sal = crypto.randomBytes(16).toString("hex");
  const claveDerivada = (await scryptAsync(contrasena, sal, KEY_LEN)) as Buffer;
  return `${sal}:${claveDerivada.toString("hex")}`;
}

/**
 * Verifica una contraseña candidata contra el hash almacenado utilizando crypto.timingSafeEqual.
 * Previene ataques de temporización (timing attacks).
 */
export async function verificarContrasena(
  contrasena: string,
  hashAlmacenado: string
): Promise<boolean> {
  const partes = hashAlmacenado.split(":");
  if (partes.length !== 2) return false;

  const [sal, hashEsperadoHex] = partes;
  const hashEsperadoBuffer = Buffer.from(hashEsperadoHex, "hex");

  try {
    const claveDerivada = (await scryptAsync(contrasena, sal, KEY_LEN)) as Buffer;
    if (claveDerivada.length !== hashEsperadoBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(claveDerivada, hashEsperadoBuffer);
  } catch {
    return false;
  }
}

/**
 * Genera un token aleatorio criptoseguro de 32 bytes.
 * Retorna el token raw (que viaja en la cookie del cliente),
 * su hash SHA-256 (que es lo ÚNICO que se persiste en la base de datos),
 * y la fecha de expiración en formato ISO.
 */
export function generarTokenSesion(): {
  tokenRaw: string;
  tokenHash: string;
  expiraEn: string;
} {
  const tokenRaw = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashearToken(tokenRaw);
  const expiraFecha = new Date(Date.now() + DURACION_SESION_MS);

  return {
    tokenRaw,
    tokenHash,
    expiraEn: expiraFecha.toISOString(),
  };
}

/**
 * Calcula el hash SHA-256 de un token de sesión en texto plano.
 */
export function hashearToken(tokenRaw: string): string {
  return crypto.createHash("sha256").update(tokenRaw).digest("hex");
}

/**
 * Genera el encabezado Set-Cookie para la sesión de usuario.
 * HttpOnly, SameSite=Lax, Path=/, 7 días, y Secure cuando no es localhost.
 */
export function generarHeaderSetCookie(tokenRaw: string, hostname?: string): string {
  const esLocal =
    !hostname ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname === "::1";

  const directivaSecure = !esLocal ? "; Secure" : "";
  const maxAgeSegundos = Math.floor(DURACION_SESION_MS / 1000);

  return `${NOMBRE_COOKIE_SESION}=${tokenRaw}; Path=/; Max-Age=${maxAgeSegundos}; HttpOnly; SameSite=Lax${directivaSecure}`;
}

/**
 * Genera el encabezado Set-Cookie para borrar la sesión al desloguearse.
 */
export function generarHeaderLimpiarCookie(): string {
  return `${NOMBRE_COOKIE_SESION}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`;
}

/**
 * Extrae el token de sesión de las cookies enviadas en la petición HTTP.
 */
export function extraerTokenDeCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  const partes = cookieHeader.split(";");
  for (const parte of partes) {
    const [nombre, valor] = parte.trim().split("=");
    if (nombre === NOMBRE_COOKIE_SESION && valor) {
      return decodeURIComponent(valor);
    }
  }
  return null;
}

// ============================================================================
// RATE LIMITING DE INTENTOS DE INICIO DE SESIÓN
// Máximo 5 fallidos por correo o IP en 10 minutos
// ============================================================================

const MAX_INTENTOS_FALLIDOS = 5;
const VENTANA_BLOQUEO_MS = 10 * 60 * 1000; // 10 minutos

const registroIntentosFallidos = new Map<string, number[]>();

function depurarIntentosAntiguos(ahora: number): void {
  for (const [clave, marcas] of registroIntentosFallidos.entries()) {
    const vigentes = marcas.filter((t) => ahora - t < VENTANA_BLOQUEO_MS);
    if (vigentes.length === 0) {
      registroIntentosFallidos.delete(clave);
    } else {
      registroIntentosFallidos.set(clave, vigentes);
    }
  }
}

/**
 * Verifica si una combinación de IP o correo ha superado los 5 intentos fallidos en 10 min.
 */
export function verificarLimiteIntentos(ip: string, correo: string): boolean {
  const ahora = Date.now();
  depurarIntentosAntiguos(ahora);

  const correoNorm = normalizarCorreo(correo);
  const marcasIp = registroIntentosFallidos.get(`ip:${ip}`) ?? [];
  const marcasCorreo = registroIntentosFallidos.get(`correo:${correoNorm}`) ?? [];

  return (
    marcasIp.length >= MAX_INTENTOS_FALLIDOS ||
    marcasCorreo.length >= MAX_INTENTOS_FALLIDOS
  );
}

/**
 * Registra un intento fallido de autenticación para la IP y el correo provisto.
 */
export function registrarFalloAutenticacion(ip: string, correo: string): void {
  const ahora = Date.now();
  const correoNorm = normalizarCorreo(correo);

  const claveIp = `ip:${ip}`;
  const marcasIp = (registroIntentosFallidos.get(claveIp) ?? []).filter(
    (t) => ahora - t < VENTANA_BLOQUEO_MS
  );
  marcasIp.push(ahora);
  registroIntentosFallidos.set(claveIp, marcasIp);

  const claveCorreo = `correo:${correoNorm}`;
  const marcasCorreo = (registroIntentosFallidos.get(claveCorreo) ?? []).filter(
    (t) => ahora - t < VENTANA_BLOQUEO_MS
  );
  marcasCorreo.push(ahora);
  registroIntentosFallidos.set(claveCorreo, marcasCorreo);
}

/**
 * Limpia el contador de intentos al concretar un inicio de sesión exitoso.
 */
export function reiniciarIntentosExitosos(ip: string, correo: string): void {
  const correoNorm = normalizarCorreo(correo);
  registroIntentosFallidos.delete(`ip:${ip}`);
  registroIntentosFallidos.delete(`correo:${correoNorm}`);
}
