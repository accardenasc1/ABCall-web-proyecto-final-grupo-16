import { TestBed } from '@angular/core/testing';

import { ClientService } from './client.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get client', async () => {
    const clients = [{
      id: "a8d601c6-8e65-11ef-bb9d-38dead9029f4",
      name: "Amazon",
      nit: '1234567890',
      email: "prueba@example.com",
      phone: "+57 321 9876543",
      department: "Cundinamarca",
      city: "Bogotá"
    }];
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.get().toPromise();
    const req = httpTesting.expectOne(`${environment.clientsURL}/client`);
    expect(req.request.method).toBe('GET');
    req.flush(clients);
    expect(await response).toEqual(clients);
    httpTesting.verify();
  });
});
