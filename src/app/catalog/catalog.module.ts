import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffingListComponent } from './staffing/staffing-list/staffing-list.component';
import { CapabilitiesListComponent } from './capabilities/capabilities-list/capabilities-list.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ReportListComponent } from './report/report-list/report-list.component';
import { CapabilitiesUploadComponent } from './capabilities/capabilities-upload/capabilities-upload.component';
import { StaffingUploadComponent } from './staffing/staffing-upload/staffing-upload.component';
import { ReportGeneratorComponent } from './report/report-generator/report-generator.component';
import { DropdownModule } from 'primeng/dropdown';
import { CertficationsListComponent } from './certifications/certifications-list/certifications-list.component';


@NgModule({
  declarations: [
    CapabilitiesListComponent,
    StaffingListComponent,
    ReportListComponent,
    CapabilitiesUploadComponent,
    StaffingUploadComponent,
    ReportGeneratorComponent,
    CertficationsListComponent
    
  ],
  imports: [
    CommonModule,
    TableModule,
    AutoCompleteModule,
    ListboxModule,
    TableModule,
    ToastModule,
    DynamicDialogModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    TabViewModule,
    InputSwitchModule,
    ScrollPanelModule,
    FileUploadModule,
    DropdownModule
  ],
})
export class CatalogModule {}
