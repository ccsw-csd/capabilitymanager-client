import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './statistic/statistic.component';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaestroComponent } from './maestro/maestro.component';
import { TableDetailComponent } from './maestro/table-detail/table-detail.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CapabilitiesListComponent } from './capabilities/capabilities-list/capabilities-list.component';
import { StaffingListComponent } from './staffing/staffing-list/staffing-list.component';
import { ReportListComponent } from './report/report-list/report-list.component';
import { CapabilitiesUploadComponent } from './capabilities/capabilities-upload/capabilities-upload.component';
import { StaffingUploadComponent } from './staffing/staffing-upload/staffing-upload.component';
import { ReportGeneratorComponent } from './report/report-generator/report-generator.component';
import { CertficationsListComponent } from './certifications/certifications-list/certifications-list.component';
import { CertificationsUploadComponent } from './certifications/certifications-upload/certifications-upload.component';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ListboxModule } from 'primeng/listbox';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FileUploadModule } from 'primeng/fileupload';
@NgModule({
  declarations: [StatisticComponent, MaestroComponent, TableDetailComponent,
    CapabilitiesListComponent,
    StaffingListComponent,
    ReportListComponent,
    CapabilitiesUploadComponent,
    StaffingUploadComponent,
    ReportGeneratorComponent,
    CertficationsListComponent,
    CertificationsUploadComponent ],
  imports: [
    CommonModule,
    ChartModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    RadioButtonModule,
    MenuModule,
    DropdownModule,
    CheckboxModule,
    InputSwitchModule,
    ToastModule,
    TooltipModule,
    TabViewModule,
    FormsModule,
    DividerModule,
    AccordionModule,
    ChipModule,
    ConfirmDialogModule,
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
    
  ],
  providers: [ConfirmationService],
})
export class SkillsModule {}
