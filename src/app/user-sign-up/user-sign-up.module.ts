import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserSignUpComponent } from './user-sign-up.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxLoadingModule } from "@dchtools/ngx-loading-v18";

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [UserSignUpComponent],
  exports: [UserSignUpComponent],
  providers: [provideHttpClient(), provideNativeDateAdapter()],
})
export class UserSignUpModule {}
