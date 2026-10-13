/**
 * Almacén de Datos SQLite (src/io/db.ts)
 * Capa Impura (I/O Shell) utilizando el módulo nativo node:sqlite de Node.js (v22.5+).
 * Base de datos persistente en data/orbia.db.
 */

import path from "path";
import fs from "fs";
import type { Usuario } from "../core/auth";

// Interfaz para el módulo nativo node:sqlite de Node.js
export interface ISqliteStatement {
  run(...params: unknown[]): { changes: number | bigint; lastInsertRowid: number | bigint };
  get(...params: unknown[]): Record<string, unknown> | undefined;
  all(...params: unknown[]): Record<string, unknown>[];
}

export interface ISqliteDatabase {
  exec(sql: string): void;
  prepare(sql: string): ISqliteStatement;
  close(): void;
}

// Carga dinámica de node:sqlite nativo
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DatabaseSync } = require("node:sqlite") as {
  DatabaseSync: new (location: string, options?: unknown) => ISqliteDatabase;
};

export interface SesionFila {
  tokenHash: string;
  usuarioId: string;
  expiraEn: string;
}

export interface SesionConUsuario extends SesionFila {
  usuario: Usuario;
}

// Ubicación configurable de la base de datos (por defecto: data/orbia.db)
export const RUTA_DB =
  process.env.ORBIA_DB_PATH ||
  path.resolve(__dirname, "../../data/orbia.db");

// Garantizar la existencia de la carpeta contenedora
const dirBase = path.dirname(RUTA_DB);
if (!fs.existsSync(dirBase)) {
  fs.mkdirSync(dirBase, { recursive: true });
}

export const db: ISqliteDatabase = new DatabaseSync(RUTA_DB);

// Inicialización de esquemas e índices
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL,
    creadoEn TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sesiones (
    tokenHash TEXT PRIMARY KEY,
    usuarioId TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expiraEn TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
  CREATE INDEX IF NOT EXISTS idx_sesiones_usuarioId ON sesiones(usuarioId);
  CREATE INDEX IF NOT EXISTS idx_sesiones_expiraEn ON sesiones(expiraEn);
`);

/**
 * Inserta un nuevo usuario en la tabla usuarios.
 */
export function insertarUsuario(usuario: Usuario): void {
  const stmt = db.prepare(`
    INSERT INTO usuarios (id, nombre, correo, hash, creadoEn)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    usuario.id,
    usuario.nombre,
    usuario.correo.toLowerCase().trim(),
    usuario.hash,
    usuario.creadoEn
  );
}

/**
 * Busca un usuario por su correo electrónico (en minúsculas).
 */
export function buscarUsuarioPorCorreo(correo: string): Usuario | null {
  const stmt = db.prepare(`SELECT id, nombre, correo, hash, creadoEn FROM usuarios WHERE correo = ?`);
  const row = stmt.get(correo.toLowerCase().trim()) as
    | { id: string; nombre: string; correo: string; hash: string; creadoEn: string }
    | undefined;

  if (!row) return null;
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    correo: String(row.correo),
    hash: String(row.hash),
    creadoEn: String(row.creadoEn),
  };
}

/**
 * Busca un usuario por su identificador único.
 */
export function buscarUsuarioPorId(id: string): Usuario | null {
  const stmt = db.prepare(`SELECT id, nombre, correo, hash, creadoEn FROM usuarios WHERE id = ?`);
  const row = stmt.get(id) as
    | { id: string; nombre: string; correo: string; hash: string; creadoEn: string }
    | undefined;

  if (!row) return null;
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    correo: String(row.correo),
    hash: String(row.hash),
    creadoEn: String(row.creadoEn),
  };
}

/**
 * Guarda una nueva sesión activa con el hash del token.
 */
export function guardarSesion(tokenHash: string, usuarioId: string, expiraEn: string): void {
  const stmt = db.prepare(`
    INSERT INTO sesiones (tokenHash, usuarioId, expiraEn)
    VALUES (?, ?, ?)
  `);
  stmt.run(tokenHash, usuarioId, expiraEn);
}

/**
 * Busca una sesión válida y no expirada por el hash de su token.
 * Retorna la sesión y los datos del usuario asociado.
 */
export function buscarSesionValida(tokenHash: string): SesionConUsuario | null {
  const ahoraIso = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT s.tokenHash, s.usuarioId, s.expiraEn,
           u.id as u_id, u.nombre as u_nombre, u.correo as u_correo, u.hash as u_hash, u.creadoEn as u_creadoEn
    FROM sesiones s
    JOIN usuarios u ON s.usuarioId = u.id
    WHERE s.tokenHash = ? AND s.expiraEn > ?
  `);
  const row = stmt.get(tokenHash, ahoraIso) as
    | {
        tokenHash: string;
        usuarioId: string;
        expiraEn: string;
        u_id: string;
        u_nombre: string;
        u_correo: string;
        u_hash: string;
        u_creadoEn: string;
      }
    | undefined;

  if (!row) return null;

  return {
    tokenHash: String(row.tokenHash),
    usuarioId: String(row.usuarioId),
    expiraEn: String(row.expiraEn),
    usuario: {
      id: String(row.u_id),
      nombre: String(row.u_nombre),
      correo: String(row.u_correo),
      hash: String(row.u_hash),
      creadoEn: String(row.u_creadoEn),
    },
  };
}

/**
 * Elimina una sesión por el hash de su token (cierre de sesión).
 */
export function eliminarSesion(tokenHash: string): void {
  const stmt = db.prepare(`DELETE FROM sesiones WHERE tokenHash = ?`);
  stmt.run(tokenHash);
}

/**
 * Limpia sesiones expiradas de la base de datos.
 */
export function limpiarSesionesExpiradas(): void {
  const ahoraIso = new Date().toISOString();
  const stmt = db.prepare(`DELETE FROM sesiones WHERE expiraEn <= ?`);
  stmt.run(ahoraIso);
}
