import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Animation } from '../models/animation';


@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  currentAnimation$ = new BehaviorSubject<Animation>(Animation.Hello);
}
