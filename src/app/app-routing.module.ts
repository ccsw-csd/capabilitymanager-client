import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { LayoutComponent } from './core/views/layout/layout.component';
import { LoginComponent } from './login/views/login/login.component';
import { MaestroComponent } from './skills/maestro/maestro.component';
import { CapabilitiesListComponent } from './skills/capabilities/capabilities-list/capabilities-list.component';
import { StaffingListComponent } from './skills/staffing/staffing-list/staffing-list.component';
import { ReportListComponent } from './skills/report/report-list/report-list.component';
import { CertficationsListComponent } from './skills/certifications/certifications-list/certifications-list.component';
import { PersonalListComponent } from './training/views/personal-list/personal-list.component';
import { ItineraryListComponent } from './training/views/itinerary-list/itinerary-list.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: { credentials: RefreshTokenResolverService },
    children: [
      // { path: 'dashboard', component: MainComponent},
      // { path: 'statistic', component: StatisticComponent },
      {
        path: 'dashboard',
        component: MaestroComponent,
        data: { role: ['CONSULTA'] },
      },
      {
        path: 'training',
        component: PersonalListComponent,
        data: { role: ['CONSULTA'] },
      },
      {
        path: 'itinerary',
        component: ItineraryListComponent,
        data: { role: ['CONSULTA'] },
      },
      {
        path: 'report',
        component: ReportListComponent,
        data: { role: ['CONSULTA'] },
      },
      {
        path: 'capabilities',
        component: CapabilitiesListComponent,
        data: { role: ['CONSULTA'] },
      },
      {
        path: 'staffing',
        component: StaffingListComponent,
        data: { role: ['CONSULTA'] },
      },
      {
        path: 'certifications',
        component: CertficationsListComponent,
        data: { role: ['CONSULTA'] },
      },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
