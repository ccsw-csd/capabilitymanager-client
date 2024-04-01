import { Component, OnInit } from '@angular/core';
import {
  ColumnDetails,
  GradesRole,
  InformeTotal,
  ProfilesAndGrades,
} from '../../core/interfaces/Capabilities';
import { SkillsService } from 'src/app/core/services/skills.service';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { Report } from '../../catalog/report/model/Report';
import { Screenshot } from 'src/app/core/interfaces/Screenshot';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.scss'],
})
export class MaestroComponent implements OnInit {
  load: boolean = false;
  EMText: string;
  EMCol: string[] = [];
  EMData: InformeTotal[];
  EMDataTotal: number;
  EMDataOthersTotal: number;
  isEMDataTotalOK: boolean = true;

  BAText: string;
  BACol: string[] = [];
  BAData: InformeTotal[];
  BADataTotal: number;
  isBADataTotalOK: boolean = true;

  ARText: string;
  ARCol: string[] = [];
  ARData: InformeTotal[];
  ARDataTotal: number;
  isARDataTotalOK: boolean = true;

  SEText: string;
  SECol: string[] = [];
  SEData: InformeTotal[];
  SEDataTotal: number;
  isSEDataTotalOK: boolean = true;

  IEText: string;
  IECol: string[] = [];
  IEData: InformeTotal[];
  IEDataTotal: number;
  isIEDataTotalOK: boolean = true;

  ArSeDevText: string;
  ArSeDevCol: string[] = [];
  ArSeDevData: InformeTotal[];
  ArSeDevDataToal: number;
  isArSeDevDataToalOK: boolean = true;

  ArSeApiText: string;
  ArSeApiCol: string[] = [];
  ArSeApiData: InformeTotal[];
  ArSeApiDataTotal: number;
  isArSeApiDataTotalOK: boolean = true;

  rolesCol: string[] = [];
  gradesRoles: InformeTotal[];
  gradeRoleText: string;
  rolesSum: number[];

  selectedExcel: string = '';
  visible: boolean;
  tableList = [
    'All Profiles',
    'Engagement Managers',
    'Architects',
    'Business Analyst',
    'Software Engineer',
    'Industry Experts',
    'Architects & SE Custom Apps Development',
    'Architects & SE Integration & APIs',
    'Pyramid Grade-Rol',
  ];

  items: MenuItem[];

  userName: string;

  idReport: number;
  selectedReportName: string;
  titleScreenshotChip: number;
  selectedReportModificationDate: Date;
  selectedReportUserName: string;

  reportYears: string[];
  reportVersions: Report[];

  screenshotsOptions: Screenshot[] = [
    { name: 'Sí' },
    { name: 'No' },
    { name: 'Todas' },
  ];
  screenshotValue: string;
  selectedScreenshotOption: Screenshot;

  screenshotEnabled: boolean;
  hasScreenshotChanged: boolean;
  comentarios: string;

  selectedScreenshot: Screenshot;
  selectedReportYear: string;
  selectedReport: Report;

  disableYearDrop: boolean = true;
  disableVersionDrop: boolean = true;
  disableButtonSearch: boolean = true;

  allProfilesAndGrades: ProfilesAndGrades[];
  dataGradesRoles: GradesRole[];
  literals: ColumnDetails[];

  CCATotal: number;

  constructor(
    private skillsService: SkillsService,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAllLiteralsAndThenLoadData();

    this.items = [
      {
        label: 'Export totales',
        icon: 'pi pi-external-link',
        command: () => this.exportExcelTotales(),
      },
      {
        label: 'Export detalle',
        icon: 'pi pi-external-link',
        command: () => this.showDialog(),
      },
    ];

    this.userName = this.authService.userInfoSSO.displayName;

    

  }

  loadAllReports() {
    this.skillsService.getAllReports().subscribe(
      (data) => {
        const lastReport = this.getLastReport(data);

        if (lastReport) {
          this.idReport = lastReport.id;
          this.selectedReportName = lastReport.descripcion;
          this.titleScreenshotChip = lastReport.screenshot;
          this.selectedReportModificationDate = lastReport.fechaModificacion;
          this.selectedReportUserName = lastReport.usuario;
          this.screenshotEnabled = lastReport.screenshot !== 0;
          this.comentarios = lastReport.comentarios || '';

          this.loadProfileAndGradesData(this.idReport);

          this.initEM();
          this.initBA();
          this.initAR();
          this.initSE();
          this.initIE();
          this.initArSeDev();
          this.initArSeApi();
          this.initPyramide();

          this.selectedReport = lastReport;
        }
      },
      (error) => {
        console.error('Error al obtener todos los informes', error);
      }
    );
  }

  getLastReport(reports: Report[]): Report | undefined {
    return reports.reduce(
      (latest, report) => (latest && latest.id > report.id ? latest : report),
      undefined
    );
  }

  loadReportVersionsByYear(
    selectedReportYear: string,
    selectedScreenshotOption: Screenshot
  ) {
    const year = selectedReportYear;
    const screenshot = selectedScreenshotOption;
    if (this.selectedScreenshot.name === 'No') {
      this.screenshotValue = '0';
    } else if (this.selectedScreenshot.name === 'Sí') {
      this.screenshotValue = '1';
    } else if (this.selectedScreenshot.name === 'Todas') {
      this.screenshotValue = 'all';
    }

    this.skillsService
      .getReportByScreenshotAndYear(year, this.screenshotValue)
      .subscribe(
        (data) => {
          this.reportVersions = data;
        },
        (error) => {
          console.error(
            'Error al obtener las versiones de reportImports',
            error
          );
        }
      );
  }

  loadReportYears(screenshotValue: string) {
    this.skillsService.getYearsByScreenshot(screenshotValue).subscribe(
      (data) => {
        this.reportYears = data;
      },
      (error) => {
        console.error('Error al obtener los años de reportImports', error);
      }
    );
  }

  onScreenshotChange() {
    if (this.selectedScreenshot.name === 'No') {
      this.screenshotValue = '0';
    } else if (this.selectedScreenshot.name === 'Sí') {
      this.screenshotValue = '1';
    } else if (this.selectedScreenshot.name === 'Todas') {
      this.screenshotValue = '';
    }
    this.loadReportYears(this.screenshotValue.toString());
    this.selectedReportYear = '';
    this.selectedReport = null;
    this.disableVersionDrop = true;
    this.disableYearDrop = false;
  }

  onYearChange() {
    this.loadReportVersionsByYear(
      this.selectedReportYear,
      this.selectedScreenshotOption
    );
    this.disableVersionDrop = false;
  }

  onVersionChange() {
    this.idReport = this.selectedReport.id;
    this.disableButtonSearch = false;
  }

  reloadComponent() {
    if (this.selectedReport) {
      this.load = false;

      this.disableButtonSearch = true;
      this.idReport = this.selectedReport.id;
      this.selectedReportName = this.selectedReport.descripcion;
      this.titleScreenshotChip = this.selectedReport.screenshot;
      this.selectedReportModificationDate =
        this.selectedReport.fechaModificacion;
      this.selectedReportUserName = this.selectedReport.usuario;

      this.loadProfileAndGradesData(this.idReport);

      this.initEM();
      this.initBA();
      this.initAR();
      this.initSE();
      this.initIE();
      this.initArSeDev();
      this.initArSeApi();
      this.initPyramide();

      this.screenshotEnabled = this.selectedReport.screenshot !== 0;
      this.comentarios = this.selectedReport.comentarios || '';
    }
  }

  toggleScreenshot() {
    if (this.selectedReport) {
      this.selectedReport.screenshot = this.screenshotEnabled ? 1 : 0;
      this.hasScreenshotChanged = !this.hasScreenshotChanged;
    }
  }

  updateReport() {
    if (this.hasScreenshotChanged) {
      this.selectedReport.screenshot = this.screenshotEnabled ? 1 : 0;
      this.selectedReport.comentarios = this.comentarios;
      this.selectedReport.usuario = this.userName;
    }

    this.skillsService.updateReport(this.selectedReport).subscribe(
      (updatedReport) => {
        //console.log('Informe actualizado');
      },
      (error) => {
        console.error('Error al actualizar el informe', error);
      }
    );

    this.hasScreenshotChanged = false;
  }

  confirmUpdateReport(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Quiere guardar los cambios?',
      header: 'Confirmación',
      icon: 'pi pi-question-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass:
        'p-button p-button-success p-button-outlined mx-2',
      rejectButtonStyleClass: 'p-button p-button-danger p-button-outlined mx-2',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Se han guardado los cambios',
        });
        this.updateReport();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No se han guardado los cambios',
          life: 3000,
        });
      },
    });
  }

  loadAllLiteralsAndThenLoadData() {
    this.loadAllLiterals().subscribe(
      () => {
        this.loadAllReports();
      },
      (error) => {
        console.error('Error al cargar los literales:', error);
      }
    );
  }

  loadAllLiterals(): Observable<void> {
    return new Observable<void>((observer) => {
      this.skillsService.getAllLiterals().subscribe(
        (data: ColumnDetails[]) => {
          this.literals = data;
          observer.next();
          observer.complete();
        },
        (error) => {
          console.error('Error al obtener los literales:', error);
          observer.error(error);
        }
      );
    });
  }

  loadProfileAndGradesData(idReport): void {
    this.skillsService.getProfileAndGradeTotals(idReport).subscribe(
      (data: ProfilesAndGrades[]) => {
        this.allProfilesAndGrades = data;
        this.EMData = this.allProfilesAndGrades['engagementManagers'];
        this.EMDataTotal = this.EMData[0]['totals'][0];
        this.EMDataOthersTotal = this.EMData[1]['totals'][0];
        this.BAData = this.allProfilesAndGrades['businessAnalyst'];
        this.BADataTotal = this.BAData[0]['totals'][0];
        this.ARData = this.allProfilesAndGrades['architects'];
        let sum = [0, 0, 0];
        this.ARData.forEach((el) => {
          el.totals.forEach((t, i) => {
            sum[i] += t;
          });
        });
        this.ARDataTotal = sum[0];
        this.ARData.push({
          profile: 'Total',
          totals: sum,
        });
        this.SEData = this.allProfilesAndGrades['softwareEngineer'];
        this.SEDataTotal = this.SEData[0]['totals'][0];
        this.IEData = this.allProfilesAndGrades['industryExperts'];
        this.IEDataTotal = this.IEData[0]['totals'][0];
        this.ArSeDevData = this.allProfilesAndGrades['architectsCustomApps'];
        this.ArSeApiData = this.allProfilesAndGrades['architectsIntegration'];
        this.dataGradesRoles = this.allProfilesAndGrades['gradeTotal'];
        let rolesSum = [0, 0, 0, 0, 0];
        this.gradesRoles = this.dataGradesRoles.map((elem) => {
          let lineSum: number = 0;
          elem.totals.forEach((nb, index) => {
            lineSum += nb;
            rolesSum[index] += nb;
          });
          rolesSum[elem.totals.length] += lineSum;
          elem.totals.push(lineSum);
          return { profile: elem.grade, totals: elem.totals };
        });
        this.gradesRoles.push({
          profile: 'Sum',
          totals: rolesSum,
        });

        if (this.EMDataTotal - this.EMDataOthersTotal !== rolesSum[0]) {
          this.isEMDataTotalOK = false;
        }

        if (this.BADataTotal !== rolesSum[2]) {
          this.isBADataTotalOK = false;
        }

        if (this.ARDataTotal !== rolesSum[1]) {
          this.isARDataTotalOK = false;
        }

        if (this.SEDataTotal !== rolesSum[3]) {
          this.isSEDataTotalOK = false;
        }

        console.log(this.isEMDataTotalOK);
        console.log(this.isBADataTotalOK);
        console.log(this.isARDataTotalOK);
        console.log(this.isSEDataTotalOK);

        this.CCATotal =
          this.EMDataTotal +
          this.EMDataOthersTotal +
          this.BADataTotal +
          this.ARDataTotal +
          this.SEDataTotal;

        this.load = true;
      },
      (error) => {
        console.error(
          'Error al obtener los datos para la versión ' + idReport + ':',
          error
        );
      }
    );
  }

  initEM() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Engagement Managers'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.EMText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.EMCol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initBA() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Business Analyst'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.BAText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.BACol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initAR() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Architects'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.ARText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.ARCol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initSE() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Software Engineer'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.SEText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.SECol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initIE() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Industry Experts'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.IEText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.IECol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initArSeDev() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Architects & SE Custom Apps Development'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.ArSeDevText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.ArSeDevCol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initArSeApi() {
    const emLiterals = this.literals.filter(
      (literal) => literal.type === 'Architects & SE Integration & APIs'
    );
    const emTextLiteral = emLiterals.find((literal) => literal.subtype === 't');
    if (emTextLiteral) {
      this.ArSeApiText = emTextLiteral.desc;
    }

    const emColLiterals = emLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (emColLiterals.length > 0) {
      this.ArSeApiCol = emColLiterals.map((literal) => literal.desc);
    }
  }

  initPyramide() {
    const gradeRoleLiterals = this.literals.filter(
      (literal) => literal.type === 'Pyramid Grade-Rol'
    );

    const gradeRoleTextLiteral = gradeRoleLiterals.find(
      (literal) => literal.subtype === 't'
    );
    if (gradeRoleTextLiteral) {
      this.gradeRoleText = gradeRoleTextLiteral.desc;
    }

    const gradeRoleColLiterals = gradeRoleLiterals.filter(
      (literal) => literal.subtype === 'c'
    );
    if (gradeRoleColLiterals.length > 0) {
      this.rolesCol = gradeRoleColLiterals.map((literal) => literal.desc);
      this.rolesCol.unshift('Grade');
      this.rolesCol.push('Total');
    }
  }

  formatTable(data, cols): any {
    let dataTable = [];
    data.forEach((row) => {
      const line: Record<string, string> = {};
      line[cols[0]] = row.profile;
      row.totals.forEach((col, i) => {
        line[cols[i + 1]] = col.toString();
      });
      dataTable.push(line);
    });
    return dataTable;
  }

  exportExcelTotales() {
    let dataTable1 = this.formatTable(this.EMData, this.EMCol);
    let dataTable2 = this.formatTable(this.ARData, this.ARCol);
    let dataTable3 = this.formatTable(this.BAData, this.BACol);
    let dataTable4 = this.formatTable(this.SEData, this.SECol);
    let dataTable5 = this.formatTable(this.IEData, this.IECol);
    let dataTable6 = this.formatTable(this.ArSeDevData, this.ArSeDevCol);
    let dataTable7 = this.formatTable(this.ArSeApiData, this.ArSeApiCol);
    let dataTable8 = this.formatTable(this.gradesRoles, this.rolesCol);

    import('xlsx').then((xlsx) => {
      const worksheet1 = xlsx.utils.json_to_sheet(dataTable1);
      const worksheet2 = xlsx.utils.json_to_sheet(dataTable2);
      const worksheet3 = xlsx.utils.json_to_sheet(dataTable3);
      const worksheet4 = xlsx.utils.json_to_sheet(dataTable4);
      const worksheet5 = xlsx.utils.json_to_sheet(dataTable5);
      const worksheet6 = xlsx.utils.json_to_sheet(dataTable6);
      const worksheet7 = xlsx.utils.json_to_sheet(dataTable7);
      const worksheet8 = xlsx.utils.json_to_sheet(dataTable8);

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet1, 'Engagement Managers');
      xlsx.utils.book_append_sheet(workbook, worksheet2, 'Architects');
      xlsx.utils.book_append_sheet(workbook, worksheet3, 'Business Analyst');
      xlsx.utils.book_append_sheet(workbook, worksheet4, 'Software Engineer');
      xlsx.utils.book_append_sheet(workbook, worksheet5, 'Industry Experts');
      xlsx.utils.book_append_sheet(
        workbook,
        worksheet6,
        'Custom Apps Development'
      );
      xlsx.utils.book_append_sheet(workbook, worksheet7, 'Integration & APIs');
      xlsx.utils.book_append_sheet(workbook, worksheet8, 'Pyramid');
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Informes');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  downloadExcel() {
    if (this.tableList.includes(this.selectedExcel)) {
      const baseUrl: string = environment.server;
      console.log('basr ', baseUrl);
      window.open(
        `${baseUrl}/profile/profilelist/${this.selectedExcel}/excel`,
        '_self'
      );
      this.closeDialog();
    }
  }

  exportExcel() {
    this.skillsService
      .sendToExport(this.selectedExcel, this.idReport)
      .subscribe((result) => {
        this.downloadFile(result, 'application/ms-excel');
      });
  }

  downloadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = this.selectedExcel + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    this.closeDialog();
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.selectedExcel = '';
  }
}
