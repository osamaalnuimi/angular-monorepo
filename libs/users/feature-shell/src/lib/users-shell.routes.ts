import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

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
      },
    ],
  },
];
