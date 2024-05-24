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

  findAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activity/all`);
  }

  findBySaga(saga: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/activity/${saga}`);
  }
}
