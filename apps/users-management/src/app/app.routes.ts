import { Route } from '@angular/router';
import { AuthGuard } from '@angular-monorepo/auth/domain';

export const appRoutes: Route[] = [
  // Public routes
  {
    path: 'login',
    loadComponent: () =>
      import('@angular-monorepo/auth/feature-login').then(
        (m) => m.LoginComponent
      ),
  },

  // Protected routes with layout
  {
    path: '',
    loadComponent: () =>
      import('@angular-monorepo/layout/feature-layout').then(
        (m) => m.LayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@angular-monorepo/layout/feature-landing').then(
            (m) => m.LandingComponent
          ),
      },
      //   {
      //     path: 'users',
      //     loadComponent: () =>
      //       import('./features/users/users.component').then(
      //         (m) => m.UsersComponent
      //       ),
      //   },
      {
        path: 'roles',
        loadComponent: () =>
          import('@angular-monorepo/roles/feature-manage').then(
            (m) => m.ManageComponent
          ),
      },
    ],
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '',
  },
];
