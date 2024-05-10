import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { PickListModule } from 'primeng/picklist';

import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';
import { NavComponent } from './views/layout/nav/nav.component';
import { ColumnConfigComponent } from './views/column-config/column-config.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    NavComponent,
    ColumnConfigComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DynamicDialogModule,
    SidebarModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    MenuModule,
    PickListModule,
    PanelMenuModule,
    OverlayPanelModule,
    DividerModule,
  ],
})
export class CoreModule {}
