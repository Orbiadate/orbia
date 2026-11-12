import type { UsuarioPublico } from "../core/auth";
import { renderMarco } from "./layout";

export function renderFormularioLogin(redirectUrl?: string, errores?: Record<string, string>): string {
  const errEmail = errores?.correo ? `<span style="color:#f87171;font-size:12px">${errores.correo}</span>` : "";
  const errPass = errores?.password ? `<span style="color:#f87171;font-size:12px">${errores.password}</span>` : "";

  const cuerpo = `
    <div style="padding:28px 20px 0;display:flex;flex-direction:column;gap:16px">
      <h1 style="margin:0;font-size:26px;font-weight:800">Iniciar Sesión</h1>
      <form action="/login" method="POST" style="display:flex;flex-direction:column;gap:12px">
        ${redirectUrl ? `<input type="hidden" name="redirect" value="${redirectUrl}">` : ""}
        <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600">
          Correo Electrónico
          <input type="email" name="correo" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
          ${errEmail}
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600">
          Contraseña
          <input type="password" name="password" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
          ${errPass}
        </label>
        <button type="submit" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:none;color:#fff;font-size:15px;font-weight:700;cursor:pointer">Entrar</button>
      </form>
      <div style="text-align:center;font-size:13px;color:#94a3b8">
        ¿No tienes cuenta? <a href="/registro" style="color:#a5b4fc;font-weight:700">Regístrate aquí</a>
      </div>
    </div>
  `;
  return renderMarco(cuerpo, "cuenta", "Login - ORBIA");
}

export function renderFormularioRegistro(redirectUrl?: string): string {
  const cuerpo = `
    <div style="padding:28px 20px 0;display:flex;flex-direction:column;gap:16px">
      <h1 style="margin:0;font-size:26px;font-weight:800">Crear Cuenta</h1>
      <form action="/registro" method="POST" style="display:flex;flex-direction:column;gap:12px">
        ${redirectUrl ? `<input type="hidden" name="redirect" value="${redirectUrl}">` : ""}
        <input type="text" name="nombre" placeholder="Nombre completo" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
        <input type="email" name="correo" placeholder="Correo electrónico" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
        <input type="password" name="password" placeholder="Contraseña (mínimo 8 caracteres)" required style="height:46px;border-radius:12px;background:#0d1424;border:1px solid rgba(148,163,184,.2);color:#fff;padding:0 12px">
        <button type="submit" style="height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#a855f7);border:none;color:#fff;font-size:15px;font-weight:700">Registrarme</button>
      </form>
    </div>
  `;
  return renderMarco(cuerpo, "cuenta", "Registro - ORBIA");
}

export function renderPantallaCuenta(usuario: UsuarioPublico): string {
  const cuerpo = `
    <div style="padding:24px 20px 0;display:flex;flex-direction:column;gap:16px">
      <h1 style="margin:0;font-size:24px;font-weight:800">Mi Cuenta</h1>
      <div style="padding:16px;border-radius:16px;background:#1e293b;border:1px solid rgba(148,163,184,.14)">
        <div style="font-size:18px;font-weight:700">${usuario.nombre}</div>
        <div style="font-size:14px;color:#94a3b8">${usuario.correo}</div>
      </div>
      <form action="/logout" method="POST">
        <button type="submit" style="width:100%;height:46px;border-radius:12px;background:#ef4444;border:none;color:#fff;font-weight:700;cursor:pointer">Cerrar Sesión</button>
      </form>
    </div>
  `;
  return renderMarco(cuerpo, "cuenta", "Cuenta - ORBIA");
}

export function renderRequiereLogin(redirectUrl?: string): string {
  return renderFormularioLogin(redirectUrl);
}

