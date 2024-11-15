import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  codeForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  resetForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    password: new FormControl('', [Validators.required, Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),]),
  });
  loading = false;
  sent = false;
  done = false;

  constructor(private router: Router, private resetPasswordService: ResetPasswordService) {

  }

  goToLogin() {
    this.router.navigate(['/', 'login']);
  }

  validatePassword() {
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.resetForm.setErrors({
        confirmedError: true
      });
    }
  }

  isCodeValid() {
    return this.codeForm.valid;
  }

  isValid() {
    return this.resetForm.valid;
  }

  sendCode() {
    this.loading = true;
    const data = this.codeForm.value;
    this.resetPasswordService.post({email: data.email}).subscribe(() => {
      this.loading = false;
      this.sent = true;
    });
  }

  save() {
    this.loading = true;
    const data = this.resetForm.value;
    this.resetPasswordService.put({code: data.code, password: data.password}).subscribe(() => {
      this.loading = false;
      this.done = true;
    }, () => {
      this.loading = false;
      this.resetForm.setErrors({
        invalid_code: true
      })
    });
  }
}
