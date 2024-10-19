import { Component } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  displayedColumns: string[] = [
    'username',
    'id_number',
    'email',
    'phone',
    'department',
    'city',
    'type',
    'client_id',
    'birthday',
  ];
  dataSource: User[] = [];
  baseData: User[] = [];
  searchField = new FormControl('');

  constructor(private userService: UserService) {
    userService.get().subscribe(value => {
      this.baseData = value;
      this.dataSource = value;
    });
  }

  search() {
    const value = this.searchField.value;
    if (value === '' || value == null) {
      this.dataSource = this.baseData;
      return;
    }

    const lower_value = value.toLocaleLowerCase();
    this.dataSource = this.baseData.filter(x =>
      x.username?.toLocaleLowerCase().includes(lower_value) ||
      x.id_number?.toString().includes(lower_value) ||
      x.email?.toLocaleLowerCase().includes(lower_value)
    );
  }
}
