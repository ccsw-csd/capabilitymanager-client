import { Component } from '@angular/core';
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
        if (result)
          this.snackbarService.showMessage('Archivo subido correctamente');
        else this.snackbarService.showMessage('Archivo subido correctamente.');
        this.isLoading = false;
        this.close(true);
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
