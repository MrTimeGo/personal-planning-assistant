import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Auth } from '../models/auth';
import { AnimationService } from '../services/animation.service';
import { RobotAction } from '../models/robot-action';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  authService = inject(AuthService);
  animationService = inject(AnimationService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  updateEmailErrorMessage() {
    if (this.form.controls.email.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.form.controls.email.hasError('email')) {
      this.emailErrorMessage.set('Email is not valid');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.form.controls.password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.authService.signIn(this.form.value as unknown as Auth).subscribe({
      next: () => {
        this.animationService.currentAnimation$.next(RobotAction.Hello);
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
