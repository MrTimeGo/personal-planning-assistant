import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AudioResponse } from '../models/audio-response';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  baseUrl = environment.backendUrl;

  httpClient = inject(HttpClient);

  getNotes(){
    return this.httpClient.get<AudioResponse<string[]>>(`${this.baseUrl}/notes`);
  }

  createNote(note: Note){
    return this.httpClient.post<AudioResponse<string[]>>(
      `${this.baseUrl}/notes`,
      note
    );
  }
}
