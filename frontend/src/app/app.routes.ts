import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyComponent } from './verify/verify.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainComponent } from './main/main.component';

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
    component: SignInComponent,
    path: 'sign-in',
  },
  {
    component: MainComponent,
    path: '',
  },
];
