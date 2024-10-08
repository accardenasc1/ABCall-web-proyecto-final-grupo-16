import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { IncidentComponent } from './incident/incident.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [  
      // Ejemplo:
       { path: 'home', component: HomeComponent },  
       { path: 'incident', component: IncidentComponent },
       { path: '', redirectTo: 'home', pathMatch: 'full' } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }