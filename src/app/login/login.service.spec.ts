import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../models/base-response';
import { Login } from '../models/login';
import { provideHttpClient } from '@angular/common/http';
import { User } from '../models/user';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and return a token', () => {
    const mockResponse: BaseResponse<Login> = {
      status: 200,
      data: { access_token: 'test-token', user: { } },
      message: null
    };

    service.login({ username: 'test', password: 'test' }).subscribe(response => {
      expect(response.status).toBe(200);
      expect(response.data?.access_token).toBe('test-token');
    });

    const req = httpMock.expectOne(`${environment.usersURL}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should save token in sessionStorage', () => {
    const token = 'test-token';
    service.saveToken(token);
    expect(sessionStorage.getItem('access_token')).toBe(token);
  });

  it('should save user in sessionStorage', () => {
    const user: User = {
      username: 'prueba',
      id: 1,
      type: 1
    };
    service.saveUser(user);
    expect(sessionStorage.getItem('user')).toBe(JSON.stringify(user));
  });
});
