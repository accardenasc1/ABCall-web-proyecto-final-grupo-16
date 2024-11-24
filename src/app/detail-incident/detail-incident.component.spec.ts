/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailIncidentComponent } from './detail-incident.component';
import { IncidentDetailService } from './detail-incident.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxLoadingModule } from '@dchtools/ngx-loading-v18';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Type } from '../models/type';
import { of } from 'rxjs';
import { Channel } from '../models/channel';

describe('IncidentDetailComponent', () => {
  let component: DetailIncidentComponent;
  let fixture: ComponentFixture<DetailIncidentComponent>;
  let mockDetailIncidentService: jasmine.SpyObj<IncidentDetailService>;
  let router: Router;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate') // Espía correctamente el router
  };


  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => key === 'id' ? '1' : null  // Simula que devuelve "1" para "id"
      }
    }
  };

  beforeEach(async () => {
    mockDetailIncidentService = jasmine.createSpyObj('IncidentService', ['getById', 'getAllClients', 'getAllUsers']);
    mockDetailIncidentService.getById.and.returnValue(of({ title: 'Test Incident',type: Type.Other, description: 'Test Description', clientid: '123', iduser: 456, state: 1, agentid: '1', serviceid: '1', userid: '1',channel: Channel.Web }));
    mockDetailIncidentService.getAllClients.and.returnValue(of([{ id: '456', name: 'client1' }, { id: '890', name: 'client2' }]));
    mockDetailIncidentService.getAllUsers.and.returnValue(of([{ id_number: '123', username: 'user1' }, { id_number: '456', username: 'user2' }]));

    await TestBed.configureTestingModule({
      declarations: [DetailIncidentComponent],
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
      ],
      providers: [
        { provide: IncidentDetailService, useValue: mockDetailIncidentService }, // Solo un proveedor para IncidentService
        { provide: Router, useValue: mockRouter }, // Espía para el router
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideNativeDateAdapter()
      ]
    }).compileComponents();



    fixture = TestBed.createComponent(DetailIncidentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the incidentId from route parameters', () => {
    expect(component.incidentId).toBe('1');
  });

  it('should navigate to login', () => {
    component.goBack(); // Llama al método que se va a probar
    expect(router.navigate).toHaveBeenCalledWith(['/', 'app', 'incident']); // Verifica que se llame a navigate con la ruta esperada
  });

  it('should have a valid form when fields are filled correctly', () => {
    component.incidentDetailForm.controls['title'].setValue('Incidente de prueba');
    component.incidentDetailForm.controls['type'].setValue(1);
    component.incidentDetailForm.controls['description'].setValue('Descripción del incidente');
    component.incidentDetailForm.controls['clientid'].setValue('Cliente1');
    component.incidentDetailForm.controls['iduser'].setValue('1');

    expect(component.incidentDetailForm.valid).toBeTrue();  // El formulario debe ser válido
  });

  it('should filter users by id_number or username', () => {
    component.allUsers = [
      { id_number: '123', username: 'Usuario1' },
      { id_number: '456', username: 'Usuario2' }
    ];

    component.onSearch('123');
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].id_number).toBe('123');

    component.onSearch('usuario2');
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].username).toBe('Usuario2');
  });

  it('should update userid when a user is selected', () => {
    // Crear un evento simulado con el formato esperado
    const mockEvent = {
      option: {
        value: {
          id_number: '12345'  // Valor simulado del id de usuario
        }
      }
    };
    // Llamar a la función con el evento simulado
    component.onUserSelected(mockEvent);
    // Verificar que el valor de userid se haya actualizado correctamente
    expect(component.userid).toBe('12345');
  });

  it('should return formatted string when a valid user is provided', () => {
    const mockUser = { id_number: 12345, username: 'JohnDoe' };

    // Llamar a displayUser con un usuario válido
    const result = component.displayUser(mockUser);

    // Verificar que el resultado sea el formato esperado
    expect(result).toBe('12345 - JohnDoe');
  });

  it('should return an empty string when no user is provided', () => {
    // Llamar a displayUser con un valor nulo
    const result = component.displayUser(null);

    // Verificar que el resultado sea una cadena vacía
    expect(result).toBe('');
  });

  it('should return an empty string when user is undefined', () => {
    // Llamar a displayUser con un valor undefined
    const result = component.displayUser(undefined);

    // Verificar que el resultado sea una cadena vacía
    expect(result).toBe('');
  });

  it('should set selectedFile when a file is selected', () => {
    // Crear un archivo simulado
    const mockFile = new File(['file content'], 'test-file.txt', { type: 'text/plain' });

    // Simular el evento de selección de archivo
    const event = {
      target: {
        files: [mockFile]  // Simular que se seleccionó un archivo
      }
    };

    // Llamar a la función onFileSelected con el evento simulado
    component.onFileSelected(event);

    // Verificar que selectedFile se haya establecido correctamente
    expect(component.selectedFile).toBe(mockFile);
  });

  it('should not set selectedFile when no file is selected', () => {
    // Simular el evento sin ningún archivo seleccionado
    const event = {
      target: {
        files: []  // Ningún archivo seleccionado
      }
    };

    // Llamar a la función onFileSelected con el evento simulado
    component.onFileSelected(event);

    // Verificar que selectedFile sea null cuando no se selecciona ningún archivo
    expect(component.selectedFile).toBeNull();
  });

  it('should enable phone toggle', () => {
    component.onToggleChange('phone');
    expect(component.isPhoneEnabled).toBe(true);
    expect(component.isMailEnabled).toBe(false);
    expect(component.serviceId).toBe('1');
  });

  it('should enable mail toggle', () => {
    component.onToggleChange('mail');
    expect(component.isMailEnabled).toBe(true);
    expect(component.isPhoneEnabled).toBe(false);
    expect(component.serviceId).toBe('2');
  });

  it('should disable smartphone toggle if phone is enabled', () => {
    component.isPhoneEnabled = true;
    component.isMailEnabled = false;
    component.updateToggleStates();
    expect(component.isSmartphoneEnabled).toBe(false);
  });

  it('should disable smartphone toggle if mail is enabled', () => {
    component.isPhoneEnabled = false;
    component.isMailEnabled = true;
    component.updateToggleStates();
    expect(component.isSmartphoneEnabled).toBe(false);
  });

  it('should clear the required validator for iduser when user type is 1', () => {
    component.user = { type: 1 }; // Tipo de usuario 1
    const clientidControl = component.incidentDetailForm.get('iduser');
    clientidControl?.setValidators(Validators.required); // Añadir validator para probar que se remueva

    component.setUserValidator();

    expect(clientidControl?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should clear the required validator for iduser when user type is 1', () => {
    // Asigna un tipo de usuario 1 para que se ejecute el bloque else
    component.user = { type: 1 };

    // Configura el validador 'required' inicialmente
    const clientidControl = component.incidentDetailForm.get('iduser');
    clientidControl?.setValidators(Validators.required);
    clientidControl?.updateValueAndValidity();

    // Llama a setUserValidator para activar la lógica del else
    component.setUserValidator();

    // Verifica que el validador requerido se haya eliminado
    expect(clientidControl?.hasValidator(Validators.required)).toBeFalse();
  });
  it('should clear the required validator for clientid when user type is 3', () => {
    // Asigna un tipo de usuario 3 para que se ejecute el bloque else
    component.user = { type: 3 };

    // Configura el validador 'required' inicialmente
    const clientidControl = component.incidentDetailForm.get('clientid');
    clientidControl?.setValidators(Validators.required);
    clientidControl?.updateValueAndValidity();

    // Llama a setClientValidator para activar la lógica del else
    component.setClientValidator();

    // Verifica que el validador requerido se haya eliminado
    expect(clientidControl?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should clear the required validator for clientid when user type is 3', () => {
    component.user = { type: 3 }; // Tipo de usuario 3
    const clientidControl = component.incidentDetailForm.get('clientid');
    clientidControl?.setValidators(Validators.required); // Añadir validator para probar que se remueva

    component.setClientValidator();

    expect(clientidControl?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should fetch and set users correctly in getClients()', () => {
    const mockAllClient = [{ id: '456', name: 'client1' }, { id: '890', name: 'client2' }];
    mockDetailIncidentService.getAllClients.and.returnValue(of(mockAllClient));

    component.getClients();

    expect(mockDetailIncidentService.getAllClients).toHaveBeenCalled();
    expect(component.allClients).toEqual(mockAllClient);
    expect(component.filteredClients).toEqual(mockAllClient);
  });

  it('should fetch and set users correctly in getusers()', async () => {
    const mockAllUser = [{ id_number: '123', username: 'user1' }, { id_number: '456', username: 'user2' }];
    mockDetailIncidentService.getAllUsers.and.returnValue(of(mockAllUser));

    await component.getUsers();

    expect(mockDetailIncidentService.getAllClients).toHaveBeenCalled();
    expect(component.allUsers).toEqual(mockAllUser);
    expect(component.filteredUsers).toEqual(mockAllUser);
  });

  it('should call getById with the correct id', () => {
    const mockId = '123';
    const mockData = { title: 'Test Incident',type: Type.Other, description: 'Test Description', clientid: '123', iduser: 456, state: 1, agentid: '1', serviceid: '1', userid: '1',channel: Channel.Web  };
    mockDetailIncidentService.getById.and.returnValue(of(mockData));

    component.getIncidentDetail(mockId);

    expect(mockDetailIncidentService.getById).toHaveBeenCalledWith(mockId);
    expect(component.isPhoneEnabled).toBe(true);
    expect(component.isMailEnabled).toBe(false);
    expect(component.isSmartphoneEnabled).toBe(false);
    expect(component.incidentDetailForm.value.clientid).toEqual(mockData.clientid);
  });

});
