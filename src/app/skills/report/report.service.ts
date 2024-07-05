import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Report } from './model/Report';
import { environment } from 'src/environments/environment';
import { Capability } from '../capabilities/model/Capability';
import { Staffing } from '../staffing/model/staffing.model';
import { Certifications } from '../certifications/Model/certifications.model';
import { ReportVersion } from './model/ReportVersion';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getAllReportVersions(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reportimports/all`);
  }

  getAllRoleImportsVersions(): Observable<Capability[]> {
    return this.http.get<Capability[]>(`${this.baseUrl}/roleimports/all`);
  }

  getAllStaffingImportsVersions(): Observable<Staffing[]> {
    return this.http.get<Staffing[]>(`${this.baseUrl}/staffingimports/all`);
  }

  getAllCertificatesImportsVersions(): Observable<Certifications[]> {
    return this.http.get<Certifications[]>(`${this.baseUrl}/certificates/all`);
  }

  generateReport(reportVersion: any): Observable<ReportVersion> {
    const url = `${this.baseUrl}/reportimports/generate-report`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ReportVersion>(url, reportVersion, { headers });
  }
}
