import { HttpClient } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, Role, User } from '../entities/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000'; // JSON Server URL
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';

  private http = inject(HttpClient);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(credentials: LoginRequest): Observable<User> {
    // In a real app, this would be a POST request to an authentication endpoint
    // For our mock backend, we'll query users and check credentials manually
    return this.http
      .get<User[]>(`${this.API_URL}/users?email=${credentials.email}`)
      .pipe(
        switchMap((users) => {
          const user = users[0];
          if (user && credentials.password === 'password') {
            // Simplified password check for demo
            // Get the user's role
            return this.http
              .get<Role>(`${this.API_URL}/roles/${user.roleId}`)
              .pipe(
                map((role) => {
                  user.role = role;

                  // Create a mock token (in a real app, this would come from the server)
                  const token = `mock-jwt-token-${Date.now()}`;

                  // Store auth data in localStorage
                  this.setLocalStorage(user, token);

                  return user;
                })
              );
          } else {
            return throwError(() => new Error('Invalid email or password'));
          }
        }),
        catchError((error) => throwError(() => error))
      );
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  hasPermission(permission: string, permissions: string[]): boolean {
    return permissions.includes(permission);
  }

  hasRole(roleName: string, userRole: string | null): boolean {
    return userRole === roleName;
  }

  isSuperAdmin(userRole: string | null): boolean {
    return userRole === 'Super Admin';
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private setLocalStorage(user: User, token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
  }

  hasValidToken(): boolean {
    // In a real app, you would check if the token is valid and not expired
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
}
