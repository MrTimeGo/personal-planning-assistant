import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-mic-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './mic-button.component.html',
  styleUrl: './mic-button.component.scss',
})
export class MicButtonComponent {
  @Output() microEvent = new EventEmitter<boolean>();
  isMicroEnabled: boolean = false;

  toggleMicro(){
    this.isMicroEnabled = !this.isMicroEnabled;
    this.microEvent.emit(this.isMicroEnabled);
  }
}
