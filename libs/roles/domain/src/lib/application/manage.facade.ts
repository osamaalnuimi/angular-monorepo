import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Role } from '@angular-monorepo/auth/domain';
import { RolesActions } from '../+state/roles.actions';
import { rolesFeature } from '../+state/roles.reducer';

@Injectable({
  providedIn: 'root',
})
export class ManageFacade {
  private store = inject(Store);

  // Selectors
  roles$: Observable<Role[]> = this.store.select(rolesFeature.selectRoles);
  selectedRole$: Observable<Role | null> = this.store.select(
    rolesFeature.selectSelectedRole
  );
  loading$: Observable<boolean> = this.store.select(rolesFeature.selectLoading);
  error$: Observable<string | null> = this.store.select(
    rolesFeature.selectError
  );
  permissions$: Observable<{ label: string; value: string }[]> =
    this.store.select(rolesFeature.selectPermissions);

  // Actions
  loadRoles(): void {
    this.store.dispatch(RolesActions.loadRoles());
  }

  loadPermissions(): void {
    this.store.dispatch(RolesActions.loadPermissions());
  }

  selectRole(role: Role | null): void {
    this.store.dispatch(RolesActions.selectRole({ role }));
  }

  createRole(role: Omit<Role, 'id'>): void {
    this.store.dispatch(RolesActions.createRole({ role }));
  }

  updateRole(role: Role): void {
    this.store.dispatch(RolesActions.updateRole({ role }));
  }

  deleteRole(roleId: number): void {
    this.store.dispatch(RolesActions.deleteRole({ roleId }));
  }

  checkRoleDeletable(roleId: number): void {
    this.store.dispatch(RolesActions.checkRoleDeletable({ roleId }));
  }
}
