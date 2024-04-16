import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Itinerary } from '../../models/Itinerary';
import { ItineraryService } from '../../services/itinerary.service';

@Component({
  selector: 'app-itinerary-edit',
  templateUrl: './itinerary-edit.component.html',
  styleUrls: ['./itinerary-edit.component.scss'],
})
export class ItineraryEditComponent implements OnInit {
  itinerary: Itinerary | null = null;

  constructor(
    public dialogRef: DynamicDialogRef,
    private itineraryService: ItineraryService,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // Obtener el itinerario pasado como datos al abrir el diálogo
    this.itinerary = this.config.data.itinerary;
  }

  onSave() {
    if (this.itinerary) {
      this.itineraryService
        .saveItinerary(this.itinerary)
        .subscribe((result) => {
          this.dialogRef.close(this.itinerary); // Pasar el itinerario editado al cerrar el diálogo
        });
    } else {
      console.error(
        'No se puede guardar el itinerario porque no está definido.'
      );
    }
  }

  onClose() {
    this.dialogRef.close(); // Cerrar el diálogo sin pasar ningún dato
  }
}
