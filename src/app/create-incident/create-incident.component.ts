/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit  } from '@angular/core';
import { IncidentService } from './create-incident.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Incident } from '../models/incident';
import { State } from '../models/state';
import { Type } from '../models/type';
import { User } from '../models/user';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-incident',
  templateUrl: './create-incident.component.html',
  styleUrl: './create-incident.component.css'
})
export class CreateIncidentComponent implements OnInit {
  state = 'Create';
  IncidentType = Type;
  incidentForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    type: new FormControl<Type | null>(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    clientid: new FormControl('', [Validators.required]),
    iduser: new FormControl<number | null>(null, [Validators.required]),
  });
  loading = false;
  done = false;
  isPhoneEnabled = true;
  isMailEnabled = false;
  isSmartphoneEnabled = false;
  serviceId = "1";
  selectedFile: File | null = null;
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  userid: string | null = null;
  filteredClients: any[] = [];
  allClients: any[] = [];
  user: User | undefined = undefined;

  constructor(private router: Router, private incidentService: IncidentService,
    private layoutService: LayoutService ) {
    this.user = layoutService.getUser();
    this.setClientValidator();
    this.setUserValidator();
  }
  ngOnInit(): void {
    this.getUsers();
    this.getClients();

    this.incidentForm.get('iduser')?.valueChanges.subscribe(value => {
      this.onSearch(value ?? '');
    });
  }


  goBack() {
    this.router.navigate(['/', 'app', 'incident']);
  }

  getUserData() {
      return this.incidentService.user_token();
  }

  save() {
    this.loading = true;
    const incident = this.incidentForm.value;
    // Obtener los datos del usuario
    const userData$ = this.getUserData();
    incident.type = Number(incident.type);
    if (this.userid == null)
    {
      this.userid = this.user?.id_number ?? null;
    }
    if (userData$) {
      userData$.subscribe({
        next: (response: any) => {
          // Ahora realiza la solicitud de guardado del incidente
          if (incident.clientid == '')
          {
            incident.clientid = response.data.client_id;
          }
          this.incidentService.post({...incident, serviceid: this.serviceId, userid: this.userid, agentid: response.data.id, state: State.Open} as Incident).subscribe(() => {
            this.loading = false;
            this.done = true;
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al obtener los datos del usuario:', error);
        }
      });
    } else {
      console.error('No se pudo realizar la solicitud porque no hay token.');
      this.loading = false;
    }
  }

  isValid() {
    return this.incidentForm.valid;
  }

  onToggleChange(toggleType: string) {
    // Resetear los valores
    this.isPhoneEnabled = false;
    this.isMailEnabled = false;

    // Activar el toggle correspondiente
    if (toggleType === 'phone') {
      this.isPhoneEnabled = true;
      this.isMailEnabled = false;
      this.serviceId = "1"; // Valor para el toggle 'phone'
    } else if (toggleType === 'mail') {
      this.isMailEnabled = true;
      this.isPhoneEnabled = false;
      this.serviceId = "2"; // Valor para el toggle 'mail'
    }

    // Deshabilitar el otro toggle
    this.updateToggleStates();
  }

  updateToggleStates() {
    // Si hay un toggle activado, deshabilitar los otros
    if (this.isPhoneEnabled || this.isMailEnabled) {
      this.isSmartphoneEnabled = false; // Si es necesario, puedes deshabilitar este también
    } else {
      this.isSmartphoneEnabled = true; // Si ambos están desactivados
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', file);
    }
  }

  displayUser(user: any): string {
    return user ? `${user.id_number} - ${user.username}` : '';
  }

  getUsers(): void {
    this.incidentService.getAllUsers().subscribe((users) => {
      this.allUsers = users;  // Guardamos todos los usuarios
      this.filteredUsers = users;  // Inicialmente mostramos todos
    });
  }

  getClients(): void {
    this.incidentService.getAllClients().subscribe((clients) => {
      this.allClients = clients;  // Guardamos todos los usuarios
      this.filteredClients = clients;  // Inicialmente mostramos todos
    });
  }

  onSearch(searchTerm: any): void {
    if (typeof searchTerm === 'string' && searchTerm) {
      // Filtrar usuarios por id_number o cualquier otro criterio
      this.filteredUsers = this.allUsers.filter(user =>
        user.id_number.toString().includes(searchTerm)  ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Si no hay término de búsqueda, mostrar todos los usuarios
      this.filteredUsers = this.allUsers;
    }
  }

  onUserSelected(event: any): void {
    this.userid = event.option.value.id_number;
  }

  setClientValidator() {
    const clientidControl = this.incidentForm.get('clientid');

    if (this.user?.type !== 3) {
      clientidControl?.setValidators(Validators.required);
    } else {
      clientidControl?.clearValidators();
    }

    // Asegúrate de que Angular vuelva a validar este campo
    clientidControl?.updateValueAndValidity();
  }

  setUserValidator() {
    const useridControl = this.incidentForm.get('iduser');

    if (this.user?.type !== 1) {
      useridControl?.setValidators(Validators.required);
    } else {
      useridControl?.clearValidators();
    }

    // Asegúrate de que Angular vuelva a validar este campo
    useridControl?.updateValueAndValidity();
  }
}
