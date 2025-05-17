import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
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

  // Selector for checking if a role can be deleted
  canDeleteRole$: Observable<{ [roleId: number]: boolean } | null> =
    this.store.select(rolesFeature.selectCanDeleteRole);

  // Method to check if a specific role can be deleted
  canDeleteRoleById$(roleId: number): Observable<boolean | null> {
    return this.canDeleteRole$.pipe(
      map((canDeleteMap) => (canDeleteMap ? canDeleteMap[roleId] : null))
    );
  }

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

  /**
   * Checks if a role can be deleted before proceeding with deletion.
   * This should be called before attempting to delete a role.
   */
  checkRoleDeletable(roleId: number): void {
    this.store.dispatch(RolesActions.checkRoleDeletable({ roleId }));
  }

  /**
   * Deletes a role. Make sure to call checkRoleDeletable first to verify
   * the role is not assigned to any users.
   */
  deleteRole(roleId: number): void {
    this.store.dispatch(RolesActions.deleteRole({ roleId }));
  }
}
