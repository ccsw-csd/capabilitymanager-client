import { Component, Input } from '@angular/core';
import { Person } from '../../models/Person';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss'],
})
export class PersonalEditComponent {
  @Input() person: Person;
  display = true;

  constructor(public dialogRef: DynamicDialogRef) {}

  closeWindow(): void {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {}
}
