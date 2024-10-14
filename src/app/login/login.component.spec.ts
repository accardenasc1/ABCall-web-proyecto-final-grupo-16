import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { of, throwError } from 'rxjs';
import { BaseResponse } from '../models/base-response';
import { Login } from '../models/login';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        LoginService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with username and password fields', () => {
    const username = component.loginForm.get('username');
    const password = component.loginForm.get('password');
    expect(username).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it('should display error message on invalid login', () => {
    spyOn(loginService, 'login').and.returnValue(throwError({ status: 401 }));
    component.loginForm.setValue({ username: 'test', password: 'wrong' });
    component.onLogInUser();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Nombre de usuario o contraseña incorrectos');
  });

  it('should navigate to home on successful login', () => {
    const mockResponse: BaseResponse<Login> = {
      status: 200,
      data: { access_token: 'test-token', usuario: null },
      message: null
    };
    spyOn(loginService, 'login').and.returnValue(of(mockResponse));
    spyOn(loginService, 'saveToken');

    component.loginForm.setValue({ username: 'test', password: 'test' });
    component.onLogInUser();
    fixture.detectChanges();

    expect(loginService.saveToken).toHaveBeenCalledWith('test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/app/home']);
  });
});