import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReportService } from '../report.service';
import { Dropdown } from 'primeng/dropdown';
import { Table } from 'primeng/table';
import { Report } from 'src/app/catalog/report/model/Report';
import { ColumnConfigComponent } from 'src/app/core/views/column-config/column-config.component';
import { SortEvent } from 'primeng/api/sortevent';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CapabilitiesUploadComponent } from '../../capabilities/capabilities-upload/capabilities-upload.component';
import { StaffingUploadComponent } from '../../staffing/staffing-upload/staffing-upload.component';
import { ReportGeneratorComponent } from '../report-generator/report-generator.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent {
  @ViewChild(Table) table: Table;
  @ViewChildren('filterDropdown') filterDropdowns!: QueryList<Dropdown>;

  columnNames: any[];
  selectedColumnNames: any[];
  changeCols: boolean = false;
  tableWidth: string;
  defaultFilters: any = {};
  totalReports: number;
  reportsToExport: Report[];
  reports: Report[];

  constructor(
    private reportService: ReportService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.columnNames = [
      {
        header: 'Versión',
        composeField: 'id',
        field: 'id',
        filterType: 'input',
      },
      {
        header: 'Archivo Capacidades',
        composeField: 'roleVersion',
        field: 'roleVersion',
        filterType: 'input',
      },
      {
        header: 'Archivo Staffing',
        composeField: 'staffingVersion',
        field: 'staffingVersion',
        filterType: 'input',
      },
      {
        header: 'Screenshot',
        composeField: 'screenshot',
        field: 'screenshot',
        filterType: 'input',
      },
      {
        header: 'Fecha de Generación',
        composeField: 'fechaImportacion',
        field: 'fechaImportacion',
        filterType: 'input',
      },
      {
        header: 'Descripción',
        composeField: 'descripcion',
        field: 'descripcion',
        filterType: 'input',
      },
      {
        header: 'Usuario',
        composeField: 'usuario',
        field: 'usuario',
        filterType: 'input',
      },
      {
        header: 'Fecha de Modificación',
        composeField: 'fechaModificacion',
        field: 'fechaModificacion',
        filterType: 'input',
      },
      {
        header: 'Comentarios',
        composeField: 'comentarios',
        field: 'comentarios',
        filterType: 'input',
      },
    ];

    this.selectedColumnNames = this.loadSelected();
    this.loadData();
  }

  importRolesFile(): void {
    console.log('Botón importar roles');
    const dialogRef = this.dialogService.open(CapabilitiesUploadComponent, {
      header: 'Importar archivo de Roles',
      width: '50%',
      closable: false,
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        console.log('Archivo subido:', result);
      } else {
        console.log('Archivo no subido.');
      }
    });
  }

  importStaffingFile(): void {
    console.log('Botón importar staffing');
    const dialogRef = this.dialogService.open(StaffingUploadComponent, {
      header: 'Importar archivo de Staffing',
      width: '50%',
      closable: false,
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        console.log('Archivo subido:', result);
      } else {
        console.log('Archivo no subido.');
      }
    });
  }

  importCertificatesFile(): void {
    console.log('Botón importar certificados');
    /* const dialogRef = this.dialogService.open(StaffingUploadComponent, {
      header: 'Importar archivo de Staffing',
      width: '50%',
      closable: false,
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        console.log('Archivo subido:', result);
      } else {
        console.log('Archivo no subido.');
      }
    }); */
  }

  generateReport(): void {
    const dialogRef = this.dialogService.open(ReportGeneratorComponent, {
      header: 'Generar Informe modelo de capacidades',
      width: '1000px',
      height: '400px',
      closable: false,
    });
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        console.log('Archivo generado correctamente:', result);
        this.loadData();
      } else {
        console.log('Archivo no generado.');
      }
    });
  }

  loadData() {
    this.reportService.getAllReportVersions().subscribe((reports) => {
      this.reports = reports;
      this.totalReports = reports.length;
      this.setDefaultFilters();
    });
  }

  loadSelected(): any[] {
    let selectedColumnNames: any = localStorage.getItem('reportListColumns');
    if (selectedColumnNames == null) return this.columnNames;

    selectedColumnNames = JSON.parse(selectedColumnNames);

    let columns: any[] = [];
    selectedColumnNames.forEach((item) => {
      let filterColumn = this.columnNames.filter(
        (column) => column.header == item
      );
      columns = columns.concat(filterColumn);
    });

    return columns;
  }

  onFilter(event) {
    this.reportsToExport = event.filteredValue;
  }

  saveSelected(selectedColumnNames: any[]) {
    localStorage.setItem(
      'reportListColumns',
      JSON.stringify(selectedColumnNames.map((e) => e.header))
    );
  }

  isColumnVisible(field: string): boolean {
    return this.selectedColumnNames.some((column) => column.field === field);
  }

  showConfig() {
    const ref = this.dialogService.open(ColumnConfigComponent, {
      width: '50vw',
      data: {
        columns: this.columnNames,
        selected: this.selectedColumnNames,
      },
      closable: false,
      showHeader: true,
      autoZIndex: true,
      header: 'Configuración de la tabla',
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        this.selectedColumnNames = result;
        this.saveSelected(result);
      }
    });
  }

  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }

  onColReorder(event): void {
    this.saveSelected(this.columnNames);
  }

  setDefaultFilters() {
    this.defaultFilters = {};

    this.columnNames.forEach((column) => {
      if (column.filterType === 'input') {
        this.defaultFilters[column.composeField] = { value: '' };
      }
    });
  }

  setFilters(): void {
    this.setDefaultFilters();
  }

  cleanFilters(): void {
    this.table.clear();
    this.setFilters();
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = this.getData(data1, event.field);
      let value2 = this.getData(data2, event.field);
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else if (Array.isArray(value1) && Array.isArray(value2)) {
        result = value1
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((t) => t.name)
          .join(', ')
          .localeCompare(
            value2
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => t.name)
              .join(', ')
          );
      } else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  getData(data, att) {
    let atts = att.split('.');
    atts.forEach((a) => {
      if (data[a] != undefined) {
        data = data[a];
      } else {
        return null;
      }
    });
    return data;
  }
}
