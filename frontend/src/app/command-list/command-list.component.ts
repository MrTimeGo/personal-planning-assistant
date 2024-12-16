import { Component, Input } from '@angular/core';
import { MessageComponent } from "../message/message.component";

export enum CommandCategory{
  Note,
  Event
}
@Component({
  selector: 'app-command-list',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './command-list.component.html',
  styleUrl: './command-list.component.scss',
})
export class CommandListComponent {
  @Input() profile?: string;
  CommandCategory=CommandCategory;

    commandsWithCategories: Map<CommandCategory, string[]> = new Map([
      [CommandCategory.Note, ['Make a note',
        'What notes do I have?',
        'Read the note']],
        [CommandCategory.Event, ['Create an event',
          'What is planned for today?',
          'What is planned for this week?',
          'What is planned for next week?',
          'Remove the event',]]
    ]);
}
