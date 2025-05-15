import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@angular-monorepo/auth/domain';

@Pipe({
  name: 'hasPermission',
})
export class HasPermissionPipe implements PipeTransform {
  transform(user: User | null, permission: string): boolean {
    // Special case for dashboard - all users should have access
    if (permission === 'view:dashboard') {
      return true;
    }

    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    return user.role.permissions.includes(permission);
  }
}
