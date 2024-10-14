import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { BaseResponse } from '../models/base-response';
import { Login } from '../models/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  loginForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });
  errorMessage = '';
  constructor(private loginService: LoginService, private router: Router ) { }
  onLogInUser() {
    console.log('onlogInUser');
    if (this.loginForm.value){
      this.loginService.login(this.loginForm.value).subscribe(
        (response: BaseResponse<Login>) => {
          if (response.status === 200) {
            if (response.data?.access_token) {
              this.loginService.saveToken(response.data.access_token);
              
              console.log('Token guardado correctamente:', response);
              this.router.navigate(['/app/home']);

            } else {
              console.log('Token no disponible en la respuesta:', response);
            }           
          }
        },
        error => {         
          this.errorMessage = 'Nombre de usuario o contraseña incorrectos';
          console.log('Error al guardar el token:', error);
        }
      );
  }
  }
}