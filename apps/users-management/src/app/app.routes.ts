import { Route } from '@angular/router';
import { AuthGuard, hasPermission } from '@angular-monorepo/auth/domain';

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
      {
        path: 'users',
        loadChildren: () =>
          import('@angular-monorepo/users/feature-shell').then(
            (m) => m.usersShellRoutes
          ),
        canActivate: [hasPermission('view:users')],
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('@angular-monorepo/roles/feature-shell').then(
            (m) => m.rolesShellRoutes
          ),
        canActivate: [hasPermission('view:roles')],
      },
    ],
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '',
  },
];
