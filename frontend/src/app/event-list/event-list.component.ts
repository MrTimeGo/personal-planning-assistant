import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageComponent } from '../message/message.component';
import { EventService } from '../services/event.service';
import { Command } from '../models/command';
import { Scenario } from '../models/scenario';
import { IoService } from '../services/io.service';
import { RecognizerService } from '../services/recognizer.service';
import { Event, Period } from '../models/event';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { AudioResponse } from '../models/audio-response';
import { NoteShort } from '../models/note';
import { AnimationService } from '../services/animation.service';
import { RobotAction } from '../models/robot-action';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, MessageComponent, MatIconModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit, OnDestroy {
  eventService = inject(EventService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);
  animationService = inject(AnimationService);

  @Input() scenario!: Scenario;
  @Input() command!: Command;
  @Output() goBack = new EventEmitter();

  micSubscription: Subscription | null = null;

  events: Event[] = [];

  periods: { [k: string]: Period } = {
    [Command.LIST_EVENTS_THIS_WEEK]: Period.ThisWeek,
    [Command.LIST_EVENTS_NEXT_WEEK]: Period.NextWeek,
    [Command.LIST_EVENTS_TODAY]: Period.Today,
  };

  period?: Period;

  ngOnInit(): void {
    this.period = this.periods[this.command];
    this.animationService.playAnimation(RobotAction.Think);
    this.eventService
      .getEvents(this.period)
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
      .subscribe((events) => {
        this.events = [...this.events, ...events];
      });
  }

  ngOnDestroy(): void {
    this.micSubscription?.unsubscribe();
    this.ioService.clearAudioQueue();
  }
}
