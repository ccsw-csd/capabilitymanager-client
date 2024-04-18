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
  private itinerariesUrl: string = 'assets/itineraries.json';

  constructor(private http: HttpClient) {}

  getAllItineraries(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(this.itinerariesUrl);
  }

  saveItinerary(itinerary: Itinerary): Observable<Itinerary> {
    return new Observable<Itinerary>((observer) => {
      observer.next(itinerary);
      observer.complete();
    });
  }
}
