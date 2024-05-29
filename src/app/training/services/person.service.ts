import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../models/Person';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/listadobench`);
  }

  getPersonBySaga(saga: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/listadobench/${saga}`);
  }
}
