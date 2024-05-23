import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/Activity';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
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
