import { ActivityType } from "./ActivityType";

export interface Activity {
    id: number;
    tipoActividad: ActivityType;
    codigoActividad: string;
    nombreActividad: string;
    estado: string;
    fechaUltimaActividad: Date;
    fechaInicio: Date;
    fechaFinalizacion: Date;
    porcentajeAvance: number;
    observaciones: string;
    saga: string;
    ggid: string;
    tipoActividadId: number;
  }
  