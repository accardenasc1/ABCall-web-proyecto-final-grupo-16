/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { IncidentService } from './create-incident.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Incident } from '../models/incident';
import { environment } from '../../environments/environment';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

  const mockIncident: Incident = {
    id_number: 1,
    title: 'Mock Incident',
    type: 1,
    description: 'Test description',
    clientid: 'Client1',
    userid: 1,
    state: 0,
    agentid: '',
    serviceid: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(IncidentService);
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

    service.post(mockIncident).subscribe();

    // Verificar que se hizo la solicitud correcta con los headers esperados
    const req = httpMock.expectOne(`${environment.incidentURL}/incident`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mocked_token');
    req.flush(mockIncident);  // Simular respuesta de la API
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

  it('getAllUsers should return users when token is available', () => {
    const mockToken = 'mockToken';
    const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

    spyOn(service, 'getToken').and.returnValue(mockToken); // Simula el método getToken para que devuelva un token

    service.getAllUsers().subscribe((response) => {
      expect(response).toEqual(mockUsers); // Verifica que la respuesta sea igual a la simulación
    });

    const req = httpMock.expectOne(`${environment.usersURL}/user`); // Verifica que se realizó una solicitud a la URL esperada
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken'); // Verifica que se envíe el token en los encabezados
    req.flush(mockUsers); // Simula una respuesta exitosa de la API
  });

  it('getAllUsers should return error when no token is available', () => {
    spyOn(service, 'getToken').and.returnValue(null); // Simula la ausencia de un token

    service.getAllUsers().subscribe((response: any) => {
      // Aquí verificamos la respuesta que se espera en caso de error
      expect(response.length).toBe(1);  // Esperamos un array con un solo objeto
      expect(response[0].error).toBeTrue();  // Verificamos que error sea true
      expect(response[0].message).toBe('Error: No se pudo realizar la solicitud porque no hay token.');  // Mensaje de error
    });
  });


});
