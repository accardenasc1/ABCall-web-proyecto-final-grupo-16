/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ClientService } from './create-client.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { User } from '../models/user';
import { LayoutService } from '../layout/layout.service';
import { Colombia } from '../user-sign-up/colombia';

@Component({
  selector: 'app-client',
  templateUrl: './create-client.component.html',
  styleUrl: './create-client.component.css'
})
export class CreateClientComponent {
  colombia = Colombia;
  department = Colombia[0];
  state = 'Create';
  clientForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    nit: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.pattern('^[0-9]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    department: new FormControl(this.colombia[0].departamento, [Validators.required]),
    city: new FormControl(this.department.ciudades[0], [Validators.required]),
    address: new FormControl(''),

  });
  loading = false;
  done = false;
  hasClientAssigned = true;
  user: User | undefined = undefined;;
  userData: any;
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  userid: string | null = null;

  constructor(private router: Router,
    private clientServise: ClientService,
    private layoutService: LayoutService) {
      this.user = layoutService.getUser();
      this.getUserData();
    }

  goBack() {
    this.router.navigate(['/', 'app', 'home']);
  }

  getUserData() {
    this.clientServise.user_token().subscribe(
      (response: any) => {
          this.userData = response.data;
          if(this.userData?.client_id == null) {
            this.hasClientAssigned = false
          }else{
            this.hasClientAssigned = true
          }
      }
    );
  }

  save() {
    this.loading = true;
    const client = this.clientForm.value;
    if (this.userData) {
          // Ahora realiza la solicitud de guardado del cliente
          this.clientServise.post(client as Client).subscribe((response: any) => {
            if (this.user) {
              this.user.client_id = response.id;
              this.clientServise.assignedClient({
                ...this.user,
              } as User).subscribe(() => {
                this.loading = false;
                this.done = true;
              });
            } else {
              console.error('User is null, cannot assign client_id.');
              this.loading = false; // Asegúrate de manejar el estado de carga
            }
          }, error => {
              this.loading = false;
              switch (error.error) {
                case 'invalid name':
                  this.clientForm.setErrors({
                    invalid_name: true
                  })
                  break;
                case 'invalid nit':
                  this.clientForm.setErrors({
                    invalid_nit: true
                  })
                  break;
                case 'invalid email':
                  this.clientForm.setErrors({
                    invalid_email: true
                  })
                  break;
              }
          });
        }
    else {
      console.error('No se pudo realizar la solicitud porque no hay token.');
      this.loading = false;
    }
  }

  isValid() {
    return this.clientForm.valid;
  }

  selectDeparment(value: string) {
    this.department = Colombia.find(d => d.departamento === value) ?? Colombia[0];
    this.clientForm.get('city')?.setValue(this.department.ciudades[0]);
  }
}
