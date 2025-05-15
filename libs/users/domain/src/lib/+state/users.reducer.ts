import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { UsersState, initialUsersState } from './users.state';

const reducer = createReducer(
  initialUsersState,

  // Load users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create user
  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false,
    error: null,
  })),

  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update user
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    loading: false,
    error: null,
  })),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete user
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter((user) => user.id !== userId),
    loading: false,
    error: null,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select user
  on(UsersActions.selectUser, (state, { user }) => ({
    ...state,
    selectedUser: user,
  })),

  // Load roles
  on(UsersActions.loadRoles, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadRolesSuccess, (state, { roles }) => ({
    ...state,
    roles,
    loading: false,
    error: null,
  })),

  on(UsersActions.loadRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const usersFeature = createFeature({
  name: 'users',
  reducer,
});
