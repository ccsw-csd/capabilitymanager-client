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
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/Person';
import { PersonalEditComponent } from '../personal-edit/personal-edit.component';

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
        header: 'Categoría',
        composeField: 'categoria',
        field: 'categoria',
        filterType: 'input',
      },
      {
        header: 'Centro',
        composeField: 'centro',
        field: 'centro',
        filterType: 'input',
      },
      {
        header: 'Rol',
        composeField: 'rol',
        field: 'rol',
        filterType: 'input',
      },
      {
        header: 'Perfil Técnico',
        composeField: 'perfilTecnico',
        field: 'perfilTecnico',
        filterType: 'input',
      },
      {
        header: 'Primary Skill',
        composeField: 'primarySkill',
        field: 'primarySkill',
        filterType: 'input',
      },
      {
        header: 'Estado',
        composeField: 'status',
        field: 'status',
        filterType: 'input',
      },
      {
        header: 'Fecha de Inicio de Asignación',
        composeField: 'fechaInicioAsignacion',
        field: 'fechaInicioAsignacion',
        filterType: 'input',
      },
      {
        header: 'Inglés Escrito',
        composeField: 'inglesEscrito',
        field: 'inglesEscrito',
        filterType: 'input',
      },
      {
        header: 'Inglés Hablado',
        composeField: 'inglesHablado',
        field: 'inglesHablado',
        filterType: 'input',
      },
      {
        header: 'Jornada',
        composeField: 'jornada',
        field: 'jornada',
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
        'ggid',
        'nombre',
        'apellidos',
        'categoria',
        'rol',
        'perfilTecnico',
        'primarySkill',
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

  editPerson(person?: Person) {
    let header = person ? 'Modificar Persona' : 'Nueva Persona';
    const ref = this.dialogService.open(PersonalEditComponent, {
      width: '50vw',
      data: {
        person: person,
      },
      closable: false,
      showHeader: true,
      header: header,
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) this.personService.getAllPersons();
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
