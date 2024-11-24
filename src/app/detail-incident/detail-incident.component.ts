/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit  } from '@angular/core';
import { IncidentDetailService } from './detail-incident.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '../models/type';
import { User } from '../models/user';
import { Incident } from '../models/incident';
import { LayoutService } from '../layout/layout.service';
import { State } from '../models/state';
import { Channel } from '../models/channel';

@Component({
  selector: 'app-incident',
  templateUrl: './detail-incident.component.html',
  styleUrl: './detail-incident.component.css'
})
export class DetailIncidentComponent implements OnInit {
  state = 'Detail';
  IncidentType = Type;
  incidentDetailForm = new FormGroup({
    title: new FormControl('', [ Validators.maxLength(50)]),
    type: new FormControl<Type | null>(0),
    description: new FormControl(''),
    clientid: new FormControl('', [Validators.required]),
    iduser: new FormControl('', [Validators.required]),
    state: new FormControl(''),
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
  incidentDetail: Incident | undefined = undefined;
  incidentId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private incidentService: IncidentDetailService,
    private layoutService: LayoutService ) {
    this.user = layoutService.getUser();
    this.setClientValidator();
    this.setUserValidator();
  }
  
  async ngOnInit() {
    this.incidentId = this.route.snapshot.paramMap.get('id');
    await this.getClients();

    if (this.incidentId) {
      await this.getUsers();
      this.getIncidentDetail(this.incidentId);
    }

    this.incidentDetailForm.get('iduser')?.valueChanges.subscribe(value => {
      this.onSearch(value ?? '');
    });

  }

  goBack() {
    this.router.navigate(['/', 'app', 'incident']);
  }

  getUserData() {
      return this.incidentService.user_token();
  }

  getIncidentStateString(state: State | undefined): string {
    if (state === undefined) return '';
    return State[state];
  }

  isValid() {
    return this.incidentDetailForm.valid;
  }

  getIncidentDetail(id: string): void {
    this.incidentService.getById(id).subscribe(
      (data) => {
        this.incidentDetail = data;
        if( Number(this.incidentDetail?.channel) === Channel.Mobile ){
          this.isPhoneEnabled = true;
          this.isMailEnabled = false;
          this.isSmartphoneEnabled = false;
        }
        if( Number(this.incidentDetail?.serviceid) === Channel.Email ){
          this.isPhoneEnabled = false;
          this.isMailEnabled = true;
          this.isSmartphoneEnabled = false;
        }
        if( Number(this.incidentDetail?.serviceid) === Channel.Web ){
          this.isPhoneEnabled = false;
          this.isMailEnabled = false;
          this.isSmartphoneEnabled = true;
        }
        const defaultUser = this.filteredUsers.find(user => user.id_number === Number(this.incidentDetail?.userid));
        this.incidentDetailForm.patchValue({
          clientid: this.incidentDetail.clientid,
          iduser: defaultUser,
          type: this.incidentDetail.type,
        });
      },
      (error) => {
        console.error('Error al obtener el detalle del incidente:', error);
      }
    );
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

  async getUsers() {
    const users = await this.incidentService.getAllUsers().toPromise();
    this.allUsers = users ?? [];  // Guardamos todos los usuarios
    this.filteredUsers = users ?? [];  // Inicialmente mostramos todos
  }

  async getClients() {
    const clients = await this.incidentService.getAllClients().toPromise()
    this.allClients = clients ?? [];  // Guardamos todos los usuarios
    this.filteredClients = clients  ?? [];  // Inicialmente mostramos todos
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
    const clientidControl = this.incidentDetailForm.get('clientid');

    if (this.user?.type !== 3) {
      clientidControl?.setValidators(Validators.required);
    } else {
      clientidControl?.clearValidators();
    }

    // Asegúrate de que Angular vuelva a validar este campo
    clientidControl?.updateValueAndValidity();
  }

  setUserValidator() {
    const useridControl = this.incidentDetailForm.get('iduser');

    if (this.user?.type !== 1) {
      useridControl?.setValidators(Validators.required);
    } else {
      useridControl?.clearValidators();
    }

    // Asegúrate de que Angular vuelva a validar este campo
    useridControl?.updateValueAndValidity();
  }

}
