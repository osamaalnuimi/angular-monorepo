import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role, User } from '@angular-monorepo/auth/domain';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = 'http://localhost:3000'; // JSON Server URL
  private http = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users?_expand=role`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to load users'));
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}?_expand=role`).pipe(
      catchError((error) => {
        console.error(`Error fetching user with id ${id}:`, error);
        return throwError(() => new Error('Failed to load user'));
      })
    );
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users`, user).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(() => new Error('Failed to create user'));
      })
    );
  }

  updateUser(user: User): Observable<User> {
    // Create a copy without the role object to avoid JSON Server issues
    const userToUpdate = { ...user };
    delete userToUpdate.role;

    return this.http
      .put<User>(`${this.API_URL}/users/${user.id}`, userToUpdate)
      .pipe(
        catchError((error) => {
          console.error(`Error updating user with id ${user.id}:`, error);
          return throwError(() => new Error('Failed to update user'));
        })
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting user with id ${id}:`, error);
        return throwError(() => new Error('Failed to delete user'));
      })
    );
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`).pipe(
      catchError((error) => {
        console.error('Error fetching roles:', error);
        return throwError(() => new Error('Failed to load roles'));
      })
    );
  }

  /**
   * Check if a username already exists
   * @param username The username to check
   * @param excludeUserId Optional user ID to exclude from the check (for edit mode)
   * @returns Observable<boolean> True if username exists, false otherwise
   */
  checkUsernameExists(
    username: string,
    excludeUserId?: number
  ): Observable<boolean> {
    // For JSON Server, we can use the q parameter to filter by username
    return this.http
      .get<User[]>(`${this.API_URL}/users?username=${username}`)
      .pipe(
        map((users) => {
          if (excludeUserId) {
            // In edit mode, exclude the current user from the check
            return users.some((user) => user.id !== excludeUserId);
          }
          return users.length > 0;
        }),
        catchError((error) => {
          console.error('Error checking username:', error);
          // In case of error, return false to allow form submission
          // and let the backend handle the uniqueness constraint
          return of(false);
        })
      );
  }
}
