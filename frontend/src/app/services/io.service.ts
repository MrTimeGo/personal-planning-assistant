import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IoService {
  private _micOutput$ = new Subject<Blob>();
  get micOutput$() {
    return this._micOutput$.asObservable();
  }

  private _audioQueue$ = new BehaviorSubject<{
    b64Phrase: string;
    phrase: string;
    error?: boolean
  }>({
    b64Phrase: '',
    phrase: '',
    error: false
  });

  get audioQueue$() {
    return this._audioQueue$.asObservable();
  }

  read(b64Phrase: string, phrase: string, error?: boolean) {
    this._audioQueue$.next({ b64Phrase, phrase, error });
  }

  output(audio: Blob) {
    this._micOutput$.next(audio);
  }

  clearAudioQueue(){
    this._audioQueue$.next({b64Phrase: '', phrase: ''});
  }
}
