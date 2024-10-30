/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Client } from '../models/client';
import { HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  public post(body: Client) {
    const token = this.getToken();
    if (token) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  // Agregar el token al encabezado
        });
        return this.http.post(`${environment.clientsURL}/client`, body, { headers }).pipe();
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
  public assignedClient(body: User){
      return this.http.put(`${environment.usersURL}/client`, body);
  }

}
