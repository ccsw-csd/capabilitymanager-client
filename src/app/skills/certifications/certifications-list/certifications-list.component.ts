import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CertificationsService } from '../certifications.service';
import { ColumnConfigComponent } from 'src/app/core/views/column-config/column-config.component';
import { SortEvent } from 'primeng/api';
import {} from 'primeng/dynamicdialog';
import { Certifications } from '../Model/certifications.model';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { CertificationsUploadComponent } from '../certifications-upload/certifications-upload.component';

@Component({
  selector: 'app-certifications-list',
  templateUrl: './certifications-list.component.html',
  styleUrls: ['./certifications-list.component.scss'],
})
export class CertficationsListComponent {
  @ViewChild(Table) table: Table;
  @ViewChildren('filterDropdown') filterDropdowns!: QueryList<Dropdown>;
  certifications: Certifications[];
  tableWidth: string;
  defaultFilters: any = {};
  selectedColumnNames: any[];
  columnNames: any[];
  years: number[];
  selectedYear: number;
  totalCertifications: number;
  certificationsToExport: Certifications[];

  constructor(
    private certificationsService: CertificationsService,
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
        header: 'Descripción',
        composeField: 'descripcion',
        field: 'descripcion',
        filterType: 'input',
      },
      {
        header: 'Fecha de Importación',
        composeField: 'fechaImportacion',
        field: 'fechaImportacion',
        filterType: 'input',
      },
      {
        header: 'Tipo Interfaz',
        composeField: 'idTipoInterfaz',
        field: 'idTipoInterfaz',
        filterType: 'input',
      },
      {
        header: 'NºRegistros',
        composeField: 'numRegistros',
        field: 'numRegistros',
        filterType: 'input',
      },
      {
        header: 'Usuario',
        composeField: 'usuario',
        field: 'usuario',
        filterType: 'input',
      },
      {
        header: 'Título',
        composeField: 'nombreFichero',
        field: 'nombreFichero',
        filterType: 'input',
      },
    ];

    this.selectedColumnNames = this.loadSelected();
    this.loadData();
  }

  isColumnVisible(field: string): boolean {
    return this.selectedColumnNames.some((column) => column.field === field);
  }

  loadSelected(): any[] {
    let selectedColumnNames: any = localStorage.getItem(
      'certificationsListColumns'
    );
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

  loadData() {
    this.certificationsService
      .getAllCertificationsImportsVersions()
      .subscribe((certification) => {
        this.certifications = certification;
        this.totalCertifications = certification.length;
        this.setDefaultFilters();
      });
  }

  importCertificatesFile(): void {
    const dialogRef = this.dialogService.open(CertificationsUploadComponent, {
      header: 'Importar archivo de Certificaciones',
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

  onFilter(event) {
    this.certificationsToExport = event.filteredValue;
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

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
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

  saveSelected(selectedColumnNames: any[]) {
    localStorage.setItem(
      'certificationsListColumns',
      JSON.stringify(selectedColumnNames.map((e) => e.header))
    );
  }

  onColReorder(event): void {
    this.saveSelected(this.columnNames);
  }

  onYearChange() {
    this.loadData();
  }

  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }

  downloadCertifications(id: string): void {
    const certifications = this.certifications.find(
      (certification) => certification.id === Number(id)
    );

    if (certifications && certifications.descripcion) {
      const fileName = `${certifications.descripcion.replace(
        /[^a-zA-Z0-9]/g,
        '_'
      )}.xlsx`;
      this.certificationsService.downloadFile(id, fileName);
    } else {
      const defaultFileName = 'Archivo_Certifications_id_' + id;
      this.certificationsService.downloadFile(id, defaultFileName);
    }
  }
}
