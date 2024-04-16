import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ColumnConfigComponent } from 'src/app/core/views/column-config/column-config.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
import { Itinerary } from '../../models/Itinerary';
import { ItineraryService } from '../../services/itinerary.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-personal-list',
  templateUrl: './itinerary-list.component.html',
  styleUrls: ['./itinerary-list.component.scss'],
  providers: [DialogService],
})
export class ItineraryListComponent implements OnInit {
  @ViewChild(Table) table: Table;
  @ViewChildren('filterDropdown') filterDropdowns!: QueryList<Dropdown>;

  columnNames: any[];
  selectedColumnNames: any[];
  tableWidth: string;
  defaultFilters: any = {};
  totalItineraries: number;
  personsToExport: Itinerary[];
  itineraries: Itinerary[];

  constructor(
    private itineraryService: ItineraryService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.columnNames = [
      {
        header: 'Código',
        composeField: 'id',
        field: 'id',
        filterType: 'input',
      },
      {
        header: 'Nombre',
        composeField: 'name',
        field: 'name',
        filterType: 'input',
      },
    ];

    this.selectedColumnNames = this.columnNames.filter((column) =>
      ['id', 'name'].includes(column.field)
    );
    this.loadData();
  }

  loadData() {
    this.itineraryService.getAllItineraries().subscribe((itineraries) => {
      this.itineraries = itineraries;
      this.totalItineraries = itineraries.length;
      this.setDefaultFilters();
    });
  }

  loadSelected(): any[] {
    let selectedColumnNames: any = localStorage.getItem('itineraryListColumns');
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
    this.personsToExport = event.filteredValue;
  }

  saveSelected(selectedColumnNames: any[]) {
    localStorage.setItem(
      'itineraryListColumns',
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

  editItinerary(id: string) {
    const itineraryToEdit = this.itineraries.find(
      (itinerary) => itinerary.id === id
    );

    if (itineraryToEdit) {
      console.log('Editar itinerario con ID:', id);
      console.log('Datos del itinerario:', itineraryToEdit);
    } else {
      console.error('No se encontró ningún itinerario con el ID:', id);
    }
  }

  createItinerary() {
    console.log('Crear nuevo itinerario');
  }

  confirmDeleteItinerary(id: string) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este itinerario?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItinerary(id);
      },
    });
  }

  deleteItinerary(id: string) {
    console.log('Eliminar itinerario con ID:', id);
  }
}
