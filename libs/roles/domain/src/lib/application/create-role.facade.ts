import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '@angular-monorepo/auth/domain';
import { Store } from '@ngrx/store';
import { RolesActions } from '../+state/roles.actions';
import { rolesFeature } from '../+state/roles.reducer';

@Injectable()
export class CreateRoleFacade {
  private store = inject(Store);

  // Selectors
  loading$: Observable<boolean> = this.store.select(rolesFeature.selectLoading);
  error$: Observable<string | null> = this.store.select(
    rolesFeature.selectError
  );
  permissions$: Observable<{ label: string; value: string }[]> =
    this.store.select(rolesFeature.selectPermissions);

  // Actions
  createRole(role: Omit<Role, 'id'>): void {
    this.store.dispatch(RolesActions.createRole({ role }));
  }

  loadPermissions(): void {
    this.store.dispatch(RolesActions.loadPermissions());
  }
}
