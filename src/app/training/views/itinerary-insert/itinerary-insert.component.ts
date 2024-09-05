import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Itinerary } from '../../models/Itinerary';
import { ItineraryService } from '../../services/itinerary.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ItineraryListComponent } from '../../views/itinerary-list/itinerary-list.component';

@Component({
  selector: 'app-itinerary-insert',
  templateUrl: './itinerary-insert.component.html',
  styleUrls: ['./itinerary-insert.component.scss'],
})
export class ItineraryInsertComponent implements OnInit {
  itinerary: Itinerary | null = null;
  updatedItinerary: Itinerary | null = null;
  isEditMode: boolean;

  constructor(
    public dialogRef: DynamicDialogRef,
    private itineraryService: ItineraryService,
    private config: DynamicDialogConfig,
    private snackbarService: SnackbarService,
    private itineraryListComponent: ItineraryListComponent
  ) {
  }

  ngOnInit(): void {
    this.itinerary = this.config.data.itinerary;
    this.updatedItinerary = { ...this.itinerary };
  }
  updateId(codigo: string) {
    this.updatedItinerary = { ...this.updatedItinerary, codigo };
  }

  updateName(name: string) {
    this.updatedItinerary = { ...this.updatedItinerary, name };
  }
  onSave() {
    if (this.updatedItinerary) {
      this.itineraryService
        .saveItinerary(this.updatedItinerary)
        .subscribe({
          next: () => {
            this.dialogRef.close(this.updatedItinerary);
            this.snackbarService.showMessage('Se ha insertado el itinerario formativo correctamente');
            this.itineraryListComponent.loadData();
          },
          error: (error) => {
            this.snackbarService.error(error.message);
          }
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
