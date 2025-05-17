import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Role } from '@angular-monorepo/auth/domain';

export const RolesActions = createActionGroup({
  source: 'Roles',
  events: {
    // Load roles
    'Load Roles': emptyProps(),
    'Load Roles Success': props<{ roles: Role[] }>(),
    'Load Roles Failure': props<{ error: string }>(),

    // Load role by id
    'Load Role By Id': props<{ id: number }>(),
    'Load Role By Id Success': props<{ role: Role }>(),
    'Load Role By Id Failure': props<{ error: string }>(),

    // Create role
    'Create Role': props<{ role: Omit<Role, 'id'> }>(),
    'Create Role Success': props<{ role: Role }>(),
    'Create Role Failure': props<{ error: string }>(),

    // Update role
    'Update Role': props<{ role: Role }>(),
    'Update Role Success': props<{ role: Role }>(),
    'Update Role Failure': props<{ error: string }>(),

    // Delete role
    'Delete Role': props<{ roleId: number }>(),
    'Delete Role Success': props<{ roleId: number }>(),
    'Delete Role Failure': props<{ error: string }>(),

    // Select role for editing
    'Select Role': props<{ role: Role | null }>(),

    // Check if role can be deleted (not assigned to any users)
    'Check Role Deletable': props<{ roleId: number }>(),
    'Check Role Deletable Success': props<{
      roleId: number;
      canDelete: boolean;
    }>(),
    'Check Role Deletable Failure': props<{ error: string }>(),

    // Load available permissions
    'Load Permissions': emptyProps(),
    'Load Permissions Success': props<{
      permissions: { label: string; value: string }[];
    }>(),
    'Load Permissions Failure': props<{ error: string }>(),

    // Show message
    'Show Message': props<{
      severity: 'success' | 'info' | 'warn' | 'error';
      summary: string;
      detail: string;
      life?: number;
    }>(),
  },
});
