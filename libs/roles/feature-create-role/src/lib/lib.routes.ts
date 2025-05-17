import { Routes } from '@angular/router';

export const createRoleRoute: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./create-role.component').then((m) => m.CreateRoleComponent),
  },
];
