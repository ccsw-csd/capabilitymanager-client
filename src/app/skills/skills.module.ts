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

@NgModule({
  declarations: [StatisticComponent, MaestroComponent, TableDetailComponent ],
  imports: [
    CommonModule,
    ChartModule,
    ButtonModule,
    TableModule,
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
    FormsModule,
    DividerModule,
    AccordionModule,
    ChipModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
})
export class SkillsModule {}
