/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentComponent } from './incident.component';
import { IncidentService } from './create-incident.service';
import { of } from 'rxjs';
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
import { Incident } from '../models/incident';

describe('IncidentComponent', () => {
  let component: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;
  let router: Router;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate') // Espía correctamente el router
  };

  const mockIncidentService = {
    getAllUsers: () => of([{ id_number: '123', username: 'user1' }, { id_number: '456', username: 'user2' }]),
    post: (data: any) => of(data),
    user_token: () => of({ data: { id: 'agent1' } })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncidentComponent],
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
        { provide: IncidentService, useValue: mockIncidentService }, // Solo un proveedor para IncidentService
        { provide: Router, useValue: mockRouter }, // Espía para el router
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login', () => {
    component.goBack(); // Llama al método que se va a probar
    expect(router.navigate).toHaveBeenCalledWith(['/', 'app', 'incident']); // Verifica que se llame a navigate con la ruta esperada
  });

  it('should call incidentService.user_token and return the correct data', () => {
    // Espiar el método user_token del servicio y simular un valor de retorno
    const mockTokenData = { data: { id: 'agent1' } };
    const userTokenSpy = spyOn(mockIncidentService, 'user_token').and.returnValue(of(mockTokenData));

    // Llamar al método getUserData
    const result$ = component.getUserData();

    // Verificar que user_token fue llamado
    expect(userTokenSpy).toHaveBeenCalled();

    // Suscribirse al resultado y verificar los datos retornados
    result$.subscribe((data) => {
      expect(data).toEqual(mockTokenData); // Verifica que los datos retornados sean los esperados
    });
  });

  it('should save the incident successfully', () => {
    // Datos de usuario simulados
    const mockUserData = { data: { id: 'agent1' } };
    const mockIncident = { title: 'Test Incident', description: 'Test Description', clientid: '123', iduser: 456, type: 1 };

    // Espiar getUserData y post del servicio
    spyOn(component, 'getUserData').and.returnValue(of(mockUserData)); // Retorna datos de usuario simulados
    const postSpy = spyOn(mockIncidentService, 'post').and.returnValue(of({})); // Simula la respuesta exitosa del post

    // Simular el valor del formulario
    component.incidentForm.setValue(mockIncident);
    component.serviceId = '1';
    component.userid = '123';

    // Ejecutar el método save
    component.save();

    // Verificar que loading está activo al inicio
    //expect(component.loading).toBeTrue();

    // Verificar que el post ha sido llamado con los datos correctos
    expect(postSpy).toHaveBeenCalledWith({...mockIncident, serviceid: '1', userid: '123', agentid: 'agent1' } as Incident);

    // Verificar que loading se establece en false y done en true después del guardado
    expect(component.loading).toBeFalse();
    expect(component.done).toBeTrue();
  });

  it('should have an invalid form when required fields are empty', () => {
    component.incidentForm.controls['title'].setValue('');
    component.incidentForm.controls['type'].setValue(1);
    expect(component.incidentForm.valid).toBeFalse();  // El formulario debe ser inválido
  });

  it('should have a valid form when fields are filled correctly', () => {
    component.incidentForm.controls['title'].setValue('Incidente de prueba');
    component.incidentForm.controls['type'].setValue(1);
    component.incidentForm.controls['description'].setValue('Descripción del incidente');
    component.incidentForm.controls['clientid'].setValue('Cliente1');
    component.incidentForm.controls['iduser'].setValue(1);

    expect(component.incidentForm.valid).toBeTrue();  // El formulario debe ser válido
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
          id: '12345'  // Valor simulado del id de usuario
        }
      }
    };
    // Llamar a la función con el evento simulado
    component.onUserSelected(mockEvent);
    // Verificar que el valor de userid se haya actualizado correctamente
    expect(component.userid).toBe('12345');
  });

  it('should return formatted string when a valid user is provided', () => {
    const mockUser = { id_number: '12345', username: 'JohnDoe' };

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

});
