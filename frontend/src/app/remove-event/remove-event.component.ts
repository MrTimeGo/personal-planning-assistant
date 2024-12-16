import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, switchMap, of, catchError, Observable, tap } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { Note } from '../models/note';
import { Scenario } from '../models/scenario';
import { IoService } from '../services/io.service';
import { NoteService } from '../services/note.service';
import { RecognizerService } from '../services/recognizer.service';
import { EventService } from '../services/event.service';
import { RobotAction } from '../models/robot-action';
import { AnimationService } from '../services/animation.service';

@Component({
  selector: 'app-remove-event',
  standalone: true,
  imports: [CommonModule, MessageComponent, MatIconModule],
  templateUrl: './remove-event.component.html',
  styleUrl: './remove-event.component.scss',
})
export class RemoveEventComponent implements OnInit, OnDestroy {
  eventService = inject(EventService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);
  animationService = inject(AnimationService)

  @Input() scenario!: Scenario;
  @Output() goBack = new EventEmitter();

  micSubscription: Subscription | null = null;

  message?: string;
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
            switchMap((response) => this.eventService.removeEvent(response.result)),
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
          this.message = response.phrase;
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
