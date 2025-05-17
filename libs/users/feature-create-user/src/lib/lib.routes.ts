import { Routes } from '@angular/router';

export const createUserRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./create-user.component').then((m) => m.CreateUserComponent),
  },
];
