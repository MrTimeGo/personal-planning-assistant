import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { NoteShort } from '../models/note';
import { AudioResponse } from '../models/audio-response';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  baseUrl = environment.backendUrl;

  httpClient = inject(HttpClient);

  getNotes(){
    return this.httpClient.get<AudioResponse<string[]>>(`${this.baseUrl}/notes`);
  }
}
