import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RobotAction } from '../models/robot-action';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

  get currentAnimation$() {
    return this._currentAnimation$.asObservable();
  }

  private _currentAnimation$ = new BehaviorSubject<RobotAction>(RobotAction.Stay);

  playAnimation(action: RobotAction) {
    this._currentAnimation$.next(action);

    // if (action === RobotAction.Error) {
    //   setTimeout(() => {
    //     this._currentAnimation$.next(RobotAction.Stay);
    //   }, 2000);
    // }
  }
}
