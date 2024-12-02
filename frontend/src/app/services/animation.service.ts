import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RobotAction } from '../models/robot-action';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  currentAnimation$ = new BehaviorSubject<RobotAction>(RobotAction.Stay);
}
