import {
  HasPermissionDirective,
  LoginFacade,
  User,
} from '@angular-monorepo/auth/domain';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    AvatarModule,
    ButtonModule,
    BadgeModule,
    HasPermissionDirective,
  ],
  selector: 'layout-feature-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  private loginFacade = inject(LoginFacade);

  // Convert observables to signals
  user = toSignal(this.loginFacade.user$, {
    initialValue: null as User | null,
  });
  userPermissions = toSignal(this.loginFacade.userPermissions$, {
    initialValue: [] as string[],
  });
}
