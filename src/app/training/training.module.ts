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

@NgModule({
  declarations: [PersonalListComponent, ItineraryListComponent],
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
