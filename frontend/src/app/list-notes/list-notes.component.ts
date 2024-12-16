import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { IoService } from '../services/io.service';
import { RecognizerService } from '../services/recognizer.service';
import { MatIconModule } from '@angular/material/icon';
import { AudioResponse } from '../models/audio-response';
import { Scenario } from '../models/scenario';
import { NoteShort } from '../models/note';
import { RobotAction } from '../models/robot-action';
import { AnimationService } from '../services/animation.service';

@Component({
  selector: 'app-list-notes',
  standalone: true,
  imports: [
    CommonModule,
    MessageComponent,
    MatIconModule,
  ],
  templateUrl: './list-notes.component.html',
  styleUrl: './list-notes.component.scss',
})
export class ListNotesComponent implements OnDestroy {
  noteService = inject(NoteService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);
  animationService = inject(AnimationService);

  @Input() scenario!: Scenario;
  @Output() goBack = new EventEmitter();

  micSubscription: Subscription | null = null;

  notes: NoteShort[] = [];
  page = 1;

  constructor() {
    this.animationService.playAnimation(RobotAction.Think);
    this.noteService
      .getNotes(this.page)
      .pipe(
        tap((response) => {
          this.ioService.read(response.b64_phrase, response.phrase);
          setTimeout(() => {
            this.ioService.read(
              this.scenario.questions[0].b64_phrase,
              this.scenario.questions[0].phrase
            );
          }, 3000);
        }),
        map((response) => response.body)
      )
      .subscribe((notes) => {
        this.notes = [...this.notes, ...notes];
      });

    this.micSubscription = this.ioService.micOutput$
      .pipe(
        switchMap((audio) => this.recognizerService.recognizeBoolean(audio)),
        switchMap((response) => {
          if (response.result) {
            this.page++;
            this.animationService.playAnimation(RobotAction.Think);
            return this.noteService.getNotes(this.page);
          }
          return new Observable<null>();
        }),
        map((response?: AudioResponse<NoteShort[]> | null) =>response ? response.body : [])
      )
      .subscribe((notes) => {
        if (notes.length > 0) {
          this.notes = [...this.notes, ...notes];
          this.ioService.read(
            this.scenario.questions[0].b64_phrase,
            this.scenario.questions[0].phrase
          );
        }
      });
  }
  ngOnDestroy(): void {
    this.micSubscription?.unsubscribe();
    this.ioService.clearAudioQueue();
  }
}
