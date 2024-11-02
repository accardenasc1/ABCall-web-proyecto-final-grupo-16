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

describe('ClientComponent', () => {
  let component: CreateClientComponent;
  let fixture: ComponentFixture<CreateClientComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate') // Espía correctamente el router
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
      ],
      providers: [
        { provide: ClientService, useValue: mockClientService }, // Solo un proveedor para Service
        { provide: Router, useValue: mockRouter }, // Espía para el router
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
    component.goBack(); // Llama al método que se va a probar
    expect(router.navigate).toHaveBeenCalledWith(['/', 'app', 'home']); // Verifica que se llame a navigate con la ruta esperada
  });

  it('should call clientService.user_token and return undefined', () => {
    // Espiar el método user_token del servicio y simular un valor de retorno
    const mockUserClient = undefined;
    const userTokenSpy = spyOn(mockClientService, 'user_token').and.callFake(() => {
      // Establecer userData como en el mock
      return of(component.userData); // Devuelve el observable simulado
    });
    // Llamar al método getUserData
    component.getUserData();

    // Verificar que user_token fue llamado
    expect(userTokenSpy).toHaveBeenCalled();

    expect(component.userData).toEqual(mockUserClient);
    expect(component.hasClientAssigned).toBeFalse();
  });

  it('should set hasClientAssigned to true when client_id is not null', () => {
    // Simular una respuesta donde client_id no sea null
    const mockTokenData = { data: { id: 'agent1', client_id: '12345' } };

    // Espiar el método user_token y devolver el mock
    const userTokenSpy = spyOn(mockClientService, 'user_token').and.returnValue(of(mockTokenData));

    // Llamar al método getUserData
    component.getUserData();

    // Verificar que user_token fue llamado
    expect(userTokenSpy).toHaveBeenCalled();

    // Verificar que userData se establece correctamente
    expect(component.userData).toEqual(mockTokenData.data);

    // Verificar que hasClientAssigned se establece en true
    expect(component.hasClientAssigned).toBeTrue();
  });

  it('should save the client successfully', () => {
    // Datos de usuario simulados
    const mockClient = {
      name: 'Mock Client',
      nit: '908654321',
      email: 'client@client.com',
      phone: '3124567890',
      department: 'Bogotá D.c.',
      city: 'Bogotá D.c.',
      address: 'Calle 19 No 11 33'
    };

    // Simular la respuesta exitosa del post con un id
    const postResponse = { id: 'newClientId' };
    const postSpy = spyOn(mockClientService, 'post').and.returnValue(of(postResponse));

    // Simular la respuesta del método assignedClient
    const assignedClientSpy = spyOn(mockClientService, 'assignedClient').and.returnValue(of({}));

    // Simular el valor del formulario
    component.clientForm.setValue(mockClient);

    // Establecer userData para que la llamada a save funcione
    component.userData = { client_id: null }; // o lo que se necesite para simular el estado inicial

    // Ejecutar el método save
    component.save();

    // Verificar que post ha sido llamado con los datos correctos
    expect(postSpy).toHaveBeenCalledWith({...mockClient } as Client);

    // Verificar que assignedClient fue llamado con el usuario correcto
    expect(assignedClientSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      client_id: postResponse.id // verificar que se haya pasado el id correcto
    }));

    // Verificar que loading se establece en false y done en true después del guardado
    expect(component.loading).toBeFalse();
    expect(component.done).toBeTrue();
  });

  it('should have an invalid form when required fields are empty', () => {
    component.clientForm.controls['name'].setValue('');
    component.clientForm.controls['nit'].setValue('');
    expect(component.clientForm.valid).toBeFalse();  // El formulario debe ser inválido
  });

  it('should have a valid form when fields are filled correctly', () => {
    component.clientForm.controls['name'].setValue('Client de prueba');
    component.clientForm.controls['nit'].setValue('90118323');
    component.clientForm.controls['email'].setValue('pruba@prueba.com');
    component.clientForm.controls['phone'].setValue('31278906');
    component.clientForm.controls['department'].setValue('Cundinamarca');
    component.clientForm.controls['city'].setValue('Mosquera');
    component.clientForm.controls['address'].setValue('Calle 12 35 20');

    expect(component.clientForm.valid).toBeTrue();  // El formulario debe ser válido
  });

  it('should select deparment', () => {
    let value = 'Amazonas';
    let department = Colombia.find(d => d.departamento === value) ?? Colombia[0]
    component.selectDeparment(value);
    expect(component.department).toBe(department);
    expect(component.clientForm.get('city')?.value).toBe('Leticia');

    value = 'Antioquia';
    department = Colombia.find(d => d.departamento === value) ?? Colombia[0]
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
    const data = {...component.clientForm.value } as Client;
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
    const data = {...component.clientForm.value } as Client;
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
