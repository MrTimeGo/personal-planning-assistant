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


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    IoComponent,
    CommonModule,
    CommandListComponent,
    ListNotesComponent,
    NewNoteComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  auth = inject(AuthService);
  ioService = inject(IoService);
  recognizerService = inject(RecognizerService);
  router = inject(Router);

  profile = this.auth.profile();

  commandEnum = Command;

  currentCommand: Command | null = null;
  scenario: Scenario | null = null;

  micSubscription: Subscription | null = null;

  /**
   *
   */
  constructor() {
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
