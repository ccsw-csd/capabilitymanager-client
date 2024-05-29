import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../models/Person';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent implements OnInit {
  person: Person;
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
      { header: 'Fecha Última Act.', field: 'fechaUltimaActividad' },
      { header: 'Fecha Inicio', field: 'fechaInicio' },
      { header: 'Fecha Finalización', field: 'fechaFinalizacion' },
      { header: '% Avance', field: 'porcentajeAvance' },
      { header: 'Observaciones', field: 'observaciones' },
      { header: 'Tipo Actividad', field: 'tipoActividadId' },
    ];
  }

  loadActivities(): void {
    this.activityService.findByGgid(this.person.ggid).subscribe(
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

  save(): void {}

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
}
