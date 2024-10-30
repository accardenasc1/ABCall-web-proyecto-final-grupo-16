import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './layout.service';
import { User } from '../models/user';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  user: User | undefined;

  constructor(private router: Router, private layoutService: LayoutService) {
    this.user = layoutService.getUser();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }
}
