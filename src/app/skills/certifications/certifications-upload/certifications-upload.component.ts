import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CertificationsService } from '../certifications.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private snackbarService: SnackbarService
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
    formData.append('documentType', '3');
    formData.append('fileData', this.certificationsFile);
    formData.append('user', this.userName);
    formData.append('description', this.certificationsFile.name);

    this.isLoading = true;
    this.certificationsService.uploadCertifications(formData).subscribe({
      next: () => {
        this.snackbarService.showMessage('Archivo subido correctamente');
        this.isLoading = false;
        this.close(true);
        this.fileUploaded.emit();
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.snackbarService.error(errorMessage);
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

  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    return 'Ocurrió un error al subir el archivo.';
  }
}
