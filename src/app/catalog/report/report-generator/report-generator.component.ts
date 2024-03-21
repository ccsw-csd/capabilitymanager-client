import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Capability } from '../../capabilities/model/Capability';
import { Staffing } from '../../staffing/model/staffing.model';
import { DropdownModule } from 'primeng/dropdown';

import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';


@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.scss'],
})
export class ReportGeneratorComponent implements OnInit {
  isLoading: boolean;
  capabilities: Capability[] = [];
  staffing: Staffing[] = [];
  certificates: string[];
  selectedCapability: Capability;
  selectedStaffing: Staffing;
  selectedCertificate: string;
  reportComment: string = '';
  userName: string;

  constructor(
    private reportService: ReportService,
    public dialogRef: DynamicDialogRef,
    public authService: AuthService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.loadData();
    this.userName = this.authService.userInfoSSO.displayName;
  }

  loadData() {
    this.reportService
      .getAllRoleImportsVersions()
      .subscribe((capabilities: Capability[]) => {
        this.capabilities = capabilities.sort((a, b) => b.id - a.id);
        this.selectedCapability = this.capabilities[0];
      });

    this.reportService
      .getAllStaffingImportsVersions()
      .subscribe((staffing: Staffing[]) => {
        this.staffing = staffing.sort((a, b) => b.id - a.id);
        this.selectedStaffing = this.staffing[0];
      });
  }

  onGenerate() {
    const today = new Date();
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    } as const;
    const formattedDate = today.toLocaleDateString('es-ES', options);
    const reportDescription = `Informe capacidades ${formattedDate}`;

    const reportVersion = {
      idRoleVersion: this.selectedCapability.id,
      idStaffingVersion: this.selectedStaffing.id,
      description: reportDescription,
      user: this.userName,
      comments: this.reportComment,
    };

    this.isLoading = true;
    this.reportService.generateReport(reportVersion).subscribe({
      next: (result) => {
        this.snackbarService.showMessage('Informe generado correctamente');
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
