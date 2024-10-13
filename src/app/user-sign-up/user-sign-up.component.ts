import { Component } from '@angular/core';
import { UserSignUpService } from './user-sign-up.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './user';
import { Colombia } from './colombia';

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {
  colombia = Colombia;
  department = Colombia[0];

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
    birthday: new FormControl(null, [Validators.required]),
    dataCheck: new FormControl(false, [Validators.required]),
  });

  constructor(private router: Router, private userSignUpService: UserSignUpService) {
    this.userForm.setErrors({
      needToCheck: true
    });
  }

  cancel() {
    this.router.navigate(['/', 'login']);
  }

  save() {
    const user = this.userForm.value;
    this.userSignUpService.post({...user, type: 1} as User).subscribe(value => {
      console.log(value);
      this.router.navigate(['/', 'login']);
    });
  }

  selectDeparment(value: string) {
    this.department = Colombia.find(d => d.departamento === value) ?? Colombia[0];
    const user = this.userForm.value;
    this.userForm.setValue({
      ...user,
      city: this.department.ciudades[0]
    } as User);
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
}

