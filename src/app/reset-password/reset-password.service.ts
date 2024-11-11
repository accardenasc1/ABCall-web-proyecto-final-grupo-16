import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  public post(body: { email:  string | null | undefined; }) {
    return this.http.post(`${environment.usersURL}/reset`, body);
  }

  public put(body: { code: string | null | undefined; password: string | null | undefined; }) {
    return this.http.put(`${environment.usersURL}/reset`, body);
  }
}
