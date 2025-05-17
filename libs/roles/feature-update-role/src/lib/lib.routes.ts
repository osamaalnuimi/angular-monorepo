import { Routes } from '@angular/router';

export const updateRoleRoute: Routes = [
  {
    path: 'update',
    loadComponent: () =>
      import('./update-role.component').then((m) => m.UpdateRoleComponent),
  },
];
