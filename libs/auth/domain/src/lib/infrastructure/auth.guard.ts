import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map, take, switchMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../+state/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(AuthSelectors.selectIsAuthenticated).pipe(
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}

export const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate();
};

export const hasPermission = (permission: string): CanActivateFn => {
  return (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(AuthSelectors.selectIsAuthenticated).pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return of(router.createUrlTree(['/login']));
        }

        // Always allow access to dashboard for authenticated users
        if (permission === 'view:dashboard') {
          return of(true);
        }

        return store.select(AuthSelectors.selectUserPermissions).pipe(
          take(1),
          map((permissions) => {
            if (permissions.includes(permission)) {
              return true;
            }

            // If authenticated but doesn't have permission, redirect to home
            return router.createUrlTree(['/']);
          })
        );
      })
    );
  };
};

export const isSuperAdmin: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(AuthSelectors.selectIsAuthenticated).pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return of(router.createUrlTree(['/login']));
      }

      return store.select(AuthSelectors.selectIsSuperAdmin).pipe(
        take(1),
        map((isSuperAdmin) => {
          if (isSuperAdmin) {
            return true;
          }

          // If authenticated but not super admin, redirect to home
          return router.createUrlTree(['/']);
        })
      );
    })
  );
};
