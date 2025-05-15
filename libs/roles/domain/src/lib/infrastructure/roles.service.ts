import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Role } from '@angular-monorepo/auth/domain';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly API_URL = 'http://localhost:3000'; // JSON Server URL
  private http = inject(HttpClient);

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`).pipe(
      catchError((error) => {
        console.error('Error fetching roles:', error);
        return throwError(() => new Error('Failed to load roles'));
      })
    );
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/roles/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching role with id ${id}:`, error);
        return throwError(() => new Error('Failed to load role'));
      })
    );
  }

  createRole(role: Omit<Role, 'id'>): Observable<Role> {
    return this.http.post<Role>(`${this.API_URL}/roles`, role).pipe(
      catchError((error) => {
        console.error('Error creating role:', error);
        return throwError(() => new Error('Failed to create role'));
      })
    );
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.API_URL}/roles/${role.id}`, role).pipe(
      catchError((error) => {
        console.error(`Error updating role with id ${role.id}:`, error);
        return throwError(() => new Error('Failed to update role'));
      })
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/roles/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting role with id ${id}:`, error);
        return throwError(() => new Error('Failed to delete role'));
      })
    );
  }

  // Check if a role can be deleted (not assigned to any users)
  canDeleteRole(roleId: number): Observable<boolean> {
    return this.http.get<any[]>(`${this.API_URL}/users?roleId=${roleId}`).pipe(
      map((users) => users.length === 0),
      catchError((error) => {
        console.error(
          `Error checking if role ${roleId} can be deleted:`,
          error
        );
        return throwError(
          () => new Error('Failed to check if role can be deleted')
        );
      })
    );
  }

  getAvailablePermissions(): Observable<{ label: string; value: string }[]> {
    return this.http
      .get<{ label: string; value: string }[]>(`${this.API_URL}/permissions`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching permissions:', error);
          return throwError(() => new Error('Failed to load permissions'));
        })
      );
  }
}
