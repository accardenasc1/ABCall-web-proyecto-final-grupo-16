import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlBoardComponent } from './control-board.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IncidentService } from '../incident/incident.service';
import { LayoutService } from '../layout/layout.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { State } from '../models/state';
import { Type } from '../models/type';
import { Channel } from '../models/channel';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('ControlBoardComponent', () => {
  let component: ControlBoardComponent;
  let fixture: ComponentFixture<ControlBoardComponent>;

  const mockIncidentService = {
    getByRole: () => of([
      { state: State.Open, createdAt: '2023-01-01T00:00:00', type: Type.Other, channel: Channel.Web },
      { state: State.Closed, createdAt: '2023-02-01T00:00:00', type: Type.Techincal, channel: Channel.Email },
      { state: State.InProgress, createdAt: '2023-03-01T00:00:00', type: Type.Users, channel: Channel.Mobile },
      { state: State.Canceled, createdAt: '2023-04-01T00:00:00', type: Type.Software, channel: Channel.Web }
    ])
  };

  const mockLayoutService = {
    getUser: () => ({ id: 1, client_id: "1", type: Role.Client } as User)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlBoardComponent],
      imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: LayoutService, useValue: mockLayoutService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch incidents on init', () => {
    component.ngOnInit();
    expect(component.incidents.length).toBe(4);
  });

  it('should update charts on date change', () => {
    spyOn(component, 'updateCharts');
    component.startDate = new Date('2023-01-01');
    component.endDate = new Date('2023-03-01');
    component.onDateChange();
    expect(component.updateCharts).toHaveBeenCalled();
  });

  it('should destroy charts before updating', () => {
    component.destroyCharts();
    spyOn(component, 'destroyCharts');
    component.updateCharts([]);
    expect(component.destroyCharts).toHaveBeenCalled();
  });

  it('should create pie chart', () => {
    spyOn(component, 'createPieChart');
    component.updateCharts(component.incidents);
    expect(component.createPieChart).toHaveBeenCalled();
  });

  it('should create bar chart', () => {
    spyOn(component, 'createBarChart');
    component.updateCharts(component.incidents);
    expect(component.createBarChart).toHaveBeenCalled();
  });

  it('should create type bar chart', () => {
    spyOn(component, 'createTypeBarChart');
    component.updateCharts(component.incidents);
    expect(component.createTypeBarChart).toHaveBeenCalled();
  });
});