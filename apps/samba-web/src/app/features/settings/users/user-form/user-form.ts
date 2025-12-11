import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Icon } from '@ng-mf/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Panel, PanelHeader, PanelBody, OverlayScrollbar, BreadcrumbsStore } from '@ng-mf/components';
import { BranchApi } from '@samba/branch-domain';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'cashier';
  branchId: number;
  isActive: boolean;
}

interface Branch {
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    Icon,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterLink,
    Panel,
    PanelHeader,
    PanelBody,
    OverlayScrollbar,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private branchApi = inject(BranchApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  isLoading = signal(false);
  isEditMode = signal(false);
  error = signal<string | null>(null);
  userId = signal<number | null>(null);
  branches = signal<Branch[]>([]);

  roles: Array<{ value: string; label: string }> = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'cashier', label: 'Cashier' },
  ];

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.minLength(6)]],
    confirmPassword: [''],
    role: ['cashier', Validators.required],
    branchId: [1, Validators.required],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadBranches();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(parseInt(id));
      this.loadUser(parseInt(id));
      // Remove password validators in edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'settings',
          name: 'Settings',
          route: '/settings',
          type: 'link',
        },
        {
          id: 'users',
          name: 'Users',
          route: '/settings/users',
          type: 'link',
        },
        {
          id: 'edit-user',
          name: 'Edit User',
          type: null,
        },
      ]);
    } else {
      // Password is required for new users
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
      
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'settings',
          name: 'Settings',
          route: '/settings',
          type: 'link',
        },
        {
          id: 'users',
          name: 'Users',
          route: '/settings/users',
          type: 'link',
        },
        {
          id: 'new-user',
          name: 'New User',
          type: null,
        },
      ]);
    }
  }

  loadBranches(): void {
    this.branchApi.getAll().subscribe({
      next: (branches) => {
        this.branches.set(branches.map(b => ({ id: b.id, name: b.name, code: b.code })));
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      },
    });
  }

  loadUser(id: number): void {
    this.isLoading.set(true);
    // Mock user data loading (replace with actual API call)
    setTimeout(() => {
      const mockUser: User = {
        id: id,
        username: 'john.doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'manager',
        branchId: 1,
        isActive: true,
      };
      
      this.userForm.patchValue({
        username: mockUser.username,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        branchId: mockUser.branchId,
        isActive: mockUser.isActive,
      });
      this.isLoading.set(false);
    }, 500);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;

    if (password && password !== confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // Mock submission (replace with actual API call)
    setTimeout(() => {
      console.log('User form submitted:', this.userForm.value);
      this.router.navigate(['/settings/users']);
    }, 1000);
  }

  getErrorMessage(field: string): string {
    const control = this.userForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    return '';
  }
}
