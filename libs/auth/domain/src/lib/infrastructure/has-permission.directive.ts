import {
  Directive,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth.service';
import * as AuthSelectors from '../+state/auth.selectors';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasPermission]',
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  hasPermission = input<string | string[]>([]);

  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(AuthSelectors.selectUserPermissions)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissions) => {
        this.updateView(permissions);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(permissions: string[]): void {
    this.viewContainer.clear();

    if (this.checkPermission(permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkPermission(permissions: string[]): boolean {
    const hasPermission = this.hasPermission();
    // If no permissions are required, show the element
    if (
      !hasPermission ||
      (Array.isArray(hasPermission) && hasPermission.length === 0)
    ) {
      return true;
    }

    // Check if user has any of the required permissions
    if (Array.isArray(hasPermission)) {
      return hasPermission.some((permission) =>
        this.authService.hasPermission(permission, permissions)
      );
    }

    // Check single permission
    return this.authService.hasPermission(hasPermission, permissions);
  }
}
