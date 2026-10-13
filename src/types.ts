
export type EstadoCita = "confirmada" | "cancelada" | "modificada" | "pendiente";

export type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export type FranjaHora = "manana" | "tarde" | "noche" | "sin_especificar";
export type FranjaFecha = "hoy" | "manana" | "esta_semana" | "sin_especificar";

export type IntencionUsuario = "agendar" | "cancelar" | "modificar" | "consultar";

export interface Servicio {
  readonly id: string;
  readonly nombre: string;
  readonly duracionMinutos: number;
  readonly precio?: number;
}

export interface Negocio {
  readonly id: string;
  readonly nombre: string;
  readonly direccion?: string;
  readonly servicios: readonly Servicio[];
}

export interface Horario {
  readonly id?: string;
  readonly negocioId: string;
  readonly servicioId: string;
  readonly diaSemana?: DiaSemana | string;
  readonly horaInicio?: string;
  readonly horaFin?: string;
  readonly fecha: string;
  readonly hora: string;
  readonly disponible: boolean;
}


export interface SolicitudUsuario {
  readonly nombreUsuario: string;
  readonly mensajeOriginal?: string;
  readonly servicio: string;
  readonly fechaPreferida: string;
  readonly horaPreferida: string;
  readonly negocioPreferido?: string;
}

export interface SolicitudEstructurada {
  readonly nombreUsuario: string;
  readonly intencion: IntencionUsuario;
  readonly servicio: string;
  readonly franjaHora: FranjaHora;
  readonly franjaFecha: FranjaFecha;
  readonly fechaPreferida: string;
  readonly horaPreferida: string;
  readonly servicioId?: string;
  readonly servicioNombre?: string;
  readonly negocioId?: string;
  readonly fechaNormalizada?: string;
  readonly horaNormalizada?: string;
  readonly citaIdObjetivo?: string;
  readonly modoLocal?: boolean;
}


export interface Cita {
  readonly id: string;
  readonly usuario: string;
  readonly negocioId: string;
  readonly servicioId: string;
  readonly fecha: string;
  readonly hora: string;
  readonly duracionMinutos?: number;
  readonly estado: EstadoCita;
  readonly creadaEn?: string;
}

export type Result<T, E = string> =
  | { readonly ok: true; readonly valor: T }
  | { readonly ok: false; readonly error: E };

export interface ResultadoProcesamiento {
  readonly exito: boolean;
  readonly mensaje: string;
  readonly cita?: Cita;
  readonly citasActualizadas: readonly Cita[];
}

export interface Recordatorio {
  readonly citaId: string;
  readonly usuario: string;
  readonly mensaje: string;
}

