import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';
import { ManageFacade } from '@angular-monorepo/roles/domain';

export const rolesShellRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    providers: [
      {
        provide: ManageFacade,
        useClass: ManageFacade,
      },
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@angular-monorepo/roles/feature-manage').then(
            (m) => m.rolesManageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@angular-monorepo/roles/feature-create-role').then(
            (m) => m.createRoleRoute
          ),
      },
      {
        path: 'update/:id',
        loadChildren: () =>
          import('@angular-monorepo/roles/feature-update-role').then(
            (m) => m.updateRoleRoute
          ),
      },
    ],
  },
];
