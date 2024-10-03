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
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.scss']
})
export class ActivityEditComponent {
  person: Person;
  activities: Activity[] = [];
  roleAdmin: boolean;
  activityTypes: ActivityType[] = [];
  activityTypesOptions: any[] = [];
  stateOptions: any[] = [];
  newActivity: Activity = {
    id: null,
    nombreActividad: '',
    codigoActividad: '',
    fechaInicio: null,
    fechaUltimaActividad: new Date(),
    porcentajeAvance: null,
    estado: null,
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
  isFormValid: boolean = false;
  activity: Activity;

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
    this.activity = this.config.data.activity;

    this.fillStateOptions();
    this.loadActivityTypes();
    //this.roleAdmin = this.authService.hasRole('ADMIN');

    this.newActivity = { ...this.activity };
    this.newActivity.id = this.activity.id;
    this.newActivity.fechaInicio = new Date(this.activity.fechaInicio);
    this.newActivity.fechaFinalizacion = new Date(this.activity.fechaFinalizacion);
    this.newActivity.estado = this.activity.estado;
    this.newActivity.tipoActividadId = this.activity.tipoActividadId;

    this.validateForm();
  }

  fillStateOptions(): void {
    this.stateOptions = [
      { name: 'Iniciado' },
      { name: 'No iniciado' },
      { name: 'En curso' },
      { name: 'Pausado' },
      { name: 'Finalizado' },
      { name: 'Bloqueado' },
    ];
  }

  validateForm(): void {
    this.isFormValid =
      this.newActivity.nombreActividad !== '' &&
      this.newActivity.estado !== null &&
      this.newActivity.tipoActividadId !== null &&
      this.newActivity.fechaInicio !== null &&
      this.newActivity.porcentajeAvance !== null;
  }

  onChangeActivityType(event) {
    this.newActivity.tipoActividad = event.value;
    this.newActivity.tipoActividadId = event.value;
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

  cancel(): void {
    this.dialogRef.close(true);
  }

  save(): void {
    
    if (this.newActivity.fechaInicio && this.newActivity.fechaFinalizacion > this.newActivity.fechaFinalizacion) {
      this.snackbarService.error('La fecha de inicio no puede ser posterior a la fecha de finalización');
      return;
    } 
    this.activityService.update(this.newActivity).subscribe({
      next: () => {
        this.snackbarService.showMessage('Actividad actualizada correctamente');
        this.cancel();
      },
      error: (error) => {

        if (error.message) {
          this.snackbarService.error(error.message);
          return;

        }
        this.snackbarService.error(
          'Error al actualizar la actividad. Inténtelo de nuevo más tarde.'
        );
      },
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
}
