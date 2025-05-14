import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest, User } from '../entities/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login flow
    Login: props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),

    // Logout flow
    Logout: emptyProps(),
    'Logout Success': emptyProps(),

    // Auth check
    'Check Auth': emptyProps(),
    'Auth Success': props<{ user: User; token: string }>(),
    'Auth Failure': emptyProps(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
