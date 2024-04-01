import { Component, Input } from '@angular/core';
import { InformeTotal } from 'src/app/core/interfaces/Capabilities';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.scss'],
})
export class TableDetailComponent {
  @Input() data: InformeTotal[];
  @Input() columnas: string[];
  @Input() text: string;
  @Input() extraHeader: string;
  @Input() isEMDataTotalOK: boolean;
  @Input() isBADataTotalOK: boolean;
  @Input() isARDataTotalOK: boolean;
  @Input() isSEDataTotalOK: boolean;

  constructor() {
    
  }

  getTotalIndex(): number {
    let ind = this.columnas.findIndex((e) => e.toLowerCase() == 'total');
    return ind - 1;
  }

  isTotal(col): boolean {
    if (['total', 'sum'].includes(col.toLowerCase())) return true;
    return false;
  }
}
