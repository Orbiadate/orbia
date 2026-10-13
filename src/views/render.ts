import type { ResultadoAgente } from "../pipeline";
import type { Cita } from "../types";
import type { UsuarioPublico } from "../core/auth";
import type { LugarMock, LocalMock } from "../../data/lugares.mock";

/**
 * Genera la barra de navegación inferior fija de 76px conforme a la referencia oficial.
 */
export function renderBarraInferior(
  pestanaActiva: "inicio" | "servicios" | "citas" | "cuenta"
): string {
  const colorActivo = "#fff";
  const pesoActivo = "700";
  const strokeActivo = "2";

  const colorInactivo = "#8b9ab3";
  const pesoInactivo = "600";
  const strokeInactivo = "1.8";

  const esInicio = pestanaActiva === "inicio";
  const esServicios = pestanaActiva === "servicios";
  const esCitas = pestanaActiva === "citas";
  const esCuenta = pestanaActiva === "cuenta";

  return `
    <nav style="height:76px;flex:none;box-sizing:border-box;display:flex;justify-content:space-around;align-items:center;padding:0 8px 8px;background:rgba(13,20,36,.94);border-top:1px solid rgba(148,163,184,.14)" aria-label="Navegación principal">
      <a href="/" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:64px;min-height:44px;font-size:11px;font-weight:${esInicio ? pesoActivo : pesoInactivo};color:${esInicio ? colorActivo : colorInactivo};text-decoration:none">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${esInicio ? strokeActivo : strokeInactivo}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z"></path></svg>
        Inicio
      </a>
      <a href="/servicios" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:64px;min-height:44px;font-size:11px;font-weight:${esServicios ? pesoActivo : pesoInactivo};color:${esServicios ? colorActivo : colorInactivo};text-decoration:none">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${esServicios ? strokeActivo : strokeInactivo}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect></svg>
        Servicios
      </a>
      <a href="/citas" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:64px;min-height:44px;font-size:11px;font-weight:${esCitas ? pesoActivo : pesoInactivo};color:${esCitas ? colorActivo : colorInactivo};text-decoration:none">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${esCitas ? strokeActivo : strokeInactivo}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M4 10h16M9 3v4M15 3v4"></path></svg>
        Mis citas
      </a>
      <a href="/cuenta" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:64px;min-height:44px;font-size:11px;font-weight:${esCuenta ? pesoActivo : pesoInactivo};color:${esCuenta ? colorActivo : colorInactivo};text-decoration:none">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${esCuenta ? strokeActivo : strokeInactivo}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path></svg>
        Cuenta
      </a>
    </nav>
  `;
}

/**
 * Envoltorio HTML estándar de la aplicación con marco de 390px x 844px exacto al diseño objetivo.
 */
export function renderMarco(
  cuerpoHtml: string,
  pestanaActiva?: "inicio" | "servicios" | "citas" | "cuenta",
  titulo: string = "ORBIA",
  fondoEstilo: string = "linear-gradient(160deg,#1b2050 0%,#0d1424 42%)"
): string {
  const barraHtml = pestanaActiva ? renderBarraInferior(pestanaActiva) : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>
  body {
    margin: 0;
    background: #070b16;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  * {
    box-sizing: border-box;
  }
  .orbia-frame {
    width: 390px;
    height: 844px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: ${fondoEstilo};
    color: #fff;
  }
  .scroll-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .scroll-body::-webkit-scrollbar {
    display: none;
  }
</style>
</head>
<body>
<div class="orbia-frame">
  <div class="scroll-body">
    ${cuerpoHtml}
  </div>
  ${barraHtml}
</div>
</body>
</html>`;
}

/**
 * PANTALLA 03: Servicios (referencia/03-servicios.html)
 * Punto de entrada principal con catálogo de servicios y acceso a lugares.
 */
export function renderPantallaServicios(lugar: LugarMock): string {
  const cuerpo = `
    <div style="padding:24px 20px 0;display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <h1 style="margin:0;font-size:32px;font-weight:800;letter-spacing:-.02em">Servicios</h1>
        <span style="background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-size:11px;font-weight:800;letter-spacing:.06em;padding:6px 12px;border-radius:999px">ORBIA AI</span>
      </div>

      <a href="/lugares/${lugar.id}" style="display:flex;align-items:center;gap:12px;height:64px;box-sizing:border-box;padding:0 16px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);color:#fff">
        <span style="width:36px;height:36px;border-radius:50%;background:rgba(99,102,241,.22);color:#a5b4fc;display:flex;align-items:center;justify-content:center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
        </span>
        <span style="flex:1;display:flex;flex-direction:column">
          <span style="font-size:12px;color:#94a3b8;font-weight:500">Tu lugar</span>
          <span style="font-size:16px;font-weight:700">${lugar.nombre}</span>
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>
      </a>

      <h2 style="margin:12px 0 0;font-size:18px;font-weight:700">Agenda una cita</h2>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
        <a href="/locales/local-12" style="position:relative;height:96px;box-sizing:border-box;padding:14px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:flex-end;color:#fff;font-size:15px;font-weight:700">
          Barbería
          <span style="position:absolute;top:12px;right:12px;color:#a5b4fc">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M8.1 8.1L20 20M8.1 15.9L20 4"></path></svg>
          </span>
        </a>
        <div style="position:relative;height:96px;box-sizing:border-box;padding:14px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:flex-end;font-size:15px;font-weight:700">
          Salón de belleza
          <span style="position:absolute;top:12px;right:12px;color:#a5b4fc">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"></path></svg>
          </span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px 10px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21c-4-3-7-6-7-10 3 0 5 1 7 3 2-2 4-3 7-3 0 4-3 7-7 10z"></path><path d="M12 14V6"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Spa</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4c-2 0-3 2-3 4 0 3 2 4 2 8 0 3 1 4 2 4s1-3 2-5c1 2 1 5 2 5s2-1 2-4c0-4 2-5 2-8 0-2-1-4-3-4-2 0-2 1-3 1s-1-1-3-1z"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Dentista</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 7a4 4 0 105 5l-9 9a2 2 0 01-3-3l9-9"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Mecánica</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="10" r="2"></circle><circle cx="12" cy="6" r="2"></circle><circle cx="17" cy="10" r="2"></circle><path d="M12 12c-3 0-5 3-5 5 0 2 2 2 5 2s5 0 5-2c0-2-2-5-5-5z"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Veterinaria</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Gimnasio</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"></rect><circle cx="12" cy="13" r="3.5"></circle><path d="M8 7l1.5-3h5L16 7"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Fotografía</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v13a2 2 0 012-2h6z"></path></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Tutorías</span></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:60px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="18" cy="12" r="1"></circle></svg></div><span style="font-size:12px;font-weight:600;color:#cbd5e1">Más</span></div>
      </div>

      <h2 style="margin:12px 0 0;font-size:18px;font-weight:700">Pide lo que quieras</h2>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:16px">
        <div style="position:relative;height:96px;box-sizing:border-box;padding:14px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:flex-end;font-size:15px;font-weight:700">
          Restaurantes
          <span style="position:absolute;top:12px;right:12px;color:#fbbf24">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"></path></svg>
          </span>
        </div>
        <div style="position:relative;height:96px;box-sizing:border-box;padding:14px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:flex-end;font-size:15px;font-weight:700">
          Súper y tienda
          <span style="position:absolute;top:12px;right:12px;color:#fbbf24">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16l-2 11H6zM9 8l3-4 3 4"></path></svg>
          </span>
        </div>
      </div>
    </div>
  `;

  return renderMarco(cuerpo, "servicios", "Servicios - ORBIA");
}

/**
 * PANTALLA 04: Plaza Central con plano y locales (referencia/04-lugar.html)
 */
export function renderPantallaLugar(lugar: LugarMock, locales: LocalMock[]): string {
  const planoCeldasHtml = lugar.planoCasillas
    .map((c) => {
      if (c.activo) {
        return `<div style="border-radius:8px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800">${c.numero}</div>`;
      }
      return `<div style="border-radius:8px;background:#0d1424;border:1px solid rgba(148,163,184,.2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#94a3b8">${c.numero}</div>`;
    })
    .join("");

  const listaLocalesHtml = locales
    .map((loc) => {
      const esBarberia = loc.id === "local-12";
      let iconoHtml = "";
      if (esBarberia) {
        iconoHtml = `<span style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#3b3f8f,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M8.1 8.1L20 20M8.1 15.9L20 4"></path></svg></span>`;
      } else if (loc.categoria === "Belleza") {
        iconoHtml = `<span style="width:48px;height:48px;border-radius:14px;background:#0d1424;display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"></path></svg></span>`;
      } else if (loc.categoria === "Comida") {
        iconoHtml = `<span style="width:48px;height:48px;border-radius:14px;background:#0d1424;display:flex;align-items:center;justify-content:center;color:#fbbf24"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h12v6a5 5 0 01-5 5H9a5 5 0 01-5-5z"></path><path d="M16 10h2a2 2 0 010 4h-2M8 3v2M12 3v2"></path></svg></span>`;
      } else {
        iconoHtml = `<span style="width:48px;height:48px;border-radius:14px;background:#0d1424;display:flex;align-items:center;justify-content:center;color:#a5b4fc"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4c-2 0-3 2-3 4 0 3 2 4 2 8 0 3 1 4 2 4s1-3 2-5c1 2 1 5 2 5s2-1 2-4c0-4 2-5 2-8 0-2-1-4-3-4-2 0-2 1-3 1s-1-1-3-1z"></path></svg></span>`;
      }

      const badgeHtml = loc.badge
        ? `<span style="font-size:11px;font-weight:700;color:#86efac;background:rgba(34,197,94,.14);padding:4px 10px;border-radius:999px">${loc.badge}</span>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>`;

      const enlaceProps = esBarberia
        ? `href="/locales/${loc.id}" style="display:flex;align-items:center;gap:12px;height:72px;box-sizing:border-box;padding:0 14px;border-radius:18px;background:#1e293b;border:1px solid rgba(165,180,252,.5);color:#fff"`
        : `href="/locales/${loc.id}" style="display:flex;align-items:center;gap:12px;height:72px;box-sizing:border-box;padding:0 14px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);color:#fff"`;

      return `
        <a ${enlaceProps}>
          ${iconoHtml}
          <span style="flex:1;display:flex;flex-direction:column;gap:2px">
            <span style="font-size:15px;font-weight:700">${loc.nombre}</span>
            <span style="font-size:12px;color:#94a3b8">${loc.tipo} · Local ${loc.numeroLocal}</span>
          </span>
          ${badgeHtml}
        </a>
      `;
    })
    .join("");

  const cuerpo = `
    <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <a href="/servicios" aria-label="Volver a Servicios" style="width:44px;height:44px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#fff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
        </a>
        <div style="display:flex;flex-direction:column">
          <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:-.02em">${lugar.nombre}</h1>
          <span style="font-size:13px;color:#94a3b8">${lugar.subtitulo}</span>
        </div>
      </div>

      <input type="text" aria-label="Buscar local o servicio" placeholder="Buscar local o servicio" style="height:48px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.14);color:#fff;font-family:inherit;font-size:14px">

      <div style="display:flex;gap:8px">
        <span style="height:36px;box-sizing:border-box;padding:0 14px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;font-size:13px;font-weight:700">Todos</span>
        <span style="height:36px;box-sizing:border-box;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;font-size:13px;font-weight:600;color:#cbd5e1">Belleza</span>
        <span style="height:36px;box-sizing:border-box;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;font-size:13px;font-weight:600;color:#cbd5e1">Comida</span>
        <span style="height:36px;box-sizing:border-box;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;font-size:13px;font-weight:600;color:#cbd5e1">Salud</span>
      </div>

      <div style="border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px">
        <span style="font-size:12px;font-weight:700;color:#94a3b8;letter-spacing:.04em">${lugar.planoTitulo}</span>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,34px);gap:6px">
          ${planoCeldasHtml}
        </div>
      </div>

      <h2 style="margin:4px 0 0;font-size:16px;font-weight:700">Locales en este lugar</h2>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        ${listaLocalesHtml}
      </div>
    </div>
  `;

  return renderMarco(cuerpo, "servicios", `${lugar.nombre} - ORBIA`);
}

/**
 * PANTALLA 05: Local de la Barbería (referencia/05-local-barberia.html)
 * Muestra servicios, barberos y los dos botones de agendamiento.
 */
export function renderPantallaLocalBarberia(local: LocalMock, lugar: LugarMock): string {
  const serviciosHtml = (local.servicios || [])
    .map((s, index, arr) => {
      const esUltimo = index === arr.length - 1;
      const borde = esUltimo ? "" : "border-bottom:1px solid rgba(148,163,184,.14);";
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;min-height:52px;box-sizing:border-box;${borde}">
          <span style="display:flex;flex-direction:column">
            <span style="font-size:14px;font-weight:600">${s.nombre}</span>
            <span style="font-size:12px;color:#94a3b8">${s.duracion}</span>
          </span>
          <span style="font-size:14px;font-weight:700">$${s.precio}</span>
        </div>
      `;
    })
    .join("");

  const barberosHtml = (local.barberos || [])
    .map((b) => {
      if (b.esEspecial) {
        return `
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
            <span style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"></path></svg>
            </span>
            <span style="font-size:12px;font-weight:600;color:#cbd5e1">${b.nombre}</span>
          </div>
        `;
      }
      return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="width:52px;height:52px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.2);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#a5b4fc">${b.inicial}</span>
          <span style="font-size:12px;font-weight:600;color:#cbd5e1">${b.nombre}</span>
        </div>
      `;
    })
    .join("");

  const cuerpo = `
    <div style="display:flex;flex-direction:column">
      <div style="position:relative;height:190px;flex:none;background:linear-gradient(135deg,#3b3f8f,#7c3aed 60%,#1e293b)">
        <a href="/lugares/${lugar.id}" aria-label="Volver a ${lugar.nombre}" style="position:absolute;top:16px;left:16px;width:44px;height:44px;border-radius:50%;background:rgba(13,20,36,.7);display:flex;align-items:center;justify-content:center;color:#fff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
        </a>
        <span style="position:absolute;right:24px;top:44px;color:rgba(255,255,255,.22)">
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M8.1 8.1L20 20M8.1 15.9L20 4"></path></svg>
        </span>
        <span style="position:absolute;left:20px;bottom:14px;font-size:12px;font-weight:600;color:rgba(255,255,255,.85)">${local.fotoTexto || "Foto del local"}</span>
      </div>

      <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:6px">
        <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:-.02em">${local.nombre}</h1>
        <span style="font-size:13px;color:#94a3b8">${local.tipo} · Local ${local.numeroLocal} · ${lugar.nombre}</span>
        <div style="display:flex;gap:8px;margin-top:6px">
          <span style="font-size:12px;font-weight:700;color:#86efac;background:rgba(34,197,94,.14);padding:6px 12px;border-radius:999px">${local.estado || "Abierto hoy"}</span>
          <span style="font-size:12px;font-weight:700;color:#c4b5fd;background:rgba(124,58,237,.2);padding:6px 12px;border-radius:999px">Agenda con IA</span>
        </div>
      </div>

      <div style="padding:16px 20px 0">
        <h2 style="margin:0;font-size:16px;font-weight:700">Servicios</h2>
        ${serviciosHtml}
      </div>

      <div style="padding:12px 20px 0">
        <h2 style="margin:0 0 10px;font-size:16px;font-weight:700">Barberos</h2>
        <div style="display:flex;gap:16px">
          ${barberosHtml}
        </div>
      </div>
    </div>
  `;

  // El marco de pantalla 05 no lleva la barra inferior general, sino los botones de acción fijos abajo
  const accionesInferiores = `
    <div style="flex:none;box-sizing:border-box;padding:14px 20px 24px;background:rgba(13,20,36,.96);border-top:1px solid rgba(148,163,184,.14);display:flex;flex-direction:column;gap:8px">
      <a href="/agendar-ia?local=${local.id}" style="height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);display:flex;align-items:center;justify-content:center;gap:8px;color:#fff;font-size:16px;font-weight:700">
        Agendar con ORBIA IA
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
      </a>
      <a href="/agendar-manual?local=${local.id}" style="height:48px;border-radius:16px;background:#1e293b;border:1px solid rgba(148,163,184,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700">
        Agendar por mi cuenta
      </a>
    </div>
  `;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${local.nombre}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>
  body { margin: 0; background: #070b16; display: flex; justify-content: center; min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  a { text-decoration: none; color: inherit; }
  * { box-sizing: border-box; }
</style>
</head>
<body>
<div style="width:390px;height:844px;box-sizing:border-box;position:relative;overflow:hidden;display:flex;flex-direction:column;background:#0d1424;color:#fff">
  <div style="flex:1;min-height:0;overflow-y:auto;scrollbar-width:none">
    ${cuerpo}
  </div>
  ${accionesInferiores}
</div>
</body>
</html>`;
}

/**
 * PANTALLA 07: Agendar manual (referencia/07-agendar-manual.html)
 * Muestra opciones paso a paso de agendamiento manual sin conectar al servidor todavía.
 */
export function renderPantallaAgendarManual(local: LocalMock): string {
  const cuerpo = `
    <div style="flex:1;min-height:0;padding:16px 20px 0;display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;gap:12px">
        <a href="/locales/${local.id}" aria-label="Volver a ${local.nombre}" style="width:44px;height:44px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#fff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
        </a>
        <div style="display:flex;flex-direction:column">
          <h1 style="margin:0;font-size:20px;font-weight:800;letter-spacing:-.01em">Agendar por mi cuenta</h1>
          <span style="font-size:13px;color:#94a3b8">${local.nombre} · Local ${local.numeroLocal}</span>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px">
        <h2 style="margin:0;font-size:15px;font-weight:700">1. Servicio</h2>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600">Corte clásico · $150</button>
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#a855f7);border:0;color:#fff;font-family:inherit;font-size:13px;font-weight:700">Corte + barba · $220</button>
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600">Afeitado · $120</button>
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600">Infantil · $110</button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px">
        <h2 style="margin:0;font-size:15px;font-weight:700">2. Barbero</h2>
        <div style="display:flex;gap:8px">
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#a855f7);border:0;color:#fff;font-family:inherit;font-size:13px;font-weight:700">Cualquiera</button>
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600">Memo</button>
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600">Rafa</button>
          <button type="button" style="height:40px;padding:0 14px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600">Nico</button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px">
        <h2 style="margin:0;font-size:15px;font-weight:700">3. Día</h2>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px">
          <button type="button" style="height:64px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font-size:11px;font-weight:600">Hoy</span><span style="font-size:18px;font-weight:800">13</span></button>
          <button type="button" style="height:64px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:0;color:#fff;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font-size:11px;font-weight:700">Mié</span><span style="font-size:18px;font-weight:800">14</span></button>
          <button type="button" style="height:64px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font-size:11px;font-weight:600">Jue</span><span style="font-size:18px;font-weight:800">15</span></button>
          <button type="button" style="height:64px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font-size:11px;font-weight:600">Vie</span><span style="font-size:18px;font-weight:800">16</span></button>
          <button type="button" style="height:64px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#cbd5e1;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span style="font-size:11px;font-weight:600">Sáb</span><span style="font-size:18px;font-weight:800">17</span></button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px">
        <h2 style="margin:0;font-size:15px;font-weight:700">4. Hora</h2>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">
          <button type="button" disabled style="height:48px;border-radius:14px;background:#0d1424;border:1px dashed rgba(148,163,184,.25);color:#8b9ab3;font-family:inherit;font-size:14px;font-weight:600;text-decoration:line-through">3:15 pm</button>
          <button type="button" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px;font-weight:600">4:00 pm</button>
          <button type="button" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:0;color:#fff;font-family:inherit;font-size:14px;font-weight:700">4:45 pm</button>
          <button type="button" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px;font-weight:600">5:30 pm</button>
          <button type="button" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px;font-weight:600">6:15 pm</button>
          <button type="button" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px;font-weight:600">7:00 pm</button>
        </div>
        <span style="font-size:12px;color:#94a3b8">Los horarios tachados ya están ocupados</span>
      </div>
    </div>
  `;

  const barraConfirmar = `
    <div style="flex:none;box-sizing:border-box;padding:14px 20px 24px;background:rgba(13,20,36,.96);border-top:1px solid rgba(148,163,184,.14);display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:14px">
        <span style="color:#94a3b8">Corte + barba · mié 14 · 4:45 pm</span>
        <span style="font-size:18px;font-weight:800">$220</span>
      </div>
      <a href="/citas" style="height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700">Confirmar cita</a>
      <a href="/agendar-ia?local=${local.id}" style="min-height:44px;display:flex;align-items:center;justify-content:center;gap:6px;color:#a5b4fc;font-size:13px;font-weight:700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"></path></svg>
        ¿Prefieres que ORBIA lo haga por ti?
      </a>
    </div>
  `;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agendar manual</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>
  body { margin: 0; background: #070b16; display: flex; justify-content: center; min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  a { text-decoration: none; color: inherit; }
  * { box-sizing: border-box; }
</style>
</head>
<body>
<div style="width:390px;height:844px;box-sizing:border-box;position:relative;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(160deg,#1b2050 0%,#0d1424 42%);color:#fff">
  <div style="flex:1;min-height:0;overflow-y:auto;scrollbar-width:none">
    ${cuerpo}
  </div>
  ${barraConfirmar}
</div>
</body>
</html>`;
}

/**
 * PANTALLA 06: Agendar con ORBIA IA (referencia/06-agendar-ia.html)
 * Formulario interactivo conectado al motor de IA funcional con reintentos y fallback.
 */
export function renderPantallaAgendarIA(
  local: LocalMock,
  usuario?: UsuarioPublico | null
): string {
  const nombreUsuario = usuario?.nombre || "Cris";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agendar con IA</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>
  body { margin: 0; background: #070b16; display: flex; justify-content: center; min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  a { text-decoration: none; color: inherit; }
  * { box-sizing: border-box; }
</style>
</head>
<body>
<div style="width:390px;height:844px;box-sizing:border-box;position:relative;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(160deg,#1b2050 0%,#0d1424 42%);color:#fff">
  <div style="flex:1;min-height:0;padding:16px 20px 0;display:flex;flex-direction:column;gap:14px;overflow-y:auto;scrollbar-width:none">
    <div style="display:flex;align-items:center;gap:12px">
      <a href="/locales/${local.id}" aria-label="Volver a ${local.nombre}" style="width:44px;height:44px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#fff">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
      </a>
      <div style="flex:1;display:flex;flex-direction:column">
        <h1 style="margin:0;font-size:20px;font-weight:800;letter-spacing:-.01em">Agendar cita</h1>
        <span style="font-size:13px;color:#94a3b8">${local.nombre} · Local ${local.numeroLocal}</span>
      </div>
      <span style="background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-size:11px;font-weight:800;letter-spacing:.06em;padding:6px 12px;border-radius:999px">ORBIA AI</span>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-top:8px">
      <div style="max-width:280px;padding:12px 16px;border-radius:18px 18px 4px 18px;background:linear-gradient(135deg,#6366f1,#7c3aed);font-size:15px;font-weight:500;line-height:1.4" id="burbujaUsuario">
        Quiero un corte con barba mañana en la tarde
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;max-width:310px">
      <div style="padding:12px 16px;border-radius:18px 18px 18px 4px;background:#1e293b;border:1px solid rgba(148,163,184,.14);font-size:15px;line-height:1.4">
        Listo. Para <b>Corte + barba</b> encontré estos horarios mañana en la tarde:
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      <button type="button" class="btn-slot" onclick="seleccionarHora('16:00', '4:00 pm', this)" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer">4:00 pm</button>
      <button type="button" class="btn-slot slot-activo" onclick="seleccionarHora('16:45', '4:45 pm', this)" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:0;color:#fff;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer">4:45 pm</button>
      <button type="button" class="btn-slot" onclick="seleccionarHora('17:30', '5:30 pm', this)" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer">5:30 pm</button>
      <button type="button" class="btn-slot" onclick="seleccionarHora('18:15', '6:15 pm', this)" style="height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer">6:15 pm</button>
    </div>

    <div style="border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);padding:16px;display:flex;flex-direction:column;gap:10px">
      <span style="font-size:12px;font-weight:700;color:#94a3b8;letter-spacing:.04em">RESUMEN</span>
      <div style="display:flex;justify-content:space-between;font-size:14px"><span style="color:#94a3b8">Servicio</span><span style="font-weight:600">Corte + barba · 45 min</span></div>
      <div style="display:flex;justify-content:space-between;font-size:14px"><span style="color:#94a3b8">Barbero</span><span style="font-weight:600">Cualquiera disponible</span></div>
      <div style="display:flex;justify-content:space-between;font-size:14px"><span style="color:#94a3b8">Cuándo</span><span style="font-weight:600" id="resumenCuando">Mañana · 4:45 pm</span></div>
      <div style="display:flex;justify-content:space-between;font-size:14px"><span style="color:#94a3b8">Dónde</span><span style="font-weight:600">Local ${local.numeroLocal}, Plaza Central</span></div>
      <div style="display:flex;justify-content:space-between;font-size:16px;padding-top:10px;border-top:1px solid rgba(148,163,184,.14)"><span style="font-weight:600">Total</span><span style="font-weight:800">$220</span></div>
    </div>
  </div>

  <form action="/citas" method="POST" id="formConfirmarIA" style="margin:0">
    <input type="hidden" name="nombreUsuario" value="${nombreUsuario.replace(/"/g, "&quot;")}" />
    <input type="hidden" name="servicio" id="inputServicio" value="Corte + barba" />
    <input type="hidden" name="fechaPreferida" id="inputFecha" value="mañana" />
    <input type="hidden" name="horaPreferida" id="inputHora" value="16:45" />

    <div style="flex:none;box-sizing:border-box;padding:12px 20px 24px;background:rgba(13,20,36,.96);border-top:1px solid rgba(148,163,184,.14);display:flex;flex-direction:column;gap:10px">
      <button type="submit" id="btnConfirmarIA" style="height:52px;width:100%;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);border:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit">
        <span id="txtConfirmarIA">Confirmar cita</span>
      </button>

      <div style="display:flex;gap:8px">
        <input type="text" id="inputTextoLibre" aria-label="Escribe un cambio o una nueva solicitud" placeholder="Ej. mejor a las 5:30 pm" style="flex:1;min-width:0;height:48px;box-sizing:border-box;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.14);color:#fff;font-family:inherit;font-size:14px">
        <button type="button" onclick="enviarMensajeIA()" aria-label="Enviar" style="width:48px;height:48px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.2);color:#a5b4fc;border:0;display:flex;align-items:center;justify-content:center;cursor:pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
        </button>
      </div>
    </div>
  </form>
</div>

<script>
  function seleccionarHora(valor24, textoHora, btn) {
    document.getElementById('inputHora').value = valor24;
    document.getElementById('resumenCuando').textContent = 'Mañana · ' + textoHora;
    document.querySelectorAll('.btn-slot').forEach(function(b) {
      b.style.background = '#1e293b';
      b.style.border = '1px solid rgba(148,163,184,.2)';
      b.style.fontWeight = '600';
    });
    btn.style.background = 'linear-gradient(135deg,#6366f1,#a855f7)';
    btn.style.border = '0';
    btn.style.fontWeight = '700';
  }

  function enviarMensajeIA() {
    const txt = document.getElementById('inputTextoLibre').value.trim();
    if (txt) {
      document.getElementById('burbujaUsuario').textContent = txt;
      document.getElementById('inputHora').value = txt;
      document.getElementById('inputTextoLibre').value = '';
    }
  }

  document.getElementById('formConfirmarIA').addEventListener('submit', function() {
    const btn = document.getElementById('btnConfirmarIA');
    const txt = document.getElementById('txtConfirmarIA');
    btn.disabled = true;
    btn.style.opacity = '0.75';
    txt.textContent = 'Procesando con ORBIA IA...';
  });
</script>
</body>
</html>`;
}

/**
 * PANTALLA 08: Mis citas (referencia/08-mis-citas.html)
 */
export function renderPantallaMisCitas(citas: Cita[], usuario: string): string {
  const tieneCitas = citas.length > 0;
  let contenidoCitas = "";

  if (tieneCitas) {
    contenidoCitas = citas
      .map((c) => {
        const estaCancelada = c.estado === "cancelada";
        return `
          <div style="border-radius:20px;background:#1e293b;border:1px solid rgba(134,239,172,.35);padding:18px;display:flex;flex-direction:column;gap:14px;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="width:32px;height:32px;border-radius:50%;background:rgba(34,197,94,.18);color:#86efac;display:flex;align-items:center;justify-content:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>
              </span>
              <span style="font-size:13px;font-weight:800;color:#86efac;letter-spacing:.04em">CITA CONFIRMADA POR ORBIA</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <span style="font-size:20px;font-weight:800">${c.servicioId}</span>
              <span style="font-size:14px;color:#94a3b8">Barbería El Filo · Local 12, Plaza Central</span>
            </div>
            <div style="display:flex;gap:10px">
              <div style="flex:1;border-radius:14px;background:#0d1424;padding:12px;display:flex;flex-direction:column;gap:2px"><span style="font-size:12px;color:#94a3b8">Cuándo</span><span style="font-size:15px;font-weight:700">${c.fecha}</span></div>
              <div style="flex:1;border-radius:14px;background:#0d1424;padding:12px;display:flex;flex-direction:column;gap:2px"><span style="font-size:12px;color:#94a3b8">Hora</span><span style="font-size:15px;font-weight:700">${c.hora}</span></div>
              <div style="flex:1;border-radius:14px;background:#0d1424;padding:12px;display:flex;flex-direction:column;gap:2px"><span style="font-size:12px;color:#94a3b8">Total</span><span style="font-size:15px;font-weight:700">$220</span></div>
            </div>
            <div style="display:flex;gap:10px">
              ${
                estaCancelada
                  ? `<span style="font-size:14px;color:#94a3b8;font-style:italic">Cita cancelada</span>`
                  : `<a href="/citas/${c.id}/modificar" style="flex:1;height:48px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.3);color:#fff;font-family:inherit;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center">Modificar</a>
                    <form action="/citas/${c.id}/cancelar" method="POST" style="flex:1;margin:0">
                      <input type="hidden" name="usuario" value="${usuario}" />
                      <button type="submit" style="width:100%;height:48px;border-radius:14px;background:#0d1424;border:1px solid rgba(248,113,113,.5);color:#fca5a5;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer">Cancelar</button>
                    </form>`
              }
            </div>
          </div>
        `;
      })
      .join("");
  } else {
    contenidoCitas = `
      <div style="border-radius:20px;background:#1e293b;border:1px solid rgba(148,163,184,.14);padding:32px 18px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px">
        <span style="font-size:32px">📅</span>
        <span style="font-size:16px;font-weight:700">Sin citas activas</span>
        <span style="font-size:13px;color:#94a3b8">No tienes citas agendadas por el momento.</span>
        <a href="/servicios" style="margin-top:8px;padding:10px 18px;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;border-radius:14px;font-size:13px;font-weight:700">Explorar servicios</a>
      </div>
    `;
  }

  const cuerpo = `
    <div style="padding:24px 20px 0;display:flex;flex-direction:column;gap:14px">
      <h1 style="margin:0;font-size:32px;font-weight:800;letter-spacing:-.02em">Mis citas</h1>

      <div style="display:flex;gap:4px;padding:4px;border-radius:999px;background:#1e293b;border:1px solid rgba(148,163,184,.14)">
        <span style="flex:1;height:40px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700">Próximas</span>
        <span style="flex:1;height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#94a3b8">Pasadas</span>
      </div>

      ${contenidoCitas}

      <div style="border-radius:20px;background:#1e293b;border:1px solid rgba(148,163,184,.14);padding:16px;display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        <span style="font-size:16px;font-weight:700">¿Algo más?</span>
        <span style="font-size:13px;color:#94a3b8;line-height:1.4">Pídelo con tus palabras: reservar, mover o cancelar una cita.</span>
        <form action="/citas" method="POST" style="display:flex;gap:8px;margin:0">
          <input type="hidden" name="nombreUsuario" value="${usuario}" />
          <input type="hidden" name="fechaPreferida" value="viernes" />
          <input type="hidden" name="horaPreferida" value="tarde" />
          <input type="text" name="servicio" aria-label="Escribe tu solicitud" placeholder="Ej. cambia mi cita al viernes" style="flex:1;min-width:0;height:48px;box-sizing:border-box;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.14);color:#fff;font-family:inherit;font-size:14px">
          <button type="submit" aria-label="Enviar" style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#7c3aed);border:0;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
        </form>
      </div>
    </div>
  `;

  return renderMarco(cuerpo, "citas", "Mis citas - ORBIA");
}

/**
 * PANTALLA 09: Cuenta (referencia/09-cuenta.html)
 */
export function renderPantallaCuenta(usuario: UsuarioPublico): string {
  const cuerpo = `
    <div style="padding:24px 20px 0;display:flex;flex-direction:column;gap:16px">
      <h1 style="margin:0;font-size:32px;font-weight:800;letter-spacing:-.02em">Cuenta</h1>

      <div style="display:flex;align-items:center;gap:14px;border-radius:20px;background:#1e293b;border:1px solid rgba(148,163,184,.14);padding:16px">
        <span style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path></svg>
        </span>
        <span style="display:flex;flex-direction:column;gap:2px">
          <span style="font-size:18px;font-weight:800">${usuario.nombre}</span>
          <span style="font-size:13px;color:#94a3b8">${usuario.correo}</span>
        </span>
      </div>

      <div style="border-radius:20px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;flex-direction:column">
        <a href="/citas" style="display:flex;align-items:center;justify-content:space-between;min-height:56px;box-sizing:border-box;padding:0 16px;border-bottom:1px solid rgba(148,163,184,.14);color:#fff;font-size:15px;font-weight:600">
          Mis citas
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>
        </a>
        <div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;box-sizing:border-box;padding:0 16px;border-bottom:1px solid rgba(148,163,184,.14);font-size:15px;font-weight:600">
          Mis datos
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;box-sizing:border-box;padding:0 16px;border-bottom:1px solid rgba(148,163,184,.14);font-size:15px;font-weight:600">
          Notificaciones
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;box-sizing:border-box;padding:0 16px;border-bottom:1px solid rgba(148,163,184,.14);font-size:15px;font-weight:600">
          Privacidad
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;box-sizing:border-box;padding:0 16px;font-size:15px;font-weight:600">
          Ayuda
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>

      <button type="button" id="btnCerrarSesion" style="height:52px;border-radius:16px;background:#0d1424;border:1px solid rgba(248,113,113,.5);display:flex;align-items:center;justify-content:center;color:#fca5a5;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;margin-bottom:16px">
        Cerrar sesión
      </button>
    </div>

    <script>
      document.getElementById('btnCerrarSesion')?.addEventListener('click', async function() {
        if (confirm('¿Deseas cerrar tu sesión?')) {
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (e) {}
          window.location.href = '/login';
        }
      });
    </script>
  `;

  return renderMarco(cuerpo, "cuenta", "Cuenta - ORBIA");
}

/**
 * PANTALLA 01: Iniciar Sesión (referencia/01-login.html)
 */
export function renderFormularioLogin(
  redirectUrl?: string,
  mensajeAlerta?: string
): string {
  const redir = redirectUrl ? redirectUrl.replace(/"/g, "&quot;") : "/servicios";
  const alertaHtml = mensajeAlerta
    ? `<div style="background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.35);padding:10px 14px;border-radius:12px;font-size:13px;color:#c7d2fe;margin-bottom:12px">${mensajeAlerta}</div>`
    : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Iniciar sesión</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>body{margin:0;background:#070b16;display:flex;justify-content:center;min-height:100vh}a{text-decoration:none}*{box-sizing:border-box}</style>
</head>
<body>
<div style="width:390px;height:844px;box-sizing:border-box;position:relative;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(160deg,#1b2050 0%,#0d1424 42%);color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif">
  <div style="flex:1;min-height:0;padding:52px 24px 0;display:flex;flex-direction:column;gap:22px;overflow-y:auto;scrollbar-width:none">
    <div style="display:flex;flex-direction:column;gap:12px">
      <span style="align-self:flex-start;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-size:11px;font-weight:800;letter-spacing:.06em;padding:6px 12px;border-radius:999px">ORBIA AI</span>
      <h1 style="margin:0;font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1">Bienvenido a ORBIA</h1>
      <p style="margin:0;font-size:15px;color:#94a3b8;line-height:1.5">Agenda citas en tus locales favoritos, con IA o por tu cuenta.</p>
    </div>

    ${alertaHtml}
    <div id="errorGeneralLogin" style="display:none;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);padding:10px 14px;border-radius:12px;font-size:13px;color:#fca5a5"></div>

    <form id="formLogin" style="display:flex;flex-direction:column;gap:14px;margin:0">
      <label style="display:flex;flex-direction:column;gap:8px;font-size:13px;font-weight:600;color:#cbd5e1">Correo
        <input type="email" id="loginCorreo" placeholder="tucorreo@ejemplo.com" required style="height:52px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px">
      </label>
      <label style="display:flex;flex-direction:column;gap:8px;font-size:13px;font-weight:600;color:#cbd5e1">Contraseña
        <input type="password" id="loginContrasena" placeholder="Tu contraseña" required style="height:52px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px">
      </label>
      <a href="#" onclick="alert('Recuperación de contraseña disponible próximamente.');return false;" style="align-self:flex-end;min-height:44px;display:flex;align-items:center;font-size:13px;font-weight:700;color:#a5b4fc">¿Olvidaste tu contraseña?</a>

      <div style="display:flex;flex-direction:column;gap:14px;margin-top:-14px">
        <button type="submit" id="btnLoginSubmit" style="height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);border:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit">Iniciar sesión</button>
        <div style="display:flex;align-items:center;gap:12px;color:#8b9ab3;font-size:12px;font-weight:600"><span style="flex:1;height:1px;background:rgba(148,163,184,.2)"></span>o<span style="flex:1;height:1px;background:rgba(148,163,184,.2)"></span></div>
        <button type="button" onclick="alert('Próximamente');" style="height:52px;border-radius:16px;background:#1e293b;border:1px solid rgba(148,163,184,.3);color:#fff;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer">Continuar con Google</button>
        <a href="/servicios" style="min-height:44px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#a5b4fc">Continuar como invitado</a>
      </div>
    </form>
  </div>

  <div style="flex:none;padding:12px 24px 28px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:14px;color:#94a3b8">¿No tienes cuenta?<a href="/registro?redirect=${encodeURIComponent(redir)}" style="min-height:44px;display:flex;align-items:center;font-weight:800;color:#a5b4fc">Crear cuenta</a></div>
</div>

<script>
  document.getElementById('formLogin')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const correo = document.getElementById('loginCorreo').value.trim();
    const contrasena = document.getElementById('loginContrasena').value;
    const btn = document.getElementById('btnLoginSubmit');
    const errBox = document.getElementById('errorGeneralLogin');
    errBox.style.display = 'none';

    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '${redir}';
      } else {
        errBox.textContent = data.error || 'Correo o contraseña incorrectos';
        errBox.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Iniciar sesión';
      }
    } catch (err) {
      errBox.textContent = 'Error de conexión. Inténtalo de nuevo.';
      errBox.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Iniciar sesión';
    }
  });
</script>
</body>
</html>`;
}

/**
 * PANTALLA 02: Crear Cuenta (referencia/02-registro.html)
 */
export function renderFormularioRegistro(redirectUrl?: string): string {
  const redir = redirectUrl ? redirectUrl.replace(/"/g, "&quot;") : "/servicios";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Crear cuenta</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>body{margin:0;background:#070b16;display:flex;justify-content:center;min-height:100vh}a{text-decoration:none}*{box-sizing:border-box}</style>
</head>
<body>
<div style="width:390px;height:844px;box-sizing:border-box;position:relative;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(160deg,#1b2050 0%,#0d1424 42%);color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif">
  <div style="flex:1;min-height:0;padding:16px 24px 0;display:flex;flex-direction:column;gap:20px;overflow-y:auto;scrollbar-width:none">
    <a href="/login" aria-label="Volver a Iniciar sesión" style="width:44px;height:44px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#fff">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
    </a>
    <div style="display:flex;flex-direction:column;gap:10px">
      <h1 style="margin:0;font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1">Crea tu cuenta</h1>
      <p style="margin:0;font-size:15px;color:#94a3b8;line-height:1.5">Guarda tus citas y agéndalas en segundos.</p>
    </div>

    <div id="errorGeneralReg" style="display:none;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);padding:10px 14px;border-radius:12px;font-size:13px;color:#fca5a5"></div>

    <form id="formRegistro" style="display:flex;flex-direction:column;gap:14px;margin:0">
      <label style="display:flex;flex-direction:column;gap:8px;font-size:13px;font-weight:600;color:#cbd5e1">Nombre
        <input type="text" id="regNombre" placeholder="Tu nombre" required style="height:52px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px">
      </label>
      <label style="display:flex;flex-direction:column;gap:8px;font-size:13px;font-weight:600;color:#cbd5e1">Correo
        <input type="email" id="regCorreo" placeholder="tucorreo@ejemplo.com" required style="height:52px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px">
      </label>
      <label style="display:flex;flex-direction:column;gap:8px;font-size:13px;font-weight:600;color:#cbd5e1">Contraseña
        <input type="password" id="regContrasena" placeholder="Mínimo 8 caracteres" required style="height:52px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:15px">
        <span style="font-size:12px;font-weight:500;color:#94a3b8">Usa al menos 8 caracteres.</span>
      </label>
      <label style="display:flex;align-items:center;gap:12px;min-height:44px;font-size:13px;color:#cbd5e1">
        <input type="checkbox" id="regCheck" required style="width:20px;height:20px;accent-color:#7c3aed">
        Acepto los términos y el aviso de privacidad
      </label>

      <button type="submit" id="btnRegSubmit" style="height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);border:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit">Crear cuenta</button>
    </form>
  </div>

  <div style="flex:none;padding:12px 24px 28px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:14px;color:#94a3b8">¿Ya tienes cuenta?<a href="/login?redirect=${encodeURIComponent(redir)}" style="min-height:44px;display:flex;align-items:center;font-weight:800;color:#a5b4fc">Iniciar sesión</a></div>
</div>

<script>
  document.getElementById('formRegistro')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value.trim();
    const correo = document.getElementById('regCorreo').value.trim();
    const contrasena = document.getElementById('regContrasena').value;
    const btn = document.getElementById('btnRegSubmit');
    const errBox = document.getElementById('errorGeneralReg');
    errBox.style.display = 'none';

    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '${redir}';
      } else {
        errBox.textContent = data.errores?.[0]?.mensaje || data.error || 'Datos inválidos';
        errBox.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Crear cuenta';
      }
    } catch (err) {
      errBox.textContent = 'Error de conexión. Inténtalo de nuevo.';
      errBox.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    }
  });
</script>
</body>
</html>`;
}

/**
 * Pantalla de aviso 401 que exige iniciar sesión con estilo idéntico al tema.
 */
export function renderRequiereLogin(redirectUrl?: string): string {
  const redir = redirectUrl ? encodeURIComponent(redirectUrl) : "%2Fservicios";
  const cuerpo = `
    <div style="padding:48px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px">
      <span style="width:64px;height:64px;border-radius:50%;background:rgba(99,102,241,.18);color:#a5b4fc;display:flex;align-items:center;justify-content:center;font-size:28px">🔒</span>
      <h1 style="margin:0;font-size:24px;font-weight:800">Acceso Requerido (401)</h1>
      <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.5">Para gestionar tus citas y cuenta personal necesitas identificarte en ORBIA.</p>
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;margin-top:12px">
        <a href="/login?redirect=${redir}" style="height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700">Iniciar sesión</a>
        <a href="/registro?redirect=${redir}" style="height:48px;border-radius:16px;background:#1e293b;border:1px solid rgba(148,163,184,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700">Crear cuenta</a>
        <a href="/servicios" style="min-height:44px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#a5b4fc">Continuar explorando</a>
      </div>
    </div>
  `;

  return renderMarco(cuerpo, "citas", "Acceso Requerido - ORBIA");
}

/**
 * Muestra el resultado de un agendamiento exitoso o fallido con estilo fiel al diseño.
 */
export function renderResultado(resultado: ResultadoAgente): string {
  const c = resultado.cita;
  const esExito = resultado.exito;

  const cuerpo = `
    <div style="padding:32px 20px;display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="width:36px;height:36px;border-radius:50%;background:${esExito ? "rgba(34,197,94,.18)" : "rgba(239,68,68,.18)"};color:${esExito ? "#86efac" : "#fca5a5"};display:flex;align-items:center;justify-content:center;font-weight:800">
          ${esExito ? "✓" : "!"}
        </span>
        <h1 style="margin:0;font-size:22px;font-weight:800">${esExito ? "Confirmación de Cita" : "Aviso"}</h1>
      </div>

      <div style="border-radius:20px;background:#1e293b;border:1px solid ${esExito ? "rgba(134,239,172,.35)" : "rgba(239,68,68,.35)"};padding:18px;display:flex;flex-direction:column;gap:12px">
        <p style="margin:0;font-size:15px;line-height:1.4">${resultado.mensaje}</p>

        ${
          c
            ? `
          <div style="display:flex;flex-direction:column;gap:4px;padding-top:10px;border-top:1px solid rgba(148,163,184,.14)">
            <span style="font-size:18px;font-weight:800">${c.servicioId}</span>
            <span style="font-size:13px;color:#94a3b8">Negocio: ${c.negocioId} &bull; ID: <code>${c.id}</code></span>
          </div>
          <div style="display:flex;gap:10px">
            <div style="flex:1;border-radius:14px;background:#0d1424;padding:12px;display:flex;flex-direction:column;gap:2px"><span style="font-size:12px;color:#94a3b8">Fecha</span><span style="font-size:15px;font-weight:700">${c.fecha}</span></div>
            <div style="flex:1;border-radius:14px;background:#0d1424;padding:12px;display:flex;flex-direction:column;gap:2px"><span style="font-size:12px;color:#94a3b8">Hora</span><span style="font-size:15px;font-weight:700">${c.hora}</span></div>
          </div>
        `
            : ""
        }
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
        <a href="/citas" style="height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700">Ver Mis Citas</a>
        <a href="/servicios" style="height:48px;border-radius:16px;background:#1e293b;border:1px solid rgba(148,163,184,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700">Volver a Servicios</a>
      </div>
    </div>
  `;

  return renderMarco(cuerpo, "citas", "Resultado de Cita - ORBIA");
}

/**
 * Muestra el formulario para modificar una cita existente.
 */
export function renderFormularioModificar(cita: Cita): string {
  const cuerpo = `
    <div style="padding:24px 20px;display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;gap:12px">
        <a href="/citas" aria-label="Volver a Mis Citas" style="width:44px;height:44px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#fff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
        </a>
        <h1 style="margin:0;font-size:22px;font-weight:800">Modificar Cita</h1>
      </div>

      <form action="/citas/${cita.id}/modificar" method="POST" style="display:flex;flex-direction:column;gap:14px;margin:0">
        <input type="hidden" name="nombreUsuario" value="${cita.usuario}" />

        <label style="display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#cbd5e1">Servicio
          <input type="text" name="servicio" value="${cita.servicioId.replace(/"/g, "&quot;")}" required style="height:48px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px">
        </label>

        <label style="display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#cbd5e1">Fecha Preferida
          <input type="text" name="fechaPreferida" value="${cita.fecha.replace(/"/g, "&quot;")}" required style="height:48px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px">
        </label>

        <label style="display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#cbd5e1">Hora o Franja
          <input type="text" name="horaPreferida" value="${cita.hora.replace(/"/g, "&quot;")}" required style="height:48px;box-sizing:border-box;width:100%;padding:0 16px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;font-family:inherit;font-size:14px">
        </label>

        <button type="submit" style="margin-top:10px;height:52px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#7c3aed);border:0;color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit">Guardar Cambios</button>
      </form>
    </div>
  `;

  return renderMarco(cuerpo, "citas", "Modificar Cita - ORBIA");
}

/**
 * Función de compatibilidad para renderPagina
 */
export function renderPagina(
  contenido: string,
  _usuario?: UsuarioPublico | null,
  opciones?: { titulo?: string; esInvitado?: boolean }
): string {
  return renderMarco(contenido, "servicios", opciones?.titulo || "ORBIA");
}
