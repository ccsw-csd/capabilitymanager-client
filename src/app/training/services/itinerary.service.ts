import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Itinerary } from '../models/Itinerary';

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getAllItineraries(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.baseUrl}/mantenimiento/itinerariosFormativos/showAll`);
  }

  saveItinerary(itinerary: Itinerary): Observable<String> {
    console.log('Itinerario Formativo subido');
    return this.http.post<String>(
      environment.server + '/mantenimiento/itinerariosFormativos/insert',
      itinerary
    );
  }

  updateItinerary(itinerary: Itinerary): Observable<String> {
    console.log('Itinerario Formativo actulizado');
    return this.http.put<String>(
      environment.server + '/mantenimiento/itinerariosFormativos/update',
      itinerary
    );
  }

  deleteItinerary(id: String): Observable<String> {
    console.log('Itinerario Formativo borrado');
    return this.http.delete<String>(`${this.baseUrl}/mantenimiento/itinerariosFormativos/delete/${id}`);
  }

  uploadItinerary(formData: FormData): Observable<String> {
    console.log('Archivo itinerario subido');
    return this.http.post<String>(
      environment.server + '/import/data',
      formData
    );
  }
}
