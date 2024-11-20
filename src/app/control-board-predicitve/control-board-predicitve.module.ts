import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlBoardPredicitveComponent } from './control-board-predicitve.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: ControlBoardPredicitveComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ControlBoardPredicitveComponent],
  exports: [ControlBoardPredicitveComponent, RouterModule],
  providers: [provideHttpClient(), provideNativeDateAdapter()],
})
export class ControlBoardPredicitveModule { }
