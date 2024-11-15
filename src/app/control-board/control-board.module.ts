import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlBoardComponent } from './control-board.component';
import { provideHttpClient } from '@angular/common/http';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ControlBoardComponent
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
  declarations: [ControlBoardComponent],
  exports: [ControlBoardComponent, RouterModule],
  providers: [provideHttpClient(), provideNativeDateAdapter()],
})
export class ControlBoardModule { }
