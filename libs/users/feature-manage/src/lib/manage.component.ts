import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

// PrimeNG Components
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Application Imports
import { HasPermissionDirective, User } from '@angular-monorepo/auth/domain';
import { ManageFacade } from '@angular-monorepo/users/domain';
import { NgClass } from '@angular/common';

@Component({
  selector: 'users-feature-manage',
  imports: [
    NgClass,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TableModule,
    ToastModule,
    TooltipModule,
    HasPermissionDirective,
    DialogModule,
  ],
  providers: [MessageService, ConfirmationService, ManageFacade],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageComponent implements OnInit {
  private facade = inject(ManageFacade);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  // Convert observables to signals
  users = toSignal(this.facade.users$, { initialValue: [] as User[] });
  loading = toSignal(this.facade.loading$, { initialValue: false });
  error = toSignal(this.facade.error$, { initialValue: null as string | null });

  // UI state signals
  showDetailView = signal(false);
  detailUser = signal<User | null>(null);

  // Computed values
  hasUsers = computed(() => this.users()?.length > 0);

  constructor() {
    // Effect to track changes and perform side effects
    effect(() => {
      // Example: Log when users change
      console.log('Users updated:', this.users()?.length);
    });
  }

  ngOnInit(): void {
    this.facade.loadUsers();
  }

  navigateToCreateUser(): void {
    this.router.navigate(['/users/create']);
  }

  navigateToEditUser(user: User): void {
    this.router.navigate(['/users/update', user.id]);
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
