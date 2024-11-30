import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AudioResponse } from '../models/audio-response';
import { Event, Period } from '../models/event';
import { N } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  baseUrl = environment.backendUrl;

  httpClient = inject(HttpClient);

  createEvent(event: Event) {
    return this.httpClient.post<AudioResponse<string>>(
      `${this.baseUrl}/events`,
      event
    );
  }

  addCalendar(calendarId: string) {
    return this.httpClient.post(
      `${this.baseUrl}/events/track/${calendarId}`,
      {}
    );
  }

  trackCalendar() {
    return this.httpClient.get<{ calendar_id : string}>(
      `${this.baseUrl}/events/track`,
      {}
    );
  }

  getEvents(period: Period){
    return this.httpClient.get<AudioResponse<Event[]>>(
      `${this.baseUrl}/events/${period}`
    );
  }

  removeEvent(name: string){
    return this.httpClient.delete<AudioResponse<string>>(
      `${this.baseUrl}/events/${name}`,
    );
  }
}
