import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './home/home.module';
import { CreateIncidentModule } from './create-incident/create-incident.module';
import { UserSignUpModule } from './user-sign-up/user-sign-up.module';
import { LoginModule } from './login/login.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { UserModule } from './user/user.module';
import { IncidentModule } from './incident/incident.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HomeModule,
    CreateIncidentModule,
    UserSignUpModule,
    LoginModule,
    UserModule,
    IncidentModule
  ],
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
