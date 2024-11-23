import { Component } from '@angular/core';
import { MicButtonComponent } from "./mic-button/mic-button.component";

@Component({
  selector: 'app-io',
  standalone: true,
  imports: [MicButtonComponent],
  templateUrl: './io.component.html',
  styleUrl: './io.component.scss'
})
export class IoComponent {

}
