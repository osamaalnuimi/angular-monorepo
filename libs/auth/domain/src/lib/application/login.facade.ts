import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoginRequest, User } from '../entities/user.model';
import { AuthActions } from '../+state/auth.actions';
import * as AuthSelectors from '../+state/auth.selectors';

@Injectable({ providedIn: 'root' })
export class LoginFacade {
  private store = inject(Store);

  // Selectors as observables
  readonly user$: Observable<User | null> = this.store.select(
    AuthSelectors.selectUser
  );
  readonly isAuthenticated$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsAuthenticated
  );
  readonly loading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectLoading
  );
  readonly error$: Observable<string | null> = this.store.select(
    AuthSelectors.selectError
  );
  readonly userPermissions$: Observable<string[]> = this.store.select(
    AuthSelectors.selectUserPermissions
  );
  readonly userRole$: Observable<string | null> = this.store.select(
    AuthSelectors.selectUserRole
  );
  readonly isSuperAdmin$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsSuperAdmin
  );

  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  checkAuth(): void {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
