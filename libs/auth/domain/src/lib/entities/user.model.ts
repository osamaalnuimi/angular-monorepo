export interface User {
  id: number;
  username: string;
  password?: string; // Optional in responses, required in requests
  fullName: string;
  email?: string; // Optional email field
  roleId: number;
  role?: Role;
  isSystemUser?: boolean;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
