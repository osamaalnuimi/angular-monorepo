import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';
import { hasPermission } from '@angular-monorepo/auth/domain';

export const usersShellRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@angular-monorepo/users/feature-manage').then(
            (m) => m.usersManageRoutes
          ),
        canActivate: [hasPermission('view:users')],
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@angular-monorepo/users/feature-create-user').then(
            (m) => m.createUserRoutes
          ),
        canActivate: [hasPermission('create:users')],
      },
      {
        path: 'update/:id',
        loadChildren: () =>
          import('@angular-monorepo/users/feature-update-user').then(
            (m) => m.updateUserRoutes
          ),
        canActivate: [hasPermission('edit:users')],
      },
    ],
  },
];
