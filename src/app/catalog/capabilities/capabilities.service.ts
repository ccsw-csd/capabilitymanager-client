import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Capability } from 'src/app/catalog/capabilities/model/Capability';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CapabilitiesService {
  private baseUrl: string = environment.server;

  constructor(private http: HttpClient) {}

  getAllRoleImportsVersions(): Observable<Capability[]> {
    return this.http.get<Capability[]>(`${this.baseUrl}/roleimports/all`);
  }

  uploadCapability(formData: FormData): Observable<String> {
    console.log('Archivo roles subido');
    return this.http.post<String>(
      environment.server + '/import/data',
      formData
    );
  }

  downloadFile(id: string, filename: string): void {
    const url = `${this.baseUrl}/version-role/download-file/${id}`;

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
