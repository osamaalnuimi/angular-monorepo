import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import * as AuthSelectors from '../+state/auth.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(AuthSelectors.selectToken).pipe(
    take(1),
    switchMap((token) => {
      // If there's a token, clone the request and add the authorization header
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next(authReq);
      }

      // If there's no token, just pass the request through
      return next(req);
    })
  );
};
