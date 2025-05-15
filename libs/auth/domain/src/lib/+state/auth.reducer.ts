import { createFeature, createReducer, on, createSelector } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

const reducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error,
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.authSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.authFailure, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);

export const authFeature = createFeature({
  name: 'auth',
  reducer,
});

// Create additional selectors using createSelector
export const selectUserPermissions = createSelector(
  authFeature.selectUser,
  (user) => {
    // Get the user's permissions from their role
    const rolePermissions = user?.role?.permissions || [];

    // Ensure all users have access to the dashboard
    if (!rolePermissions.includes('view:dashboard')) {
      return [...rolePermissions, 'view:dashboard'];
    }

    return rolePermissions;
  }
);

export const selectUserRole = createSelector(
  authFeature.selectUser,
  (user) => user?.role?.name || null
);

export const selectIsSuperAdmin = createSelector(
  authFeature.selectUser,
  (user) => user?.role?.name === 'Super Admin'
);
