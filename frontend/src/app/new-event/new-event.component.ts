import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription, switchMap, map, Observable, tap } from 'rxjs';
import { Scenario } from '../models/scenario';
import { IoService } from '../services/io.service';
import { NoteService } from '../services/note.service';
import { RecognizerService } from '../services/recognizer.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.scss',
})
export class NewEventComponent implements OnInit, OnDestroy {
  eventService = inject(EventService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);

  @Input() scenario!: Scenario;
  @Output() goBack = new EventEmitter();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
  });

  nameErrorMessage = signal('');
  startErrorMessage = signal('');
  endErrorMessage = signal('');

  micSubscription: Subscription | null = null;
  index = 0;

  defaultCalendarId = '036ecfe1a25e74938a2224b16a0c224beebcd3b5b8cab3cfba1562ceb6ddbf58@group.calendar.google.com';

  ngOnDestroy(): void {
    this.micSubscription?.unsubscribe();
    this.ioService.clearAudioQueue();
  }
  ngOnInit(): void {
    this.readQuestion();

    this.micSubscription = this.ioService.micOutput$
      .pipe(
        switchMap((audio) =>
          this.index === 0
            ? this.recognizerService.recognizeText(audio)
            : this.recognizerService.recognizeDate(audio)
        ),
        map((response) => response.result)
      )
      .subscribe((text) => {
        if (this.index === 0) {
          this.form.controls.name.patchValue(text.toString());
        } else if (this.index === 1) {
          this.form.controls.start.patchValue(text);
        } else if (this.index === 2) {
          this.form.controls.end.patchValue(text);
        }
        this.index++;
        if (this.index < 3) {
          this.readQuestion();
        }
      });
  }

  readQuestion() {
    this.ioService.read(
      this.scenario.questions[this.index].b64_phrase,
      this.scenario.questions[this.index].phrase
    );
  }

  updateNameErrorMessage() {
    if (this.form.controls.name.hasError('required')) {
      this.nameErrorMessage.set('Name is required');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateStartErrorMessage() {
    if (this.form.controls.start.hasError('required')) {
      this.startErrorMessage.set('Start date is required');
    } else {
      this.startErrorMessage.set('');
    }
  }

  updateEndErrorMessage() {
    if (this.form.controls.start.hasError('required')) {
      this.endErrorMessage.set('End date is required');
    } else {
      this.endErrorMessage.set('');
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.eventService.trackCalendar().pipe(
      tap(({calendar_id})=> {
        console.log(calendar_id);
        if(calendar_id != this.defaultCalendarId){
          this.eventService.addCalendar(this.defaultCalendarId);
        }
      }),
      switchMap(()=>this.eventService.createEvent({
            name: this.form.value.name!,
            start: new Date(Date.parse(this.form.value.start!)),
            end: new Date(Date.parse(this.form.value.end!)),
          })))
      .subscribe((response) => {
        if(response){
          this.ioService.read(response.b64_phrase, response.phrase);
          setTimeout(() => {
            this.goBack.emit();
          }, 4000);
        }
      });
    
  }
}
