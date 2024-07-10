import { Injectable } from '@angular/core';
import { ActivityType } from '../models/ActivityType';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityTypeService {
  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getAllActivityTypes(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(`${this.baseUrl}/activity-types`);
  }

  getActivityTypeById(id: number): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(
      `${this.baseUrl}/activity-types/${id}`
    );
  }
}
