export interface Person {
  id: number;
  saga: string;
  ggid: string;
  nombre: string;
  apellidos: string;
  practica: string;
  grado: string;
  categoria: string;
  centro: string; // Agregado
  rol: string; // Agregado
  perfilTecnico: string;
  primarySkill: string; // Agregado
  fechaIncorporacion: Date | null;
  asignacion: number;
  status: string;
  clienteActual: string | null;
  fechaInicioAsignacion: Date | null;
  fechaFinAsignacion: Date | null;
  fechaDisponibilidad: Date | null;
  posicionProyectoFuturo: string | null;
  colaboraciones: string;
  proyectoAnterior: string | null;
  inglesEscrito: string; // Agregado
  inglesHablado: string; // Agregado
  jornada: string; // Agregado
  mesesBench: string;
}
