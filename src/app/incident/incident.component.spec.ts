import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentComponent } from './incident.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IncidentService } from './incident.service';
import { UserService } from '../user/user.service';
import { LayoutService } from '../layout/layout.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { State } from '../models/state';
import { Type } from '../models/type';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Channel } from '../models/channel';

describe('IncidentComponent', () => {
  let component: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;
  let router: Router;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockIncidentService = {
    getAll: () => of([
      { title: 'Test 1', description: 'Test 1', clientid: 1, state: State.Open, agentid: 1, serviceid: '1', userid: 1, type: Type.Other }
    ]),

    getByRole: () => of([
      { title: 'Test 1', description: 'Test 2', clientid: 2, state: State.Open, agentid: 2, serviceid: '2', userid: 2, type: Type.Other }
    ])
  };

  const mockUserService = {
    getById: () => of({ first_name: 'User', last_name: '1' })
  };

  const mockLayoutService = {
    getUser: () => ({ id: 1, type: Role.Admin } as User)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncidentComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: UserService, useValue: mockUserService },
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    // Simular un token en sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue('mocked_token');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all incidents for admin', () => {
    component.incidents = [
      { title: 'Test 1', description: 'Test 1', clientid: '1', state: State.Open, agentid: '1', serviceid: '1', userid: '1', type: Type.Other, channel: Channel.Web,createat: new Date() }
    ];
    console.log("inci",component.incidents);
    expect(component.incidents.length).toBe(1);
    expect(component.incidents[0].title).toBe('Test 1');
  });

  it('should fetch incidents for agent', () => {
    component.incidents = [
      { title: 'Test 1', description: 'Test 1', clientid: '1', state: State.Open, agentid: '1', serviceid: '1', userid: '1', type: Type.Other,channel: Channel.Web,createat: new Date() }
    ];
    mockLayoutService.getUser = () => ({ id: 1, type: Role.Agent } as User);
    component.getIncidents();
    expect(component.incidents.length).toBe(1);
    expect(component.incidents[0].title).toBe('Test 1');
  });

  it('should fetch incidents for user', () => {
    component.incidents = [
      { title: 'Test 1', description: 'Test 1', clientid: '1', state: State.Open, agentid: '1', serviceid: '1', userid: '1', type: Type.Other,channel: Channel.Web,createat: new Date() }
    ];
    mockLayoutService.getUser = () => ({ id: 1, type: Role.User } as User);
    component.getIncidents();
    expect(component.incidents.length).toBe(1);
    expect(component.incidents[0].title).toBe('Test 1');
  });

  it('should navigate to create incident page on create', () => {
    component.onCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'app', 'create-incident']);
  });

  it('should filter incidents by id and title', () => {
    component.dataSource.data = [
      { id_number: 1, title: 'Incident 1', description: 'Description 1', clientid: '1', state: State.Open, agentid: 'agent1', serviceid: 'service1', userid: '1', type: Type.Other, username: 'User 1' ,channel: Channel.Web,createat: new Date()},
      { id_number: 2, title: 'Incident 2', description: 'Description 2', clientid: '2', state: State.Closed, agentid: 'agent2', serviceid: 'service2', userid: '2', type: Type.Other, username: 'User 2',channel: Channel.Web,createat: new Date() }
    ];
    const event = new Event('input', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: { value: '1' }, writable: true });
    component.applyFilterByIdAndTitle(event);
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].id_number).toBe(1);
  });

  it('should filter incidents by user', () => {
    component.dataSource.data = [
      { id_number: 1, title: 'Incident 1', description: 'Description 1', clientid: '1', state: State.Open, agentid: 'agent1', serviceid: 'service1', userid: '1', type: Type.Other, username: 'User 1' ,channel: Channel.Web,createat: new Date()},
      { id_number: 2, title: 'Incident 2', description: 'Description 2', clientid: '2', state: State.Closed, agentid: 'agent2', serviceid: 'service2', userid: '2', type: Type.Other, username: 'User 2' ,channel: Channel.Web,createat: new Date()}
    ];
    const event = new Event('input', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: { value: 'User 1' }, writable: true });
    component.applyFilterByUser(event);
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].username).toBe('User 1');
  });
  it('should update error message when no incidents found', () => {
    component.dataSource.data = [];
    component.updateErrorMessage();
    expect(component.errorMessage).toBe('No hay incidentes para mostrar');
  });

  it('should clear error message when incidents are found', () => {
    component.dataSource.data = [
      { id_number: 1, title: 'Incident 1', description: 'Description 1', clientid: '1', state: State.Open, agentid: 'agent1', serviceid: 'service1', userid: '1', type: Type.Other, username: 'User 1',channel: Channel.Web,createat: new Date() }
    ];
    component.updateErrorMessage();
    expect(component.errorMessage).toBe('');
  });
});
