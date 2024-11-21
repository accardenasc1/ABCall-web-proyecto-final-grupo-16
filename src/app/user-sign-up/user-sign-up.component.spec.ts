/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignUpComponent } from './user-sign-up.component';
import { UserSignUpService } from './user-sign-up.service';
import { User } from '../models/user';
import { of, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from '@dchtools/ngx-loading-v18';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Colombia } from './colombia';

describe('UserSignUpComponent', () => {
  let component: UserSignUpComponent;
  let fixture: ComponentFixture<UserSignUpComponent>;

  const mockUserSignUpService = {
    post: (data: User) => {
      return of(data);
    }
  };

  const mockRouter = {
    navigate: (commands: any[]) => {
      return Promise.resolve(commands ? true : false);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSignUpComponent],
      imports: [
        CommonModule,
        MatCardModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserSignUpService, useValue: mockUserSignUpService },
        { provide: Router, useValue: mockRouter },
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to login', () => {
    const service = fixture.debugElement.injector.get(Router);
    const serviceSpy = spyOn(service, 'navigate');
    component.goToLogin();
    expect(serviceSpy).toHaveBeenCalledWith(['/', 'login']);
  });

  it('should save', () => {
    const data = {...component.userForm.value, type: 1} as User;
    const service = fixture.debugElement.injector.get(UserSignUpService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(of(data));
    component.save();
    const today = new Date();
    const birthday = today.getDate()  + '/' + (today.getMonth() + 1) + '/' +  today.getFullYear();
    expect(serviceSpy).toHaveBeenCalledWith({...data, birthday: birthday});
    expect(component.done).toBeTruthy();
  });

  it('should not save with invalid username', () => {
    const data = {...component.userForm.value, type: 1} as User;
    const service = fixture.debugElement.injector.get(UserSignUpService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(throwError(() => {
      return {
        error: 'invalid username'
      };
    }));

    component.save();
    const today = new Date();
    const birthday = today.getDate()  + '/' + (today.getMonth() + 1) + '/' +  today.getFullYear();
    expect(serviceSpy).toHaveBeenCalledWith({...data, birthday: birthday});
    expect(component.done).toBeFalsy();
    expect(component.userForm.hasError('invalid_username')).toBeTruthy();
  });

  it('should not save with invalid id_number', () => {
    const data = {...component.userForm.value, type: 1} as User;
    const service = fixture.debugElement.injector.get(UserSignUpService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(throwError(() => {
      return {
        error: 'invalid id_number'
      };
    }));

    component.save();
    const today = new Date();
    const birthday = today.getDate()  + '/' + (today.getMonth() + 1) + '/' +  today.getFullYear();
    expect(serviceSpy).toHaveBeenCalledWith({...data, birthday: birthday});
    expect(component.done).toBeFalsy();
    expect(component.userForm.hasError('invalid_id_number')).toBeTruthy();
  });

  it('should not save with invalid email', () => {
    const data = {...component.userForm.value, type: 1} as User;
    const service = fixture.debugElement.injector.get(UserSignUpService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(throwError(() => {
      return {
        error: 'invalid email'
      };
    }));

    component.save();
    const today = new Date();
    const birthday = today.getDate()  + '/' + (today.getMonth() + 1) + '/' +  today.getFullYear();
    expect(serviceSpy).toHaveBeenCalledWith({...data, birthday: birthday});
    expect(component.done).toBeFalsy();
    expect(component.userForm.hasError('invalid_email')).toBeTruthy();
  });

  it('should select deparment', () => {
    let value = 'Amazonas';
    let department = Colombia.find(d => d.departamento === value) ?? Colombia[0]
    component.selectDeparment(value);
    expect(component.department).toBe(department);
    expect(component.userForm.get('city')?.value).toBe('Leticia');

    value = 'Antioquia';
    department = Colombia.find(d => d.departamento === value) ?? Colombia[0]
    component.selectDeparment(value);
    expect(component.department).toBe(department);
    expect(component.userForm.get('city')?.value).toBe('Abejorral');
  });

  it('should validate password', () => {
    const passwordA = 'Qwerty123*#';
    let passwordB = 'Otro123*#';
    component.userForm.get('password')?.setValue(passwordA)
    component.userForm.get('confirmPassword')?.setValue(passwordB)
    component.validatePassword();
    expect(component.userForm.hasError('confirmedError')).toBeTruthy();

    passwordB = passwordA;
    component.userForm.get('confirmPassword')?.setValue(passwordB)
    component.validatePassword();
    expect(component.userForm.hasError('confirmedError')).toBeFalsy();
  });

  it('should be valid', () => {

    component.userForm.setValue({
      username: 'test01',
      first_name: 'Humberto Enrique',
      last_name: 'Maury Maury',
      id_number: '1234567890',
      email: 'test@test.com',
      password: 'Qwerty123*#',
      confirmPassword: 'Qwerty123*#',
      department: 'Amazonas',
      city: 'Leticia',
      address: 'Calle 1 # 1 - 123',
      phone: '+57 3013122123',
      birthday: new Date(),
      dataCheck: true,
    });
    const valid = component.isValid();
    expect(valid).toBeTruthy();

  });
});
