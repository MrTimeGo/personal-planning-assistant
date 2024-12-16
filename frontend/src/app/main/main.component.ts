import { Component, ElementRef, inject, ViewChild } from '@angular/core';
// import { base64 } from '../base64-example-audio';
import { IoComponent } from '../io/io.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommandListComponent } from '../command-list/command-list.component';
import { NewNoteComponent } from '../new-note/new-note.component';
import { ListNotesComponent } from '../list-notes/list-notes.component';
import { IoService } from '../services/io.service';
import { RecognizerService } from '../services/recognizer.service';
import { catchError, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Command } from '../models/command';
import { Scenario } from '../models/scenario';
import { ReadNoteComponent } from '../read-note/read-note.component';
import { NewEventComponent } from '../new-event/new-event.component';
import { EventListComponent } from '../event-list/event-list.component';
import { RemoveEventComponent } from '../remove-event/remove-event.component';
import { AnimationService } from '../services/animation.service';
import { RobotAction } from '../models/robot-action';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    IoComponent,
    CommonModule,
    MatButtonModule,
    CommandListComponent,
    ListNotesComponent,
    NewNoteComponent,
    ReadNoteComponent,
    NewEventComponent,
    EventListComponent,
    RemoveEventComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  auth = inject(AuthService);
  ioService = inject(IoService);
  animationService = inject(AnimationService);
  recognizerService = inject(RecognizerService);
  router = inject(Router);

  profile = this.auth.profile();

  commandEnum = Command;

  currentCommand: Command | null = null;
  scenario: Scenario | null = null;

  micSubscription: Subscription | null = null;

  constructor() {
    this.toggleView(null);
  }

  logout() {
    this.animationService.playAnimation(RobotAction.Bye);

    setTimeout(() => {
      this.auth.logout().subscribe({
        next: () => {
          this.router.navigate(['sign-in']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
    }, 2800);
  }

  toggleView(command: Command | null) {
    this.currentCommand = command;

    if (command) {
      this.micSubscription?.unsubscribe();
      this.micSubscription = null;
    } else {
      this.micSubscription = this.ioService.micOutput$
        .pipe(
          tap(() => {
            this.animationService.playAnimation(RobotAction.Think);
          }),
          switchMap((resp) =>
            of(resp).pipe(
              switchMap((audio) =>
                this.recognizerService.recognizeCommand(audio)
              ),
              catchError((error) => {
                this.ioService.read(error.error.b64_phrase, error.error.phrase, true);
                return new Observable<undefined>();
              })
            )
          )
        )
        .subscribe((response) => {
          this.animationService.playAnimation(RobotAction.Stay);
          if (response) {
            this.toggleView(response.command);
            this.scenario = response.scenario;
          }
        });
    }
  }
}
