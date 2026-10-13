import express, { Request, Response, NextFunction } from "express";
import path from "path";
import crypto from "crypto";
import type { Cita, SolicitudUsuario } from "../types";
import {
  validarRegistro,
  normalizarCorreo,
  aUsuarioPublico,
  type Usuario,
  type UsuarioPublico,
} from "../core/auth";
import {
  insertarUsuario,
  buscarUsuarioPorCorreo,
  guardarSesion,
  buscarSesionValida,
  eliminarSesion,
} from "./db";
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
} from "./auth";
import {
  procesarSolicitud,
  consultarCitasAgente,
  cancelarCitaAgente,
  modificarCitaAgente,
} from "../pipeline";
import { negociosMock, horariosMock } from "../../data/negocios.mock";
import {
  renderFormularioSolicitud,
  renderResultado,
  renderPagina,
  renderBusquedaCitas,
  renderListaCitas,
  renderFormularioModificar,
  renderFormularioLogin,
  renderFormularioRegistro,
  renderPantallaCuenta,
  renderRequiereLogin,
} from "../views/render";

/**
 * Instancia de la aplicación Express (Imperative Shell).
 * Mantiene el estado en memoria para citas y delega la persistencia de usuarios y sesiones a SQLite.
 */
export const app = express();

// Middleware para decodificar cuerpos JSON y formularios POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (public/estilos.css)
app.use(express.static(path.join(__dirname, "../../public")));

// Estado de citas en memoria a nivel de módulo
let citas: Cita[] = [];

/**
 * Helper para obtener el usuario autenticado desde la cookie o el header Authorization.
 */
export function obtenerUsuarioDePeticion(req: Request): UsuarioPublico | null {
  const tokenRaw =
    extraerTokenDeCookie(req.headers.cookie) ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null);

  if (!tokenRaw) return null;
  const tokenHash = hashearToken(tokenRaw);
  const sesion = buscarSesionValida(tokenHash);
  if (!sesion) return null;

  return aUsuarioPublico(sesion.usuario);
}

/**
 * Middleware para rutas y acciones que exigen sesión activa.
 * Devuelve 401 si no hay sesión.
 */
function requerirSesion(req: Request, res: Response, next: NextFunction) {
  const usuario = obtenerUsuarioDePeticion(req);
  if (!usuario) {
    if (
      req.path.startsWith("/api/") ||
      req.headers.accept?.includes("application/json") ||
      req.xhr
    ) {
      res.status(401).json({ error: "No autorizado. Inicia sesión para continuar." });
      return;
    }

    const destino = req.originalUrl || "/";
    res
      .status(401)
      .type("html")
      .send(renderPagina(renderRequiereLogin(destino), null, { titulo: "Acceso Requerido (401)" }));
    return;
  }

  (req as unknown as { usuario: UsuarioPublico }).usuario = usuario;
  next();
}

// ============================================================================
// ENDPOINTS DE AUTENTICACIÓN (/api/auth/*)
// ============================================================================

/**
 * POST /api/auth/registro — Crea una cuenta nueva, genera sesión y establece cookie.
 */
app.post("/api/auth/registro", async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contrasena } = req.body ?? {};

    // Validación pura con el núcleo funcional
    const errores = validarRegistro({ nombre, correo, contrasena });
    if (errores.length > 0) {
      res.status(400).json({ error: "Datos de registro inválidos.", errores });
      return;
    }

    const correoNormalizado = normalizarCorreo(correo);

    // Verificar si el correo ya existe
    const usuarioExistente = buscarUsuarioPorCorreo(correoNormalizado);
    if (usuarioExistente) {
      res.status(400).json({
        error: "El correo electrónico ya está registrado.",
        errores: [{ campo: "correo", mensaje: "Ya existe una cuenta con este correo." }],
      });
      return;
    }

    // Hashear contraseña con Scrypt y sal única
    const hash = await hashearContrasena(contrasena);
    const nuevoUsuario: Usuario = {
      id: `usr-${crypto.randomUUID()}`,
      nombre: String(nombre).trim(),
      correo: correoNormalizado,
      hash,
      creadoEn: new Date().toISOString(),
    };

    insertarUsuario(nuevoUsuario);

    // Generar sesión criptográfica de 32 bytes
    const { tokenRaw, tokenHash, expiraEn } = generarTokenSesion();
    guardarSesion(tokenHash, nuevoUsuario.id, expiraEn);

    // Asignar cookie de sesión segura
    res.setHeader("Set-Cookie", generarHeaderSetCookie(tokenRaw, req.headers.host));

    res.status(200).json({
      ok: true,
      usuario: aUsuarioPublico(nuevoUsuario),
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Ocurrió un error interno al registrar la cuenta." });
  }
});

/**
 * POST /api/auth/login — Autentica usuario, valida límite de intentos y emite sesión.
 */
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body ?? {};
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const correoNormalizado = normalizarCorreo(correo || "");

    if (!correo || !contrasena) {
      res.status(400).json({ error: "Debes ingresar correo y contraseña." });
      return;
    }

    // Límite de intentos: máximo 5 fallidos por correo o IP en 10 minutos
    if (verificarLimiteIntentos(ip, correoNormalizado)) {
      res.status(429).json({
        error: "Demasiados intentos fallidos. Por favor, intenta de nuevo en 10 minutos.",
      });
      return;
    }

    const usuario = buscarUsuarioPorCorreo(correoNormalizado);
    let esValida = false;

    if (usuario) {
      esValida = await verificarContrasena(contrasena, usuario.hash);
    }

    if (!usuario || !esValida) {
      registrarFalloAutenticacion(ip, correoNormalizado);
      // Mensaje genérico: no revela si falló el correo o la contraseña
      res.status(401).json({ error: "Correo o contraseña incorrectos" });
      return;
    }

    // Éxito: limpiar contador de intentos
    reiniciarIntentosExitosos(ip, correoNormalizado);

    // Crear sesión
    const { tokenRaw, tokenHash, expiraEn } = generarTokenSesion();
    guardarSesion(tokenHash, usuario.id, expiraEn);

    res.setHeader("Set-Cookie", generarHeaderSetCookie(tokenRaw, req.headers.host));

    res.status(200).json({
      ok: true,
      usuario: aUsuarioPublico(usuario),
    });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Ocurrió un error interno al iniciar sesión." });
  }
});

/**
 * POST /api/auth/logout — Elimina la sesión en base de datos y limpia la cookie.
 */
app.post("/api/auth/logout", (req: Request, res: Response) => {
  try {
    const tokenRaw =
      extraerTokenDeCookie(req.headers.cookie) ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.substring(7)
        : null);

    if (tokenRaw) {
      eliminarSesion(hashearToken(tokenRaw));
    }

    res.setHeader("Set-Cookie", generarHeaderLimpiarCookie());
    res.status(200).json({ ok: true, mensaje: "Sesión cerrada correctamente." });
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    res.status(500).json({ error: "Ocurrió un error interno al cerrar sesión." });
  }
});

/**
 * GET /api/auth/yo — Devuelve el usuario autenticado actual sin hash sensible.
 */
app.get("/api/auth/yo", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  if (!usuario) {
    res.status(401).json({ autenticado: false, error: "No autenticado" });
    return;
  }

  res.status(200).json({ autenticado: true, usuario });
});

// ============================================================================
// ENDPOINTS PÚBLICOS DE CATÁLOGO (Modo Invitado)
// ============================================================================

/**
 * GET /api/locales — Lectura pública de lugares y locales disponibles para modo invitado.
 */
app.get("/api/locales", (_req: Request, res: Response) => {
  res.status(200).json({
    locales: negociosMock.map((n) => ({
      id: n.id,
      nombre: n.nombre,
      direccion: n.direccion,
      totalServicios: n.servicios.length,
    })),
  });
});

/**
 * GET /api/servicios — Lectura pública de servicios para modo invitado.
 */
app.get("/api/servicios", (_req: Request, res: Response) => {
  const todosServicios = negociosMock.flatMap((n) =>
    n.servicios.map((s) => ({ ...s, negocioId: n.id, negocioNombre: n.nombre }))
  );
  res.status(200).json({ servicios: todosServicios });
});

// ============================================================================
// VISTAS WEB
// ============================================================================

/**
 * GET / — Ruta principal.
 * - Con sesión: muestra pantalla Servicios con el usuario precargado.
 * - Sin sesión y con parámetro ?modo=invitado: muestra Servicios en modo invitado.
 * - Sin sesión y sin modo invitado: redirige a /login.
 */
app.get("/", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  const esInvitado = req.query.modo === "invitado";

  if (usuario) {
    const html = renderPagina(renderFormularioSolicitud(usuario, false), usuario, {
      titulo: "Servicios - ORBIA",
    });
    res.type("html").send(html);
    return;
  }

  if (esInvitado) {
    const html = renderPagina(renderFormularioSolicitud(null, true), null, {
      titulo: "Servicios (Invitado) - ORBIA",
      esInvitado: true,
    });
    res.type("html").send(html);
    return;
  }

  // Al abrir la app sin sesión previa, dirigir a Iniciar sesión
  res.redirect("/login");
});

/**
 * GET /login — Pantalla de Iniciar Sesión.
 */
app.get("/login", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  const redirectDestino = typeof req.query.redirect === "string" ? req.query.redirect : "/";

  if (usuario) {
    res.redirect(redirectDestino);
    return;
  }

  const html = renderPagina(renderFormularioLogin(redirectDestino), null, {
    titulo: "Iniciar Sesión - ORBIA",
  });
  res.type("html").send(html);
});

/**
 * GET /registro — Pantalla de Crear Cuenta.
 */
app.get("/registro", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  const redirectDestino = typeof req.query.redirect === "string" ? req.query.redirect : "/";

  if (usuario) {
    res.redirect(redirectDestino);
    return;
  }

  const html = renderPagina(renderFormularioRegistro(redirectDestino), null, {
    titulo: "Crear Cuenta - ORBIA",
  });
  res.type("html").send(html);
});

/**
 * GET /cuenta — Pantalla "Cuenta" del usuario autenticado (exige sesión).
 */
app.get("/cuenta", requerirSesion, (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req)!;
  const html = renderPagina(renderPantallaCuenta(usuario), usuario, {
    titulo: "Mi Cuenta - ORBIA",
  });
  res.type("html").send(html);
});

/**
 * GET /citas — Consulta las citas de un usuario (exige sesión activa).
 */
app.get("/citas", requerirSesion, (req: Request, res: Response) => {
  const usuarioAuth = obtenerUsuarioDePeticion(req)!;
  const usuarioBuscado =
    typeof req.query.usuario === "string" && req.query.usuario.trim() !== ""
      ? req.query.usuario.trim()
      : usuarioAuth.nombre;

  const resultadoConsulta = consultarCitasAgente(citas, usuarioBuscado);
  const contenido =
    renderBusquedaCitas(usuarioBuscado) +
    renderListaCitas(resultadoConsulta.citas, usuarioBuscado);

  res.type("html").send(renderPagina(contenido, usuarioAuth, { titulo: "Mis Citas - ORBIA" }));
});

/**
 * POST /citas — Procesa la solicitud de agendamiento (exige sesión activa).
 */
app.post("/citas", requerirSesion, async (req: Request, res: Response) => {
  try {
    const usuarioAuth = obtenerUsuarioDePeticion(req)!;
    const { servicio, fechaPreferida, horaPreferida, nombreUsuario } = req.body;

    const nombreFinal =
      typeof nombreUsuario === "string" && nombreUsuario.trim() !== ""
        ? nombreUsuario.trim()
        : usuarioAuth.nombre;

    const solicitud: SolicitudUsuario = {
      nombreUsuario: nombreFinal,
      servicio: String(servicio ?? "").trim(),
      fechaPreferida: String(fechaPreferida ?? "").trim(),
      horaPreferida: String(horaPreferida ?? "").trim(),
    };

    const { resultado, citas: nuevasCitas } = await procesarSolicitud(
      solicitud,
      negociosMock,
      horariosMock,
      citas
    );

    citas = nuevasCitas;

    const html = renderPagina(renderResultado(resultado), usuarioAuth, {
      titulo: "Resultado del Agendamiento - ORBIA",
    });
    res.type("html").send(html);
  } catch (error) {
    console.error("Error al procesar la cita:", error);
    const usuarioAuth = obtenerUsuarioDePeticion(req);
    const htmlError = renderPagina(
      renderResultado({
        exito: false,
        mensaje:
          "Ocurrió un error inesperado al procesar la cita. Por favor, intenta de nuevo en unos momentos.",
      }),
      usuarioAuth
    );
    res.status(500).type("html").send(htmlError);
  }
});

/**
 * POST /citas/:id/cancelar — Cancela una cita específica (exige sesión activa).
 */
app.post("/citas/:id/cancelar", requerirSesion, (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const usuarioAuth = obtenerUsuarioDePeticion(req)!;
    const usuario =
      typeof req.body.usuario === "string" && req.body.usuario.trim() !== ""
        ? req.body.usuario.trim()
        : usuarioAuth.nombre;

    const { citas: citasTrasCancelar } = cancelarCitaAgente(citas, id);
    citas = citasTrasCancelar;

    res.redirect(`/citas?usuario=${encodeURIComponent(usuario)}`);
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    res.redirect("/citas");
  }
});

/**
 * GET /citas/:id/modificar — Muestra el formulario para modificar cita (exige sesión activa).
 */
app.get("/citas/:id/modificar", requerirSesion, (req: Request, res: Response) => {
  const usuarioAuth = obtenerUsuarioDePeticion(req)!;
  const id = String(req.params.id);
  const cita = citas.find((c) => c.id === id);

  if (!cita) {
    const htmlError = renderPagina(
      `
      <main class="card resultado-error">
        <div class="resultado-cabecera">
          <span class="resultado-icono">!</span>
          <div>
            <span class="resultado-etiqueta">Cita no encontrada</span>
            <p class="resultado-mensaje">No se encontró ninguna cita con el ID "${id}".</p>
          </div>
        </div>
        <div class="acciones">
          <a href="/citas" class="btn-secundario">&larr; Volver a Mis Citas</a>
        </div>
      </main>
    `,
      usuarioAuth
    );
    res.status(404).type("html").send(htmlError);
    return;
  }

  const html = renderPagina(renderFormularioModificar(cita), usuarioAuth, {
    titulo: "Modificar Cita - ORBIA",
  });
  res.type("html").send(html);
});

/**
 * POST /citas/:id/modificar — Actualiza los datos de la cita (exige sesión activa).
 */
app.post("/citas/:id/modificar", requerirSesion, (req: Request, res: Response) => {
  try {
    const usuarioAuth = obtenerUsuarioDePeticion(req)!;
    const id = String(req.params.id);
    const citaExistente = citas.find((c) => c.id === id);

    const { servicio, fechaPreferida, horaPreferida, nombreUsuario } = req.body;
    const usuario = citaExistente
      ? citaExistente.usuario
      : String(nombreUsuario ?? "").trim() || usuarioAuth.nombre;

    let servicioNombre = String(servicio ?? "").trim();
    const negocioConServicio = negociosMock.find((n) =>
      n.servicios.some((s) => s.id === servicioNombre)
    );
    const servicioEncontrado = negocioConServicio?.servicios.find(
      (s) => s.id === servicioNombre
    );
    if (servicioEncontrado) {
      servicioNombre = servicioEncontrado.nombre;
    }

    const solicitud: SolicitudUsuario = {
      nombreUsuario: usuario,
      servicio: servicioNombre,
      fechaPreferida: String(fechaPreferida ?? "").trim(),
      horaPreferida: String(horaPreferida ?? "").trim(),
    };

    const { citas: citasActualizadas } = modificarCitaAgente(
      citas,
      id,
      negociosMock,
      horariosMock,
      solicitud
    );

    citas = citasActualizadas;

    res.redirect(`/citas?usuario=${encodeURIComponent(usuario)}`);
  } catch (error) {
    console.error("Error al modificar la cita:", error);
    res.redirect("/citas");
  }
});

/**
 * Inicia el servidor Express en el puerto especificado.
 */
export function iniciarServidor(puerto: number = 3000) {
  return app.listen(puerto, () => {
    console.log(`\n=================================================`);
    console.log(` Servidor ORBIA iniciado con éxito`);
    console.log(` URL: http://localhost:${puerto}`);
    console.log(` Autenticación: Habilitada (node:sqlite)`);
    console.log(`=================================================\n`);
  });
}
