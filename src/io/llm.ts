import type {
  SolicitudUsuario,
  SolicitudEstructurada,
  FranjaFecha,
  FranjaHora,
  IntencionUsuario,
} from "../types";
import { parsearSolicitudLocal } from "../tools/parse";
import {
  consultarModeloConReintentos,
  obtenerModelosConfigurados,
} from "./gemini_client";

export interface LLMOutput {
  nombreUsuario: string;
  intencion?: IntencionUsuario;
  servicio: string;
  franjaFecha: FranjaFecha;
  franjaHora: FranjaHora;
}

export { obtenerModelosConfigurados };

function validarYExtraerJSON(rawText: string): Partial<LLMOutput> | null {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : rawText;
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function parsearSolicitudConResiliencia(
  solicitud: SolicitudUsuario
): Promise<{ solicitud: SolicitudEstructurada; modo: "llm" | "local" }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      solicitud: parsearSolicitudLocal(solicitud, true),
      modo: "local",
    };
  }

  const systemPrompt = `Eres un asistente que extrae entidades de citas para agendamiento.
Devuelve un JSON estrictamente con este formato:
{
  "nombreUsuario": "nombre del cliente o string vacío si no se indica",
  "intencion": "agendar" | "cancelar" | "modificar" | "consultar",
  "servicio": "servicio solicitado (ej: corte, barba, tinte, etc)",
  "franjaFecha": "hoy" | "manana" | "esta_semana" | "sin_especificar",
  "franjaHora": "manana" | "tarde" | "noche" | "sin_especificar"
}`;

  const mensaje = solicitud.mensajeOriginal || solicitud.servicio || "";
  const userContent = `Usuario: ${solicitud.nombreUsuario}\nMensaje: "${mensaje}"`;
  const modelos = obtenerModelosConfigurados();

  for (const modelo of modelos) {
    const res = await consultarModeloConReintentos(modelo, apiKey, systemPrompt, userContent);
    if (!res.ok) {
      if (res.esNoReintentable) break;
      continue;
    }

    const textPart = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textPart) continue;

    const parsed = validarYExtraerJSON(textPart);
    if (!parsed || !parsed.servicio) continue;

    const estructurada: SolicitudEstructurada = {
      nombreUsuario: parsed.nombreUsuario || solicitud.nombreUsuario,
      intencion: parsed.intencion || "agendar",
      servicio: parsed.servicio,
      franjaFecha: parsed.franjaFecha || "sin_especificar",
      franjaHora: parsed.franjaHora || "sin_especificar",
      fechaPreferida: solicitud.fechaPreferida || "2026-11-15",
      horaPreferida: solicitud.horaPreferida || "10:00",
      modoLocal: false,
    };

    return { solicitud: estructurada, modo: "llm" };
  }

  return {
    solicitud: parsearSolicitudLocal(solicitud, true),
    modo: "local",
  };
}

export async function parsearSolicitudConLLM(
  solicitud: SolicitudUsuario
): Promise<SolicitudEstructurada> {
  const resultado = await parsearSolicitudConResiliencia(solicitud);
  return resultado.solicitud;
}
