import { Component, OnInit } from '@angular/core';
import { Person } from '../../models/Person';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivityType } from 'src/app/training/models/ActivityType';
import { ActivityColumns } from 'src/app/training/models/ActivityColumns';
import { ActivityTypeService } from 'src/app/training/services/activity-type.service';
import { Router } from '@angular/router';
import { ActivityInsertComponent } from '../activity-insert/activity-insert.component';
import { ActivityEditComponent } from '../activity-edit/activity-edit.component';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent implements OnInit {
  person: Person;
  activities: ActivityColumns[] = [];
  totalActivities: number;
  columnNames: any[] = [];
  defaultFilters: any = {};
  roleAdmin: boolean;
  showCreate = false;
  activityTypes: ActivityType[] = [];
  reportsToExport: ActivityColumns[];
  activityTypesOptions: any[] = [];
  filteredActivities = [...this.activities];
  activityColumns: ActivityColumns = {
    id: 0,
    nombreActividad: '',
    estado: '',
    fechaUltimaActividad: '',
    fechaInicio: '',
    fechaFinalizacion: '',
    porcentajeAvance: 0,
    tipoActividadName: '',
    observaciones: '',
  };

  /*newActivity: Activity = {
    id: null,
    nombreActividad: '',
    codigoActividad: '',
    fechaInicio: new Date(),
    fechaUltimaActividad: new Date(),
    porcentajeAvance: null,
    estado: '',
    observaciones: '',
    saga: '',
    ggid: '',
    tipoActividadId: null,
    fechaFinalizacion: new Date(),
    tipoActividad: {
      id: 0,
      nombre: '',
    },
  };*/

  stateOptions: any[] = [
    { name: 'Iniciado' },
    { name: 'No iniciado' },
    { name: 'En curso' },
    { name: 'Pausado' },
    { name: 'Finalizado' },
    { name: 'Bloqueado' },
  ];

  constructor(
    //public dialogRef: DynamicDialogRef,
    //public config: DynamicDialogConfig,
    private activityService: ActivityService,
    private activityTypeService: ActivityTypeService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private route: Router,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Recuperamos la persona almacenada en state
    if (history.state) {
      this.person = history.state;

      //this.newActivity.ggid = this.person.ggid;
      //this.newActivity.saga = this.person.saga;

      this.initializeColumns();
      this.loadActivityTypes();
      this.loadActivities();

      this.roleAdmin = this.authService.hasRole('ADMIN');
    } else {
      console.log('ERROR: No se ha encontrado ninguna persona en el estado');
    }
  }

  initializeColumns() {
    this.columnNames = [
      {
        header: 'Nombre',
        field: 'nombreActividad',
        composeField: 'nombreActividad',
        filterType: 'input',
      },
      {
        header: 'Estado',
        field: 'estado',
        composeField: 'estado',
        filterType: 'input',
        class: this.getEstadoClass,
      },

      {
        header: 'Fecha Última Act.',
        field: 'fechaUltimaActividad',
        composeField: 'fechaUltimaActividad',
        filterType: 'date',
      },
      {
        header: 'Fecha Inicio',
        field: 'fechaInicio',
        composeField: 'fechaInicio',
        filterType: 'date',
      },
      {
        header: 'Fecha Finalización',
        field: 'fechaFinalizacion',
        composeField: 'fechaFinalizacion',
        filterType: 'date',
        class: this.getFechaFinalizacionClass,
      },
      {
        header: '% Avance',
        field: 'porcentajeAvance',
        composeField: 'porcentajeAvance',
        filterType: 'input',
      },
      {
        header: 'Tipo Actividad',
        field: 'tipoActividadName',
        composeField: 'tipoActividadName',
        filterType: 'input',
      },
      {
        header: 'Observaciones',
        field: 'observaciones',
        composeField: 'observaciones',
        filterType: 'input',
      },
    ];

    this.loadData();
  }

  loadActivityTypes(): void {
    this.activityTypeService.getAllActivityTypes().subscribe({
      next: (activityTypes) => {
        this.activityTypes = activityTypes;
        this.activityTypesOptions = activityTypes.map((activityType) => {
          return {
            id: activityType.id,
            name: activityType.nombre,
          };
        });
      },
      error: (error) => {
        console.error('Error loading activity types:', error);
        this.snackbarService.error(
          'Error al cargar los tipos de actividad. Inténtelo de nuevo más tarde.'
        );
      },
    });
  }

  loadActivities(): void {
    forkJoin([
      this.activityService.findByGgid(this.person.ggid),
      this.activityService.findBySaga(this.person.saga),
    ]).subscribe(
      ([ggidActivities, sagaActivities]) => {
        const allActivities = [...ggidActivities, ...sagaActivities];
        const uniqueActivitiesMap = new Map();

        allActivities.forEach((activity) => {
          if (activity.porcentajeAvance === 100) {
            activity.estado = 'Completado';
          }

          const uniqueKey =
            activity.codigoActividad ||
            `${activity.nombreActividad}-${activity.fechaInicio}`;

          activity = this.coverDatetUtc(activity);

          if (!uniqueActivitiesMap.has(uniqueKey)) {
            uniqueActivitiesMap.set(uniqueKey, this.mapActivity(activity));
          }
        });
        this.activities = Array.from(uniqueActivitiesMap.values());
        this.totalActivities = this.activities.length;
        this.setDefaultFilters();
      },
      (error) => {
        console.error('Error loading activities:', error);
        this.snackbarService.error(
          'Error al cargar las actividades. Inténtelo de nuevo más tarde.'
        );
      }
    );
  }

  coverDatetUtc(activity: Activity): Activity {
    if (activity.fechaInicio) {
      const fechaInicio = new Date(activity.fechaInicio);
      activity.fechaInicio = new Date(
        Date.UTC(
          fechaInicio.getFullYear(),
          fechaInicio.getMonth(),
          fechaInicio.getDate()
        )
      );
    }
    if (activity.fechaFinalizacion) {
      const fechaFinalizacion = new Date(activity.fechaFinalizacion);
      activity.fechaFinalizacion = new Date(
        Date.UTC(
          fechaFinalizacion.getFullYear(),
          fechaFinalizacion.getMonth(),
          fechaFinalizacion.getDate()
        )
      );
    }
    if (activity.fechaUltimaActividad) {
      const fechaUltimaActividad = new Date(activity.fechaUltimaActividad);
      activity.fechaUltimaActividad = new Date(
        Date.UTC(
          fechaUltimaActividad.getFullYear(),
          fechaUltimaActividad.getMonth(),
          fechaUltimaActividad.getDate()
        )
      );
    }
    return activity;
  }

  mapActivity(activity: Activity): ActivityColumns {
    const mappedActivity: ActivityColumns = {
      id: activity.id,
      nombreActividad: activity.nombreActividad,
      estado: activity.estado,
      fechaUltimaActividad: this.formatDateForFilter(
        activity.fechaUltimaActividad
      ),
      fechaInicio: this.formatDateForFilter(activity.fechaInicio),
      fechaFinalizacion: this.formatDateForFilter(activity.fechaFinalizacion),
      porcentajeAvance: activity.porcentajeAvance,
      tipoActividadName: this.mapActivityTypeName(activity),
      observaciones: activity.observaciones,
    };
    return mappedActivity;
  }

  formatDateForFilter(date: Date): string {
    if (date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    return null;
  }

  mapActivityTypeName(activity: Activity): string {
    const activityType = this.activityTypes.find(
      (type) => type.id === activity.tipoActividadId
    );
    if (activityType) {
      return activityType.nombre;
    }
  }

  dateFilter(value: Date, filter: string): boolean {
    if (!value || !filter) {
      return false;
    }
    const dateValue = this.formatDateForFilter(value);
    return dateValue === filter;
  }

  customSort(event: SortEvent): void {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else if (Array.isArray(value1) && Array.isArray(value2)) {
        result = value1
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((t) => t.name)
          .join(', ')
          .localeCompare(
            value2
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => t.name)
              .join(', ')
          );
      } else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  getEstadoClass(activity: any): string {
    let dias = 0;
    let diasHastaFinalizacion;
    if (activity.fechaUltimaActividad != null) {
      dias = this.getDaysDifference(
        activity.fechaInicio,
        activity.fechaUltimaActividad
      );
    } else {
      dias = this.getDaysDifference(activity.fechaInicio, new Date());
    }
    if (activity.fechaFinalizacion != null) {
      diasHastaFinalizacion = this.getDaysDifference(
        new Date(),
        activity.fechaFinalizacion
      );
    }

    const porcentajeAvance = activity.porcentajeAvance;

    if (
      (activity.estado === 'No iniciado' ||
        activity.estado === 'Pausado' ||
        activity.estado === 'Bloqueado') &&
      dias > 5
    ) {
      return 'alerta-roja';
    } else if (
      (activity.estado === 'No iniciado' ||
        activity.estado === 'Pausado' ||
        activity.estado === 'Bloqueado') &&
      dias > 3
    ) {
      return 'alerta-amarilla';
    } else if (
      (diasHastaFinalizacion <= 7 &&
        (activity.estado === 'No iniciado' || activity.estado === 'Pausado')) ||
      porcentajeAvance < 50
    ) {
      return 'alerta-roja';
    } else if (
      (diasHastaFinalizacion <= 7 && activity.estado === 'Iniciado') ||
      (porcentajeAvance >= 50 && porcentajeAvance <= 85)
    ) {
      return 'alerta-amarilla';
    } else if (activity.estado === 'Completado') {
      return 'alerta-verde';
    }

    return 'alerta-normal';
  }

  getFechaFinalizacionClass(activity: Activity): string {
    const diasParaFinalizacion = this.getDaysDifference(
      new Date(),
      new Date(activity.fechaUltimaActividad)
    );
    if (
      ((activity.estado === 'No iniciado' || activity.estado === 'Pausado') &&
        diasParaFinalizacion <= 7) ||
      activity.porcentajeAvance < 50
    ) {
      return 'alerta-roja';
    } else if (
      (activity.estado === 'En curso' && diasParaFinalizacion <= 7) ||
      (activity.porcentajeAvance >= 50 && activity.porcentajeAvance < 85)
    ) {
      return 'alerta-amarilla';
    }
    return '';
  }

  getDaysDifference(date1Str, date2Str) {
    // Convertir las fechas de cadena a objetos Date
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    // Obtener la diferencia en milisegundos entre las dos fechas
    const diffTime = Math.abs(date2.getTime() - date1.getTime());

    // Convertir la diferencia de milisegundos a días y redondear hacia abajo
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  confirmDeleteActivity(id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que quieres eliminar esta actividad?',
      header: 'Confirmación',
      icon: 'pi pi-question-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button p-button-danger p-button-outlined mx-2',
      rejectButtonStyleClass: 'p-button p-button-info p-button-outlined mx-2',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Se ha borrado la actividad',
        });
        this.deleteActividad(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'No se ha borrado la actividad',
          life: 3000,
        });
      },
    });
  }

  deleteActividad(id: string) {
    this.activityService.delete(id).subscribe(
      () => {
        // Actualizar la lista de actividades
        this.activities = this.activities.filter(
          (activity) => activity.id.toString() !== id
        );
        this.loadActivities();
      },
      (error) => {
        // Manejar el error si ocurre
        console.error(`Error al eliminar la actividad con id ${id}:`, error);
      }
    );
  }

  editActivity(id: number) {
    const activityToEdit = this.activities.find(
      (activity) => activity.id === id
    );
    if (activityToEdit) {
      console.log('Editar actividad con id:', id);
      console.log('Datos de la actividad:', activityToEdit);
      const ref = this.dialogService.open(ActivityEditComponent, {
        header: 'Editar actividad',
        width: '60rem',
        data: {
          activity: activityToEdit,
        },
        closable: false,
      });

      ref.onClose.subscribe((result: boolean) => {
        if (result) {
          this.loadData();
        }
      });
    } else {
      console.error('No se encontró ninguna actividad con el id:', id);
    }
  }

  createActivity(person?: Person) {
    console.log('Crear nueva actividad');
    const ref = this.dialogService.open(ActivityInsertComponent, {
      header: 'Crear actividad',
      width: '60rem',
      data: {
        person: person,
      },
      closable: false,
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.loadActivities();
  }

  setDefaultFilters() {
    this.defaultFilters = {};

    this.columnNames.forEach((column) => {
      if (column.filterType === 'input' || column.filterType === 'date') {
        this.defaultFilters[column.field] = {
          value: '',
          matchMode: 'contains',
        };
      }
    });
  }

  setFilters(): void {
    this.setDefaultFilters();
  }

  cleanFilters(): void {
    this.loadActivities();
    this.setFilters();
  }

  parseDateFromString(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    return new Date(+year, +month - 1, +day);
  }
}
