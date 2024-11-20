import { Component, ElementRef, ViewChild } from '@angular/core';
import { base64 } from '../base64-example-audio';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  title = 'frontend';

  @ViewChild('audioPlayer') audio!: ElementRef;

  play() {
    const audioBase64 = base64;
    const audioBinary = atob(audioBase64); // Decode base64
    const audioArray = new Uint8Array(audioBinary.length);

    for (let i = 0; i < audioBinary.length; i++) {
      audioArray[i] = audioBinary.charCodeAt(i);
    }

    const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Set the audio player source to the decoded audio
    this.audio.nativeElement.src = audioUrl;
    this.audio.nativeElement.play();
  }
}
