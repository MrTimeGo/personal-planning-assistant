import { Component, ElementRef, inject, ViewChild } from '@angular/core';
// import { base64 } from '../base64-example-audio';
import { IoComponent } from '../io/io.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [IoComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  auth = inject(AuthService);
  router = inject(Router);

  profile = this.auth.profile();

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

  // @ViewChild('audioPlayer') audio!: ElementRef;

  // play() {
  //   const audioBase64 = base64;
  //   const audioBinary = atob(audioBase64); // Decode base64
  //   const audioArray = new Uint8Array(audioBinary.length);

  //   for (let i = 0; i < audioBinary.length; i++) {
  //     audioArray[i] = audioBinary.charCodeAt(i);
  //   }

  //   const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
  //   const audioUrl = URL.createObjectURL(audioBlob);

  //   // Set the audio player source to the decoded audio
  //   this.audio.nativeElement.src = audioUrl;
  //   this.audio.nativeElement.play();
  // }
}
