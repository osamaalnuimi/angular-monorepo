import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, tap } from 'rxjs';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

// Application Imports
import { Role, User } from '@angular-monorepo/auth/domain';
import { SelectModule } from 'primeng/select';
import { usernameExistsValidator } from './validators/username-validator';

@Component({
  selector: 'users-ui-user-form',
  imports: [
    NgClass,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    CheckboxModule,
    InputGroupModule,
  ],
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  mode = input<'create' | 'edit'>('create');
  user = input<User | null>(null);
  availableRoles = input<Role[]>([]);
  validateUsername = model<(username: string) => Observable<boolean>>();

  // Outputs
  save = output<User | Omit<User, 'id'>>();
  cancelSave = output<void>();

  // Form
  userForm = this.fb.nonNullable.group({
    username: [
      '',
      {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur',
      },
    ],
    password: [
      '',
      this.isEditMode()
        ? [Validators.minLength(6)]
        : [Validators.required, Validators.minLength(6)],
    ],
    fullName: ['', Validators.required],
    email: ['', Validators.email],
    roleId: [0, Validators.required],
    isActive: [true],
  });

  // UI state
  isFormSubmitted = signal(false);

  constructor() {
    // Watch for user changes to update form

    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        console.log('User changed:', currentUser);

        this.updateForm(currentUser);
      } else {
        this.resetForm();
      }
    });

    // Watch for mode changes to enable/disable username field
    effect(() => {
      if (this.isEditMode()) {
        this.userForm.get('username')?.disable();
      } else {
        this.userForm.get('username')?.enable();
      }
    });

    // Watch for validation function changes
    effect(() => {
      const validateFn = this.validateUsername();
      if (typeof validateFn === 'function') {
        this.updateUsernameValidator();
      }
    });
  }

  ngOnInit(): void {
    // Initial setup of validators based on mode
    this.updatePasswordValidators();
    this.updateUsernameValidator();
    this.userForm.valueChanges
      .pipe(tap((value) => console.log(value)))
      .subscribe();
  }

  // Getters
  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  isEditMode(): boolean {
    return this.mode() === 'edit';
  }

  submitted(): boolean {
    return this.isFormSubmitted();
  }

  // Form update methods
  updateForm(user: User): void {
    this.userForm.patchValue({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      roleId: user.role?.id || 0,
      isActive: user.isActive !== undefined ? user.isActive : true,
    });

    // Clear password in edit mode
    if (this.isEditMode()) {
      this.userForm.get('password')?.setValue('');
      this.updatePasswordValidators();
    }
  }

  resetForm(): void {
    this.userForm.reset({
      isActive: true,
    });
  }

  updatePasswordValidators(): void {
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      if (this.isEditMode()) {
        passwordControl.setValidators([Validators.minLength(6)]);
      } else {
        passwordControl.setValidators([
          Validators.required,
          Validators.minLength(6),
        ]);
      }
      passwordControl.updateValueAndValidity();
    }
  }

  updateUsernameValidator(): void {
    const usernameControl = this.userForm.get('username');
    const validateFn = this.validateUsername();

    if (usernameControl && typeof validateFn === 'function') {
      usernameControl.clearAsyncValidators();
      usernameControl.setAsyncValidators(usernameExistsValidator(validateFn));
      usernameControl.updateValueAndValidity();
    }
  }

  // Form submission
  onSubmit(): void {
    this.isFormSubmitted.set(true);

    if (this.userForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formData = this.userForm.getRawValue();

    // In edit mode, only include password if it was changed
    if (this.isEditMode() && !formData.password) {
      // Create a new object without the password property instead of using delete
      const { password, ...dataWithoutPassword } = formData;

      // For edit mode, include the ID
      if (this.user()) {
        this.save.emit({
          ...dataWithoutPassword,
          roleId: Number(formData.roleId),
          id: this.user()?.id || 0,
        });
      }
    } else {
      // For edit mode with password or create mode
      if (this.isEditMode() && this.user()) {
        this.save.emit({
          ...formData,
          roleId: Number(formData.roleId),
          id: this.user()?.id || 0,
        });
      } else {
        this.save.emit({
          ...formData,
          roleId: Number(formData.roleId),
        });
      }
    }
  }

  onCancel(): void {
    this.cancelSave.emit();
  }
}
