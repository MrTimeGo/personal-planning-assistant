import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MicButtonComponent } from './mic-button/mic-button.component';
import { IoService } from '../services/io.service';
import { exampleAudio } from '../base64-example-audio';

@Component({
  selector: 'app-io',
  standalone: true,
  imports: [MicButtonComponent],
  templateUrl: './io.component.html',
  styleUrl: './io.component.scss',
})
export class IoComponent {
  private ioService = inject(IoService);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  phrase = '';
  isRecording = false;

  constructor() {
    this.ioService.audioQueue$.subscribe((audioData) => {
      if (audioData.b64Phrase) {
        this.play(audioData.b64Phrase);
      }
      this.phrase = audioData.phrase;
    });
  }

  @ViewChild('audioPlayer') audio!: ElementRef;

  play(b64Phrase: string) {
    const audioBinary = atob(b64Phrase); // Decode base64
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

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.ioService.output(audioBlob);
        });

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
}
