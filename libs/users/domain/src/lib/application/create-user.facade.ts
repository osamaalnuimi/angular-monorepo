import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role, User } from '@angular-monorepo/auth/domain';
import { UsersActions } from '../+state/users.actions';
import { usersFeature } from '../+state/users.reducer';

@Injectable()
export class CreateUserFacade {
  private store = inject(Store);

  // Selectors
  loading$: Observable<boolean> = this.store.select(usersFeature.selectLoading);
  error$: Observable<string | null> = this.store.select(
    usersFeature.selectError
  );
  roles$: Observable<Role[]> = this.store.select(usersFeature.selectRoles);

  // Actions
  loadRoles(): void {
    this.store.dispatch(UsersActions.loadRoles());
  }

  createUser(user: Omit<User, 'id'>): void {
    this.store.dispatch(UsersActions.createUser({ user }));
  }
}
