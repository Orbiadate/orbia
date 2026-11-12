import type { LocalMock } from "../../data/lugares.mock";
import { renderMarco } from "./layout";

export function renderPantallaAgendarManual(local: LocalMock): string {
  const serviciosOpciones = (local.servicios || [])
    .map((s) => `<option value="${s.id}">${s.nombre} - ${s.precio}</option>`)
    .join("");

  const cuerpo = `
    <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:14px">
      <h1 style="margin:0;font-size:22px;font-weight:800">Agendar Cita</h1>
      <form action="/citas" method="POST" style="display:flex;flex-direction:column;gap:12px">
        <input type="hidden" name="negocioId" value="${local.id}">
        <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600">
          Servicio
          <select name="servicioId" style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">${serviciosOpciones}</select>
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600">
          Fecha
          <input type="date" name="fecha" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600">
          Hora
          <input type="time" name="hora" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
        </label>
        <button type="submit" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:none;color:#fff;font-size:15px;font-weight:700;margin-top:8px;cursor:pointer">Confirmar Cita</button>
      </form>
    </div>
  `;
  return renderMarco(cuerpo, "citas", "Agendar Cita - ORBIA");
}

export function renderPantallaAgendarIA(local: LocalMock): string {
  const cuerpo = `
    <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:14px">
      <h1 style="margin:0;font-size:22px;font-weight:800">Asistente ORBIA AI</h1>
      <p style="font-size:14px;color:#94a3b8;margin:0">Escribe lo que necesitas y la IA encontrará el mejor horario en ${local.nombre}.</p>
      <form action="/agendar/ia" method="POST" style="display:flex;flex-direction:column;gap:12px">
        <input type="hidden" name="localId" value="${local.id}">
        <textarea name="mensaje" rows="4" placeholder="Ej: Quiero un corte y barba mañana por la tarde" required style="border-radius:14px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:12px;font-family:inherit;font-size:14px"></textarea>
        <button type="submit" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:none;color:#fff;font-size:15px;font-weight:700;cursor:pointer">Buscar con IA</button>
      </form>
    </div>
  `;
  return renderMarco(cuerpo, "citas", "Agendar con IA - ORBIA");
}
