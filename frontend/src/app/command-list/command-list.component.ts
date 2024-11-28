import { Component, Input } from '@angular/core';
import { MessageComponent } from "../message/message.component";

@Component({
  selector: 'app-command-list',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './command-list.component.html',
  styleUrl: './command-list.component.scss',
})
export class CommandListComponent {
  @Input() profile?: string;
  commands = [
    'Make a note',
    'What notes do I have?',
    'Read the note',
    'Create an event',
    'What is planned for today?',
    'What is planned for this week?',
    'What is planned for next week?',
    'Remove the event',
  ];
}
