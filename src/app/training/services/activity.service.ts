import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/Activity';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private baseUrl = '/activity';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/all`);
  }

  findBySaga(saga: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/${saga}`);
  }
}
