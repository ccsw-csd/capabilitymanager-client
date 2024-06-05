import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { StaffingService } from '../staffing.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-staffing-upload',
  templateUrl: './staffing-upload.component.html',
  styleUrls: ['./staffing-upload.component.scss'],
})
export class StaffingUploadComponent implements OnInit {
  staffingFile: File | null = null;
  isLoading = false;
  userName = '';
  @Output() fileUploaded = new EventEmitter<void>();

  constructor(
    private staffingService: StaffingService,
    public authService: AuthService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.userInfoSSO.displayName;
  }

  onSelect(event: { currentFiles: File[] }): void {
    this.staffingFile = event.currentFiles[0] || null;
  }

  onRemove(): void {
    this.staffingFile = null;
  }

  onImport(): void {
    if (!this.staffingFile) {
      this.snackbarService.error('Por favor seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('documentType', '1');
    formData.append('fileData', this.staffingFile);
    formData.append('user', this.userName);
    formData.append('description', this.staffingFile.name);
    console.log(this.staffingFile);
    console.log(this.userName);

    this.isLoading = true;
    this.staffingService.uploadStaffing(formData).subscribe({
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
