import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Auth NgRx
import {
  authFeature,
  AuthEffects,
  LoginFacade,
} from '@angular-monorepo/auth/domain';
import { authInterceptor } from '@angular-monorepo/auth/domain';
import { inject } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    // HTTP Client with auth interceptor
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // NgRx Store
    provideStore({
      // Use the feature instead of just the reducer
      [authFeature.name]: authFeature.reducer,
    }),
    provideEffects([AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),

    // Modern app initialization with proper dependency injection
    provideAppInitializer(() => {
      const loginFacade = inject(LoginFacade);
      console.log('Checking authentication during app initialization');
      loginFacade.checkAuth();
      return Promise.resolve();
    }),
  ],
};
