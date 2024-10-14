import { TestBed } from '@angular/core/testing';

import { UserSignUpService } from './user-sign-up.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { User } from './user';
import { environment } from '../../environments/environment';

describe('UserSignUpService', () => {
  let service: UserSignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(UserSignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request user sign up', async () => {
    const user = { username: 'test' } as User;
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.post(user).toPromise();
    const req = httpTesting.expectOne(`${environment.usersURL}/user`);
    expect(req.request.method).toBe('POST');
    req.flush(user);
    expect(await response).toEqual(user);
    httpTesting.verify();
  });
});
