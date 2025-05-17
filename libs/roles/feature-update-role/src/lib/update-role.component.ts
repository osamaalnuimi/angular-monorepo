import { UpdateRoleFacade, RolesActions } from '@angular-monorepo/roles/domain';
import { Component, inject, OnInit, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  toObservable,
  toSignal,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Application Imports
import { Role } from '@angular-monorepo/auth/domain';
import { RoleFormComponent } from '@angular-monorepo/roles/ui-manage-form';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    RoleFormComponent,
  ],
  providers: [UpdateRoleFacade, MessageService],
  selector: 'roles-feature-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss'],
})
export class UpdateRoleComponent implements OnInit {
  private updateRoleFacade = inject(UpdateRoleFacade);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private actions$ = inject(Actions);

  // Input binding for role ID
  id = input.required<string>();

  // Convert observables to signals
  loading = toSignal(this.updateRoleFacade.loading$, { initialValue: false });
  error = toSignal(this.updateRoleFacade.error$, {
    initialValue: null as string | null,
  });
  selectedRole = toSignal(this.updateRoleFacade.selectedRole$, {
    initialValue: null as Role | null,
  });
  permissions = toSignal(this.updateRoleFacade.permissions$, {
    initialValue: [],
  });

  constructor() {
    // Listen for show message actions
    this.actions$
      .pipe(ofType(RolesActions.showMessage), takeUntilDestroyed())
      .subscribe(({ severity, summary, detail, life }) => {
        this.messageService.add({
          severity,
          summary,
          detail,
          life: life || 3000,
        });
      });
  }

  ngOnInit() {
    // Load permissions when component initializes
    this.updateRoleFacade.loadPermissions();

    // Convert the id input signal to an observable and react to changes
    const id$ = toObservable(this.id);

    id$
      .pipe(
        filter((id) => !!id),
        switchMap((id) => this.updateRoleFacade.getRoleById(+id)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  saveRole(role: Omit<Role, 'id'>): void {
    this.updateRoleFacade.updateRole({
      id: +this.id(),
      ...role,
    });
    this.navigateToRolesList();
  }

  cancelUpdate(): void {
    this.navigateToRolesList();
  }

  private navigateToRolesList(): void {
    this.router.navigate(['/roles']);
  }
}
