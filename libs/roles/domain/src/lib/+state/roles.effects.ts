import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { RolesService } from '../infrastructure/roles.service';
import { RolesActions } from './roles.actions';

@Injectable()
export class RolesEffects {
  private actions$ = inject(Actions);
  private rolesService = inject(RolesService);
  private messageService = inject(MessageService);

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      switchMap(() =>
        this.rolesService.getAllRoles().pipe(
          map((roles) => RolesActions.loadRolesSuccess({ roles })),
          catchError((error) =>
            of(RolesActions.loadRolesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      mergeMap(({ role }) =>
        this.rolesService.createRole(role).pipe(
          map((createdRole) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Role created successfully',
            });
            return RolesActions.createRoleSuccess({ role: createdRole });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create role',
            });
            return of(RolesActions.createRoleFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.updateRole),
      mergeMap(({ role }) =>
        this.rolesService.updateRole(role).pipe(
          map((updatedRole) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Role updated successfully',
            });
            return RolesActions.updateRoleSuccess({ role: updatedRole });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update role',
            });
            return of(RolesActions.updateRoleFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deleteRole),
      mergeMap(({ roleId }) =>
        this.rolesService.deleteRole(roleId).pipe(
          map(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Role deleted successfully',
            });
            return RolesActions.deleteRoleSuccess({ roleId });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete role',
            });
            return of(RolesActions.deleteRoleFailure({ error: error.message }));
          })
        )
      )
    )
  );

  checkRoleDeletable$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.checkRoleDeletable),
      mergeMap(({ roleId }) =>
        this.rolesService.canDeleteRole(roleId).pipe(
          map((canDelete) =>
            RolesActions.checkRoleDeletableSuccess({ roleId, canDelete })
          ),
          catchError((error) =>
            of(RolesActions.checkRoleDeletableFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadPermissions),
      switchMap(() =>
        this.rolesService.getAvailablePermissions().pipe(
          map((permissions) =>
            RolesActions.loadPermissionsSuccess({ permissions })
          ),
          catchError((error) =>
            of(RolesActions.loadPermissionsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
