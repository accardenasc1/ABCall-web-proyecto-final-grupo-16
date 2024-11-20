/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Incident } from '../models/incident';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentResponseService {

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  public getById(incidentId: string | null): Observable<Incident> {
    return this.http.get<Incident>(`${environment.incidentURL}/incident-detail/${incidentId}`);
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

  public getAllClients(): Observable<any[]> {
    const token = this.getToken();
    if (token) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  // Agregar el token al encabezado
        });
        return this.http.get<any[]>(`${environment.clientsURL}/client`, { headers });
    } else {
        console.error('Error: No se pudo realizar la solicitud porque no hay token.');
        // Lanzar un error controlado
        //return throwError(new Error('No hay token disponible para realizar la solicitud.'));
        return of([{ error: true, message: 'Error: No se pudo realizar la solicitud porque no hay token.' }]);
    }
  }
  public getResponse(titulo: string | null, tipo: number | null): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const body = {
        titulo: titulo,
        tipo: tipo
      };

      return this.http.post<any>(`${environment.incidentURL}/response-indicent`, body, { headers });
    } else {
      console.error('Error: No se pudo realizar la solicitud porque no hay token.');
      return of([{ error: true, message: 'Error: No se pudo realizar la solicitud porque no hay token.' }]);
    }
  }

}
