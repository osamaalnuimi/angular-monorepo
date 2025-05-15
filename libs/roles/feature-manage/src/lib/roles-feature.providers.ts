import { makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { rolesFeature, RolesEffects } from '@angular-monorepo/roles/domain';
import { MessageService, ConfirmationService } from 'primeng/api';

export function provideRolesFeature() {
  return makeEnvironmentProviders([
    // NgRx feature state and effects
    provideState(rolesFeature),
    provideEffects(RolesEffects),

    // PrimeNG services needed by effects
    { provide: MessageService, useClass: MessageService },
    { provide: ConfirmationService, useClass: ConfirmationService },
  ]);
}
