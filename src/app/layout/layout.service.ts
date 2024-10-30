import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  getUser(): User | undefined {
    const data = sessionStorage.getItem('user');
    return data ? JSON.parse(data) : undefined;
  }
}
