import { createFeature, createReducer, on } from '@ngrx/store';
import { RolesActions } from './roles.actions';
import { initialRolesState } from './roles.state';

const reducer = createReducer(
  initialRolesState,

  // Load roles
  on(RolesActions.loadRoles, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(RolesActions.loadRolesSuccess, (state, { roles }) => ({
    ...state,
    roles,
    loading: false,
    error: null,
  })),

  on(RolesActions.loadRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create role
  on(RolesActions.createRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(RolesActions.createRoleSuccess, (state, { role }) => ({
    ...state,
    roles: [...state.roles, role],
    loading: false,
    error: null,
  })),

  on(RolesActions.createRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update role
  on(RolesActions.updateRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(RolesActions.updateRoleSuccess, (state, { role }) => ({
    ...state,
    roles: state.roles.map((r) => (r.id === role.id ? role : r)),
    loading: false,
    error: null,
  })),

  on(RolesActions.updateRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete role
  on(RolesActions.deleteRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(RolesActions.deleteRoleSuccess, (state, { roleId }) => ({
    ...state,
    roles: state.roles.filter((role) => role.id !== roleId),
    loading: false,
    error: null,
    // Clear the canDeleteRole status for this role
    canDeleteRole: state.canDeleteRole
      ? Object.fromEntries(
          Object.entries(state.canDeleteRole).filter(
            ([key]) => Number(key) !== roleId
          )
        )
      : null,
  })),

  on(RolesActions.deleteRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select role
  on(RolesActions.selectRole, (state, { role }) => ({
    ...state,
    selectedRole: role,
  })),

  // Check if role can be deleted
  on(RolesActions.checkRoleDeletable, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    RolesActions.checkRoleDeletableSuccess,
    (state, { roleId, canDelete }) => ({
      ...state,
      loading: false,
      error: null,
      canDeleteRole: {
        ...(state.canDeleteRole || {}),
        [roleId]: canDelete,
      },
    })
  ),

  on(RolesActions.checkRoleDeletableFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load permissions
  on(RolesActions.loadPermissions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(RolesActions.loadPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    permissions,
    loading: false,
    error: null,
  })),

  on(RolesActions.loadPermissionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const rolesFeature = createFeature({
  name: 'roles',
  reducer,
});
