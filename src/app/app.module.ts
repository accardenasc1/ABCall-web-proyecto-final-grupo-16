import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './home/home.module';
import { IncidentModule } from './create-incident/create-incident.module';
import { UserSignUpModule } from './user-sign-up/user-sign-up.module';
import { LoginModule } from './login/login.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HomeModule,
    IncidentModule,
    UserSignUpModule,
    LoginModule,
    UserModule
  ],
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
