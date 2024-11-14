/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetPasswordComponent } from './reset-password.component';
import { of, throwError } from 'rxjs';
import { ResetPasswordService } from './reset-password.service';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  const mockResetPasswordService = {
    post: (body: { email:  string | null | undefined; }) => {
      return of(body);
    },
    put: (body: { code: string | null | undefined; password: string | null | undefined; }) => {
      return of(body);
    }
  };

  const mockRouter = {
    navigate: (commands: any[]) => {
      return Promise.resolve(commands ? true : false);
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: ResetPasswordService, useValue: mockResetPasswordService },
        { provide: Router, useValue: mockRouter },
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
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

  it('should validate password', () => {
    const passwordA = 'Qwerty123*#';
    let passwordB = 'Otro123*#';
    component.sent = true;
    component.resetForm.get('password')?.setValue(passwordA)
    component.resetForm.get('confirmPassword')?.setValue(passwordB)
    fixture.detectChanges();
    component.validatePassword();
    expect(component.resetForm.hasError('confirmedError')).toBeTruthy();

    passwordB = passwordA;
    component.resetForm.get('confirmPassword')?.setValue(passwordB)
    component.validatePassword();
    expect(component.resetForm.hasError('confirmedError')).toBeFalsy();
  });

  it('should be valid email', () => {
    component.codeForm.setValue({
      email: 'test01@test.com'
    });
    const valid = component.isCodeValid();
    expect(valid).toBeTruthy();
  });

  it('should be valid code and password', () => {
    component.resetForm.setValue({
      code: 'test01',
      password: 'Qwerty123*#',
      confirmPassword: 'Qwerty123*#'
    });
    const valid = component.isValid();
    expect(valid).toBeTruthy();
  });

  it('should sendCode', () => {
    component.sent = false;
    component.done = false;
    component.codeForm.get('email')?.setValue("test@test.com")
    fixture.detectChanges();
    const data = { email: component.codeForm.value.email };
    const service = fixture.debugElement.injector.get(ResetPasswordService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(of(data));
    component.sendCode();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.sent).toBeTruthy();
  });

  it('should save', () => {
    component.sent = true;
    component.done = false;
    component.resetForm.get('code')?.setValue("test10");
    component.resetForm.get('password')?.setValue("Qwerty123*#")
    component.resetForm.get('confirmPassword')?.setValue("Qwerty123*#")
    fixture.detectChanges();
    const data = {code: "test10", password: "Qwerty123*#"};
    const service = fixture.debugElement.injector.get(ResetPasswordService);
    const serviceSpy = spyOn(service, 'put').and.returnValue(of(data));
    component.save();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.done).toBeTruthy();
  });

  it('should save invalid code', () => {
    component.sent = true;
    component.done = false;
    component.resetForm.get('code')?.setValue("nocode");
    component.resetForm.get('password')?.setValue("Qwerty123*#")
    component.resetForm.get('confirmPassword')?.setValue("Qwerty123*#")
    fixture.detectChanges();
    const data = {code: "nocode", password: "Qwerty123*#"};
    const service = fixture.debugElement.injector.get(ResetPasswordService);
    const serviceSpy = spyOn(service, 'put').and.returnValue(throwError(() => {
      return {
        error: 'invalid username'
      };
    }));

    component.save();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.done).toBeFalsy();
    expect(component.resetForm.hasError('invalid_code')).toBeTruthy();
  });
});
