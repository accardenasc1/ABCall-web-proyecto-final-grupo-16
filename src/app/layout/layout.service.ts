/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  getUser(): any {
    return JSON.parse(sessionStorage.getItem('user')?.toString() ?? '');
  }
}
