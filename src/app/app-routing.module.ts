import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { LayoutComponent } from './core/views/layout/layout.component';
import { LoginComponent } from './login/views/login/login.component';
import { MaestroComponent } from './skills/maestro/maestro.component';
import { CapabilitiesListComponent } from './catalog/capabilities/capabilities-list/capabilities-list.component';
import { StaffingListComponent } from './catalog/staffing/staffing-list/staffing-list.component';
import { ReportListComponent } from './catalog/report/report-list/report-list.component';
import { CertficationsListComponent } from './catalog/certifications/certifications-list/certifications-list.component';
import { PersonalListComponent } from './training/personal-list/personal-list.component';
import { ItineraryListComponent } from './training/itinerary-list/itinerary-list.component';
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
        data: { role: ['DASHBOARD'] },
      },
      {
        path: 'training',
        component: PersonalListComponent,
        data: { role: ['DASHBOARD'] },
      },
      {
        path: 'itinerary',
        component: ItineraryListComponent,
        data: { role: ['DASHBOARD'] },
      },
      {
        path: 'report',
        component: ReportListComponent,
        data: { role: ['DASHBOARD'] },
      },
      {
        path: 'capabilities',
        component: CapabilitiesListComponent,
        data: { role: ['DASHBOARD'] },
      },
      {
        path: 'staffing',
        component: StaffingListComponent,
        data: { role: ['DASHBOARD'] },
      },
      {
        path: 'certifications',
        component: CertficationsListComponent,
        data: { role: ['DASHBOARD'] },
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
