import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from '@angular-monorepo/auth/domain';
import { Store } from '@ngrx/store';
import { RolesActions } from '../+state/roles.actions';
import { rolesFeature } from '../+state/roles.reducer';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UpdateRoleFacade {
  private store = inject(Store);

  // Selectors
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
  getRoleById(id: number): Observable<Role | null> {
    this.store.dispatch(RolesActions.loadRoleById({ id }));
    return this.selectedRole$.pipe(catchError(() => of(null)));
  }

  selectRole(role: Role | null): void {
    this.store.dispatch(RolesActions.selectRole({ role }));
  }

  updateRole(role: Role): void {
    this.store.dispatch(RolesActions.updateRole({ role }));
  }

  loadPermissions(): void {
    this.store.dispatch(RolesActions.loadPermissions());
  }
}
