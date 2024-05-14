import { Component, Input } from '@angular/core';
import { Person } from '../../models/Person';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent {
  @Input() person: Person;

  closeWindow(): void {
    
  }

}
