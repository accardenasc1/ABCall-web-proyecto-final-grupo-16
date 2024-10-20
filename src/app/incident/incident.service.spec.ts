import { TestBed } from '@angular/core/testing';
import { IncidentService } from './incident.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Service: Incident', () => {
  let service: IncidentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(IncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
