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
  lugaresMock,
  obtenerLugarPorId,
  obtenerLocalesDeLugar,
  obtenerLocalPorId,
} from "../../data/lugares.mock";
import {
  renderPantallaServicios,
  renderPantallaLugar,
  renderPantallaLocalBarberia,
  renderPantallaAgendarManual,
  renderPantallaAgendarIA,
  renderPantallaMisCitas,
  renderResultado,
  renderPagina,
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

/**
 * GET /api/lugares — Lista todos los lugares disponibles (solo lectura).
 */
app.get("/api/lugares", (_req: Request, res: Response) => {
  res.status(200).json(lugaresMock);
});

/**
 * GET /api/lugares/:id/locales — Lista los locales de un lugar específico (solo lectura).
 */
app.get("/api/lugares/:id/locales", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const lugar = obtenerLugarPorId(id);
  if (!lugar) {
    res.status(404).json({ error: `Lugar no encontrado con id '${id}'.` });
    return;
  }
  const locales = obtenerLocalesDeLugar(id);
  res.status(200).json(locales);
});

/**
 * GET /api/locales/:id — Detalle de un local específico con sus servicios y profesionales (solo lectura).
 */
app.get("/api/locales/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const local = obtenerLocalPorId(id);
  if (!local) {
    res.status(404).json({ error: `Local no encontrado con id '${id}'.` });
    return;
  }
  res.status(200).json(local);
});

// ============================================================================
// VISTAS WEB
// ============================================================================

/**
 * GET / y GET /servicios — PANTALLA 03: Servicios (referencia/03-servicios.html).
 * Punto de entrada principal donde se muestran el lugar asignado y el catálogo.
 */
app.get(["/", "/servicios"], (_req: Request, res: Response) => {
  const lugar = obtenerLugarPorId("plaza-central") || lugaresMock[0];
  const html = renderPantallaServicios(lugar);
  res.type("html").send(html);
});

/**
 * GET /lugares/:id — PANTALLA 04: Plaza Central (referencia/04-lugar.html).
 * Muestra el plano de casillas y el listado de locales dinámicamente.
 */
app.get("/lugares/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const lugar = obtenerLugarPorId(id);
  if (!lugar) {
    res.status(404).type("html").send(
      renderPagina(
        `<div style="padding:48px 24px;text-align:center"><h2 style="font-size:20px;font-weight:800">Lugar no encontrado</h2><p style="color:#94a3b8">No se encontró el lugar con ID "${id}".</p><a href="/servicios" style="color:#a5b4fc;font-weight:700">&larr; Volver a Servicios</a></div>`,
        null,
        { titulo: "No Encontrado - ORBIA" }
      )
    );
    return;
  }

  const locales = obtenerLocalesDeLugar(id);
  const html = renderPantallaLugar(lugar, locales);
  res.type("html").send(html);
});

/**
 * GET /locales/:id — PANTALLA 05: Local de la barbería u otros (referencia/05-local-barberia.html).
 * Muestra servicios, barberos y los botones "Agendar con ORBIA IA" y "Agendar por mi cuenta".
 */
app.get("/locales/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const local = obtenerLocalPorId(id);
  if (!local) {
    res.status(404).type("html").send(
      renderPagina(
        `<div style="padding:48px 24px;text-align:center"><h2 style="font-size:20px;font-weight:800">Local no encontrado</h2><p style="color:#94a3b8">No se encontró el local con ID "${id}".</p><a href="/lugares/plaza-central" style="color:#a5b4fc;font-weight:700">&larr; Volver al Lugar</a></div>`,
        null,
        { titulo: "No Encontrado - ORBIA" }
      )
    );
    return;
  }

  const lugar = obtenerLugarPorId(local.lugarId) || lugaresMock[0];
  const html = renderPantallaLocalBarberia(local, lugar);
  res.type("html").send(html);
});

/**
 * GET /agendar-ia — PANTALLA 06: Agendar con ORBIA IA (referencia/06-agendar-ia.html).
 * Conectado con el flujo funcional existente de agendamiento inteligente.
 */
app.get("/agendar-ia", (req: Request, res: Response) => {
  const localId = typeof req.query.local === "string" ? req.query.local : "local-12";
  const local = obtenerLocalPorId(localId) || obtenerLocalPorId("local-12")!;
  const usuario = obtenerUsuarioDePeticion(req);
  const html = renderPantallaAgendarIA(local, usuario);
  res.type("html").send(html);
});

/**
 * GET /agendar-manual — PANTALLA 07: Agendar por mi cuenta (referencia/07-agendar-manual.html).
 * Muestra la selección manual paso a paso (sin conectar al servidor por ahora).
 */
app.get("/agendar-manual", (req: Request, res: Response) => {
  const localId = typeof req.query.local === "string" ? req.query.local : "local-12";
  const local = obtenerLocalPorId(localId) || obtenerLocalPorId("local-12")!;
  const html = renderPantallaAgendarManual(local);
  res.type("html").send(html);
});

/**
 * GET /login — PANTALLA 01: Iniciar Sesión (referencia/01-login.html).
 */
app.get("/login", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  const redirectDestino = typeof req.query.redirect === "string" ? req.query.redirect : "/";

  if (usuario) {
    res.redirect(redirectDestino);
    return;
  }

  const html = renderFormularioLogin(redirectDestino);
  res.type("html").send(html);
});

/**
 * GET /registro — PANTALLA 02: Crear Cuenta (referencia/02-registro.html).
 */
app.get("/registro", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  const redirectDestino = typeof req.query.redirect === "string" ? req.query.redirect : "/";

  if (usuario) {
    res.redirect(redirectDestino);
    return;
  }

  const html = renderFormularioRegistro(redirectDestino);
  res.type("html").send(html);
});

/**
 * GET /cuenta — PANTALLA 09: Cuenta (referencia/09-cuenta.html).
 * Exige sesión activa; si no existe, redirige a /login.
 */
app.get("/cuenta", (req: Request, res: Response) => {
  const usuario = obtenerUsuarioDePeticion(req);
  if (!usuario) {
    res.redirect("/login?redirect=%2Fcuenta");
    return;
  }
  const html = renderPantallaCuenta(usuario);
  res.type("html").send(html);
});

/**
 * GET /citas — PANTALLA 08: Mis Citas (referencia/08-mis-citas.html).
 * Consulta las citas activas del usuario autenticado o especificado en query.
 */
app.get("/citas", (req: Request, res: Response) => {
  const usuarioAuth = obtenerUsuarioDePeticion(req);
  const usuarioBuscado =
    typeof req.query.usuario === "string" && req.query.usuario.trim() !== ""
      ? req.query.usuario.trim()
      : usuarioAuth?.nombre;

  if (!usuarioBuscado) {
    // Si no tiene sesión activa ni usuario especificado, solicitar inicio de sesión
    res.redirect("/login?redirect=%2Fcitas");
    return;
  }

  const resultadoConsulta = consultarCitasAgente(citas, usuarioBuscado);
  const html = renderPantallaMisCitas(resultadoConsulta.citas, usuarioBuscado);
  res.type("html").send(html);
});

/**
 * POST /citas — Procesa la solicitud de agendamiento con el agente inteligente existente.
 * Mantiene la funcionalidad intacta: procesar con IA, registrar en memoria y mostrar confirmación.
 */
app.post("/citas", async (req: Request, res: Response) => {
  try {
    const usuarioAuth = obtenerUsuarioDePeticion(req);
    const { servicio, fechaPreferida, horaPreferida, nombreUsuario } = req.body;

    const nombreFinal =
      typeof nombreUsuario === "string" && nombreUsuario.trim() !== ""
        ? nombreUsuario.trim()
        : usuarioAuth?.nombre || "Invitado";

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

    const html = renderResultado(resultado);
    res.type("html").send(html);
  } catch (error) {
    console.error("Error al procesar la cita:", error);
    const htmlError = renderResultado({
      exito: false,
      mensaje:
        "Ocurrió un error inesperado al procesar la cita. Por favor, intenta de nuevo en unos momentos.",
    });
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
