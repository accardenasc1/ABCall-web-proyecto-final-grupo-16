/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Incident } from '../models/incident';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  public post(body: Incident) {
    const token = this.getToken();
    if (token) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  // Agregar el token al encabezado
        });
        return this.http.post(`${environment.incidentURL}/incident`, body, { headers }).pipe(
            catchError(error => {
                // Manejar errores relacionados con la autenticación o el token
                if (error.status === 401) {
                    // Token no válido o expirado
                    console.error('Token no válido o expirado. Por favor, inicie sesión de nuevo.');
                    // Aquí podrías redirigir al usuario a la página de inicio de sesión o manejar el estado de la aplicación

                }

                return of([{ error: true, message:'Token no válido o expirado. Por favor, inicie sesión de nuevo.'}]);

            })
        );
    } else {
        console.error('Error: No se pudo realizar la solicitud porque no hay token.');
        // Lanzar un error controlado
        //return throwError(new Error('No hay token disponible para realizar la solicitud.'));
        return of([{ error: true, message:'Error: No se pudo realizar la solicitud porque no hay token.'}]);
    }
  }
  public user_token(){
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  // Agregar el token al encabezado
      });
      return this.http.get(`${environment.usersURL}/login`, { headers });
    }else{
        return of([{ error: true, message: 'Error al validar token' }]);
      }
  }
  public getAllUsers(): Observable<any[]> {
    const token = this.getToken();
    if (token) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  // Agregar el token al encabezado
        });
        return this.http.get<any[]>(`${environment.usersURL}/user`, { headers });
    } else {
        console.error('Error: No se pudo realizar la solicitud porque no hay token.');
        // Lanzar un error controlado
        //return throwError(new Error('No hay token disponible para realizar la solicitud.'));
        return of([{ error: true, message: 'Error: No se pudo realizar la solicitud porque no hay token.' }]);
    }
  }

}