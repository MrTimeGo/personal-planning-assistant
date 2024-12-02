import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-calendar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-calendar.component.html',
  styleUrl: './add-calendar.component.scss',
})
export class AddCalendarComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  eventService = inject(EventService);

  form = new FormGroup({
    calendarId: new FormControl('', [Validators.required]),
  });

  calendarIdErrorMessage = signal('');

  submit() {
    if (this.form.valid) {
      this.eventService.addCalendar(this.form.value.calendarId!).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  updateCalendarIdErrorMessage() {
    if (this.form.controls.calendarId.hasError('required')) {
      this.calendarIdErrorMessage.set('Calendar ID is required');
    }
  }
}
