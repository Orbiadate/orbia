import type { LugarMock, LocalMock } from "../../data/lugares.mock";
import { renderMarco } from "./layout";

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
    </div>
  `;
  return renderMarco(cuerpo, "servicios", "Servicios - ORBIA");
}

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
      const badgeHtml = loc.badge
        ? `<span style="font-size:11px;font-weight:700;color:#86efac;background:rgba(34,197,94,.14);padding:4px 10px;border-radius:999px">${loc.badge}</span>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"></path></svg>`;

      return `
        <a href="/locales/${loc.id}" style="display:flex;align-items:center;gap:12px;height:72px;box-sizing:border-box;padding:0 14px;border-radius:18px;background:#1e293b;border:1px solid rgba(148,163,184,.14);color:#fff">
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

