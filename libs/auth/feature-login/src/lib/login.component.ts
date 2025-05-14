import { LoginFacade } from '@angular-monorepo/auth/domain';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    MessageModule,
    ToastModule,
  ],
  providers: [MessageService],
  selector: 'auth-feature-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private loginFacade = inject(LoginFacade);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();

  email = '';
  password = '';
  checked = false;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    // Subscribe to loading state
    this.loginFacade.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Subscribe to error state
    this.loginFacade.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error = error;
        if (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error,
            life: 3000,
          });
        }
      });

    // Check if user is already authenticated
    this.loginFacade.checkAuth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Email and password are required',
        life: 3000,
      });
      return;
    }

    this.loginFacade.login({
      email: this.email,
      password: this.password,
    });
  }
}
