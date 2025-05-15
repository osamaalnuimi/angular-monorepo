import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role, User } from '@angular-monorepo/auth/domain';
import { UsersActions } from '../+state/users.actions';
import { usersFeature } from '../+state/users.reducer';

@Injectable({
  providedIn: 'root',
})
export class ManageFacade {
  private store = inject(Store);

  // Selectors
  users$: Observable<User[]> = this.store.select(usersFeature.selectUsers);
  selectedUser$: Observable<User | null> = this.store.select(
    usersFeature.selectSelectedUser
  );
  loading$: Observable<boolean> = this.store.select(usersFeature.selectLoading);
  error$: Observable<string | null> = this.store.select(
    usersFeature.selectError
  );
  roles$: Observable<Role[]> = this.store.select(usersFeature.selectRoles);

  // Actions
  loadUsers(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  loadRoles(): void {
    this.store.dispatch(UsersActions.loadRoles());
  }

  selectUser(user: User | null): void {
    this.store.dispatch(UsersActions.selectUser({ user }));
  }

  createUser(user: Omit<User, 'id'>): void {
    this.store.dispatch(UsersActions.createUser({ user }));
  }

  updateUser(user: User): void {
    this.store.dispatch(UsersActions.updateUser({ user }));
  }

  deleteUser(userId: number): void {
    this.store.dispatch(UsersActions.deleteUser({ userId }));
  }
}
