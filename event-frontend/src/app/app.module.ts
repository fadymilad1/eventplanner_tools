import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventSearchComponent } from './components/event-search/event-search.component';

import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { InvitationService } from './services/invitation.service';
import { AttendanceService } from './services/attendance.service';
import { UserService } from './services/user.service';
import { AuthInterceptor } from './services/auth.interceptor';

// Route Guards
import { AuthGuard } from './guards/auth.guard';

// Define routes
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'events/create', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
  { path: 'events/:id/edit', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'events/search', component: EventSearchComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    EventFormComponent,
    EventDetailsComponent,
    EventSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    EventService,
    InvitationService,
    AttendanceService,
    UserService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
