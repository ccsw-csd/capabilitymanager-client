import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Role,
  GradesRole,
  ColumnDetails,
  ProfilesAndGrades,
} from '../interfaces/Capabilities';
import { Report } from 'src/app/skills/report/model/Report';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private readonly baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/role/config`);
  }

  getGradesRoles(idReport: string): Observable<GradesRole[]> {
    const params = new HttpParams().set('idReport', idReport);
    return this.http.get<GradesRole[]>(
      `${this.baseUrl}/grade-role/gradetotals`,
      { params }
    );
  }

  getAllLiterals(): Observable<ColumnDetails[]> {
    return this.http
      .get<ColumnDetails[]>(`${this.baseUrl}/literal/config`)
      .pipe(
        catchError((error) => {
          console.error('Ocurrió un error al obtener los literales:', error);
          return throwError(
            'Error al cargar los literales. Por favor, inténtalo de nuevo más tarde.'
          );
        })
      );
  }

  getProfileAndGradeTotals(idReport: string): Observable<ProfilesAndGrades[]> {
    const params = new HttpParams().set('idReport', idReport);
    return this.http.get<ProfilesAndGrades[]>(
      `${this.baseUrl}/profile/informeRoles`,
      { params }
    );
  }

  getYearsByScreenshot(screenshot?: string): Observable<string[]> {
    let params = new HttpParams();
    if (screenshot !== '') {
      params = params.set('screenshot', screenshot);
    }
    return this.http.get<string[]>(`${this.baseUrl}/reportimports/years`, {
      params,
    });
  }

  getReportByScreenshotAndYear(
    year: string,
    screenshot: string
  ): Observable<Report[]> {
    let params = new HttpParams().set('year', year);
    let url: string;
    if (screenshot === 'all' || screenshot === '0' || screenshot === '1') {
      url = `${this.baseUrl}/reportimports/screenshot/${screenshot}`;
    } else {
      throw new Error("El valor de 'screenshot' debe ser 'all', 0 o 1.");
    }
    return this.http.get<Report[]>(url, { params: params });
  }

  sendToExport(selectedExcel: string, idReport: number): Observable<Blob> {
    const params = new HttpParams().set('idReport', idReport.toString());
    const url = `${this.baseUrl}/profile/profilelist/${selectedExcel}/excel`;
    return this.http.get(url, { params, responseType: 'blob' }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de exportación:', error);
        return throwError(error);
      })
    );
  }

  getReportImportsAvailableYears(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/reportimports/years`);
  }

  getReportImportsVersionsByYear(year: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reportimports/all/${year}`);
  }

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reportimports/all`);
  }

  updateReport(report: Report): Observable<Report> {
    const url = `${this.baseUrl}/reportimports/${report.id}`;
    return this.http.put<Report>(url, report);
  }
}
