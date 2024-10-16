import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Injectable,
} from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { ColumnConfigComponent } from 'src/app/core/views/column-config/column-config.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
import { Itinerary } from '../../models/Itinerary';
import { ItineraryService } from '../../services/itinerary.service';
import { ConfirmationService } from 'primeng/api';
import { ItineraryEditComponent } from '../itinerary-edit/itinerary-edit.component';
import { ItineraryUploadComponent } from '../itinerary-upload/itinerary-upload.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ItineraryInsertComponent } from '../itinerary-insert/itinerary-insert.component';

@Component({
  selector: 'app-personal-list',
  templateUrl: './itinerary-list.component.html',
  styleUrls: ['./itinerary-list.component.scss'],
  providers: [DialogService],
})
export class ItineraryListComponent implements OnInit {
  @ViewChild(Table) table: Table;
  @ViewChildren('filterDropdown') filterDropdowns!: QueryList<Dropdown>;
  userName = '';
  columnNames: any[];
  selectedColumnNames: any[];
  tableWidth: string;
  defaultFilters: any = {};
  totalItineraries: number;
  personsToExport: Itinerary[];
  itineraries: Itinerary[];
  selectedItinerary: Itinerary;

  constructor(
    private itineraryService: ItineraryService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userName = this.authService.userInfoSSO.displayName;
    this.columnNames = [
      {
        header: 'Código',
        composeField: 'codigo',
        field: 'codigo',
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
      ['codigo', 'name'].includes(column.field)
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

  onFilter(event: any) {
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
        this.defaultFilters[column.composeField] = {
          value: '',
          matchMode: 'contains',
        };
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

  editItinerary(codigo: string) {
    const itineraryToEdit = this.itineraries.find(
      (itinerary) => itinerary.codigo === codigo
    );
    if (itineraryToEdit) {
      console.log('Editar itinerario con codigo:', codigo);
      console.log('Datos del itinerario:', itineraryToEdit);
      // Abrir el diálogo de edición del itinerario
      const ref = this.dialogService.open(ItineraryInsertComponent, {
        header: 'Editar Itinerario',
        width: '35%',
        closable: false,
        data: {
          itinerary: itineraryToEdit,
        },
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
      });

      // Quitar el foco del botón de edición
      const activeElement = document.activeElement as HTMLElement;
      activeElement.blur();

      ref.onClose.subscribe((result: any) => {
        if (result) {
          console.log('Itinerario editado:', result);
          this.loadData();
        }
      });
    } else {
      console.error('No se encontró ningún itinerario con el codigo:', codigo);
    }
  }

  createItinerary() {
    console.log('Crear nuevo itinerario');
    const ref = this.dialogService.open(ItineraryInsertComponent, {
      header: 'Crear Itinerario',
      width: '35%',
      closable: false,
      data: {
        itinerary: { codigo: '', name: '', usuario: this.userName },
      },
    });

    ref.onClose.subscribe((newItinerary: Itinerary | null) => {
      if (newItinerary) {
        console.log('Nuevo itinerario creado:', newItinerary);
      } else {
        console.log('Se canceló la creación del itinerario');
      }
    });
  }

  confirmDeleteItinerary(id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que quieres eliminar este itinerario?',
      header: 'Confirmación',
      icon: 'pi pi-question-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button p-button-danger p-button-outlined mx-2',
      rejectButtonStyleClass: 'p-button p-button-info p-button-outlined mx-2',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Se ha borrado el itinerario',
        });
        this.deleteItinerary(id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'No se ha borrado el itinerario',
          life: 3000,
        });
      },
    });
  }

  importItinerarioFile(): void {
    console.log('Botón importar itinerario');
    const dialogRef = this.dialogService.open(ItineraryUploadComponent, {
      header: 'Importar archivo de Itinerario',
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

  deleteItinerary(id: string) {
    this.itineraryService.deleteItinerary(id).subscribe(
      () => {
        // Actualizar la lista de itinerarios
        this.itineraries = this.itineraries.filter(
          (itinerary) => itinerary.codigo !== id
        );
        this.loadData();
      },
      (error) => {
        // Manejar el error si ocurre
        console.error(`Error al eliminar el itinerario con id ${id}:`, error);
      }
    );
  }
  onPageChange(event) {
    const currentPage = event.page + 1;
    console.log('Página actual:', currentPage);
  }
}
