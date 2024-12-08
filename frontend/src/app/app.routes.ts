import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyComponent } from './verify/verify.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainComponent } from './main/main.component';
import { AddCalendarComponent } from './add-calendar/add-calendar.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    component: SignUpComponent,
    path: 'sign-up',
  },
  {
    component: VerifyComponent,
    path: 'verify',
  },
  {
    component: AddCalendarComponent,
    path: 'calendar',
  },
  {
    component: AddCalendarComponent,
    path: 'calendar',
  },
  {
    component: SignInComponent,
    path: 'sign-in',
  },
  {
    component: MainComponent,
    path: '',
    canActivate: [authGuard]
  },
];
