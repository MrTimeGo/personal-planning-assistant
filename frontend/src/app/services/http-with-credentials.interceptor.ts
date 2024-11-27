import { HttpInterceptorFn } from '@angular/common/http';

export const httpWithCredentialsInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  return next(req.clone({ withCredentials: true }));
};
