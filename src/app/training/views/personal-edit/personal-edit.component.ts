import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../models/Person';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent implements OnInit {
  @Input() person: Person;
  display = true;
  activities: Activity[] = [];
  columnNames: any[] = [];

  constructor(
    public dialogRef: DynamicDialogRef,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
    this.columnNames = [
      {
        header: 'Código',
        composeField: 'codigoActividad',
        field: 'codigoActividad',
      },
      {
        header: 'Nombre',
        composeField: 'nombreActividad',
        field: 'nombreActividad',
      },
      { header: 'Estado', composeField: 'estado', field: 'estado' },
      {
        header: 'Fecha Última Actividad',
        composeField: 'fechaUltimaActividad',
        field: 'fechaUltimaActividad',
      },
      {
        header: 'Fecha Inicio',
        composeField: 'fechaInicio',
        filterType: 'input',
      },
      {
        header: 'Fecha Finalización',
        composeField: 'fechaFinalizacion',
        field: 'fechaFinalizacion',
      },
      {
        header: 'Porcentaje Avance',
        composeField: 'porcentajeAvance',
        field: 'porcentajeAvance',
      },
      {
        header: 'Observaciones',
        composeField: 'observaciones',
        field: 'observaciones',
      },
      { header: 'Saga', composeField: 'saga', field: 'saga' },
      {
        header: 'GGID',
        composeField: 'ggid',
        field: 'ggid',
      },
      {
        header: 'ID Tipo Actividad',
        composeField: 'tipoActividadId',
        field: 'tipoActividadId',
      },
    ];
  }

  loadActivities(): void {
    this.activityService.findAll().subscribe(
      (activities: Activity[]) => {
        this.activities = activities;
        console.log(this.activities);
      },
      (error) => {
        console.error('Error loading activities:', error);
      }
    );
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {}
}
