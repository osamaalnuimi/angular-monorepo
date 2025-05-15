import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import * as AuthSelectors from '../+state/auth.selectors';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const authService = inject(AuthService);

  // Skip token for login requests
  if (req.url.includes('/users?username=')) {
    return next(req);
  }

  return store.select(AuthSelectors.selectToken).pipe(
    take(1),
    switchMap((storeToken) => {
      let token = storeToken;

      // If no token in store but we're in browser, try localStorage as fallback
      if (!token && isBrowser) {
        token = authService.getToken();
      }

      // If there's a token, clone the request and add the authorization header
      if (token) {
        console.log('Adding token to request:', token);
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
