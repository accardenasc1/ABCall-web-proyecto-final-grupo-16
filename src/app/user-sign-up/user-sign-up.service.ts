import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserSignUpService {

  constructor(private http: HttpClient) { }

  public post(body: User) {
    return this.http.post(`${environment.usersURL}/user`, body);
  }
}
