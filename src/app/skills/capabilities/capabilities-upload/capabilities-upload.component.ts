import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CapabilitiesService } from '../capabilities.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-capabilities-upload',
  templateUrl: './capabilities-upload.component.html',
  styleUrls: ['./capabilities-upload.component.scss'],
})
export class CapabilitiesUploadComponent implements OnInit {
  capabilityFile: File | null = null;
  isLoading = false;
  userName = '';
  @Output() fileUploaded = new EventEmitter<void>();

  constructor(
    private capabilitiesService: CapabilitiesService,
    public authService: AuthService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.userInfoSSO.displayName;
  }

  onSelect(event: { currentFiles: File[] }): void {
    this.capabilityFile = event.currentFiles[0] || null;
  }

  onRemove(): void {
    this.capabilityFile = null;
  }

  onImport(): void {
    if (!this.capabilityFile) {
      this.snackbarService.error('Por favor seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('documentType', '2');
    formData.append('fileData', this.capabilityFile);
    formData.append('user', this.userName);
    formData.append('description', this.capabilityFile.name);

    this.isLoading = true;
    this.capabilitiesService.uploadCapability(formData).subscribe({
      next: (respuesta) => {
        const errorMessage = this.getErrorMessage(respuesta);
        this.isLoading = false;
        this.close(true);
        this.fileUploaded.emit();
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
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

  private getErrorMessage(respuesta: any): string {
    if (respuesta?.error) {
      this.snackbarService.error(respuesta.message);
    } else{
      this.snackbarService.showMessage(respuesta.message);
    }
    return 'Ocurrió un error al subir el archivo.';
  }
}
