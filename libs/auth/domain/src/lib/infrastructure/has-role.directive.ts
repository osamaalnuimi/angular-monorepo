import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth.service';
import * as AuthSelectors from '../+state/auth.selectors';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasRole]',
})
export class HasRoleDirective implements OnInit, OnDestroy {
  readonly hasRole = input<string | string[]>();

  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(AuthSelectors.selectUserRole)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRole) => {
        this.updateView(userRole);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(userRole: string | null): void {
    this.viewContainer.clear();

    if (this.checkRole(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkRole(userRole: string | null): boolean {
    const roleInput = this.hasRole();
    // If no roles are required, show the element
    if (!roleInput || (Array.isArray(roleInput) && roleInput.length === 0)) {
      return true;
    }

    // If userRole is null, don't show the element
    if (userRole === null) {
      return false;
    }

    // Check if user has any of the required roles
    if (Array.isArray(roleInput)) {
      return roleInput.some((role) => this.authService.hasRole(role, userRole));
    }

    // Check single role
    return this.authService.hasRole(roleInput, userRole);
  }
}
