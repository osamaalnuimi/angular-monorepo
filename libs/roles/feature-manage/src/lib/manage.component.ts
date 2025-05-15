import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Components
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Application Imports
import { HasRoleDirective, Role } from '@angular-monorepo/auth/domain';
import { ManageFacade } from '@angular-monorepo/roles/domain';
import { RoleFormComponent } from '@angular-monorepo/roles/ui-manage-form';

@Component({
  selector: 'roles-feature-manage',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    TooltipModule,
    HasRoleDirective,
    RoleFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  private facade = inject(ManageFacade);
  private confirmationService = inject(ConfirmationService);

  // Convert observables to signals
  roles = toSignal(this.facade.roles$, { initialValue: [] as Role[] });
  loading = toSignal(this.facade.loading$, { initialValue: false });
  error = toSignal(this.facade.error$, { initialValue: null as string | null });
  selectedRole = toSignal(this.facade.selectedRole$, {
    initialValue: null as Role | null,
  });

  // UI state signals
  displayDialog = signal(false);
  dialogMode = signal<'create' | 'edit'>('create');

  // Computed values
  hasRoles = computed(() => this.roles()?.length > 0);

  // Convert permissions observable to signal
  permissions = toSignal(this.facade.permissions$, {
    initialValue: [] as { label: string; value: string }[],
  });

  constructor() {
    // Effect to track changes and perform side effects
    effect(() => {
      // Example: Log when roles change
      console.log('Roles updated:', this.roles()?.length);
    });
  }

  ngOnInit(): void {
    this.facade.loadRoles();
    this.facade.loadPermissions();
  }

  openCreateDialog(): void {
    this.dialogMode.set('create');
    this.facade.selectRole(null);
    this.displayDialog.set(true);
  }

  openEditDialog(role: Role): void {
    this.dialogMode.set('edit');
    this.facade.selectRole(role);
    this.displayDialog.set(true);
  }

  closeDialog(): void {
    this.displayDialog.set(false);
  }

  saveRole(role: Role | Omit<Role, 'id'>): void {
    if (this.dialogMode() === 'create') {
      this.facade.createRole(role as Omit<Role, 'id'>);
    } else {
      this.facade.updateRole(role as Role);
    }
    this.displayDialog.set(false);
  }

  confirmDelete(role: Role): void {
    // First check if the role can be deleted
    this.facade.checkRoleDeletable(role.id);

    // Check if any users have this role
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
