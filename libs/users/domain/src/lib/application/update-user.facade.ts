import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role, User } from '@angular-monorepo/auth/domain';
import { UsersActions } from '../+state/users.actions';
import { usersFeature } from '../+state/users.reducer';

@Injectable()
export class UpdateUserFacade {
  private store = inject(Store);

  // Selectors
  selectedUser$: Observable<User | null> = this.store.select(
    usersFeature.selectSelectedUser
  );
  loading$: Observable<boolean> = this.store.select(usersFeature.selectLoading);
  error$: Observable<string | null> = this.store.select(
    usersFeature.selectError
  );
  roles$: Observable<Role[]> = this.store.select(usersFeature.selectRoles);

  // Actions
  loadRoles(): void {
    this.store.dispatch(UsersActions.loadRoles());
  }

  selectUser(user: User | null): void {
    this.store.dispatch(UsersActions.selectUser({ user }));
  }

  updateUser(user: User): void {
    this.store.dispatch(UsersActions.updateUser({ user }));
  }
}
