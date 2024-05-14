import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalListComponent } from './views/personal-list/personal-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ItineraryListComponent } from './views/itinerary-list/itinerary-list.component';
import { ItineraryEditComponent } from './views/itinerary-edit/itinerary-edit.component';
import { PersonalEditComponent } from './views/personal-edit/personal-edit.component';

@NgModule({
  declarations: [
    PersonalListComponent,
    ItineraryListComponent,
    ItineraryEditComponent,
    PersonalEditComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DynamicDialogModule,
    FormsModule,
    MultiSelectModule,
  ],
})
export class TrainingModule {}
