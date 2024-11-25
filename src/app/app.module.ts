import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
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
import { CreateClientModule } from './create-client/create-client.module';
import { ControlBoardModule } from './control-board/control-board.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { ControlBoardPredicitveModule } from './control-board-predicitve/control-board-predicitve.module';

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
    IncidentModule,
    CreateClientModule,
    ControlBoardModule,
    ControlBoardPredicitveModule,
    ResetPasswordModule
  ],
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'en' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
