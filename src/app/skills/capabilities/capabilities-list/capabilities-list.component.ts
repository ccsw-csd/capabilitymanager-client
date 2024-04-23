import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CapabilitiesService } from '../capabilities.service';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Capability } from '../model/Capability';
import { ColumnConfigComponent } from 'src/app/core/views/column-config/column-config.component';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
import { CapabilitiesUploadComponent } from '../capabilities-upload/capabilities-upload.component';

@Component({
  selector: 'app-capabilities-list',
  templateUrl: './capabilities-list.component.html',
  styleUrls: ['./capabilities-list.component.scss'],
  providers: [
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
    ConfirmationService,
  ],
})
export class CapabilitiesListComponent implements OnInit {
  @ViewChild(Table) table: Table;
  @ViewChildren('filterDropdown') filterDropdowns!: QueryList<Dropdown>;

  columnNames: any[];
  selectedColumnNames: any[];
  changeCols: boolean = false;
  tableWidth: string;
  defaultFilters: any = {};
  totalCapabilities: number;
  capabilitiesToExport: Capability[];
  capabilities: Capability[];

  constructor(
    private capabilitiesService: CapabilitiesService,
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

  loadData() {
    this.capabilitiesService
      .getAllRoleImportsVersions()
      .subscribe((capabilities) => {
        //console.log(capabilities);
        this.capabilities = capabilities;
        this.totalCapabilities = capabilities.length;
        this.setDefaultFilters();
      });
  }

  loadSelected(): any[] {
    let selectedColumnNames: any = localStorage.getItem(
      'capabilitiesListColumns'
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

  onYearChange() {
    this.loadData();
  }

  onFilter(event) {
    this.capabilitiesToExport = event.filteredValue;
  }

  saveSelected(selectedColumnNames: any[]) {
    localStorage.setItem(
      'capabilityListColumns',
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

  downloadCapability(id: string): void {
    const capability = this.capabilities.find(
      (capability) => capability.id === Number(id)
    );

    if (capability && capability.descripcion) {
      const fileName = capability.descripcion;
      this.capabilitiesService.downloadFile(id, fileName);
    } else {
      const defaultFileName = 'Archivo_Roles_id_' + id;
      this.capabilitiesService.downloadFile(id, defaultFileName);
    }
  }

  importRolesFile(): void {
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
}
