import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BaseResponse } from '../models/base-response';
import { Login } from '../models/login';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private backendUrl = environment.usersURL;
  constructor(private http: HttpClient) {}

  login(
    value: Partial<{ username: string | null; password: string | null }>
  ): Observable<BaseResponse<Login>> {
    return this.http.post<BaseResponse<Login>>(
      `${this.backendUrl}/login`,
      value
    );
  }

  saveToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  saveUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
}
