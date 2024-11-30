import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AudioResponse, PlainAudioResponse } from '../models/audio-response';
import { Note, NoteShort } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  baseUrl = environment.backendUrl;

  httpClient = inject(HttpClient);

  getNotes(page: number){
    const params = new HttpParams().set('page', page);
    const options = {params: params};
    return this.httpClient.get<AudioResponse<NoteShort[]>>(
      `${this.baseUrl}/notes`,
      options
    );
  }

  createNote(note: Note){
    return this.httpClient.post<AudioResponse<string>>(
      `${this.baseUrl}/notes`,
      note
    );
  }

  getNote(name: string){
    return this.httpClient.get<AudioResponse<Note>>(
      `${this.baseUrl}/notes/${name}`
    );
  }
}
