import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Panel, PanelHeader, PanelBody, OverlayScrollbar, BreadcrumbsStore } from '@ng-mf/components';
import { BranchService, CreateBranchDto } from '@samba/branch-domain';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    RouterLink,
    Panel,
    PanelHeader,
    PanelBody,
    OverlayScrollbar,
  ],
  templateUrl: './branch-form.html',
  styleUrl: './branch-form.scss',
})
export class BranchForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private branchService = inject(BranchService);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  isLoading = signal(false);
  isEditMode = signal(false);
  error = signal<string | null>(null);
  branchId = signal<number | null>(null);

  branchForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    isMainBranch: [false],
    isActive: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.branchId.set(parseInt(id));
      this.loadBranch(parseInt(id));
      
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
          id: 'branches',
          name: 'Branches',
          route: '/settings/branches',
          type: 'link',
        },
        {
          id: 'edit-branch',
          name: 'Edit Branch',
          type: null,
        },
      ]);
    } else {
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
          id: 'branches',
          name: 'Branches',
          route: '/settings/branches',
          type: 'link',
        },
        {
          id: 'new-branch',
          name: 'New Branch',
          type: null,
        },
      ]);
    }
  }

  loadBranch(id: number): void {
    this.isLoading.set(true);
    this.branchService.getById(id).subscribe({
      next: (branch) => {
        this.branchForm.patchValue({
          name: branch.name,
          code: branch.code,
          address: branch.address,
          city: branch.city,
          phone: branch.phone,
          email: branch.email,
          isMainBranch: branch.isMainBranch,
          isActive: branch.isActive,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading branch:', error);
        this.error.set('Failed to load branch');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.branchForm.value;
    const branchDto: CreateBranchDto = {
      name: formValue.name!,
      code: formValue.code!,
      address: formValue.address!,
      city: formValue.city!,
      phone: formValue.phone!,
      email: formValue.email!,
      isMainBranch: formValue.isMainBranch!,
      isActive: formValue.isActive!,
    };

    if (this.isEditMode()) {
      const updateDto = { ...branchDto, id: this.branchId()! };
      this.branchService.update(updateDto).subscribe({
        next: () => {
          this.router.navigate(['/settings/branches']);
        },
        error: (error) => {
          console.error('Error updating branch:', error);
          this.error.set('Failed to update branch');
          this.isLoading.set(false);
        },
      });
    } else {
      this.branchService.create(branchDto).subscribe({
        next: () => {
          this.router.navigate(['/settings/branches']);
        },
        error: (error) => {
          console.error('Error creating branch:', error);
          this.error.set('Failed to create branch');
          this.isLoading.set(false);
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.branchForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum length not met';
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    if (control?.hasError('pattern')) {
      if (field === 'code') {
        return 'Code must be uppercase letters and numbers only';
      }
      return 'Invalid format';
    }
    return '';
  }
}
