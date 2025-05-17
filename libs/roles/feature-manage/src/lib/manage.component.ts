import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG Components
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Application Imports
import { HasRoleDirective, Role } from '@angular-monorepo/auth/domain';
import { ManageFacade, RolesActions } from '@angular-monorepo/roles/domain';

@Component({
  selector: 'roles-feature-manage',
  imports: [
    RouterModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ProgressSpinnerModule,
    TooltipModule,
    HasRoleDirective,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  private facade = inject(ManageFacade);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private actions$ = inject(Actions);

  // Convert observables to signals
  roles = toSignal(this.facade.roles$, { initialValue: [] as Role[] });
  loading = toSignal(this.facade.loading$, { initialValue: false });
  error = toSignal(this.facade.error$, { initialValue: null as string | null });

  // Track role deletion status
  canDeleteRole = toSignal(this.facade.canDeleteRole$, { initialValue: null });

  // Computed values
  hasRoles = computed(() => this.roles()?.length > 0);

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

    // Effect to track changes and perform side effects
    effect(() => {
      // Example: Log when roles change
      console.log('Roles updated:', this.roles()?.length);
    });
  }

  ngOnInit(): void {
    this.facade.loadRoles();
  }

  navigateToCreate(): void {
    this.router.navigate(['/roles/create']);
  }

  navigateToEdit(role: Role): void {
    this.router.navigate(['/roles/update', role.id]);
  }

  confirmDelete(role: Role): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the role "${role.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.facade.deleteRole(role.id);
      },
    });
  }
}
