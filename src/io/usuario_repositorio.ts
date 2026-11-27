import fs from "fs";
import path from "path";
import type { Usuario } from "../tools/auth";

/**
 * Interfaz desacoplada para el almacenamiento de usuarios.
 * Permite cambiar el almacenamiento local en JSON por SQLite o PostgreSQL sin alterar la lógica de negocio.
 */
export interface IUsuarioRepositorio {
  buscarPorCorreo(correo: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<void>;
  listarTodos(): Promise<readonly Usuario[]>;
}

export class JsonUsuarioRepositorio implements IUsuarioRepositorio {
  private readonly rutaArchivo: string;

  constructor(rutaArchivo?: string) {
    this.rutaArchivo =
      rutaArchivo ||
      process.env.USUARIOS_JSON_PATH ||
      path.resolve(__dirname, "../../data/usuarios.json");
    this.asegurarArchivo();
  }

  private asegurarArchivo(): void {
    const dir = path.dirname(this.rutaArchivo);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.rutaArchivo)) {
      fs.writeFileSync(this.rutaArchivo, JSON.stringify([], null, 2), "utf-8");
    }
  }

  private leerUsuarios(): Usuario[] {
    try {
      this.asegurarArchivo();
      const contenido = fs.readFileSync(this.rutaArchivo, "utf-8");
      return JSON.parse(contenido) as Usuario[];
    } catch {
      return [];
    }
  }

  private escribirUsuarios(usuarios: Usuario[]): void {
    this.asegurarArchivo();
    fs.writeFileSync(this.rutaArchivo, JSON.stringify(usuarios, null, 2), "utf-8");
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const usuarios = this.leerUsuarios();
    const buscado = correo.trim().toLowerCase();
    const encontrado = usuarios.find((u) => u.correo.toLowerCase() === buscado);
    return encontrado || null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const usuarios = this.leerUsuarios();
    const encontrado = usuarios.find((u) => u.id === id);
    return encontrado || null;
  }

  async guardar(usuario: Usuario): Promise<void> {
    const usuarios = this.leerUsuarios();
    const indice = usuarios.findIndex((u) => u.id === usuario.id);
    if (indice >= 0) {
      usuarios[indice] = usuario;
    } else {
      usuarios.push(usuario);
    }
    this.escribirUsuarios(usuarios);
  }

  async listarTodos(): Promise<readonly Usuario[]> {
    return this.leerUsuarios();
  }
}

export const usuarioRepositorio: IUsuarioRepositorio = new JsonUsuarioRepositorio();

