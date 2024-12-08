import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthService);
  const router = inject(Router);

  return authService.profile().pipe(
    map((response) => {
      return true;
    }),
    catchError((error) => {
      router.navigate(['/sign-in']);
      return of(false);
    })
  );

  
};
