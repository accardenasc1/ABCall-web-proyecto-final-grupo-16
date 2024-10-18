/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  user: any;

  constructor(private router: Router, private layoutService: LayoutService) {
    this.user = layoutService.getUser().user;
    console.log(this.user);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }
}
