import type { Cita } from "../types";
import type { ResultadoAgente } from "../pipeline";
import { renderMarco } from "./layout";

export function renderPantallaMisCitas(citas: Cita[], usuario: string): string {
  const listaCitas = citas.length === 0
    ? `<p style="color:#94a3b8;font-size:14px">No tienes citas programadas actualmente.</p>`
    : citas.map((c) => `
        <div style="padding:14px;border-radius:14px;background:#1e293b;border:1px solid rgba(148,163,184,.14);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:15px;font-weight:700">Cita #${c.id}</div>
            <div style="font-size:13px;color:#94a3b8">${c.fecha} a las ${c.hora} (${c.estado})</div>
          </div>
          ${c.estado !== "cancelada" ? `
            <form action="/citas/${c.id}/cancelar" method="POST" style="margin:0">
              <button type="submit" style="background:#ef4444;color:#fff;border:none;padding:6px 12px;border-radius:8px;font-size:12px;cursor:pointer">Cancelar</button>
            </form>
          ` : ""}
        </div>
      `).join("");

  const cuerpo = `
    <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:14px">
      <h1 style="margin:0;font-size:24px;font-weight:800">Mis Citas</h1>
      <span style="font-size:13px;color:#94a3b8">Usuario: ${usuario}</span>
      <div style="display:flex;flex-direction:column;gap:10px">${listaCitas}</div>
    </div>
  `;
  return renderMarco(cuerpo, "citas", "Mis Citas - ORBIA");
}

export function renderResultado(resultado: ResultadoAgente): string {
  const cuerpo = `
    <div style="padding:24px 20px 0;text-align:center">
      <h1 style="font-size:24px;font-weight:800">${resultado.exito ? "¡Éxito!" : "Atención"}</h1>
      <p style="font-size:15px;color:#cbd5e1">${resultado.mensaje}</p>
      <a href="/citas" style="display:inline-block;margin-top:16px;padding:12px 24px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-weight:700">Ir a mis citas</a>
    </div>
  `;
  return renderMarco(cuerpo, "citas", "Resultado - ORBIA");
}

export function renderFormularioModificar(cita: Cita): string {
  const cuerpo = `
    <div style="padding:16px 20px 0">
      <h1 style="font-size:22px;font-weight:800">Modificar Cita #${cita.id}</h1>
      <form action="/citas/${cita.id}/modificar" method="POST" style="display:flex;flex-direction:column;gap:12px;margin-top:14px">
        <input type="date" name="fecha" value="${cita.fecha}" required style="height:44px;padding:0 12px;border-radius:10px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff">
        <input type="time" name="hora" value="${cita.hora}" required style="height:44px;padding:0 12px;border-radius:10px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff">
        <button type="submit" style="height:46px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#a855f7);border:none;color:#fff;font-weight:700">Guardar Cambios</button>
      </form>
    </div>
  `;
  return renderMarco(cuerpo, "citas", "Modificar Cita - ORBIA");
}

