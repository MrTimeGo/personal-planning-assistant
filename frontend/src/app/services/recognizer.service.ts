import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Command } from '../models/command';
import { Scenario } from '../models/scenario';

@Injectable({
  providedIn: 'root',
})
export class RecognizerService {
  baseUrl = environment.backendUrl;

  httpClient = inject(HttpClient);

  recognizeCommand(audio: Blob) {
    const formData = new FormData();
    formData.append('audio', audio, 'recording.wav');
    return this.httpClient.post<{ command: Command; scenario: Scenario }>(
      `${this.baseUrl}/recognize_command`,
      formData
    );
  }

  recognizeText(audio: Blob) {
    const formData = new FormData();
    formData.append('audio', audio, 'recording.wav');
    return this.httpClient.post<{ result: string }>(
      `${this.baseUrl}/recognize_text`,
      formData
    );
  }

  recognizeBoolean(audio: Blob) {
    const formData = new FormData();
    formData.append('audio', audio, 'recording.wav');
    return this.httpClient.post<{ result: boolean }>(
      `${this.baseUrl}/recognize_boolean`,
      formData
    );
  }

  recognizeDate(audio: Blob) {
    const formData = new FormData();
    formData.append('audio', audio, 'recording.wav');
    return this.httpClient.post<{ result: string }>(
      `${this.baseUrl}/recognize_date`,
      formData
    );
  }
}
