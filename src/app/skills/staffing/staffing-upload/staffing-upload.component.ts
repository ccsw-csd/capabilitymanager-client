import { Component, EventEmitter, Output } from '@angular/core';
import { StaffingService } from '../staffing.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-staffing-upload',
  templateUrl: './staffing-upload.component.html',
  styleUrls: ['./staffing-upload.component.scss'],
})
export class StaffingUploadComponent {
  staffingFile: File;
  isLoading: boolean;
  userName: string;
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter();

  constructor(
    private staffingService: StaffingService,
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
    this.staffingFile = event.currentFiles[0];
  }

  onRemove() {
    this.staffingFile = null;
  }

  onImport() {
    if (!this.staffingFile) {
      this.snackbarService.error('Por favor seleccione un archivo.');
      return;
    }

    let formData = new FormData();
    formData.append('documentType', '1');
    formData.append('fileData', this.staffingFile);
    formData.append('user', this.userName);
    formData.append('description', this.staffingFile.name);

    this.isLoading = true;
    this.staffingService.uploadStaffing(formData).subscribe({
      next: (result) => {
        const message = result
          ? 'Archivo subido correctamente'
          : 'Archivo subido correctamente.';
        this.snackbarService.showMessage(message);
        this.isLoading = false;
        this.close(true);
        this.fileUploaded.emit();
      },
      error: (error) => {
        let errorMessage = 'Ocurrió un error al subir el archivo.';
        if (error && error.message) {
          errorMessage = error.message;
        }
        this.snackbarService.error(errorMessage);
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
