/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { IncidentDetailService } from './detail-incident.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Incident } from '../models/incident';
import { environment } from '../../environments/environment';

describe('IncidentDetailService', () => {
  let service: IncidentDetailService;
  let httpMock: HttpTestingController;

  const mockIncident: Incident = {
    id_number: 1,
    title: 'Mock Incident',
    type: 1,
    description: 'Test description',
    clientid: 'Client1',
    userid: '1',
    state: 0,
    agentid: '',
    serviceid: '',
    channel: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(IncidentDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return null when no token is available in sessionStorage', () => {
    // Simular que no hay token en sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    const token = service.getToken();

    // Verificar que la función devuelve null cuando no hay token
    expect(token).toBeNull();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('access_token');
  });

  it('should retrieve incident details by id', () => {
    const incidentId = '1';  // ID del incidente que quieres probar

    service.getById(incidentId).subscribe((incident) => {
      expect(incident).toEqual(mockIncident);
    });

    // Simulamos la respuesta HTTP del servicio
    const req = httpMock.expectOne(`${environment.incidentURL}/incident-detail/${incidentId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncident);  // Enviamos el mockIncident como respuesta

    // Verificamos que no haya solicitudes pendientes
    httpMock.verify();
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

  it('getAllClients should return users when token is available', () => {
    const mockToken = 'mockToken';
    const mockClients = [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }];

    spyOn(service, 'getToken').and.returnValue(mockToken); // Simula el método getToken para que devuelva un token

    service.getAllClients().subscribe((response) => {
      expect(response).toEqual(mockClients); // Verifica que la respuesta sea igual a la simulación
    });

    const req = httpMock.expectOne(`${environment.clientsURL}/client`); // Verifica que se realizó una solicitud a la URL esperada
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken'); // Verifica que se envíe el token en los encabezados
    req.flush(mockClients); // Simula una respuesta exitosa de la API
  });

  it('getAllClients should return error when no token is available', () => {
    spyOn(service, 'getToken').and.returnValue(null); // Simula la ausencia de un token

    service.getAllClients().subscribe((response: any) => {
      // Aquí verificamos la respuesta que se espera en caso de error
      expect(response.length).toBe(1);  // Esperamos un array con un solo objeto
      expect(response[0].error).toBeTrue();  // Verificamos que error sea true
      expect(response[0].message).toBe('Error: No se pudo realizar la solicitud porque no hay token.');  // Mensaje de error
    });
  });

});
