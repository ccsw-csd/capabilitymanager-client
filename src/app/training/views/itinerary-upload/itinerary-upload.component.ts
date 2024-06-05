import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ItineraryService } from '../../services/itinerary.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-itinerary-upload',
  templateUrl: './itinerary-upload.component.html',
  styleUrls: ['./itinerary-upload.component.scss'],
})
export class ItineraryUploadComponent implements OnInit {
  itineraryFile: File | null = null;
  isLoading = false;
  userName = '';
  @Output() fileUploaded = new EventEmitter<void>();

  constructor(
    private itineraryService: ItineraryService,
    public authService: AuthService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.userInfoSSO.displayName;
  }

  onSelect(event: { currentFiles: File[] }): void {
    this.itineraryFile = event.currentFiles[0] || null;
  }

  onRemove(): void {
    this.itineraryFile = null;
  }

  onImport(): void {
    if (!this.itineraryFile) {
      this.snackbarService.error('Por favor seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('documentType', '4');
    formData.append('fileData', this.itineraryFile);
    formData.append('user', this.userName);
    formData.append('description', this.itineraryFile.name);

    this.isLoading = true;
    this.itineraryService.uploadItinerary(formData).subscribe({
      next: (respuesta) => {
        const errorMessage = this.getErrorMessage(respuesta);
        this.isLoading = false;
        this.close(true);
        this.fileUploaded.emit();
      },
      error: (error) => {
        this.snackbarService.error(error);
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.close(false);
  }

  close(isUpload: boolean): void {
    this.dialogRef.close(isUpload);
  }
  private getErrorMessage(respuesta: any): void {
    if (respuesta?.error) {
      this.snackbarService.error(respuesta.error);
    } else{
      this.snackbarService.showMessage(respuesta.message);
    }

  }
}
