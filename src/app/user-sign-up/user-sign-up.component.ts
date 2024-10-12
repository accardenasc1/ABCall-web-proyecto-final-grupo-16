import { Component } from '@angular/core';
import { UserSignUpService } from './user-sign-up.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './user';

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {

  userForm = new FormGroup({
    username: new FormControl(''),
    id: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    phone: new FormControl(''),
    department: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
    birthday: new FormControl(null),
    dataCheck: new FormControl(false),
  });

  constructor(private router: Router, private userSignUpService: UserSignUpService) {

  }

  cancel() {
    this.router.navigate(['/', 'login']);
  }

  save() {
    const user = this.userForm.value;
    this.userSignUpService.post(user as User).subscribe(value => {
      console.log(value);
    });
  }
}
