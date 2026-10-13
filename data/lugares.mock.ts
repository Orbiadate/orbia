export interface BarberoMock {
  id: string;
  nombre: string;
  inicial: string;
  esEspecial?: boolean;
}

export interface ServicioMock {
  id: string;
  nombre: string;
  duracion: string;
  duracionMinutos: number;
  precio: number;
}

export interface LocalMock {
  id: string;
  nombre: string;
  tipo: string;
  numeroLocal: string;
  lugarId: string;
  categoria: "Belleza" | "Comida" | "Salud" | "Servicios";
  estado?: string;
  badge?: string;
  servicios?: ServicioMock[];
  barberos?: BarberoMock[];
  fotoTexto?: string;
}

export interface PlanoCasillaMock {
  numero: string;
  activo?: boolean;
  localId?: string;
}

export interface LugarMock {
  id: string;
  nombre: string;
  subtitulo: string;
  planoTitulo: string;
  planoCasillas: PlanoCasillaMock[];
  localesIds: string[];
}

export const lugaresMock: LugarMock[] = [
  {
    id: "plaza-central",
    nombre: "Plaza Central",
    subtitulo: "Cada local tiene su propio espacio",
    planoTitulo: "PLANO · PLANTA BAJA",
    localesIds: ["local-12", "local-14", "local-09", "local-10"],
    planoCasillas: [
      { numero: "12", activo: true, localId: "local-12" },
      { numero: "13" },
      { numero: "14", localId: "local-14" },
      { numero: "15" },
      { numero: "08" },
      { numero: "09", localId: "local-09" },
      { numero: "10", localId: "local-10" },
      { numero: "11" },
    ],
  },
];

export const localesMock: LocalMock[] = [
  {
    id: "local-12",
    nombre: "Barbería El Filo",
    tipo: "Barbería",
    numeroLocal: "12",
    lugarId: "plaza-central",
    categoria: "Belleza",
    estado: "Abierto hoy",
    badge: "Citas hoy",
    fotoTexto: "Foto del local",
    servicios: [
      { id: "s1", nombre: "Corte clásico", duracion: "30 min", duracionMinutos: 30, precio: 150 },
      { id: "s2", nombre: "Corte + barba", duracion: "45 min", duracionMinutos: 45, precio: 220 },
      { id: "s3", nombre: "Afeitado con toalla caliente", duracion: "30 min", duracionMinutos: 30, precio: 120 },
      { id: "s4", nombre: "Corte infantil", duracion: "25 min", duracionMinutos: 25, precio: 110 },
    ],
    barberos: [
      { id: "b0", nombre: "Cualquiera", inicial: "★", esEspecial: true },
      { id: "b1", nombre: "Memo", inicial: "M" },
      { id: "b2", nombre: "Rafa", inicial: "R" },
      { id: "b3", nombre: "Nico", inicial: "N" },
    ],
  },
  {
    id: "local-14",
    nombre: "Salón Lúmina",
    tipo: "Belleza",
    numeroLocal: "14",
    lugarId: "plaza-central",
    categoria: "Belleza",
    estado: "Abierto hoy",
    servicios: [
      { id: "sl1", nombre: "Corte y peinado", duracion: "45 min", duracionMinutos: 45, precio: 250 },
      { id: "sl2", nombre: "Manicura spa", duracion: "40 min", duracionMinutos: 40, precio: 180 },
    ],
  },
  {
    id: "local-09",
    nombre: "Café Rincón",
    tipo: "Comida",
    numeroLocal: "09",
    lugarId: "plaza-central",
    categoria: "Comida",
    estado: "Abierto hoy",
    servicios: [
      { id: "cr1", nombre: "Mesa para 2", duracion: "60 min", duracionMinutos: 60, precio: 0 },
      { id: "cr2", nombre: "Mesa terraza", duracion: "60 min", duracionMinutos: 60, precio: 0 },
    ],
  },
  {
    id: "local-10",
    nombre: "Clínica Sonrisa",
    tipo: "Salud",
    numeroLocal: "10",
    lugarId: "plaza-central",
    categoria: "Salud",
    estado: "Abierto hoy",
    servicios: [
      { id: "cs1", nombre: "Limpieza dental", duracion: "40 min", duracionMinutos: 40, precio: 350 },
      { id: "cs2", nombre: "Valoración general", duracion: "30 min", duracionMinutos: 30, precio: 200 },
    ],
  },
];

export function obtenerLugarPorId(id: string): LugarMock | undefined {
  return lugaresMock.find((l) => l.id === id);
}

export function obtenerLocalesDeLugar(lugarId: string): LocalMock[] {
  return localesMock.filter((loc) => loc.lugarId === lugarId);
}

export function obtenerLocalPorId(id: string): LocalMock | undefined {
  return localesMock.find((loc) => loc.id === id);
}
