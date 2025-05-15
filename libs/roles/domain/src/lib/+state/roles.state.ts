import { Role } from '@angular-monorepo/auth/domain';

export interface RolesState {
  roles: Role[];
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
  permissions: { label: string; value: string }[];
}

export const initialRolesState: RolesState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null,
  permissions: [],
};
