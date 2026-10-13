/**
 * Núcleo Funcional Puro: Autenticación y Cuentas de Usuario (src/core/auth.ts)
 * 100% puro: sin I/O, sin llamadas al sistema ni efectos secundarios.
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
}

export interface ErrorValidacion {
  readonly campo: "nombre" | "correo" | "contrasena" | "general";
  readonly mensaje: string;
}

/**
 * Normaliza una dirección de correo electrónico eliminando espacios y convirtiendo a minúsculas.
 * Función pura: misma entrada -> misma salida.
 */
export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

/**
 * Valida los datos recibidos para la creación de una nueva cuenta.
 * Retorna la lista de errores detectados (nombre no vacío, formato de correo válido, contraseña >= 8 caracteres).
 * Si la lista está vacía, los datos son completamente válidos.
 * Función pura.
 */
export function validarRegistro(datos: DatosRegistro): readonly ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];

  const nombre = datos.nombre?.trim() ?? "";
  if (nombre.length === 0) {
    errores.push({
      campo: "nombre",
      mensaje: "El nombre no puede estar vacío.",
    });
  }

  const correo = normalizarCorreo(datos.correo ?? "");
  const formatoCorreoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo.length === 0) {
    errores.push({
      campo: "correo",
      mensaje: "El correo electrónico es obligatorio.",
    });
  } else if (!formatoCorreoRegex.test(correo)) {
    errores.push({
      campo: "correo",
      mensaje: "Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).",
    });
  }

  const contrasena = datos.contrasena ?? "";
  if (contrasena.length < 8) {
    errores.push({
      campo: "contrasena",
      mensaje: "La contraseña debe tener al menos 8 caracteres.",
    });
  }

  return Object.freeze(errores);
}

/**
 * Proyecta una entidad Usuario hacia su versión pública omitiendo el hash y cualquier dato sensible.
 * Función pura.
 */
export function aUsuarioPublico(usuario: Usuario): UsuarioPublico {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    creadoEn: usuario.creadoEn,
  };
}
