import { Component, EventEmitter, Output } from '@angular/core';
import { CertificationsService } from '../certifications.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-certifications-upload',
  templateUrl: './certifications-upload.component.html',
  styleUrls: ['./certifications-upload.component.scss'],
})
export class CertificationsUploadComponent {
  certificationsFile: File;
  isLoading: boolean;
  userName: string;
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter();

  constructor(
    private certificationsService: CertificationsService,
    public authService: AuthService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.userName = this.authService.userInfoSSO.displayName;
  }

  onSelect(event: { currentFiles: File[] }) {
    this.certificationsFile = event.currentFiles[0];
  }

  onRemove() {
    this.certificationsFile = null;
  }

  onImport() {
    if (!this.certificationsFile) {
      this.snackbarService.error('Por favor seleccione un archivo.');
      return;
    }

    let formData = new FormData();
    formData.append('documentType', '3');
    formData.append('fileData', this.certificationsFile);
    formData.append('user', this.userName);
    formData.append('description', this.certificationsFile.name);

    this.isLoading = true;
    this.certificationsService.uploadCertifications(formData).subscribe({
      next: (result) => {
        if (result) {
          this.snackbarService.showMessage('Archivo subido correctamente');
        } else {
          this.snackbarService.showMessage('Archivo subido correctamente.');
        }
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

  onCancel() {
    this.close(false);
  }

  close(isUpload: boolean) {
    this.dialogRef.close(isUpload);
  }
}
