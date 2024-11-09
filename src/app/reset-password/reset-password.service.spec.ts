import { TestBed } from '@angular/core/testing';

import { ResetPasswordService } from './reset-password.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(ResetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request code', async () => {
    const data = { email: 'test' };
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.post(data).toPromise();
    const req = httpTesting.expectOne(`${environment.usersURL}/reset`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
    expect(await response).toEqual(data);
    httpTesting.verify();
  });

  it('should request code', async () => {
    const data = { code: 'test', password: '123' };
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.put(data).toPromise();
    const req = httpTesting.expectOne(`${environment.usersURL}/reset`);
    expect(req.request.method).toBe('PUT');
    req.flush(data);
    expect(await response).toEqual(data);
    httpTesting.verify();
  });
});
