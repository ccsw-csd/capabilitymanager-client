import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/Activity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {

  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  create(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.baseUrl}/activity/guardar`, activity);
  }

  findAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activity`);
  }

  findByGgid(ggid: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activity/ggid/${ggid}`);
  }

  findBySaga(saga: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activity/saga/${saga}`);
  }

  delete(id: string): Observable<String> {
    return this.http.delete<String>(`${this.baseUrl}/activity/delete/${id}`);
  }

  update(activity: Activity): Observable<String> {
    console.log('Actualizando actividad:', activity);
    return this.http.put<String>(`${this.baseUrl}/activity/update`, activity);
  }
}
