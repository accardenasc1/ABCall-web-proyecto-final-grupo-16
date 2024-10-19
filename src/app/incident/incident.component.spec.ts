/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentComponent } from './incident.component';
import { IncidentService } from './incident.service';
import { Incident } from '../models/incident';
import { of, throwError } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
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
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

describe('IncidentComponent', () => {
  let component: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;

  const mockRouter = {
    navigate: (commands: any[]) => {
      return Promise.resolve(commands ? true : false);
    }
  };

  const mockIncidentService = {
    getAllUsers: () => {
      return of([{ id_number: '123', username: 'user1' }, { id_number: '456', username: 'user2' }]);
    },
    post: (data: Incident) => {
      return of(data);
    },
    user_token: () => {
      return of({ data: { id: 'agent1' } });
    }
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('IncidentService', ['getAllUsers', 'post', 'user_token']);

    await TestBed.configureTestingModule({
      declarations: [IncidentComponent],
      imports: [
        CommonModule,
        MatCardModule,
        RouterModule,
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
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: Router, IncidentService, useValue: mockRouter, spy },
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when required fields are empty', () => {
    component.incidentForm.controls['title'].setValue('');
    component.incidentForm.controls['type'].setValue('');
    expect(component.incidentForm.valid).toBeFalse();  // El formulario debe ser inválido
  });
  it('should have a valid form when fields are filled correctly', () => {
    component.incidentForm.controls['title'].setValue('Incidente de prueba');
    component.incidentForm.controls['type'].setValue('Tipo1');
    component.incidentForm.controls['description'].setValue('Descripción del incidente');
    component.incidentForm.controls['clientid'].setValue('Cliente1');
    component.incidentForm.controls['iduser'].setValue('Usuario1');

    expect(component.incidentForm.valid).toBeTrue();  // El formulario debe ser válido
  });

  // Probar el método de búsqueda (onSearch)
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


});
