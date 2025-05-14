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
  readonly permissionInput = input<string | string[] | undefined>(undefined, {
    alias: 'hasPermission',
  });

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
    // If no permissions are required, show the element
    const permissionInput = this.permissionInput();
    if (
      !permissionInput ||
      (Array.isArray(permissionInput) && permissionInput.length === 0)
    ) {
      return true;
    }

    // Check if user has any of the required permissions
    if (Array.isArray(permissionInput)) {
      return permissionInput.some((permission) =>
        permissions.includes(permission)
      );
    }

    // Check single permission
    return permissions.includes(permissionInput);
  }
}
