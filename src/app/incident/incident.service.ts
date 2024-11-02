import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Incident } from '../models/incident';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incidentUrl = environment.incidentURL;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Incident[]> {
    return this.http.get<Incident[]>(
      `${this.incidentUrl}/incident`
    );
  }
  getByRole(userId: number | null | undefined, role: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(
      `${this.incidentUrl}/incident-role/${userId}/${role}`
    );
  }
}
