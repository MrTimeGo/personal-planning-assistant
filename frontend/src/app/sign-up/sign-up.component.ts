import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.confirmPassword
    ? null
    : { PasswordNoMatch: true };
};

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  form = new FormGroup(
    {
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [confirmPasswordValidator],
    }
  );

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');

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
    } else if (
      this.form.controls.confirmPassword.dirty && this.form.hasError('PasswordNoMatch')
    ) {
      this.confirmPasswordErrorMessage.set('Password is not matched');
    } else {
      this.passwordErrorMessage.set('');
      this.confirmPasswordErrorMessage.set('');
    }
  }

  updateConfirmPasswordErrorMessage() {
    if (this.form.controls.confirmPassword.hasError('required')) {
      this.confirmPasswordErrorMessage.set('Confirmation password is required');
    } else if (this.form.hasError('PasswordNoMatch')) {
      this.confirmPasswordErrorMessage.set('Password is not matched');
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }
}
