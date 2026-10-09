import express, { Request, Response } from "express";
import path from "path";
import type { Cita, SolicitudUsuario } from "../types";
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
} from "../views/render";

/**
 * Instancia de la aplicación Express (Imperative Shell).
 * Mantiene el estado en memoria y delega el procesamiento al núcleo funcional.
 */
export const app = express();

// Middleware para decodificar datos enviados por formulario POST (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (como public/estilos.css)
app.use(express.static(path.join(__dirname, "../../public")));

// Estado de citas en memoria a nivel de módulo
let citas: Cita[] = [];

/**
 * GET / — Ruta principal que renderiza el formulario de agendamiento.
 */
app.get("/", (_req: Request, res: Response) => {
  const html = renderPagina(renderFormularioSolicitud());
  res.type("html").send(html);
});

/**
 * GET /citas — Consulta las citas de un usuario o muestra el formulario de búsqueda.
 */
app.get("/citas", (req: Request, res: Response) => {
  const usuario = typeof req.query.usuario === "string" ? req.query.usuario.trim() : undefined;

  if (usuario) {
    const resultadoConsulta = consultarCitasAgente(citas, usuario);
    const contenido = renderBusquedaCitas(usuario) + renderListaCitas(resultadoConsulta.citas, usuario);
    res.type("html").send(renderPagina(contenido));
  } else {
    res.type("html").send(renderPagina(renderBusquedaCitas()));
  }
});

/**
 * POST /citas — Procesa la solicitud enviada por el formulario web.
 */
app.post("/citas", async (req: Request, res: Response) => {
  try {
    const { nombreUsuario, servicio, fechaPreferida, horaPreferida } = req.body;

    const solicitud: SolicitudUsuario = {
      nombreUsuario: String(nombreUsuario ?? "").trim(),
      servicio: String(servicio ?? "").trim(),
      fechaPreferida: String(fechaPreferida ?? "").trim(),
      horaPreferida: String(horaPreferida ?? "").trim(),
    };

    // Invoca la función orquestadora del pipeline existente
    const { resultado, citas: nuevasCitas } = await procesarSolicitud(
      solicitud,
      negociosMock,
      horariosMock,
      citas
    );

    // Transición explícita de estado inmutable en memoria
    citas = nuevasCitas;

    const html = renderPagina(renderResultado(resultado));
    res.type("html").send(html);
  } catch (error) {
    console.error("Error al procesar la cita:", error);
    const htmlError = renderPagina(
      renderResultado({
        exito: false,
        mensaje:
          "Ocurrió un error inesperado al procesar la cita. Por favor, intenta de nuevo en unos momentos.",
      })
    );
    res.status(500).type("html").send(htmlError);
  }
});

/**
 * POST /citas/:id/cancelar — Cancela una cita específica y redirige a la vista del usuario.
 */
app.post("/citas/:id/cancelar", (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const usuario =
      typeof req.body.usuario === "string" && req.body.usuario.trim() !== ""
        ? req.body.usuario.trim()
        : typeof req.query.usuario === "string" && req.query.usuario.trim() !== ""
        ? req.query.usuario.trim()
        : "";

    // Invoca la función pura de cancelación del pipeline
    const { citas: citasTrasCancelar } = cancelarCitaAgente(citas, id);
    citas = citasTrasCancelar;

    if (usuario) {
      res.redirect(`/citas?usuario=${encodeURIComponent(usuario)}`);
    } else {
      res.redirect("/citas");
    }
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    res.redirect("/citas");
  }
});

/**
 * GET /citas/:id/modificar — Busca la cita por id en el estado en memoria y muestra renderFormularioModificar.
 */
app.get("/citas/:id/modificar", (req: Request, res: Response) => {
  const id = String(req.params.id);
  const cita = citas.find((c) => c.id === id);

  if (!cita) {
    const htmlError = renderPagina(`
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
    `);
    res.status(404).type("html").send(htmlError);
    return;
  }

  const html = renderPagina(renderFormularioModificar(cita));
  res.type("html").send(html);
});

/**
 * POST /citas/:id/modificar — Arma una SolicitudUsuario con los datos del formulario,
 * llama a modificarCitaAgente, actualiza el estado en memoria, y redirige a /citas?usuario=<usuario>.
 */
app.post("/citas/:id/modificar", (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const citaExistente = citas.find((c) => c.id === id);

    const { servicio, fechaPreferida, horaPreferida, nombreUsuario } = req.body;
    const usuario = citaExistente
      ? citaExistente.usuario
      : String(nombreUsuario ?? "").trim();

    let servicioNombre = String(servicio ?? "").trim();
    // Si el valor ingresado coincide con un ID de servicio en el catálogo mock, resolver su nombre
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

    if (usuario) {
      res.redirect(`/citas?usuario=${encodeURIComponent(usuario)}`);
    } else {
      res.redirect("/citas");
    }
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
    console.log(`=================================================\n`);
  });
}

