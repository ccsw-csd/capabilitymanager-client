import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certifications } from './Model/certifications.model';

@Injectable({
  providedIn: 'root',
})
export class CertificationsService {
  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getAllCertificationsImportsVersions(): Observable<Certifications[]> {
    return this.http.get<Certifications[]>(`${this.baseUrl}/certificates/all`);
  }

  uploadCertifications(formData: FormData): Observable<String> {
    console.log('Archivo Certifications subido');
    return this.http.post<String>(
      environment.server + '/import/data',
      formData
    );
  }

  downloadFile(id: string, filename: string): void {
    const url = `${this.baseUrl}/version-certificaciones/download-file/${id}`;

    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    this.http.get(url, httpOptions).subscribe((response: Blob) => {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    });
  }
}
