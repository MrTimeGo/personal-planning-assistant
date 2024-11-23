import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  codeErrorMessage = signal('');

  updateCodeErrorMessage() {
    if (this.form.controls.code.hasError('required')) {
      this.codeErrorMessage.set('Code is required');
    } 
  }
}
