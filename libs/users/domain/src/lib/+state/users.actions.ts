import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Role, User } from '@angular-monorepo/auth/domain';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    // Load users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Create user
    'Create User': props<{ user: Omit<User, 'id'> }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),

    // Update user
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    // Delete user
    'Delete User': props<{ userId: number }>(),
    'Delete User Success': props<{ userId: number }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Select user for editing
    'Select User': props<{ user: User | null }>(),

    // Load available roles for dropdown
    'Load Roles': emptyProps(),
    'Load Roles Success': props<{ roles: Role[] }>(),
    'Load Roles Failure': props<{ error: string }>(),
  },
});
