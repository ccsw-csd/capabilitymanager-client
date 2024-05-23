import { Component, OnInit } from '@angular/core';
import { Activity } from '../../models/Activity';
import { ActivityService } from '../../services/activity.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  cols: Column[];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();

    this.cols = [
      { field: 'codigoActividad', header: 'Código de Actividad' },
      { field: 'nombreActividad', header: 'Nombre de Actividad' },
      { field: 'estado', header: 'Estado' },
      { field: 'fechaUltimaActividad', header: 'Fecha Última Actividad' },
      { field: 'fechaInicio', header: 'Fecha de Inicio' },
      { field: 'fechaFinalizacion', header: 'Fecha de Finalización' },
      { field: 'porcentajeAvance', header: 'Porcentaje de Avance' },
      { field: 'observaciones', header: 'Observaciones' },
      { field: 'saga', header: 'Saga' },
      { field: 'ggid', header: 'GGID' },
    ];
  }

  loadActivities(): void {
    this.activityService.findAll().subscribe(
      (data) => {
        this.activities = data;
      },
      (error) => {
        console.error('Error al cargar las actividades', error);
      }
    );
  }
}
