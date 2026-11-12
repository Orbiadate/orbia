import type { LugarMock, LocalMock } from "../../data/lugares.mock";

export function renderBarraInferior(pestanaActiva: "inicio" | "servicios" | "citas" | "cuenta"): string {
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
  body { margin:0; background:#070b16; display:flex; justify-content:center; min-height:100vh; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
  a { text-decoration:none; color:inherit; }
  * { box-sizing:border-box; }
  .orbia-frame { width:390px; height:844px; position:relative; overflow:hidden; display:flex; flex-direction:column; background:${fondoEstilo}; color:#fff; }
  .scroll-body { flex:1; min-height:0; overflow-y:auto; scrollbar-width:none; }
  .scroll-body::-webkit-scrollbar { display:none; }
</style>
</head>
<body>
<div class="orbia-frame">
  <div class="scroll-body">${cuerpoHtml}</div>
  ${barraHtml}
</div>
</body>
</html>`;
}

export function renderPagina(cuerpo: string, titulo: string = "ORBIA"): string {
  return renderMarco(cuerpo, "inicio", titulo);
}

