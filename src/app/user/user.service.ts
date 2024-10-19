import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.usersURL;
  constructor(private http: HttpClient) {}

  get(): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.url}/user`
    );
  }
}
