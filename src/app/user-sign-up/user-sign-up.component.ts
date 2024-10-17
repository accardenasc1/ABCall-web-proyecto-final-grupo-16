import { Component } from '@angular/core';
import { UserSignUpService } from './user-sign-up.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Colombia } from './colombia';

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {
  colombia = Colombia;
  department = Colombia[0];
  today = new Date();
  userForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    id_number: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    department: new FormControl(this.colombia[0].departamento, [Validators.required]),
    city: new FormControl(this.department.ciudades[0], [Validators.required]),
    address: new FormControl('', [Validators.required]),
    birthday: new FormControl(new Date(), [Validators.required]),
    dataCheck: new FormControl(false, [Validators.required]),
  });
  loading = false;
  done = false;

  constructor(private router: Router, private userSignUpService: UserSignUpService) {

  }

  goToLogin() {
    this.router.navigate(['/', 'login']);
  }

  save() {
    this.loading = true;
    const user = this.userForm.value;
    this.userSignUpService.post({...user, type: 1} as User).subscribe(() => {
      this.loading = false;
      this.done = true;
    }, error => {
      this.loading = false;
      switch (error.error) {
        case 'invalid username':
          this.userForm.setErrors({
            invalid_username: true
          })
          break;
        case 'invalid id_number':
          this.userForm.setErrors({
            invalid_id_number: true
          })
          break;
        case 'invalid email':
          this.userForm.setErrors({
            invalid_email: true
          })
          break;
      }
    });
  }

  selectDeparment(value: string) {
    this.department = Colombia.find(d => d.departamento === value) ?? Colombia[0];
    this.userForm.get('city')?.setValue(this.department.ciudades[0]);
  }

  validatePassword() {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.userForm.setErrors({
        confirmedError: true
      });
    }
  }

  isValid() {
    return this.userForm.valid && this.userForm.get('dataCheck')?.value === true;
  }
}

