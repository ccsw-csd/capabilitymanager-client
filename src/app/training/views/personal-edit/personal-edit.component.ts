import { Component, OnInit } from '@angular/core';
import { Person } from '../../models/Person';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';
import { SortEvent } from 'primeng/api';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivityType } from 'src/app/training/models/ActivityType';
import { ActivityTypeService } from 'src/app/training/services/activity-type.service';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent implements OnInit {
  person: Person;
  activities: Activity[] = [];
  columnNames: any[] = [];
  roleAdmin: boolean;
  showCreate = false;
  activityTypes: ActivityType[] = [];
  activityTypesOptions: any[] = [];
  newActivity: Activity = {
    id: null,
    nombreActividad: '',
    codigoActividad: '',
    fechaInicio: null,
    fechaUltimaActividad: new Date(),
    porcentajeAvance: null,
    estado: '',
    observaciones: '',
    saga: '',
    ggid: '',
    tipoActividadId: null,
    fechaFinalizacion: null,
    tipoActividad: {
      id: 0,
      nombre: '',
    },
  };

  stateOptions: any[] = [
    { name: 'Iniciado' },
    { name: 'No iniciado' },
    { name: 'En curso' },
    { name: 'Pausado' },
    { name: 'Finalizado' },
    { name: 'Bloqueado' },
  ];

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private activityService: ActivityService,
    private activityTypeService: ActivityTypeService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.person = this.config.data.person;

    this.newActivity.ggid = this.person.ggid;
    this.newActivity.saga = this.person.saga;

    this.initializeColumns();
    this.loadActivities();
    this.loadActivityTypes();
    this.roleAdmin = this.authService.hasRole('ADMIN');
  }

  initializeColumns() {
    this.columnNames = [
      { header: 'Código', field: 'codigoActividad' },
      { header: 'Nombre', field: 'nombreActividad' },
      { header: 'Estado', field: 'estado', class: this.getEstadoClass },
      { header: 'Fecha Última Act.', field: 'fechaUltimaActividad' },
      { header: 'Fecha Inicio', field: 'fechaInicio' },
      {
        header: 'Fecha Finalización',
        field: 'fechaFinalizacion',
        class: this.getFechaFinalizacionClass,
      },
      { header: '% Avance', field: 'porcentajeAvance' },
      { header: 'Observaciones', field: 'observaciones' },
      { header: 'Tipo Actividad', field: 'tipoActividadId' },
    ];
  }

  onChangeActivityType(event) {
    this.newActivity.tipoActividad = event.value.id;
    this.newActivity.tipoActividadId = event.value.id;
  }

  onChangeActivityState(event){
    this.newActivity.estado = event.value;
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
        const activitiesMap = new Map<string, any>();

        allActivities.forEach((activity) => {
          if (!activitiesMap.has(activity.codigoActividad)) {
            activitiesMap.set(activity.codigoActividad, activity);

            if (
              activity.porcentajeAvance > 0 &&
              activity.porcentajeAvance < 100
            ) {
              activity.estado = 'Iniciado';
            } else if (activity.porcentajeAvance === 100) {
              activity.estado = 'Completado';
            }
          }
        });

        this.activities = Array.from(activitiesMap.values());
      },
      (error) => {
        console.error('Error loading activities:', error);
        this.snackbarService.error(
          'Error al cargar las actividades. Inténtelo de nuevo más tarde.'
        );
      }
    );
  }

  formatDate(dateString: string): string {
    if (dateString != null) {
      const date = new Date(dateString);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      return '';
    }
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.newActivity.estado = (this.newActivity.estado as any)?.name || 'No iniciado';

    //Check new activity is valid
    if (
      this.newActivity.nombreActividad === '' ||
      this.newActivity.estado === '' ||
      this.newActivity.tipoActividadId === null ||
      this.newActivity.fechaInicio === null ||
      this.newActivity.fechaFinalizacion === null ||
      this.newActivity.porcentajeAvance === null ||
      this.newActivity.codigoActividad === ''
    ) {
      this.snackbarService.error('Debe rellenar todos los campos obligatorios');
      return;
    }

    //Check dates
    if (this.newActivity.fechaInicio > this.newActivity.fechaFinalizacion) {
      this.snackbarService.error('La fecha de inicio no puede ser posterior a la fecha de finalización');
      return;
    } 

    this.activityService.create(this.newActivity).subscribe({
      next: () => {
        this.snackbarService.showMessage('Actividad creada correctamente');
        this.loadActivities();
      },
      error: (error) => {

        if (error.message) {
          this.snackbarService.error(error.message);
          return;

        }
        this.snackbarService.error(
          'Error al crear la actividad. Inténtelo de nuevo más tarde.'
        );
      },
    });
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

  getTipoActividadName(tipoActividadId: number): string {
    switch (tipoActividadId) {
      case 1:
        return 'Formacion';
      case 2:
        return 'Bootcamp';
      case 3:
        return 'Shadowing/TOJ';
      case 4:
        return 'Colaboraciones';
      case 5:
        return 'Proyecto interno';
      case 6:
        return 'Preparación certificación';
      case 7:
        return 'Certificación';
      case 8:
        return 'Itinerario Formativo';
      default:
        return 'Desconocido';
    }
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
}
