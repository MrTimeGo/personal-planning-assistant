import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-note',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.scss',
})
export class NewNoteComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  nameErrorMessage = signal('');
  contentErrorMessage = signal('');

  updateNameErrorMessage() {
    if (this.form.controls.name.hasError('required')) {
      this.nameErrorMessage.set('Name is required');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateContentErrorMessage() {
    if (this.form.controls.content.hasError('required')) {
      this.contentErrorMessage.set('Content is required');
    } else {
      this.contentErrorMessage.set('');
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
  }
}
