import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModalComponent } from './edit-modal.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../models/user';
import { of, throwError } from 'rxjs';
import { UserService } from '../user.service';

describe('EditModalComponent', () => {
  let component: EditModalComponent;
  let fixture: ComponentFixture<EditModalComponent>;

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
    put: (data: User) => {
      return of(data);
    }
  };

  const mockData = {
    user: {
      id: "d7515355-8e35-11ef-a172-38dead9029f4",
      username: "prueba",
      id_number: '825634951',
      email: "prueba@example.com",
      password: "c893bad68927b457dbed39460e6afd62",
      phone: "+57 321 9876543",
      department: "Cundinamarca",
      city: "Bogotá",
      type: 0,
      client_id: null,
      birthday: "1990-05-15"
    },
    clients: [{
      id: "a8d601c6-8e65-11ef-bb9d-38dead9029f4",
      name: "Amazon",
      nit: '1234567890',
      email: "prueba@example.com",
      phone: "+57 321 9876543",
      department: "Cundinamarca",
      city: "Bogotá"
    }]
  }

  const modalMock = {
    close: (): void => {
      return;
    }
  }

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
      declarations: [EditModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: modalMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: UserService, useValue: mockUserService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const data = component.userForm.value;
    expect(component).toBeTruthy();
    expect(data.id).toBe(mockData.user.id);
    expect(data.username).toBe(mockData.user.username);
    expect(data.type).toBe(mockData.user.type);
    expect(data.client_id).toBe(mockData.user.client_id);
  });

  it('should save', () => {
    const data = mockData.user;
    const service = fixture.debugElement.injector.get(UserService);
    const serviceSpy = spyOn(service, 'put').and.returnValue(of(data));
    component.onSave();
    expect(serviceSpy).toHaveBeenCalledWith(data);
  });

  it('should not save with invalid client', () => {
    const data = mockData.user;
    const service = fixture.debugElement.injector.get(UserService);
    const serviceSpy = spyOn(service, 'put').and.returnValue(throwError(() => {
      return {
        error: 'invalid client'
      };
    }));

    component.onSave();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.userForm.hasError('invalid_client')).toBeTruthy();
  });
});
