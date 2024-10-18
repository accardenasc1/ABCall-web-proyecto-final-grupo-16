import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentComponent } from './incident.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule ,
    MatPaginatorModule ,
    MatInputModule ,
    MatIconModule ,
    MatFormFieldModule 
  ],
  declarations: [IncidentComponent]
})
export class IncidentModule { }
