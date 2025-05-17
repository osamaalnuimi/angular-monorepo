import { Routes } from '@angular/router';

export const updateUserRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./update-user.component').then((m) => m.UpdateUserComponent),
  },
];
