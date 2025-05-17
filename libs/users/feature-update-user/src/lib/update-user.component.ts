import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  input,
} from '@angular/core';
import {
  toSignal,
  toObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, filter, switchMap } from 'rxjs';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Application Imports
import { UpdateUserFacade, UsersService } from '@angular-monorepo/users/domain';
import { Role, User } from '@angular-monorepo/auth/domain';
import { UserFormComponent } from '@angular-monorepo/users/ui-user-form';

@Component({
  imports: [
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    UserFormComponent,
  ],
  providers: [MessageService, UpdateUserFacade],
  selector: 'users-feature-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserComponent implements OnInit {
  private updateUserFacade = inject(UpdateUserFacade);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Input binding for user ID
  id = input.required<string>();

  // Convert observables to signals
  loading = toSignal(this.updateUserFacade.loading$, { initialValue: false });
  error = toSignal(this.updateUserFacade.error$, {
    initialValue: null as string | null,
  });
  roles = toSignal(this.updateUserFacade.roles$, {
    initialValue: [] as Role[],
  });
  selectedUser = toSignal(this.updateUserFacade.selectedUser$, {
    initialValue: null as User | null,
  });

  // Username validation function for the form
  validateUsername = (username: string): Observable<boolean> => {
    const currentUser = this.selectedUser();
    const currentUserId = currentUser ? currentUser.id : undefined;
    return this.usersService.checkUsernameExists(username, currentUserId);
  };

  constructor() {
    // Convert the id input signal to an observable and react to changes
    const id$ = toObservable(this.id);

    id$
      .pipe(
        filter((id) => !!id),
        switchMap((id) => {
          const userId = +id;
          return this.usersService.getUserById(userId);
        }),
        filter((user) => !!user),
        takeUntilDestroyed()
      )
      .subscribe((user) => {
        this.updateUserFacade.selectUser(user);
      });
  }

  ngOnInit(): void {
    this.updateUserFacade.loadRoles();
  }

  saveUser(user: Omit<User, 'id'>): void {
    this.updateUserFacade.updateUser({
      ...user,
      id: +this.id(),
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User updated successfully',
    });
    this.navigateToUsersList();
  }

  cancelUpdate(): void {
    this.navigateToUsersList();
  }

  navigateToUsersList(): void {
    this.router.navigate(['/users']);
  }
}
