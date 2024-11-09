import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CreateClientComponent } from './create-client/create-client.component';
import { SelectPlanComponent } from './create-client/select-plan/select-plan/select-plan.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'user-sign-up', component: UserSignUpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: 'home',  loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
      { path: 'incident', loadChildren: () => import('./incident/incident.module').then(m => m.IncidentModule), canActivate: [AuthGuard]},
      { path: 'create-incident', loadChildren: () => import('./create-incident/create-incident.module').then(m => m.CreateIncidentModule) , canActivate: [AuthGuard]},
      {
        path: 'client',
        component: CreateClientComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'select-plan', component: SelectPlanComponent } // Ruta hija
        ]
      },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [AuthGuard]},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
