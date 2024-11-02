/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateClientComponent } from './create-client.component';
import { ClientService } from './create-client.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from '@dchtools/ngx-loading-v18';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../models/client';
import { Colombia } from '../user-sign-up/colombia';
import { LayoutService } from '../layout/layout.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateClientComponent', () => {
  let component: CreateClientComponent;
  let fixture: ComponentFixture<CreateClientComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate') // Correctly spy on the router
  };

  const mockClientService = {
    post: (data: any) => of(data),
    user_token: () => of({ data: { id: 'agent1' } }),
    assignedClient: (data: User) => of(data)
  };
  const mockLayoutService = {
    getUser: () => ({ id: 1, type: Role.Admin } as User)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateClientComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatSlideToggleModule,
        RouterTestingModule // Import RouterTestingModule
      ],
      providers: [
        { provide: ClientService, useValue: mockClientService }, // Only one provider for Service
        { provide: Router, useValue: mockRouter }, // Spy for the router
        { provide: LayoutService, useValue: mockLayoutService },
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClientComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home', () => {
    component.goBack(); // Call the method to be tested
    expect(router.navigate).toHaveBeenCalledWith(['/', 'app', 'home']); // Verify that navigate is called with the expected route
  });

  it('should call clientService.user_token and return undefined', () => {
    // Spy on the user_token method of the service and simulate a return value
    const mockUserClient = undefined;
    const userTokenSpy = spyOn(mockClientService, 'user_token').and.callFake(() => {
      // Set userData as in the mock
      return of(component.userData); // Return the simulated observable
    });
    // Call the getUserData method
    component.getUserData();

    // Verify that user_token was called
    expect(userTokenSpy).toHaveBeenCalled();

    expect(component.userData).toEqual(mockUserClient);
    expect(component.hasClientAssigned).toBeFalse();
  });

  it('should set hasClientAssigned to true when client_id is not null', () => {
    // Simulate a response where client_id is not null
    const mockTokenData = { data: { id: 'agent1', client_id: '12345' } };

    // Spy on the user_token method and return the mock
    const userTokenSpy = spyOn(mockClientService, 'user_token').and.returnValue(of(mockTokenData));

    // Call the getUserData method
    component.getUserData();

    // Verify that user_token was called
    expect(userTokenSpy).toHaveBeenCalled();

    // Verify that userData is set correctly
    expect(component.userData).toEqual(mockTokenData.data);

    // Verify that hasClientAssigned is set to true
    expect(component.hasClientAssigned).toBeTrue();
  });

  it('should save the client successfully', () => {
    // Simulated user data
    const mockClient = {
      name: 'Mock Client',
      nit: '908654321',
      email: 'client@client.com',
      phone: '3124567890',
      department: 'Bogotá D.c.',
      city: 'Bogotá D.c.',
      address: 'Calle 19 No 11 33'
    };

    // Simulate the successful post response with an id
    const postResponse = { nit: '908654321' };
    const postSpy = spyOn(mockClientService, 'post').and.returnValue(of(postResponse));

    // Simulate the response of the assignedClient method
    const assignedClientSpy = spyOn(mockClientService, 'assignedClient').and.returnValue(of({}));

    // Simulate the form value
    component.clientForm.setValue(mockClient);

    // Set userData so that the call to save works
    component.userData = { client_id: null }; // or whatever is needed to simulate the initial state

    // Execute the save method
    component.save();

    // Verify that post has been called with the correct data
    expect(postSpy).toHaveBeenCalledWith({ ...mockClient } as Client);

    // Verify that assignedClient was called with the correct user
    expect(assignedClientSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      client_id: postResponse.nit // verify that the correct id was passed
    }));

    // Verify that loading is set to false and done to true after saving
    expect(component.loading).toBeFalse();
    expect(component.done).toBeTrue();
  });

  it('should have an invalid form when required fields are empty', () => {
    component.clientForm.controls['name'].setValue('');
    component.clientForm.controls['nit'].setValue('');
    expect(component.clientForm.valid).toBeFalse();  // The form should be invalid
  });

  it('should have a valid form when fields are filled correctly', () => {
    component.clientForm.controls['name'].setValue('Client de prueba');
    component.clientForm.controls['nit'].setValue('90118323');
    component.clientForm.controls['email'].setValue('pruba@prueba.com');
    component.clientForm.controls['phone'].setValue('31278906');
    component.clientForm.controls['department'].setValue('Cundinamarca');
    component.clientForm.controls['city'].setValue('Mosquera');
    component.clientForm.controls['address'].setValue('Calle 12 35 20');

    expect(component.clientForm.valid).toBeTrue();  // The form should be valid
  });

  it('should select department', () => {
    let value = 'Amazonas';
    let department = Colombia.find(d => d.departamento === value) ?? Colombia[0];
    component.selectDeparment(value);
    expect(component.department).toBe(department);
    expect(component.clientForm.get('city')?.value).toBe('Leticia');

    value = 'Antioquia';
    department = Colombia.find(d => d.departamento === value) ?? Colombia[0];
    component.selectDeparment(value);
    expect(component.department).toBe(department);
    expect(component.clientForm.get('city')?.value).toBe('Abejorral');
  });

  it('should not save with invalid email', () => {
    component.clientForm.controls['email'].setValue('invalid-email');
    component.save();
    expect(component.clientForm.valid).toBeFalse();
  });

  it('should not save with invalid name', () => {
    const data = { ...component.clientForm.value } as Client;
    const service = fixture.debugElement.injector.get(ClientService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(throwError(() => {
      return {
        error: 'invalid name'
      };
    }));

    component.save();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.done).toBeFalsy();
    expect(component.clientForm.hasError('invalid_name')).toBeTruthy();
  });

  it('should not save with invalid nit', () => {
    const data = { ...component.clientForm.value } as Client;
    const service = fixture.debugElement.injector.get(ClientService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(throwError(() => {
      return {
        error: 'invalid nit'
      };
    }));

    component.save();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.done).toBeFalsy();
    expect(component.clientForm.hasError('invalid_nit')).toBeTruthy();
  });
});