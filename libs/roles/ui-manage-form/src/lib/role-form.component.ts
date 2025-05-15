import { Role } from '@angular-monorepo/auth/domain';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// PrimeNG Components
import { ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'roles-ui-manage-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    DividerModule,
    MessagesModule,
    MessageModule,
  ],
  templateUrl: './role-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFormComponent {
  private fb = inject(FormBuilder);

  // Inputs using model() for two-way binding
  mode = model<'create' | 'edit'>('create');
  role = model<Role | null>(null);
  availablePermissions = model<{ label: string; value: string }[]>([]);

  // Outputs
  save = output<Role | Omit<Role, 'id'>>();
  cancelSave = output<void>();

  // Form state
  roleForm: FormGroup;
  submitted = signal(false);

  // Computed values
  isEditMode = computed(() => this.mode() === 'edit');
  formTitle = computed(() =>
    this.isEditMode() ? 'Edit Role' : 'Create New Role'
  );

  constructor() {
    this.roleForm = this.createForm();

    // Watch for role changes to update the form
    effect(() => {
      const currentRole = this.role();
      if (currentRole) {
        this.updateForm(currentRole);
      } else {
        this.resetForm();
      }
    });

    // Watch for mode changes to enable/disable name field
    effect(() => {
      if (this.isEditMode()) {
        this.roleForm.get('name')?.disable();
      } else {
        this.roleForm.get('name')?.enable();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      permissions: [[]],
    });
  }

  updateForm(role: Role): void {
    this.roleForm.patchValue({
      name: role.name,
      permissions: role.permissions || [],
    });
  }

  resetForm(): void {
    this.roleForm.reset({
      name: '',
      permissions: [],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.roleForm.invalid) {
      return;
    }

    const formValue = this.roleForm.getRawValue();

    if (this.isEditMode()) {
      // Update existing role
      if (this.role()) {
        this.save.emit({
          id: this.role()?.id || 0,
          name: formValue.name,
          permissions: formValue.permissions || [],
        });
      }
    } else {
      // Create new role
      this.save.emit({
        name: formValue.name,
        permissions: formValue.permissions || [],
      });
    }
  }

  onCancel(): void {
    this.cancelSave.emit();
  }

  // Helper methods for form validation
  get f() {
    return this.roleForm.controls;
  }
}
