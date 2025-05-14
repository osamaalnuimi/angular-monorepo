export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roleId: number;
  role?: Role;
  isSystemUser: boolean;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
