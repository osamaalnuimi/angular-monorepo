import { Routes } from '@angular/router';
import { provideUsersFeature } from './users-manage.provider';

export const usersManageRoutes: Routes = [
  {
    path: '',
    providers: [provideUsersFeature()],
    loadComponent: () =>
      import('./manage.component').then((m) => m.ManageComponent),
  },
];
