import "dotenv/config";
import dotenv from "dotenv";
import path from "path";

// Asegura que .env se cargue desde la raíz del proyecto (junto a package.json)
dotenv.config({ path: path.resolve(__dirname, ".env") });

import {
  procesarSolicitud,
  modificarCitaAgente,
  cancelarCitaAgente,
  configurarServicioAgente,
  consultarCitasAgente,
  generarRecordatoriosAgente,
} from "./src/pipeline";
import type { Cita, Negocio, Servicio, SolicitudUsuario } from "./src/types";
import { negociosMock, horariosMock } from "./data/negocios.mock";

/**
 * Pausa la ejecución asíncrona durante el tiempo indicado en milisegundos.
 * Envuelve setTimeout en una Promise para espaciar llamadas consecutivas al LLM
 * y prevenir saturación o errores HTTP 503 ('high demand') en la API de Gemini.
 */
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  let citas: Cita[] = [];
  let negocios: Negocio[] = negociosMock;

  console.log("=== INICIO DE PRUEBAS DE FLUJO DE CITAS (ORBIA) ===\n");

  // 1. Reservar una cita
  console.log("--- 1. Reservar Cita ---");
  const solicitudReserva: SolicitudUsuario = {
    nombreUsuario: "Cris",
    servicio: "corte de cabello",
    fechaPreferida: "viernes",
    horaPreferida: "tarde",
  };

  const { resultado: resReserva, citas: citasTrasReserva } = await procesarSolicitud(
    solicitudReserva,
    negocios,
    horariosMock,
    citas
  );
  citas = citasTrasReserva;
  console.log("Resultado:", resReserva.mensaje);

  const citaId = resReserva.cita?.id ?? "cita-1";

  // 2. Modificar la cita
  console.log("\n--- 2. Modificar Cita ---");
  const solicitudModificacion: SolicitudUsuario = {
    nombreUsuario: "Cris",
    servicio: "corte de cabello",
    fechaPreferida: "viernes",
    horaPreferida: "mañana",
  };

  const { resultado: resModificar, citas: citasTrasModificar } = modificarCitaAgente(
    citas,
    citaId,
    negocios,
    horariosMock,
    solicitudModificacion
  );
  citas = citasTrasModificar;
  console.log("Resultado:", resModificar.mensaje);

  // 3. Cancelar la cita
  console.log("\n--- 3. Cancelar Cita ---");
  const { resultado: resCancelar, citas: citasTrasCancelar } = cancelarCitaAgente(
    citas,
    citaId
  );
  citas = citasTrasCancelar;
  console.log("Resultado:", resCancelar.mensaje);

  console.log("\n=== ESTADO FINAL DE CITAS ===");
  console.log(citas);

  // 4. Configurar la duración de un servicio en un negocio
  console.log("\n--- 4. Configurar Duración de Servicio en Negocio ---");
  const nuevoServicio: Servicio = {
    id: "s3",
    nombre: "Corte + barba",
    duracionMinutos: 45,
  };

  const { resultado: resConfigurar, negocios: negociosActualizados } = configurarServicioAgente(
    negocios,
    "n1",
    nuevoServicio
  );
  negocios = negociosActualizados;
  console.log("Resultado:", resConfigurar.mensaje);
  console.log(
    "Servicios actualizados de Salón Bella Vista:",
    negocios.find((n) => n.id === "n1")?.servicios
  );

  // 5. Consultar citas de 'Cris' sin filtro
  console.log("\n--- 5. Consultar Citas de 'Cris' (Sin Filtro) ---");
  const consultaSinFiltro = consultarCitasAgente(citas, "Cris");
  console.log("Resultado:", consultaSinFiltro.mensaje);
  console.log("Citas encontradas:", consultaSinFiltro.citas);

  // 6. Consultar citas de 'Cris' con rango de fechas específico
  console.log("\n--- 6. Consultar Citas de 'Cris' (Con Rango: 2026-09-01 a 2026-09-30) ---");
  const consultaConFiltro = consultarCitasAgente(citas, "Cris", {
    desde: "2026-09-01",
    hasta: "2026-09-30",
  });
  console.log("Resultado:", consultaConFiltro.mensaje);
  console.log("Citas en rango:", consultaConFiltro.citas);

  // 7. Generar recordatorios de citas
  console.log("\n--- 7. Generar Recordatorios de Citas ---");
  await esperar(2000);
  const solicitudRecordatorio: SolicitudUsuario = {
    nombreUsuario: "Ana",
    servicio: "corte de cabello",
    fechaPreferida: "viernes",
    horaPreferida: "tarde",
  };

  const { resultado: resReserva2, citas: citasConReserva2 } = await procesarSolicitud(
    solicitudRecordatorio,
    negocios,
    horariosMock,
    citas
  );
  citas = citasConReserva2;
  console.log("Resultado de reserva:", resReserva2.mensaje);

  const fechaHoyFija = "2026-09-10"; // Fecha fija de prueba ('hoy')
  // Generar recordatorios para 'mañana' (diasAntes = 1)
  const resRecordatorios = generarRecordatoriosAgente(citas, fechaHoyFija, 1);
  console.log("Resultado recordatorios:", resRecordatorios.mensaje);
  console.log("Recordatorios generados:", resRecordatorios.recordatorios);

  // 8. Citas multi-negocio y multi-rubro para un mismo usuario ('Cris')
  console.log("\n--- 8. Citas Multi-Negocio y Multi-Rubro para 'Cris' ---");
  await esperar(2000);

  // Reserva 1: Salón de belleza (Salón Bella Vista - n1)
  const solicitudSalonCris: SolicitudUsuario = {
    nombreUsuario: "Cris",
    servicio: "corte de cabello",
    fechaPreferida: "viernes",
    horaPreferida: "tarde",
  };
  const { resultado: resSalonCris, citas: citasConSalonCris } = await procesarSolicitud(
    solicitudSalonCris,
    negocios,
    horariosMock,
    citas
  );
  citas = citasConSalonCris;
  console.log("Reserva en Salón de Belleza:", resSalonCris.mensaje);

  // Pausa entre llamadas consecutivas al LLM para prevenir errores 503 por alta demanda
  await esperar(2000);

  // Reserva 2: Taller mecánico (Taller El Mecánico - n3)
  const solicitudMecanicoCris: SolicitudUsuario = {
    nombreUsuario: "Cris",
    servicio: "cambio de aceite",
    fechaPreferida: "sábado",
    horaPreferida: "mañana",
  };
  const { resultado: resMecanicoCris, citas: citasConMecanicoCris } = await procesarSolicitud(
    solicitudMecanicoCris,
    negocios,
    horariosMock,
    citas
  );
  citas = citasConMecanicoCris;
  console.log("Reserva en Taller Mecánico:", resMecanicoCris.mensaje);

  // Consulta de todas las citas activas de 'Cris' confirmando soporte multi-negocio
  const consultaMultiRubro = consultarCitasAgente(citas, "Cris");
  console.log("\nResultado de consulta multi-rubro:", consultaMultiRubro.mensaje);
  console.log("Citas encontradas para Cris (distintos negocios y rubros):");
  consultaMultiRubro.citas.forEach((c) => {
    const negocio = negocios.find((n) => n.id === c.negocioId);
    console.log(
      `  - Cita ID: ${c.id} | Negocio: "${negocio?.nombre}" (${c.negocioId}) | Servicio ID: ${c.servicioId} | Fecha: ${c.fecha} ${c.hora} | Estado: ${c.estado}`
    );
  });
}

main().catch((error) => {
  console.error("Error al ejecutar el flujo de ORBIA:", error);
});
