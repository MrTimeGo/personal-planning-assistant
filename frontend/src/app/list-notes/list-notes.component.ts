import { Component, inject, Input } from '@angular/core';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { Scenario } from '../models/scenario';
import { map, tap } from 'rxjs';
import { IoService } from '../services/io.service';

@Component({
  selector: 'app-list-notes',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './list-notes.component.html',
  styleUrl: './list-notes.component.scss',
})
export class ListNotesComponent {
  noteService = inject(NoteService);
  ioService = inject(IoService);

  @Input() scenario!: Scenario;

  notes$ = this.noteService.getNotes().pipe(
    tap((response) => {
      console.log(response);
      this.ioService.read(response.b64_phrase, response.phrase);
    }),
    map((response) => response.body)
  );
}
