export interface Person {
  id: number;
  saga: string;
  nombre: string;
  apellidos: string;
  practica: string;
  grado: string;
  categoria: string;
  perfilTecnico: string;
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
  ggid: string;
  mesesBench: string;
}
