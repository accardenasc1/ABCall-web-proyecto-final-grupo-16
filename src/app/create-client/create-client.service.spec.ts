/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { ClientService } from './create-client.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  const mockClient: Client = {
    name: 'Mock Client',
    nit: '908654321',
    email: 'client@client.com',
    phone: '3124567890',
    department: 'Bogotá D.c.',
    city: 'Bogotá D.c.',
    address: 'Calle 19 No 11 33'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request with the correct headers when token is available', () => {
    // Simular un token en sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue('mocked_token');

    service.post(mockClient).subscribe();

    // Verificar que se hizo la solicitud correcta con los headers esperados
    const req = httpMock.expectOne(`${environment.clientsURL}/client`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mocked_token');
    req.flush(mockClient);  // Simular respuesta de la API
  });

  it('should return null when no token is available in sessionStorage', () => {
    // Simular que no hay token en sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    const token = service.getToken();

    // Verificar que la función devuelve null cuando no hay token
    expect(token).toBeNull();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('access_token');
  });

  it('should return token assigned to user', () => {
    const mockToken = 'mockToken';
    spyOn(service, 'getToken').and.returnValue(mockToken); // Simula el método getToken para que devuelva un token

    service.user_token().subscribe(response => {
      expect(response).toBeTruthy(); // Verifica que la respuesta no sea nula
    });

    const req = httpMock.expectOne(`${environment.usersURL}/login`); // Verifica que se realizó una solicitud a la URL esperada
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken'); // Verifica que se envíe el token en los encabezados

    req.flush({ status: 200, statusText: 'Token válido' }); // Simula una respuesta exitosa de la API
  });

  it('should return error token assigned to user', () => {
    spyOn(service, 'getToken').and.returnValue(null);
    service.user_token().subscribe((response: any) => {
        // Aquí verificamos la respuesta que se espera en caso de error 401
        expect(response.length).toBe(1);  // Esperamos un array con un solo objeto
        expect(response[0].error).toBeTrue();  // Verificamos que error sea true
        expect(response[0].message).toBe('Error al validar token');  // Mensaje de error
    });
  });

  it('should send a PUT request to assignedClient and return the response', () => {
    const mockUser: User = { /* Aquí debes incluir los campos de User */ };
    const mockResponse = { success: true }; // Simula la respuesta que esperas

    service.assignedClient(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Expect a request to be made
    const req = httpMock.expectOne(`${environment.usersURL}/client`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser); // Verifica que el cuerpo de la solicitud sea el correcto

    // Responde con datos simulados
    req.flush(mockResponse);
  });

});
