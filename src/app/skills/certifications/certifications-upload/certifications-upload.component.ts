import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CertificationsService } from '../certifications.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { WebsocketService } from '../../services/websocket.service';
@Component({
  selector: 'app-certifications-upload',
  templateUrl: './certifications-upload.component.html',
  styleUrls: ['./certifications-upload.component.scss'],
})
export class CertificationsUploadComponent implements OnInit {
  certificationsFile: File | null = null;
  isLoading = false;
  userName = '';
  @Output() fileUploaded = new EventEmitter<void>();

  constructor(
    private certificationsService: CertificationsService,
    public authService: AuthService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private snackbarService: SnackbarService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.userInfoSSO.displayName;
  }

  onSelect(event: { currentFiles: File[] }): void {
    this.certificationsFile = event.currentFiles[0] || null;
  }

  onRemove(): void {
    this.certificationsFile = null;
  }

  onImport(): void {
    if (!this.certificationsFile) {
      this.snackbarService.error('Por favor seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('tipoFichero', '3');
    formData.append('fileData', this.certificationsFile);
    formData.append('usuario', this.userName);
    formData.append('nombreFichero', this.certificationsFile.name);

    this.isLoading = true;
    this.certificationsService.uploadCertifications_new(formData).subscribe({
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
