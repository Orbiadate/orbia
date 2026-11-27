/**
 * Núcleo Funcional Puro: Autenticación y Cuentas de Usuario (src/tools/auth.ts)
 * 100% puro: determinista, sin I/O, sin llamadas al sistema ni efectos secundarios.
 */

export interface Usuario {
  readonly id: string;
  readonly nombre: string;
  readonly correo: string;
  readonly hash: string;
  readonly creadoEn: string;
}

export interface UsuarioPublico {
  readonly id: string;
  readonly nombre: string;
  readonly correo: string;
  readonly creadoEn: string;
}

export interface DatosRegistro {
  readonly nombre?: string;
  readonly correo?: string;
  readonly contrasena?: string;
  readonly confirmacion?: string;
}

export interface DatosLogin {
  readonly correo?: string;
  readonly contrasena?: string;
}

export interface ResultadoValidacion {
  readonly valido: boolean;
  readonly errores: Record<string, string>;
}

export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

export function validarRegistro(datos: DatosRegistro): ResultadoValidacion {
  const errores: Record<string, string> = {};

  const nombre = (datos.nombre || "").trim();
  if (nombre.length === 0) {
    errores.nombre = "El nombre no puede estar vacío";
  }

  const correo = normalizarCorreo(datos.correo || "");
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo.length === 0) {
    errores.correo = "El correo electrónico es obligatorio";
  } else if (!regexCorreo.test(correo)) {
    errores.correo = "Ingresa un correo electrónico válido";
  }

  const pass = datos.contrasena || "";
  if (pass.length < 8) {
    errores.contrasena = "La contraseña debe tener al menos 8 caracteres";
  }

  if (datos.confirmacion !== undefined && pass !== datos.confirmacion) {
    errores.confirmacion = "Las contraseñas no coinciden";
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
}

export function validarLogin(datos: DatosLogin): ResultadoValidacion {
  const errores: Record<string, string> = {};

  const correo = normalizarCorreo(datos.correo || "");
  if (correo.length === 0) {
    errores.correo = "El correo es obligatorio";
  }

  const pass = datos.contrasena || "";
  if (pass.length === 0) {
    errores.contrasena = "La contraseña es obligatoria";
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
}

export function aUsuarioPublico(usuario: Usuario): UsuarioPublico {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    creadoEn: usuario.creadoEn,
  };
}

