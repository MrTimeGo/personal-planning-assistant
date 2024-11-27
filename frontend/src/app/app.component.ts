import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { exampleAudio } from './base64-example-audio';
import { AudioRecorderComponent } from "./audio-recorder/audio-recorder.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioRecorderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // title = 'frontend';

  // @ViewChild('audioPlayer') audio!: ElementRef;


  // play() {
  //   const audioBase64 = exampleAudio.base64;
  //   const audioBinary = atob(audioBase64);  // Decode base64
  //   const audioArray = new Uint8Array(audioBinary.length);

  //   for (let i = 0; i < audioBinary.length; i++) {
  //       audioArray[i] = audioBinary.charCodeAt(i);
  //   }

  //   const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
  //   const audioUrl = URL.createObjectURL(audioBlob);

  //   // Set the audio player source to the decoded audio
  //   this.audio.nativeElement.src = audioUrl;
  //   this.audio.nativeElement.play();
  // }
}
