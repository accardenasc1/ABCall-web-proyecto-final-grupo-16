import { Component, inject } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { Client } from '../models/client';
import { ClientService } from '../client/client.service';

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
    'action'
  ];
  dataSource: User[] = [];
  baseData: User[] = [];
  searchField = new FormControl('');
  readonly dialog = inject(MatDialog);
  clients: Client[] = [];

  constructor(private userService: UserService, private clientService: ClientService) {
    this.onLoad();
  }

  onLoad() {
    this.clientService.get().subscribe(value => {
      this.clients = value;
    });
    this.userService.get().subscribe(value => {
      this.baseData = value;
      this.dataSource = value;
    });
  }

  onSearch() {
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

  onOpenModal(element: User) {
    this.dialog.open(EditModalComponent, {
      width: '600px',
      data: { user: element, clients: this.clients },
    });

    this.dialog.afterAllClosed.subscribe(
      () => this.onLoad()
    );
  }

  getClient(value: string) {
    return this.clients.find(c => c.id === value)?.name;
  }
}
