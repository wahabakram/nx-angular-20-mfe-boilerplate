import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Panel, PanelHeader, PanelBody, OverlayScrollbar, BreadcrumbsStore } from '@ng-mf/components';
import { CategoryApi, CreateCategoryDto } from '@samba/category-domain';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Icon,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterLink,
    Panel,
    PanelHeader,
    PanelBody,
    OverlayScrollbar,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryApi = inject(CategoryApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  isLoading = signal(false);
  isEditMode = signal(false);
  error = signal<string | null>(null);
  categoryId = signal<number | null>(null);

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
    description: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoryId.set(parseInt(id));
      this.loadCategory(parseInt(id));
      
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
          id: 'categories',
          name: 'Categories',
          route: '/settings/categories',
          type: 'link',
        },
        {
          id: 'edit-category',
          name: 'Edit Category',
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
          id: 'categories',
          name: 'Categories',
          route: '/settings/categories',
          type: 'link',
        },
        {
          id: 'new-category',
          name: 'New Category',
          type: null,
        },
      ]);
    }
  }

  loadCategory(id: number): void {
    this.isLoading.set(true);
    this.categoryApi.getById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          code: category.code,
          description: category.description || '',
          isActive: category.isActive,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.error.set('Failed to load category');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.categoryForm.value;
    const categoryDto: CreateCategoryDto = {
      name: formValue.name!,
      code: formValue.code!,
      description: formValue.description || undefined,
      isActive: formValue.isActive!,
    };

    if (this.isEditMode()) {
      const updateDto = { ...categoryDto, id: this.categoryId()! };
      this.categoryApi.update(updateDto).subscribe({
        next: () => {
          this.router.navigate(['/settings/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.error.set('Failed to update category');
          this.isLoading.set(false);
        },
      });
    } else {
      this.categoryApi.create(categoryDto).subscribe({
        next: () => {
          this.router.navigate(['/settings/categories']);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.error.set('Failed to create category');
          this.isLoading.set(false);
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.categoryForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum length not met';
    }
    if (control?.hasError('pattern')) {
      return 'Code must be uppercase letters and numbers only';
    }
    return '';
  }
}
