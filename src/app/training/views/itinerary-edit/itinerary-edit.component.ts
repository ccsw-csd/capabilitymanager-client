import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Itinerary } from '../../models/Itinerary';
import { ItineraryService } from '../../services/itinerary.service';
import { ItineraryListComponent } from '../../views/itinerary-list/itinerary-list.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-itinerary-edit',
  templateUrl: './itinerary-edit.component.html',
  styleUrls: ['./itinerary-edit.component.scss'],
})
export class ItineraryEditComponent implements OnInit {
  itinerary: Itinerary | null = null;
  updatedItinerary: Itinerary | null = null;
  isEditMode: boolean;

  isFormValid: boolean = false;
  
  validateForm(): void {
    this.isFormValid = this.itinerary.codigo !== null && this.itinerary.name !== null;
  }
  
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
        .updateItinerary(this.updatedItinerary)
        .subscribe({
          next: () => {
            this.dialogRef.close(this.updatedItinerary);
            this.itineraryListComponent.loadData();
            this.snackbarService.showMessage('Se ha actualizado el itinerario formativo correctamente');
          },
          error: (error) => {
            this.snackbarService.error(error.message);
          }
        });
    } else {
      this.dialogRef.close(this.updatedItinerary);
      console.error(
        'No se puede guardar el itinerario porque no está definido.'
      );
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
