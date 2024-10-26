import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IncidentService } from './incident.service';
import { Incident } from '../models/incident';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpTestingController: HttpTestingController;

  const mockIncident: Incident = {
    title: 'Mock Incident',
    description: 'Test description',
    clientid: 'Client1',
    state: null,
    agentid: 'Agent1',
    serviceid: 'Service1',
    userid: 1,
    type: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IncidentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IncidentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all incidents', () => {
    const mockIncidents: Incident[] = [mockIncident];

    service.getAll().subscribe((incidents) => {
      expect(incidents.length).toBe(1);
      expect(incidents).toEqual(mockIncidents);
    });

    const req = httpTestingController.expectOne(`${environment.incidentURL}/incident`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidents);
  });

  it('should fetch incidents by role', () => {
    const mockIncidents: Incident[] = [mockIncident];

    service.getByRole(1, 1).subscribe((incidents) => {
      expect(incidents.length).toBe(1);
      expect(incidents).toEqual(mockIncidents);
    });

    const req = httpTestingController.expectOne(`${environment.incidentURL}/incident-role/1/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIncidents);
  });

  it('should handle error when fetching all incidents', () => {
    service.getAll().subscribe(
      () => fail('should have failed with the 500 error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne(`${environment.incidentURL}/incident`);
    expect(req.request.method).toBe('GET');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when fetching incidents by role', () => {
    service.getByRole(1, 1).subscribe(
      () => fail('should have failed with the 500 error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne(`${environment.incidentURL}/incident-role/1/1`);
    expect(req.request.method).toBe('GET');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });
});