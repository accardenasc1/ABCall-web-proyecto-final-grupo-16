import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateClientComponent } from './create-client.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxLoadingModule } from "@dchtools/ngx-loading-v18";
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectPlanComponent } from './select-plan/select-plan/select-plan.component';
import { SelectedModalComponent } from './selected-modal/selected-modal/selected-modal.component';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: CreateClientComponent,
    children: [
      { path: 'select-plan', component: SelectPlanComponent } // Ruta hija
    ]
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
    MatDialogContent,
    MatDialogActions,
    NgxLoadingModule.forRoot({}),
    RouterModule.forChild(routes)

  ],
  declarations: [CreateClientComponent,SelectPlanComponent,SelectedModalComponent],
  exports: [CreateClientComponent, RouterModule,SelectPlanComponent,SelectedModalComponent],
  providers: [provideHttpClient(), provideNativeDateAdapter()],
})
export class CreateClientModule {}

