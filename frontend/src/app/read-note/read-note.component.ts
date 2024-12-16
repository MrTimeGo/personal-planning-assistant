import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageComponent } from "../message/message.component";
import { Subscription } from 'rxjs/internal/Subscription';
import { Note } from '../models/note';
import { Scenario } from '../models/scenario';
import { IoService } from '../services/io.service';
import { NoteService } from '../services/note.service';
import { RecognizerService } from '../services/recognizer.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { catchError, map, Observable, of, repeat, switchMap, tap } from 'rxjs';
import { RobotAction } from '../models/robot-action';
import { AnimationService } from '../services/animation.service';

@Component({
  selector: 'app-read-note',
  standalone: true,
  imports: [CommonModule, MessageComponent, MatIconModule],
  templateUrl: './read-note.component.html',
  styleUrl: './read-note.component.scss',
})
export class ReadNoteComponent implements OnInit, OnDestroy {
  noteService = inject(NoteService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);
  animationService = inject(AnimationService);

  @Input() scenario!: Scenario;
  @Output() goBack = new EventEmitter();

  micSubscription: Subscription | null = null;

  note?: Note;
  index = 0;

  ngOnInit(): void {
    this.readQuestion();

    this.micSubscription = this.ioService.micOutput$
      .pipe(
        tap(() => {
          this.animationService.playAnimation(RobotAction.Think);
        }),
        switchMap((resp) =>
          of(resp).pipe(
            switchMap((audio) => this.recognizerService.recognizeText(audio)),
            switchMap((response) => this.noteService.getNote(response.result)),
            catchError((error) => {
              this.ioService.read(error.error.b64_phrase, error.error.phrase, true);
              return new Observable<undefined>();
            })
          )
        )
      )
      .subscribe((response) => {
        if (response) {
          this.ioService.read(response.b64_phrase, response.phrase);
          this.note = {
            name: response.body.name,
            content: response.body.content,
          };
        }
      });
  }
  ngOnDestroy(): void {
    this.micSubscription?.unsubscribe();
    this.ioService.clearAudioQueue();
  }

  readQuestion() {
    this.ioService.read(
      this.scenario.questions[this.index].b64_phrase,
      this.scenario.questions[this.index].phrase
    );
  }
}
