/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit  } from '@angular/core';
import { IncidentResponseService } from './response-incident.service';
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
  templateUrl: './response-incident.component.html',
  styleUrl: './response-incident.component.css'
})
export class ResponseIncidentComponent implements OnInit {
  state = 'Response';
  IncidentType = Type;
  incidentDetailForm = new FormGroup({
    title: new FormControl('', [ Validators.maxLength(50)]),
    type: new FormControl<Type | null>(0),
    description: new FormControl(''),
    clientid: new FormControl('', [Validators.required]),
    iduser: new FormControl('', [Validators.required]),
    state: new FormControl(''),
    response: new FormControl(''),
    desresponse: new FormControl(''),
  });
  loading = false;
  done = false;
  serviceId = "1";
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  userid: string | null = null;
  filteredClients: any[] = [];
  allClients: any[] = [];
  responses: { titulo: string; texto: string }[] = [];
  user: User | undefined = undefined;
  incidentDetail: Incident | undefined = undefined;
  incidentId: string | null = null;
  nameCliente: string | null = null;
  selectedIcon: string | null = null;
  selectedText: string | null = null;
  states = [
    { value: State.Open, label: 'Open' },
    { value: State.Closed, label: 'Closed' },
    { value: State.InProgress, label: 'In Progress' },
    { value: State.Canceled, label: 'Canceled' }
  ];


  constructor(private route: ActivatedRoute, private router: Router, private incidentService: IncidentResponseService,
    private layoutService: LayoutService ) {
    this.user = layoutService.getUser();
    this.setClientValidator();
    this.setUserValidator();
  }
  ngOnInit(): void {
    this.incidentId = this.route.snapshot.paramMap.get('id');
    this.getClients();
    this.getUsers();

    if (this.incidentId) {
      this.getIncidentDetail(this.incidentId);
    }

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
        if( Number(this.incidentDetail?.channel) === Channel.Web ){
          this.selectedIcon = 'phone';
        }
        if( Number(this.incidentDetail?.channel) === Channel.Email ){
          this.selectedIcon = 'mail';
        }
        if( Number(this.incidentDetail?.channel) === Channel.Mobile ){
          this.selectedIcon = 'smartphone';
        }
        this.getClients();
        this.getUsers();

        const defaultUser = this.filteredUsers.find(user => user.id_number === Number(this.incidentDetail?.userid));
        this.getResponse(this.incidentDetail?.title, this.incidentDetail?.type);
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

  setClientValidator() {
    const clientidControl = this.incidentDetailForm.get('clientid');

    if (this.user?.type !== 3) {
      clientidControl?.setValidators(Validators.required);
    } else {
      clientidControl?.clearValidators();
    }

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

  get clientName(): string {
    const client = this.filteredClients.find(client => client.nit === Number(this.incidentDetail?.clientid));
    return client ? client.name : 'N/A';
  }

  get userName(): string {
    const user = this.filteredUsers.find(user => user.id_number === Number(this.incidentDetail?.userid));
    return user ? `${user.first_name}  ${user.last_name}` : '';
  }

  getIncidentTypeString(type: Type | undefined): string {
    if (type === undefined) return '';
    return Type[type];
  }

  getResponse(titulo: string | null, tipo: number | null): void {
    this.incidentService.getResponse(titulo, tipo).subscribe({
      next: (response) => {
        this.responses = response;  // Guardamos todos los usuarios o respuestas
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
      }
    });
  }

  onResponseChange(event: any): void {
    // Find the corresponding response object based on the selected title
    const selectedValue = (event.target as HTMLSelectElement).value; // Obtener el valor seleccionado
    console.log('prueba',selectedValue)
    const selectedResponse = this.responses.find(item => item.titulo === selectedValue);

    this.selectedText = selectedResponse ? selectedResponse.texto : ''; // Establecer selectedText para mostrar en el textarea
    this.incidentDetailForm.get('description')?.setValue(this.selectedText);
  }

}
