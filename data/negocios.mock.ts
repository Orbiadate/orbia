import type { Negocio, Horario } from "../src/types";

export const negociosMock: Negocio[] = [
  {
    id: "n1",
    nombre: "Salón Bella Vista",
    servicios: [{ id: "s1", nombre: "Corte de cabello", duracionMinutos: 30 }],
  },
  {
    id: "n2",
    nombre: "Estética Luna",
    servicios: [{ id: "s2", nombre: "Corte de cabello", duracionMinutos: 45 }],
  },
  {
    id: "n3",
    nombre: "Taller El Mecánico",
    servicios: [{ id: "s4", nombre: "Cambio de aceite", duracionMinutos: 40 }],
  },
];

export const horariosMock: Horario[] = [
  { negocioId: "n1", servicioId: "s1", fecha: "2026-09-11", hora: "10:00", disponible: true },
  { negocioId: "n1", servicioId: "s1", fecha: "2026-09-11", hora: "16:30", disponible: true },
  { negocioId: "n2", servicioId: "s2", fecha: "2026-09-11", hora: "17:00", disponible: false },
  { negocioId: "n2", servicioId: "s2", fecha: "2026-09-11", hora: "18:00", disponible: true },
  { negocioId: "n3", servicioId: "s4", fecha: "2026-09-12", hora: "09:00", disponible: true },
  { negocioId: "n3", servicioId: "s4", fecha: "2026-09-12", hora: "11:00", disponible: true },
];
