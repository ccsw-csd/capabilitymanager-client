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
  updatedItinerary: Itinerary | null = null;

  constructor(
    public dialogRef: DynamicDialogRef,
    private itineraryService: ItineraryService,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.itinerary = this.config.data.itinerary;
    this.updatedItinerary = { ...this.itinerary };
  }

  updateId(id: string) {
    this.updatedItinerary = { ...this.updatedItinerary, id };
  }

  updateName(name: string) {
    this.updatedItinerary = { ...this.updatedItinerary, name };
  }

  onSave() {
    if (this.updatedItinerary) {
      this.itineraryService
        .saveItinerary(this.updatedItinerary)
        .subscribe((result) => {
          this.dialogRef.close(this.updatedItinerary);
        });
    } else {
      console.error(
        'No se puede guardar el itinerario porque no está definido.'
      );
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
