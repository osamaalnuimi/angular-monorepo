import { CreateRoleFacade, RolesActions } from '@angular-monorepo/roles/domain';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Application Imports
import { Role } from '@angular-monorepo/auth/domain';
import { RoleFormComponent } from '@angular-monorepo/roles/ui-manage-form';

@Component({
  imports: [ButtonModule, CardModule, ToastModule, RoleFormComponent],
  providers: [CreateRoleFacade, MessageService],
  selector: 'roles-feature-create-role',
  templateUrl: './create-role.component.html',
})
export class CreateRoleComponent implements OnInit {
  private createRoleFacade = inject(CreateRoleFacade);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private actions$ = inject(Actions);

  // Convert observables to signals
  loading = toSignal(this.createRoleFacade.loading$, { initialValue: false });
  error = toSignal(this.createRoleFacade.error$, {
    initialValue: null as string | null,
  });
  permissions = toSignal(this.createRoleFacade.permissions$, {
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
    this.createRoleFacade.loadPermissions();
  }

  saveRole(role: Omit<Role, 'id'>): void {
    this.createRoleFacade.createRole(role);
    this.navigateToRolesList();
  }

  cancelCreate(): void {
    this.navigateToRolesList();
  }

  private navigateToRolesList(): void {
    this.router.navigate(['/roles']);
  }
}
