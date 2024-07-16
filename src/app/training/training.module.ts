import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalListComponent } from './views/personal-list/personal-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ItineraryListComponent } from './views/itinerary-list/itinerary-list.component';
import { ItineraryEditComponent } from './views/itinerary-edit/itinerary-edit.component';
import { ItineraryInsertComponent } from './views/itinerary-insert/itinerary-insert.component';
import { ItineraryUploadComponent } from './views/itinerary-upload/itinerary-upload.component';
import { PersonalEditComponent } from './views/personal-edit/personal-edit.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    PersonalListComponent,
    ItineraryListComponent,
    ItineraryEditComponent,
    ItineraryInsertComponent,
    ItineraryUploadComponent,
    PersonalEditComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule,
    DynamicDialogModule,
    FormsModule,
    MultiSelectModule,
    DialogModule,
    FileUploadModule,
  ],
  providers: [DialogService],
})
export class TrainingModule {}
