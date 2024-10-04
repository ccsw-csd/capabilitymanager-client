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
    formData.append('tipoFichero', '2');
    formData.append('fileData', this.capabilityFile);
    formData.append('usuario', this.userName);
    formData.append('nombreFichero', this.capabilityFile.name);

    this.isLoading = true;
    this.capabilitiesService.uploadCapability_new(formData).subscribe({
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
