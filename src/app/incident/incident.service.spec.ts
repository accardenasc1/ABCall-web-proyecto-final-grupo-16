import { TestBed } from '@angular/core/testing';

import { IncidentService } from './incident.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Incident } from '../models/incident';
import { environment } from '../../environments/environment';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

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

    const incident: Incident = {
      title: 'Test Incident',
      type: 1,
      description: 'This is a test',
      clientid: 'client_123',
      iduser: 1
    };

    service.post(incident).subscribe();

    // Verificar que se hizo la solicitud correcta con los headers esperados
    const req = httpMock.expectOne(`${environment.incidentURL}/incident`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mocked_token');
    req.flush(incident);  // Simular respuesta de la API
  });

  it('should throw an error if no token is available when calling post', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null); // Simular que no hay token
    const incident: Incident = {
      title: 'Test Incident',
      type: 1,
      description: 'This is a test',
      clientid: 'client_123',
      iduser: 1
    };

    service.post(incident).subscribe(
      () => fail('Expected an error, but got success'),
      error => {
        expect(error.message).toBe('No hay token disponible para realizar la solicitud.');
      }
    );
  });

  it('should return null when no token is available in sessionStorage', () => {
    // Simular que no hay token en sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    const token = service.getToken();

    // Verificar que la función devuelve null cuando no hay token
    expect(token).toBeNull();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('access_token');
  });



});
