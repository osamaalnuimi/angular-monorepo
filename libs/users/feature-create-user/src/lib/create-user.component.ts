import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Application Imports
import { CreateUserFacade, UsersService } from '@angular-monorepo/users/domain';
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
  providers: [MessageService, CreateUserFacade],
  selector: 'users-feature-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent implements OnInit {
  private createUserFacade = inject(CreateUserFacade);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Convert observables to signals
  loading = toSignal(this.createUserFacade.loading$, { initialValue: false });
  error = toSignal(this.createUserFacade.error$, {
    initialValue: null as string | null,
  });
  roles = toSignal(this.createUserFacade.roles$, {
    initialValue: [] as Role[],
  });

  // Username validation function for the form
  validateUsername = (username: string): Observable<boolean> => {
    return this.usersService.checkUsernameExists(username);
  };

  ngOnInit() {
    this.createUserFacade.loadRoles();
  }

  saveUser(user: Omit<User, 'id'>): void {
    this.createUserFacade.createUser(user);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User created successfully',
    });
    this.navigateToUsersList();
  }

  cancelCreate(): void {
    this.navigateToUsersList();
  }

  navigateToUsersList(): void {
    this.router.navigate(['/users']);
  }
}
