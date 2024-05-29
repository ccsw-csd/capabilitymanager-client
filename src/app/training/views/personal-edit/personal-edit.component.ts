import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../models/Person';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent implements OnInit {
  person: Person;
  display = true;
  activities: Activity[] = [];
  columnNames: any[] = [];

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.person = this.config.data.person;
    this.loadActivities();
    this.initializeColumns();
  }

  initializeColumns() {
    this.columnNames = [
      { header: 'Código', field: 'codigoActividad' },
      { header: 'Nombre', field: 'nombreActividad' },
      { header: 'Estado', field: 'estado' },
      { header: 'Fecha Última Actividad', field: 'fechaUltimaActividad' },
      { header: 'Fecha Inicio', field: 'fechaInicio' },
      { header: 'Fecha Finalización', field: 'fechaFinalizacion' },
      { header: '% Avance', field: 'porcentajeAvance' },
      { header: 'Observaciones', field: 'observaciones' },
      { header: 'ID Tipo Actividad', field: 'tipoActividadId' },
    ];
  }

  loadActivities(): void {
    this.activityService.findAll().subscribe(
      (activities: Activity[]) => {
        this.activities = activities;
      },
      (error) => {
        console.error('Error loading activities:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    // TODO
  }

  trackByActivityId(index: number, activity: Activity): number {
    return activity.id;
  }
}
