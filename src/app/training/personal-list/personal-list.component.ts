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
import { PersonService } from '../services/person.service';
import { Person } from '../models/Person';

@Component({
  selector: 'app-personal-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss'],
  providers: [DialogService],
})
export class PersonalListComponent implements OnInit {
  @ViewChild(Table) table: Table;
  @ViewChildren('filterDropdown') filterDropdowns!: QueryList<Dropdown>;

  columnNames: any[];
  selectedColumnNames: any[];
  tableWidth: string;
  defaultFilters: any = {};
  totalPersons: number;
  personsToExport: Person[];
  persons: Person[];

  constructor(
    private personService: PersonService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.columnNames = [
      {
        header: 'Saga',
        composeField: 'saga',
        field: 'saga',
        filterType: 'input',
      },
      {
        header: 'GGID',
        composeField: 'ggid',
        field: 'ggid',
        filterType: 'input',
      },
      {
        header: 'Nombre',
        composeField: 'nombre',
        field: 'nombre',
        filterType: 'input',
      },
      {
        header: 'Apellidos',
        composeField: 'apellidos',
        field: 'apellidos',
        filterType: 'input',
      },
      {
        header: 'Práctica',
        composeField: 'practica',
        field: 'practica',
        filterType: 'input',
      },
      {
        header: 'Grado',
        composeField: 'grado',
        field: 'grado',
        filterType: 'input',
      },
      {
        header: 'Categoría',
        composeField: 'categoria',
        field: 'categoria',
        filterType: 'input',
      },
      {
        header: 'Perfil Técnico',
        composeField: 'perfilTecnico',
        field: 'perfilTecnico',
        filterType: 'input',
      },
      {
        header: 'Fecha de Incorporación',
        composeField: 'fechaIncorporacion',
        field: 'fechaIncorporacion',
        filterType: 'input',
      },
      {
        header: 'Asignación',
        composeField: 'asignacion',
        field: 'asignacion',
        filterType: 'input',
      },
      {
        header: 'Estado',
        composeField: 'status',
        field: 'status',
        filterType: 'input',
      },
      {
        header: 'Cliente Actual',
        composeField: 'clienteActual',
        field: 'clienteActual',
        filterType: 'input',
      },
      {
        header: 'Fecha de Inicio de Asignación',
        composeField: 'fechaInicioAsignacion',
        field: 'fechaInicioAsignacion',
        filterType: 'input',
      },
      {
        header: 'Fecha de Fin de Asignación',
        composeField: 'fechaFinAsignacion',
        field: 'fechaFinAsignacion',
        filterType: 'input',
      },
      {
        header: 'Fecha de Disponibilidad',
        composeField: 'fechaDisponibilidad',
        field: 'fechaDisponibilidad',
        filterType: 'input',
      },
      {
        header: 'Posición en Proyecto Futuro',
        composeField: 'posicionProyectoFuturo',
        field: 'posicionProyectoFuturo',
        filterType: 'input',
      },
      {
        header: 'Colaboraciones',
        composeField: 'colaboraciones',
        field: 'colaboraciones',
        filterType: 'input',
      },
      {
        header: 'Proyecto Anterior',
        composeField: 'proyectoAnterior',
        field: 'proyectoAnterior',
        filterType: 'input',
      },
      {
        header: 'Meses en Bench',
        composeField: 'mesesBench',
        field: 'mesesBench',
        filterType: 'input',
      },
    ];

    this.selectedColumnNames = this.columnNames.filter((column) =>
      [
        'saga',
        'nombre',
        'apellidos',
        'categoria',
        'perfilTecnico',
        'status',
        'mesesBench',
      ].includes(column.field)
    );
    this.loadData();
  }

  loadData() {
    this.personService.getAllPersons().subscribe((persons) => {
      this.persons = persons;
      this.totalPersons = persons.length;
      this.setDefaultFilters();
    });
  }

  loadSelected(): any[] {
    let selectedColumnNames: any = localStorage.getItem('personListColumns');
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
      'personListColumns',
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
}
