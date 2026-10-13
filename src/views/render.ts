import type { ResultadoAgente } from "../pipeline";
import type { Cita } from "../types";
import type { UsuarioPublico } from "../core/auth";

/**
 * Función pura que genera el HTML del formulario para solicitar una cita.
 * Si el usuario está autenticado, precompleta su nombre.
 * Si está en modo invitado, permite explorar e interactuar, y al intentar agendar solicita inicio de sesión.
 */
export function renderFormularioSolicitud(
  usuario?: UsuarioPublico | null,
  esInvitado: boolean = false
): string {
  const nombreValor = usuario ? usuario.nombre : "";
  const readonlyAttr = usuario ? 'readonly="readonly"' : "";

  const bannerInvitado = esInvitado
    ? `
      <div class="banner-invitado" role="status">
        <span class="banner-icono">👋</span>
        <div>
          <strong>Modo Invitado activo:</strong> Puedes explorar los servicios y negocios disponibles. Para confirmar tu cita se te solicitará iniciar sesión.
        </div>
      </div>
    `
    : "";

  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Agente Inteligente de Citas</h1>
      <p class="subtitulo">Programa tus citas con lenguaje natural y procesamiento funcional.</p>
    </header>

    ${bannerInvitado}

    <main class="card">
      <form action="/citas" method="POST" class="formulario" id="formAgendar" data-autenticado="${usuario ? "true" : "false"}">
        <div class="campo">
          <label for="nombreUsuario">Nombre del Usuario</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            value="${nombreValor.replace(/"/g, "&quot;")}"
            placeholder="Ej. Cris, Ana, Juan Pérez"
            required
            autocomplete="name"
            ${readonlyAttr}
          />
          <span class="error-campo" id="error-nombreUsuario" role="alert"></span>
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
          <span class="error-campo" id="error-servicio" role="alert"></span>
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
            <span class="error-campo" id="error-fechaPreferida" role="alert"></span>
          </div>

          <div class="campo">
            <label for="horaPreferida">Hora o Franja Horaria</label>
            <input
              type="text"
              id="horaPreferida"
              name="horaPreferida"
              placeholder="Ej. tarde, mañana, 16:30"
            />
            <span class="error-campo" id="error-horaPreferida" role="alert"></span>
          </div>
        </div>

        <div class="alerta-error" id="error-agendarGeneral" style="display: none;" role="alert"></div>

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
          const esAutenticado = form && form.getAttribute('data-autenticado') === 'true';
          let enCurso = false;
          let ultimoEnvio = 0;
          const DEBOUNCE_MS = 800;

          if (form && btn) {
            form.addEventListener('submit', function(e) {
              // Modo Invitado: al intentar confirmar, solicitar inicio de sesión y preservar estado
              if (!esAutenticado) {
                e.preventDefault();
                try {
                  const datos = {
                    nombreUsuario: document.getElementById('nombreUsuario')?.value || '',
                    servicio: document.getElementById('servicio')?.value || '',
                    fechaPreferida: document.getElementById('fechaPreferida')?.value || '',
                    horaPreferida: document.getElementById('horaPreferida')?.value || ''
                  };
                  sessionStorage.setItem('orbia_borrador_cita', JSON.stringify(datos));
                } catch (err) {}
                window.location.href = '/login?redirect=' + encodeURIComponent('/');
                return false;
              }

              const ahora = Date.now();
              if (enCurso || (ahora - ultimoEnvio < DEBOUNCE_MS)) {
                e.preventDefault();
                return false;
              }

              ultimoEnvio = ahora;
              enCurso = true;

              btn.disabled = true;
              btn.style.opacity = '0.75';
              btn.style.cursor = 'not-allowed';
              if (texto) texto.textContent = 'Procesando tu solicitud...';
              if (icono) icono.textContent = '⏳';
            });
          }

          // Restaurar borrador de cita tras login exitoso si existe
          try {
            const borradorJson = sessionStorage.getItem('orbia_borrador_cita');
            if (borradorJson) {
              const borrador = JSON.parse(borradorJson);
              if (borrador.servicio && document.getElementById('servicio')) {
                document.getElementById('servicio').value = borrador.servicio;
              }
              if (borrador.fechaPreferida && document.getElementById('fechaPreferida')) {
                document.getElementById('fechaPreferida').value = borrador.fechaPreferida;
              }
              if (borrador.horaPreferida && document.getElementById('horaPreferida')) {
                document.getElementById('horaPreferida').value = borrador.horaPreferida;
              }
              sessionStorage.removeItem('orbia_borrador_cita');
            }
          } catch (err) {}
        })();
      </script>
    </main>
  `;
}

/**
 * Función pura que genera el HTML de la vista de Iniciar Sesión.
 */
export function renderFormularioLogin(
  redirectUrl?: string,
  mensajeAlerta?: string
): string {
  const redir = redirectUrl ? redirectUrl.replace(/"/g, "&quot;") : "/";
  const alertaHtml = mensajeAlerta
    ? `<div class="alerta-aviso" role="status"><span>ℹ️</span> <div>${mensajeAlerta}</div></div>`
    : "";

  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Iniciar Sesión</h1>
      <p class="subtitulo">Ingresa a tu cuenta para gestionar y agendar tus citas.</p>
    </header>

    ${alertaHtml}

    <main class="card auth-card">
      <form id="formLogin" class="formulario" novalidate>
        <input type="hidden" id="loginRedirect" value="${redir}" />

        <div class="campo">
          <label for="loginCorreo">Correo electrónico</label>
          <input
            type="email"
            id="loginCorreo"
            name="correo"
            placeholder="ejemplo@correo.com"
            required
            autocomplete="email"
          />
          <span class="error-campo" id="error-loginCorreo" role="alert"></span>
        </div>

        <div class="campo">
          <div class="label-fila">
            <label for="loginContrasena">Contraseña</label>
            <button type="button" id="btnOlvidoContrasena" class="link-secundario">¿Olvidaste tu contraseña?</button>
          </div>
          <input
            type="password"
            id="loginContrasena"
            name="contrasena"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
          <span class="error-campo" id="error-loginContrasena" role="alert"></span>
        </div>

        <div class="alerta-error" id="error-loginGeneral" style="display: none;" role="alert"></div>

        <button type="submit" class="btn-principal" id="btnLogin">
          <span id="btnLoginTexto">Iniciar sesión</span>
          <span class="btn-flecha" id="btnLoginIcono">&rarr;</span>
        </button>

        <div class="separador"><span>o</span></div>

        <button type="button" class="btn-google" id="btnGoogleVisual">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continuar con Google</span>
          <span class="badge-proximamente">Próximamente</span>
        </button>

        <a href="/?modo=invitado" class="btn-invitado">Continuar como invitado &rarr;</a>

        <p class="pie-auth">
          ¿No tienes una cuenta? <a href="/registro?redirect=${encodeURIComponent(redir)}" class="link-enfasis">Crear cuenta</a>
        </p>
      </form>

      <script>
        (function() {
          const form = document.getElementById('formLogin');
          const btn = document.getElementById('btnLogin');
          const texto = document.getElementById('btnLoginTexto');
          const icono = document.getElementById('btnLoginIcono');
          const correoInput = document.getElementById('loginCorreo');
          const passInput = document.getElementById('loginContrasena');
          const redirectInput = document.getElementById('loginRedirect');
          const errCorreo = document.getElementById('error-loginCorreo');
          const errPass = document.getElementById('error-loginContrasena');
          const errGeneral = document.getElementById('error-loginGeneral');
          const btnOlvido = document.getElementById('btnOlvidoContrasena');

          if (btnOlvido) {
            btnOlvido.addEventListener('click', function(e) {
              e.preventDefault();
              alert('La recuperación automática de contraseña se habilitará próximamente. Por favor, contacta a soporte de ORBIA si necesitas restablecer tu acceso.');
            });
          }

          function limpiarErrores() {
            if (errCorreo) errCorreo.textContent = '';
            if (errPass) errPass.textContent = '';
            if (errGeneral) {
              errGeneral.textContent = '';
              errGeneral.style.display = 'none';
            }
          }

          if (form && btn) {
            form.addEventListener('submit', async function(e) {
              e.preventDefault();
              limpiarErrores();

              const correo = correoInput?.value.trim() || '';
              const contrasena = passInput?.value || '';

              let hayErrorLocal = false;
              if (!correo) {
                if (errCorreo) errCorreo.textContent = 'Ingresa tu correo electrónico.';
                hayErrorLocal = true;
              }
              if (!contrasena) {
                if (errPass) errPass.textContent = 'Ingresa tu contraseña.';
                hayErrorLocal = true;
              }
              if (hayErrorLocal) return;

              btn.disabled = true;
              btn.style.opacity = '0.75';
              btn.style.cursor = 'not-allowed';
              if (texto) texto.textContent = 'Procesando...';
              if (icono) icono.textContent = '⏳';

              try {
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ correo, contrasena })
                });

                const data = await res.json();

                if (res.ok) {
                  const destino = redirectInput?.value || '/';
                  window.location.href = destino;
                  return;
                }

                // Error controlado del servidor (401, 429, etc.)
                if (errGeneral) {
                  errGeneral.textContent = data.error || 'Ocurrió un error al iniciar sesión.';
                  errGeneral.style.display = 'block';
                }
              } catch (err) {
                if (errGeneral) {
                  errGeneral.textContent = 'Error de conexión. Inténtalo de nuevo.';
                  errGeneral.style.display = 'block';
                }
              } finally {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                if (texto) texto.textContent = 'Iniciar sesión';
                if (icono) icono.textContent = '→';
              }
            });
          }
        })();
      </script>
    </main>
  `;
}

/**
 * Función pura que genera el HTML de la vista de Crear Cuenta.
 */
export function renderFormularioRegistro(redirectUrl?: string): string {
  const redir = redirectUrl ? redirectUrl.replace(/"/g, "&quot;") : "/";

  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Crear Cuenta</h1>
      <p class="subtitulo">Regístrate para agendar y gestionar citas con IA de forma personalizada.</p>
    </header>

    <main class="card auth-card">
      <form id="formRegistro" class="formulario" novalidate>
        <input type="hidden" id="regRedirect" value="${redir}" />

        <div class="campo">
          <label for="regNombre">Nombre completo</label>
          <input
            type="text"
            id="regNombre"
            name="nombre"
            placeholder="Ej. Ana Morales"
            required
            autocomplete="name"
          />
          <span class="error-campo" id="error-regNombre" role="alert"></span>
        </div>

        <div class="campo">
          <label for="regCorreo">Correo electrónico</label>
          <input
            type="email"
            id="regCorreo"
            name="correo"
            placeholder="ejemplo@correo.com"
            required
            autocomplete="email"
          />
          <span class="error-campo" id="error-regCorreo" role="alert"></span>
        </div>

        <div class="campo">
          <label for="regContrasena">Contraseña</label>
          <input
            type="password"
            id="regContrasena"
            name="contrasena"
            placeholder="Mínimo 8 caracteres"
            required
            autocomplete="new-password"
          />
          <small class="ayuda">Usa al menos 8 caracteres.</small>
          <span class="error-campo" id="error-regContrasena" role="alert"></span>
        </div>

        <div class="campo-checkbox">
          <label class="checkbox-label" for="regTerminos">
            <input type="checkbox" id="regTerminos" name="terminos" required />
            <span>Acepto los términos del servicio y el aviso de privacidad de ORBIA</span>
          </label>
          <span class="error-campo" id="error-regTerminos" role="alert"></span>
        </div>

        <div class="alerta-error" id="error-regGeneral" style="display: none;" role="alert"></div>

        <button type="submit" class="btn-principal" id="btnRegistro">
          <span id="btnRegTexto">Crear cuenta</span>
          <span class="btn-flecha" id="btnRegIcono">&rarr;</span>
        </button>

        <p class="pie-auth">
          ¿Ya tienes una cuenta? <a href="/login?redirect=${encodeURIComponent(redir)}" class="link-enfasis">Iniciar sesión</a>
        </p>
      </form>

      <script>
        (function() {
          const form = document.getElementById('formRegistro');
          const btn = document.getElementById('btnRegistro');
          const texto = document.getElementById('btnRegTexto');
          const icono = document.getElementById('btnRegIcono');
          const nombreInput = document.getElementById('regNombre');
          const correoInput = document.getElementById('regCorreo');
          const passInput = document.getElementById('regContrasena');
          const terminosInput = document.getElementById('regTerminos');
          const redirectInput = document.getElementById('regRedirect');
          const errNombre = document.getElementById('error-regNombre');
          const errCorreo = document.getElementById('error-regCorreo');
          const errPass = document.getElementById('error-regContrasena');
          const errTerminos = document.getElementById('error-regTerminos');
          const errGeneral = document.getElementById('error-regGeneral');

          function limpiarErrores() {
            if (errNombre) errNombre.textContent = '';
            if (errCorreo) errCorreo.textContent = '';
            if (errPass) errPass.textContent = '';
            if (errTerminos) errTerminos.textContent = '';
            if (errGeneral) {
              errGeneral.textContent = '';
              errGeneral.style.display = 'none';
            }
          }

          if (form && btn) {
            form.addEventListener('submit', async function(e) {
              e.preventDefault();
              limpiarErrores();

              const nombre = nombreInput?.value.trim() || '';
              const correo = correoInput?.value.trim() || '';
              const contrasena = passInput?.value || '';
              const aceptaTerminos = terminosInput?.checked || false;

              let hayErrorLocal = false;
              if (!nombre) {
                if (errNombre) errNombre.textContent = 'El nombre no puede estar vacío.';
                hayErrorLocal = true;
              }
              if (!correo) {
                if (errCorreo) errCorreo.textContent = 'El correo electrónico es obligatorio.';
                hayErrorLocal = true;
              }
              if (contrasena.length < 8) {
                if (errPass) errPass.textContent = 'La contraseña debe tener al menos 8 caracteres.';
                hayErrorLocal = true;
              }
              if (!aceptaTerminos) {
                if (errTerminos) errTerminos.textContent = 'Debes aceptar los términos y el aviso de privacidad.';
                hayErrorLocal = true;
              }

              if (hayErrorLocal) return;

              btn.disabled = true;
              btn.style.opacity = '0.75';
              btn.style.cursor = 'not-allowed';
              if (texto) texto.textContent = 'Procesando...';
              if (icono) icono.textContent = '⏳';

              try {
                const res = await fetch('/api/auth/registro', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nombre, correo, contrasena })
                });

                const data = await res.json();

                if (res.ok) {
                  const destino = redirectInput?.value || '/';
                  window.location.href = destino;
                  return;
                }

                if (data.errores && Array.isArray(data.errores)) {
                  data.errores.forEach(function(err) {
                    if (err.campo === 'nombre' && errNombre) errNombre.textContent = err.mensaje;
                    if (err.campo === 'correo' && errCorreo) errCorreo.textContent = err.mensaje;
                    if (err.campo === 'contrasena' && errPass) errPass.textContent = err.mensaje;
                  });
                } else if (errGeneral) {
                  errGeneral.textContent = data.error || 'Ocurrió un error al crear la cuenta.';
                  errGeneral.style.display = 'block';
                }
              } catch (err) {
                if (errGeneral) {
                  errGeneral.textContent = 'Error de conexión. Inténtalo de nuevo.';
                  errGeneral.style.display = 'block';
                }
              } finally {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                if (texto) texto.textContent = 'Crear cuenta';
                if (icono) icono.textContent = '→';
              }
            });
          }
        })();
      </script>
    </main>
  `;
}

/**
 * Función pura que genera la pantalla "Cuenta" de un usuario autenticado.
 */
export function renderPantallaCuenta(usuario: UsuarioPublico): string {
  const inicial = usuario.nombre.charAt(0).toUpperCase();
  const fechaRegistro = new Date(usuario.creadoEn).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Mi Cuenta</h1>
      <p class="subtitulo">Gestiona tus datos personales, citas asociadas y preferencias de seguridad.</p>
    </header>

    <main class="card cuenta-card">
      <div class="perfil-cabecera">
        <div class="avatar-grande">${inicial}</div>
        <div class="perfil-info">
          <h2>${usuario.nombre}</h2>
          <p class="cuenta-correo">${usuario.correo}</p>
          <span class="badge-miembro">Miembro desde ${fechaRegistro}</span>
        </div>
      </div>

      <div class="cuenta-secciones">
        <a href="/citas" class="fila-cuenta">
          <div class="fila-icono">📅</div>
          <div class="fila-contenido">
            <strong>Mis Citas</strong>
            <p>Consulta, modifica y cancela las citas agendadas con tu usuario.</p>
          </div>
          <span class="fila-flecha">&rarr;</span>
        </a>

        <div class="fila-cuenta interactiva" id="filaMisDatos">
          <div class="fila-icono">👤</div>
          <div class="fila-contenido">
            <strong>Mis Datos</strong>
            <p>Identificador único: <code>${usuario.id}</code></p>
          </div>
          <span class="badge-tag">Verificado</span>
        </div>

        <div class="fila-cuenta interactiva" id="filaNotificaciones">
          <div class="fila-icono">🔔</div>
          <div class="fila-contenido">
            <strong>Notificaciones</strong>
            <p>Recordatorios automáticos activos para tus próximas citas.</p>
          </div>
          <span class="badge-tag">Activo</span>
        </div>

        <div class="fila-cuenta interactiva" id="filaPrivacidad">
          <div class="fila-icono">🛡️</div>
          <div class="fila-contenido">
            <strong>Privacidad y Seguridad</strong>
            <p>Contraseñas hasheadas con Scrypt y sesiones criptográficas de 32 bytes.</p>
          </div>
          <span class="badge-tag">Seguro</span>
        </div>

        <div class="fila-cuenta interactiva" id="filaAyuda">
          <div class="fila-icono">❓</div>
          <div class="fila-contenido">
            <strong>Ayuda y Soporte</strong>
            <p>Guía de uso del agente inteligente de citas y preguntas frecuentes.</p>
          </div>
          <span class="fila-flecha">&rarr;</span>
        </div>
      </div>

      <div class="cuenta-acciones">
        <button type="button" class="btn-cerrar-sesion" id="btnCerrarSesion">
          <span id="btnCerrarTexto">Cerrar sesión</span>
          <span class="icono-cerrar">🚪</span>
        </button>
      </div>

      <script>
        (function() {
          const btnLogout = document.getElementById('btnCerrarSesion');
          const texto = document.getElementById('btnCerrarTexto');

          if (btnLogout) {
            btnLogout.addEventListener('click', async function() {
              if (confirm('¿Deseas cerrar tu sesión en ORBIA?')) {
                btnLogout.disabled = true;
                if (texto) texto.textContent = 'Cerrando sesión...';

                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                } catch (e) {}

                window.location.href = '/login';
              }
            });
          }

          const filaAyuda = document.getElementById('filaAyuda');
          if (filaAyuda) {
            filaAyuda.addEventListener('click', function() {
              alert('ORBIA AI es tu asistente funcional de agendamiento. Puedes escribir solicitudes en lenguaje natural desde la pestaña Servicios.');
            });
          }
        })();
      </script>
    </main>
  `;
}

/**
 * Función pura para mostrar mensaje 401 que exige iniciar sesión con opciones claras.
 */
export function renderRequiereLogin(redirectUrl?: string): string {
  const redir = redirectUrl ? encodeURIComponent(redirectUrl) : "%2F";
  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Acceso Requerido</h1>
    </header>

    <main class="card resultado-error">
      <div class="resultado-cabecera">
        <span class="resultado-icono">🔒</span>
        <div>
          <span class="resultado-etiqueta">Sesión no iniciada (401)</span>
          <p class="resultado-mensaje">Debes iniciar sesión con tu cuenta para acceder y gestionar tus citas.</p>
        </div>
      </div>

      <div class="acciones" style="margin-top: 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="/login?redirect=${redir}" class="btn-principal" style="text-decoration: none; padding: 12px 24px;">Iniciar sesión</a>
        <a href="/registro?redirect=${redir}" class="btn-secundario" style="text-decoration: none; padding: 12px 24px;">Crear cuenta</a>
        <a href="/?modo=invitado" class="btn-secundario" style="text-decoration: none; padding: 12px 24px;">Explorar como invitado</a>
      </div>
    </main>
  `;
}

/**
 * Función pura que genera el HTML del resultado tras procesar una solicitud de cita.
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
 * Función pura que genera el HTML de búsqueda de citas.
 */
export function renderBusquedaCitas(usuarioBuscado?: string): string {
  const valor = usuarioBuscado ? usuarioBuscado.replace(/"/g, "&quot;") : "";
  return `
    <header class="header">
      <div class="logo-badge">ORBIA AI</div>
      <h1>Mis Citas</h1>
      <p class="subtitulo">Consulta y gestiona las citas asociadas a tu usuario.</p>
    </header>

    <main class="card busqueda-card">
      <form action="/citas" method="GET" class="formulario-busqueda">
        <div class="campo-busqueda">
          <label for="usuario">Nombre o Usuario</label>
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
 * Función pura que genera el HTML de la lista de citas de un usuario.
 */
export function renderListaCitas(citas: Cita[], usuario: string): string {
  if (citas.length === 0) {
    return `
      <section class="card lista-citas-card vacio">
        <div class="mensaje-vacio">
          <span class="icono-vacio">📅</span>
          <h3>Sin citas registradas</h3>
          <p>No se encontraron citas para <strong>${usuario}</strong>.</p>
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
 * Función pura que genera el formulario para modificar una cita.
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
 * estructura de documento HTML completa (DOCTYPE, head, estilos, navegación adaptativa y contenedor).
 */
export function renderPagina(
  contenido: string,
  usuario?: UsuarioPublico | null,
  opciones?: { titulo?: string; esInvitado?: boolean }
): string {
  const tieneSesion = Boolean(usuario);
  const tituloPagina = opciones?.titulo || "ORBIA - Agente de Citas";

  const enlacesNav = tieneSesion
    ? `
      <a href="/" class="nav-link">Servicios</a>
      <a href="/citas" class="nav-link">Mis Citas</a>
      <a href="/cuenta" class="nav-link nav-usuario">
        <span class="avatar-mini">${usuario!.nombre.charAt(0).toUpperCase()}</span>
        <span>Cuenta</span>
      </a>
    `
    : `
      <a href="/?modo=invitado" class="nav-link">Servicios</a>
      <a href="/login" class="nav-link">Iniciar Sesión</a>
      <a href="/registro" class="nav-link nav-destacado">Crear Cuenta</a>
    `;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${tituloPagina}</title>
  <link rel="stylesheet" href="/estilos.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="layout">
    <nav class="nav-bar" aria-label="Navegación principal">
      ${enlacesNav}
    </nav>
    ${contenido}
    <footer class="footer">
      <p>ORBIA &bull; Functional Core, Imperative Shell &bull; Antigravity IDE</p>
    </footer>
  </div>
</body>
</html>`;
}
