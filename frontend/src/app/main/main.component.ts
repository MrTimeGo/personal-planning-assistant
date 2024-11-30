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
import { Subscription, switchMap } from 'rxjs';
import { Command } from '../models/command';
import { Scenario } from '../models/scenario';
import { ReadNoteComponent } from "../read-note/read-note.component";
import { NewEventComponent } from "../new-event/new-event.component";
import { EventListComponent } from "../event-list/event-list.component";
import { RemoveEventComponent } from "../remove-event/remove-event.component";
import { AnimationService } from '../services/animation.service';
import { Animation } from '../models/animation';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    IoComponent,
    CommonModule,
    CommandListComponent,
    ListNotesComponent,
    NewNoteComponent,
    ReadNoteComponent,
    NewEventComponent,
    EventListComponent,
    RemoveEventComponent
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
    setTimeout(()=>{this.animationService.currentAnimation$.next(Animation.Stay)}, 1000);
    this.toggleView(null);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['sign-in']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  toggleView(command: Command | null) {
    this.currentCommand = command;

    if (command) {
      this.micSubscription?.unsubscribe();
      this.micSubscription = null;
    } else {
      this.micSubscription = this.ioService.micOutput$
        .pipe(
          switchMap((audio) => this.recognizerService.recognizeCommand(audio))
        )
        .subscribe(({ command, scenario }) => {
          this.toggleView(command);
          this.scenario = scenario;
        });
    }
  }
}
