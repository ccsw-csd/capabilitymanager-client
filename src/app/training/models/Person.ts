export interface Person {
    id: number;
    saga: string;
    nombre: string;
    apellidos: string;
    practica: string;
    grado: string;
    categoria: string;
    perfil_Tecnico: string;
    fecha_Incorporacion: Date | null;
    asignacion: number;
    status: string;
    cliente_ctual: string | null;
    fecha_Inicio_asignacion: Date | null;
    fecha_Fin_signacion: Date | null;
    fecha_Disponibilidad: Date | null;
    posicion_Proyecto_Futuro: string | null;
    colaboraciones: string; 
    proyecto_anterior: string | null;
    ggid: string;
    meses_Bench: string;
  }