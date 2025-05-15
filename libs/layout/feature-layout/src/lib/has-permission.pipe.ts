import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@angular-monorepo/auth/domain';

@Pipe({
  name: 'hasPermission',
  standalone: true,
})
export class HasPermissionPipe implements PipeTransform {
  transform(user: User | null, permission: string): boolean {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    return user.role.permissions.includes(permission);
  }
}
