import type { ResultadoAgente } from "../pipeline";
import type { Cita } from "../types";

/**
 * Función pura que genera el HTML del formulario para solicitar una cita.
 * Es completamente pura: no accede a req ni a res; retorna una cadena HTML estricta.
 */
export function renderFormularioSolicitud(): string {
  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Agente Inteligente de Citas</h1>
      <p class="subtitulo">Programa tus citas con lenguaje natural y procesamiento funcional.</p>
    </header>

    <main class="card">
      <form action="/citas" method="POST" class="formulario" id="formAgendar">
        <div class="campo">
          <label for="nombreUsuario">Nombre del Usuario</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            placeholder="Ej. Cris, Ana, Juan Pérez"
            required
            autocomplete="name"
          />
        </div>

        <div class="campo">
          <label for="servicio">Servicio Solicitado</label>
          <input
            type="text"
            id="servicio"
            name="servicio"
            placeholder="Ej. corte de cabello, cambio de aceite"
            required
          />
          <small class="ayuda">Indica el servicio que requieres (ej. belleza, mecánica, etc.).</small>
        </div>

        <div class="grid-campos">
          <div class="campo">
            <label for="fechaPreferida">Fecha Preferida</label>
            <input
              type="text"
              id="fechaPreferida"
              name="fechaPreferida"
              placeholder="Ej. viernes, hoy, mañana, 2026-09-11"
            />
          </div>

          <div class="campo">
            <label for="horaPreferida">Hora o Franja Horaria</label>
            <input
              type="text"
              id="horaPreferida"
              name="horaPreferida"
              placeholder="Ej. tarde, mañana, 16:30"
            />
          </div>
        </div>

        <button type="submit" class="btn-principal" id="btnAgendar">
          <span id="btnAgendarTexto">Agendar Cita con IA</span>
          <span class="btn-flecha" id="btnAgendarIcono">&rarr;</span>
        </button>
      </form>

      <script>
        (function() {
          const form = document.getElementById('formAgendar');
          const btn = document.getElementById('btnAgendar');
          const texto = document.getElementById('btnAgendarTexto');
          const icono = document.getElementById('btnAgendarIcono');
          let enCurso = false;
          let ultimoEnvio = 0;
          const DEBOUNCE_MS = 800;

          if (form && btn) {
            form.addEventListener('submit', function(e) {
              const ahora = Date.now();
              // Evitar envíos múltiples o clics rápidos dentro del debounce
              if (enCurso || (ahora - ultimoEnvio < DEBOUNCE_MS)) {
                e.preventDefault();
                return false;
              }

              ultimoEnvio = ahora;
              enCurso = true;

              // Deshabilitar botón y mostrar retroalimentación de proceso
              btn.disabled = true;
              btn.style.opacity = '0.75';
              btn.style.cursor = 'not-allowed';
              if (texto) texto.textContent = 'Procesando tu solicitud...';
              if (icono) icono.textContent = '⏳';
            });
          }
        })();
      </script>
    </main>
  `;
}

/**
 * Función pura que genera el HTML del resultado tras procesar una solicitud de cita.
 * Muestra el mensaje de éxito o aviso y, si se reservó una cita, sus detalles estructurados.
 */
export function renderResultado(resultado: ResultadoAgente): string {
  const claseEstado = resultado.exito ? "resultado-exito" : "resultado-error";
  const icono = resultado.exito ? "✓" : "!";
  const etiqueta = resultado.exito ? "Confirmación Exitosa" : "Aviso de Disponibilidad";

  let detalleCitaHtml = "";
  if (resultado.cita) {
    const c = resultado.cita;
    detalleCitaHtml = `
      <section class="detalle-cita">
        <h3>Detalles de la Cita Asignada</h3>
        <dl class="lista-detalles">
          <div class="detalle-item">
            <dt>ID de Cita</dt>
            <dd><code>${c.id}</code></dd>
          </div>
          <div class="detalle-item">
            <dt>Usuario</dt>
            <dd>${c.usuario}</dd>
          </div>
          <div class="detalle-item">
            <dt>ID de Negocio</dt>
            <dd><code>${c.negocioId}</code></dd>
          </div>
          <div class="detalle-item">
            <dt>ID de Servicio</dt>
            <dd><code>${c.servicioId}</code></dd>
          </div>
          <div class="detalle-item">
            <dt>Fecha Asignada</dt>
            <dd class="destacado">${c.fecha}</dd>
          </div>
          <div class="detalle-item">
            <dt>Hora Asignada</dt>
            <dd class="destacado">${c.hora}</dd>
          </div>
          <div class="detalle-item">
            <dt>Duración</dt>
            <dd>${c.duracionMinutos ?? 30} minutos</dd>
          </div>
          <div class="detalle-item">
            <dt>Estado</dt>
            <dd><span class="badge-estado estado-${c.estado}">${c.estado}</span></dd>
          </div>
        </dl>
      </section>
    `;
  }

  let modoLocalHtml = "";
  if (resultado.modoLocal) {
    modoLocalHtml = `
      <div style="margin: 16px 0; padding: 12px 16px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; font-size: 0.875rem; color: #fbbf24; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.2rem;">⚡</span>
        <div>
          <strong>Modo Local Activo (Plan B):</strong> La solicitud fue procesada por el parser determinista puro debido a saturación o indisponibilidad en los servicios externos de IA.
        </div>
      </div>
    `;
  }

  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Resultado del Agendamiento</h1>
    </header>

    <main class="card ${claseEstado}">
      <div class="resultado-cabecera">
        <span class="resultado-icono">${icono}</span>
        <div>
          <span class="resultado-etiqueta">${etiqueta}</span>
          <p class="resultado-mensaje">${resultado.mensaje}</p>
        </div>
      </div>

      ${modoLocalHtml}
      ${detalleCitaHtml}

      <div class="acciones">
        <a href="/" class="btn-secundario">&larr; Volver al Formulario</a>
      </div>
    </main>
  `;
}

/**
 * Función pura que genera el HTML de un formulario simple (GET)
 * con un campo de texto para buscar citas por nombre de usuario.
 */
export function renderBusquedaCitas(usuarioBuscado?: string): string {
  const valor = usuarioBuscado ? usuarioBuscado.replace(/"/g, "&quot;") : "";
  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Mis Citas</h1>
      <p class="subtitulo">Consulta y gestiona las citas asociadas a tu nombre de usuario.</p>
    </header>

    <main class="card busqueda-card">
      <form action="/citas" method="GET" class="formulario-busqueda">
        <div class="campo-busqueda">
          <label for="usuario">Nombre del Usuario</label>
          <div class="input-boton-grupo">
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Ej. Cris, Ana, Juan"
              value="${valor}"
              required
              autocomplete="name"
            />
            <button type="submit" class="btn-buscar">Buscar Citas</button>
          </div>
        </div>
      </form>
    </main>
  `;
}

/**
 * Función pura que genera el HTML de la lista de citas de un usuario,
 * mostrando fecha, hora, servicio y estado, con un botón para cancelar cada una.
 */
export function renderListaCitas(citas: Cita[], usuario: string): string {
  if (citas.length === 0) {
    return `
      <section class="card lista-citas-card vacio">
        <div class="mensaje-vacio">
          <span class="icono-vacio">📅</span>
          <h3>Sin citas registradas</h3>
          <p>No se encontraron citas para el usuario <strong>${usuario}</strong>.</p>
          <div class="acciones-vacio">
            <a href="/" class="btn-secundario">+ Agendar una nueva cita</a>
          </div>
        </div>
      </section>
    `;
  }

  const itemsHtml = citas
    .map((c) => {
      const estaCancelada = c.estado === "cancelada";
      return `
        <article class="cita-card">
          <div class="cita-info">
            <div class="cita-cabecera">
              <span class="cita-fecha-hora">📅 ${c.fecha} &bull; ⏰ ${c.hora}</span>
              <span class="badge-estado estado-${c.estado}">${c.estado}</span>
            </div>
            <div class="cita-detalles">
              <p><strong>Servicio:</strong> <code>${c.servicioId}</code></p>
              <p><strong>Negocio:</strong> <code>${c.negocioId}</code></p>
              <p><strong>ID Cita:</strong> <code>${c.id}</code></p>
            </div>
          </div>
          <div class="cita-acciones">
            ${
              estaCancelada
                ? `<span class="texto-cancelada">Cancelada</span>`
                : `<a href="/citas/${c.id}/modificar" class="btn-modificar">Modificar</a>
                  <form action="/citas/${c.id}/cancelar" method="POST" class="form-cancelar">
                    <input type="hidden" name="usuario" value="${usuario}" />
                    <button type="submit" class="btn-cancelar">Cancelar</button>
                  </form>`
            }
          </div>
        </article>
      `;
    })
    .join("\n");

  return `
    <section class="card lista-citas-card">
      <div class="lista-cabecera">
        <h2>Citas de ${usuario} (${citas.length})</h2>
      </div>
      <div class="lista-grid">
        ${itemsHtml}
      </div>
    </section>
  `;
}

/**
 * Función pura que genera el HTML del formulario para modificar una cita existente.
 * Muestra los mismos campos que el formulario de agendar (servicio, fecha preferida,
 * hora preferida), precargados con los datos actuales de la cita.
 */
export function renderFormularioModificar(cita: Cita): string {
  const servicioEscapado = cita.servicioId.replace(/"/g, "&quot;");
  const fechaEscapada = cita.fecha.replace(/"/g, "&quot;");
  const horaEscapada = cita.hora.replace(/"/g, "&quot;");
  const usuarioEscapado = cita.usuario.replace(/"/g, "&quot;");

  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Modificar Cita</h1>
      <p class="subtitulo">Actualiza los datos de tu cita <code>${cita.id}</code> (Usuario: <strong>${usuarioEscapado}</strong>).</p>
    </header>

    <main class="card">
      <form action="/citas/${cita.id}/modificar" method="POST" class="formulario">
        <input type="hidden" name="nombreUsuario" value="${usuarioEscapado}" />

        <div class="campo">
          <label for="servicio">Servicio Solicitado</label>
          <input
            type="text"
            id="servicio"
            name="servicio"
            value="${servicioEscapado}"
            placeholder="Ej. corte de cabello, cambio de aceite"
            required
          />
          <small class="ayuda">Indica el servicio asignado a esta cita.</small>
        </div>

        <div class="grid-campos">
          <div class="campo">
            <label for="fechaPreferida">Fecha Preferida</label>
            <input
              type="text"
              id="fechaPreferida"
              name="fechaPreferida"
              value="${fechaEscapada}"
              placeholder="Ej. viernes, hoy, mañana, 2026-09-11"
              required
            />
          </div>

          <div class="campo">
            <label for="horaPreferida">Hora o Franja Horaria</label>
            <input
              type="text"
              id="horaPreferida"
              name="horaPreferida"
              value="${horaEscapada}"
              placeholder="Ej. tarde, mañana, 16:30"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-principal">
          <span>Guardar Cambios</span>
          <span class="btn-flecha">&rarr;</span>
        </button>

        <div class="acciones" style="margin-top: 16px;">
          <a href="/citas?usuario=${encodeURIComponent(cita.usuario)}" class="btn-secundario">&larr; Volver a Mis Citas</a>
        </div>
      </form>
    </main>
  `;
}

/**
 * Función pura que envuelve cualquier fragmento de contenido dentro de la
 * estructura de documento HTML completa (DOCTYPE, head, link a estilos, navegación y contenedor).
 */
export function renderPagina(contenido: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ORBIA - Agente de Citas</title>
  <link rel="stylesheet" href="/estilos.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="layout">
    <nav class="nav-bar">
      <a href="/" class="nav-link">Agendar Cita</a>
      <a href="/citas" class="nav-link">Mis Citas</a>
    </nav>
    ${contenido}
    <footer class="footer">
      <p>ORBIA &bull; Functional Core, Imperative Shell &bull; Antigravity IDE</p>
    </footer>
  </div>
</body>
</html>`;
}

