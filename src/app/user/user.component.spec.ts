import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { User } from '../models/user';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { ClientService } from '../client/client.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UsersComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  const mockUserService = {
    get: () => {
      return of([
        {
            "id": "d7515355-8e35-11ef-a172-38dead9029f4",
            "username": "prueba",
            "id_number": 825634951,
            "email": "prueba@example.com",
            "password": "c893bad68927b457dbed39460e6afd62",
            "phone": "+57 321 9876543",
            "department": "Cundinamarca",
            "city": "Bogotá",
            "type": 0,
            "client_id": null,
            "birthday": "1990-05-15"
        },
        {
            "id": "ea4ff2aa-8e35-11ef-bbe5-38dead9029f4",
            "username": "prueba2",
            "id_number": 825634952,
            "email": "prueba2@example.com",
            "password": "c893bad68927b457dbed39460e6afd62",
            "phone": "+57 321 9876543",
            "department": "Cundinamarca",
            "city": "Bogotá",
            "type": 3,
            "client_id": "a8d601c6-8e65-11ef-bb9d-38dead9029f4",
            "birthday": "1990-05-15"
        }
    ]);
    },
    post: (data: User) => {
      return of(data);
    }
  };

  const mockClientService = {
    get: () => {
      return of([
        {
            "id": "a8d601c6-8e65-11ef-bb9d-38dead9029f4",
            "name": "Amazon",
            "nit": 1234567890,
            "email": "prueba@example.com",
            "phone": "+57 321 9876543",
            "department": "Cundinamarca",
            "city": "Bogotá"
        },
        {
            "id": "c1256c47-8e65-11ef-8073-38dead9029f4",
            "name": "Avianca",
            "nit": 1234567891,
            "email": "prueb1a@example.com",
            "phone": "+57 321 9876543",
            "department": "Cundinamarca",
            "city": "Bogotá"
        }
      ]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [UserComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ClientService, useValue: mockClientService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load data', () => {
    expect(component).toBeTruthy();
    expect(component.baseData.length).toBe(2);
    expect(component.dataSource.length).toBe(2);
    expect(component.clients.length).toBe(2);
  });

  it('should Search', () => {
    component.searchField.setValue('prueba2');
    expect(component.baseData.length).toBe(2);
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].username).toBe('prueba2');
  });

  it('should get Client', () => {
    const client = component.getClient('c1256c47-8e65-11ef-8073-38dead9029f4');
    expect(client).toBe('Avianca');
  });
});
