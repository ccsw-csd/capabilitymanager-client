import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token: string | null = this.auth.getSSOToken();

    if (token != null) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage;
          switch (error.status) {
            case 400:
              errorMessage = 'Error de usuario: ' + error.error;
              break;
            case 401:
            case 403:
              this.auth.logout();
              errorMessage = 'Token expirado.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 415:
              errorMessage = 'No se ha enviado un elemento válido.';
              break;
            case 422:
              if(error.error.message == null){
                errorMessage = 'No se puede procesar el elemento enviado.';
              }else{
                errorMessage = error.error.message;
              }
              break;
            case 500:
              errorMessage = 'Se ha producido un error del servidor. Por favor, póngase en contacto con un administrador. Disculpe las molestias.';
              break;
            default:
              if(error.error.message == null){
                errorMessage = 'Se ha producido un error. Por favor, inténtelo de nuevo.';
              }
              else{
                errorMessage = error.error.message
              }
          }
          return throwError(() => new Error(errorMessage));
        })
      );
    }

    return next.handle(req);
  }
}
