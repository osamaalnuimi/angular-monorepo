import { makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersFeature, UsersEffects } from '@angular-monorepo/users/domain';
import { MessageService, ConfirmationService } from 'primeng/api';

export function provideUsersFeature() {
  return makeEnvironmentProviders([
    // NgRx feature state and effects
    provideState(usersFeature),
    provideEffects(UsersEffects),

    // PrimeNG services needed by effects
    { provide: MessageService, useClass: MessageService },
    { provide: ConfirmationService, useClass: ConfirmationService },
  ]);
}
