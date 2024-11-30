import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Scenario } from '../models/scenario';
import { IoService } from '../services/io.service';
import { RecognizerService } from '../services/recognizer.service';
import { map, Subscription, switchMap } from 'rxjs';
import { NoteService } from '../services/note.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-note',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './new-note.component.html',
  styleUrl: './new-note.component.scss',
})
export class NewNoteComponent implements OnInit, OnDestroy {
  noteService = inject(NoteService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);

  @Input() scenario!: Scenario;
  @Output() goBack = new EventEmitter();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  nameErrorMessage = signal('');
  contentErrorMessage = signal('');

  micSubscription: Subscription | null = null;
  index = 0;

  ngOnDestroy(): void {
    this.micSubscription?.unsubscribe();
    this.ioService.clearAudioQueue();
  }
  ngOnInit(): void {
    this.readQuestion();

    this.micSubscription = this.ioService.micOutput$
      .pipe(
        switchMap((audio) => this.recognizerService.recognizeText(audio)),
        map((response) => response.result)
      )
      .subscribe((text) => {
        if (this.index === 0) {
          this.form.controls.name.patchValue(text);
        } else if (this.index === 1) {
          this.form.controls.content.patchValue(text);
        }
        this.index++;
        if (this.index < 2) {
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
    this.noteService.createNote({
      name: this.form.value.name!,
      content: this.form.value.content!,
    }).subscribe((response)=>{
      this.ioService.read(response.b64_phrase, response.phrase);
      setTimeout(()=>{
        this.goBack.emit();
      }, 4000)
    });
  }
}
