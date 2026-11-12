import type { LugarMock, LocalMock } from "../../data/lugares.mock";
import { renderMarco } from "./layout";

export function renderPantallaLocalBarberia(local: LocalMock, lugar: LugarMock): string {
  const serviciosHtml = (local.servicios || [])
    .map(
      (s) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.14)">
          <div style="display:flex;flex-direction:column">
            <span style="font-size:15px;font-weight:700">${s.nombre}</span>
            <span style="font-size:12px;color:#94a3b8">${s.duracion}</span>
          </div>
          <span style="font-size:16px;font-weight:800;color:#a5b4fc">${s.precio}</span>
        </div>
      `
    )
    .join("");

  const cuerpo = `
    <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:center;gap:12px">
        <a href="/lugares/${lugar.id}" aria-label="Volver a ${lugar.nombre}" style="width:44px;height:44px;border-radius:50%;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;color:#fff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
        </a>
        <div style="display:flex;flex-direction:column">
          <h1 style="margin:0;font-size:22px;font-weight:800">${local.nombre}</h1>
          <span style="font-size:13px;color:#94a3b8">${lugar.nombre} · Local ${local.numeroLocal}</span>
        </div>
      </div>
      <h2 style="margin:0;font-size:16px;font-weight:700">Servicios disponibles</h2>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${serviciosHtml}
      </div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <a href="/agendar/ia?localId=${local.id}" style="flex:1;height:50px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff">Agendar con IA</a>
        <a href="/agendar/manual?localId=${local.id}" style="flex:1;height:50px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff">Agendar manual</a>
      </div>
    </div>
  `;
  return renderMarco(cuerpo, "servicios", `${local.nombre} - ORBIA`);
}
