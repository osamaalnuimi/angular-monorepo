import { Role, User } from '@angular-monorepo/auth/domain';

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  roles: Role[];
}

export const initialUsersState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  roles: [],
};
