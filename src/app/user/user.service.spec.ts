import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('UsersService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user', async () => {
    const users = [{
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
    }];
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.get().toPromise();
    const req = httpTesting.expectOne(`${environment.usersURL}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(users);
    expect(await response).toEqual(users);
    httpTesting.verify();
  });

  it('should edit user', async () => {
    const user = {
      id: "d7515355-8e35-11ef-a172-38dead9029f4",
      username: "prueba",
      id_number: '825634951',
      email: "prueba@example.com",
      password: "c893bad68927b457dbed39460e6afd62",
      phone: "+57 321 9876543",
      department: "Cundinamarca",
      city: "Bogotá",
      type: 3,
      client_id: 'd7515355-8e35-11ef-a172-38dead9029f4',
      birthday: "1990-05-15"
    };
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.put(user).toPromise();
    const req = httpTesting.expectOne(`${environment.usersURL}/user`);
    expect(req.request.method).toBe('PUT');
    req.flush(user);
    expect(await response).toEqual(user);
    httpTesting.verify();
  });
});
