import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ResponseIncidentComponent } from './response-incident.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxLoadingModule } from "@dchtools/ngx-loading-v18";
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
  {
    path: '',
    component: ResponseIncidentComponent
  }
];
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
    MatIconModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forChild(routes)

  ],
  declarations: [ResponseIncidentComponent],
  exports: [ResponseIncidentComponent, RouterModule],
  providers: [provideHttpClient(), provideNativeDateAdapter()],
})
export class ResponseIncidentModule {}
