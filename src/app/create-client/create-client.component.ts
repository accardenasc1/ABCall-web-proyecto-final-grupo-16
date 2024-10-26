/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ClientService } from './create-client.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../models/client';
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
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  userid: string | null = null;

  constructor(private router: Router, private clientServise: ClientService) {

  }

  goBack() {
    this.router.navigate(['/', 'app', 'home']);
  }

  getUserData() {
      return this.clientServise.user_token();
  }

  save() {
    this.loading = true;
    const client = this.clientForm.value;
    // Obtener los datos del usuario
    const userData$ = this.getUserData();

    if (userData$) {
          // Ahora realiza la solicitud de guardado del cliente
          this.clientServise.post(client as Client).subscribe(() => {
            this.loading = false;
            this.done = true;
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
