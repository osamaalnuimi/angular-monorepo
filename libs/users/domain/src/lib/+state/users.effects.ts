import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { UsersService } from '../infrastructure/users.service';
import { UsersActions } from './users.actions';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersService.getAllUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UsersActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      mergeMap(({ user }) =>
        this.usersService.createUser(user).pipe(
          map((createdUser) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User created successfully',
            });
            return UsersActions.createUserSuccess({ user: createdUser });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create user',
            });
            return of(UsersActions.createUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ user }) =>
        this.usersService.updateUser(user).pipe(
          map((updatedUser) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User updated successfully',
            });
            return UsersActions.updateUserSuccess({ user: updatedUser });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update user',
            });
            return of(UsersActions.updateUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(({ userId }) =>
        this.usersService.deleteUser(userId).pipe(
          map(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully',
            });
            return UsersActions.deleteUserSuccess({ userId });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user',
            });
            return of(UsersActions.deleteUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadRoles),
      switchMap(() =>
        this.usersService.getAllRoles().pipe(
          map((roles) => UsersActions.loadRolesSuccess({ roles })),
          catchError((error) =>
            of(UsersActions.loadRolesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
