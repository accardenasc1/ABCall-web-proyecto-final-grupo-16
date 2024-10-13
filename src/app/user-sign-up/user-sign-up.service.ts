import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserSignUpService {

  constructor(private http: HttpClient) { }

  public get() {
    return this.http.get(`${environment.usersURL}/ping`);
  }

  public post(body: User) {
    return this.http.post(`${environment.usersURL}/user`, body);
  }
}
