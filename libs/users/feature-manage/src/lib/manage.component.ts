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
import { Observable, map } from 'rxjs';

// PrimeNG Components
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Application Imports
import {
  HasPermissionDirective,
  Role,
  User,
} from '@angular-monorepo/auth/domain';
import { ManageFacade, UsersService } from '@angular-monorepo/users/domain';
import { UserFormComponent } from '@angular-monorepo/users/ui-user-form';

@Component({
  selector: 'users-feature-manage',
  standalone: true,
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
    TooltipModule,
    HasPermissionDirective,
    UserFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  private facade = inject(ManageFacade);
  private confirmationService = inject(ConfirmationService);
  private usersService = inject(UsersService);

  // Convert observables to signals
  users = toSignal(this.facade.users$, { initialValue: [] as User[] });
  loading = toSignal(this.facade.loading$, { initialValue: false });
  error = toSignal(this.facade.error$, { initialValue: null as string | null });
  selectedUser = toSignal(this.facade.selectedUser$, {
    initialValue: null as User | null,
  });
  roles = toSignal(this.facade.roles$, { initialValue: [] as Role[] });

  // UI state signals
  displayDialog = signal(false);
  dialogMode = signal<'create' | 'edit'>('create');
  showDetailView = signal(false);
  detailUser = signal<User | null>(null);

  // Computed values
  hasUsers = computed(() => this.users()?.length > 0);

  // Username validation function for the form
  validateUsername = (username: string): Observable<boolean> => {
    const currentUser = this.selectedUser();
    const currentUserId = currentUser ? currentUser.id : undefined;
    return this.usersService.checkUsernameExists(username, currentUserId);
  };

  constructor() {
    // Effect to track changes and perform side effects
    effect(() => {
      // Example: Log when users change
      console.log('Users updated:', this.users()?.length);
    });
  }

  ngOnInit(): void {
    this.facade.loadUsers();
    this.facade.loadRoles();
  }

  openCreateDialog(): void {
    this.dialogMode.set('create');
    this.facade.selectUser(null);
    this.displayDialog.set(true);
  }

  openEditDialog(user: User): void {
    this.dialogMode.set('edit');
    this.facade.selectUser(user);
    this.displayDialog.set(true);
  }

  closeDialog(): void {
    this.displayDialog.set(false);
  }

  saveUser(user: User | Omit<User, 'id'>): void {
    if (this.dialogMode() === 'create') {
      this.facade.createUser(user as Omit<User, 'id'>);
    } else {
      this.facade.updateUser(user as User);
    }
    this.displayDialog.set(false);
  }

  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the user "${user.username}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.facade.deleteUser(user.id);
      },
    });
  }

  viewUserDetails(user: User): void {
    this.detailUser.set(user);
    this.showDetailView.set(true);
  }

  closeDetailView(): void {
    this.showDetailView.set(false);
  }
}
