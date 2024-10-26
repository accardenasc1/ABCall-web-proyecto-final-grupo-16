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

describe('ClientComponent', () => {
  let component: CreateClientComponent;
  let fixture: ComponentFixture<CreateClientComponent>;
  let router: Router;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate') // Espía correctamente el router
  };

  const mockClientService = {
    post: (data: any) => of(data),
    user_token: () => of({ data: { id: 'agent1' } })
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
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClientComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home', () => {
    component.goBack(); // Llama al método que se va a probar
    expect(router.navigate).toHaveBeenCalledWith(['/', 'app', 'home']); // Verifica que se llame a navigate con la ruta esperada
  });

  it('should call clientService.user_token and return the correct data', () => {
    // Espiar el método user_token del servicio y simular un valor de retorno
    const mockTokenData = { data: { id: 'agent1' } };
    const userTokenSpy = spyOn(mockClientService, 'user_token').and.returnValue(of(mockTokenData));

    // Llamar al método getUserData
    const result$ = component.getUserData();

    // Verificar que user_token fue llamado
    expect(userTokenSpy).toHaveBeenCalled();

    // Suscribirse al resultado y verificar los datos retornados
    result$.subscribe((data) => {
      expect(data).toEqual(mockTokenData); // Verifica que los datos retornados sean los esperados
    });
  });

  it('should save the client successfully', () => {
    // Datos de usuario simulados
    const mockUserData = { data: { id: 'agent1' } };
    const mockClient = {
      name: 'Mock Client',
      nit: '908654321',
      email: 'client@client.com',
      phone: '3124567890',
      department: 'Bogotá D.c.',
      city: 'Bogotá D.c.',
      address: 'Calle 19 No 11 33'
    };

    // Espiar getUserData y post del servicio
    spyOn(component, 'getUserData').and.returnValue(of(mockUserData)); // Retorna datos de usuario simulados
    const postSpy = spyOn(mockClientService, 'post').and.returnValue(of({})); // Simula la respuesta exitosa del post

    // Simular el valor del formulario
    component.clientForm.setValue(mockClient);

    // Ejecutar el método save
    component.save();

    // Verificar que loading está activo al inicio
    //expect(component.loading).toBeTrue();

    // Verificar que el post ha sido llamado con los datos correctos
    expect(postSpy).toHaveBeenCalledWith({...mockClient } as Client);

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
    const data = {...component.clientForm.value } as Client;
    const service = fixture.debugElement.injector.get(ClientService);
    const serviceSpy = spyOn(service, 'post').and.returnValue(throwError(() => {
      return {
        error: 'invalid email'
      };
    }));

    component.save();

    expect(serviceSpy).toHaveBeenCalledWith(data);
    expect(component.done).toBeFalsy();
    expect(component.clientForm.hasError('invalid_email')).toBeTruthy();
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
