import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Icon } from '@ng-mf/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Panel, PanelHeader, PanelBody, OverlayScrollbar, BreadcrumbsStore } from '@ng-mf/components';
import { BranchApi } from '@samba/branch-domain';
import { Product, ProductApi, ProductStore } from '@samba/product-domain';
import { AuthStore } from '@samba/user-domain';

interface BranchMap {
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    Icon,
    MatProgressSpinnerModule,
    RouterLink,
    Panel,
    PanelHeader,
    PanelBody,
    OverlayScrollbar,
  ],
  templateUrl: './transfer-form.html',
  styleUrl: './transfer-form.scss',
})
export class TransferForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private branchApi = inject(BranchApi);
  private productApi = inject(ProductApi);
  private productStore = inject(ProductStore);
  private authStore = inject(AuthStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  isLoading = signal(false);
  isViewMode = signal(false);
  error = signal<string | null>(null);
  transferId = signal<number | null>(null);
  
  branches = signal<BranchMap[]>([]);
  products = this.productStore.products;
  selectedProduct = signal<Product | null>(null);

  transferForm = this.fb.group({
    fromBranchId: [null as number | null, Validators.required],
    toBranchId: [null as number | null, Validators.required],
    productId: [null as number | null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    notes: [''],
  });

  // Computed available stock for selected product
  availableStock = computed(() => {
    const product = this.selectedProduct();
    return product ? product.stockLevel : 0;
  });

  // Filter destination branches (exclude source branch)
  availableToBranches = computed(() => {
    const fromBranchId = this.transferForm.get('fromBranchId')?.value;
    if (!fromBranchId) return this.branches();
    return this.branches().filter(b => b.id !== fromBranchId);
  });

  ngOnInit(): void {
    this.loadBranches();
    this.loadProducts();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isViewMode.set(true);
      this.transferId.set(parseInt(id));
      this.loadTransfer(parseInt(id));
      
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'stock-transfers',
          name: 'Stock Transfers',
          route: '/stock-transfers',
          type: 'link',
        },
        {
          id: 'view-transfer',
          name: 'View Transfer',
          type: null,
        },
      ]);
      
      // Disable form in view mode
      this.transferForm.disable();
    } else {
      // Set current user's branch as default source
      const user = this.authStore.user();
      if (user?.branchId) {
        this.transferForm.patchValue({ fromBranchId: user.branchId });
      }
      
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'stock-transfers',
          name: 'Stock Transfers',
          route: '/stock-transfers',
          type: 'link',
        },
        {
          id: 'new-transfer',
          name: 'New Transfer',
          type: null,
        },
      ]);
    }

    // Watch for product selection changes
    this.transferForm.get('productId')?.valueChanges.subscribe(productId => {
      if (productId) {
        const product = this.products().find(p => p.id === productId);
        this.selectedProduct.set(product || null);
      } else {
        this.selectedProduct.set(null);
      }
    });
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

  loadProducts(): void {
    this.productApi.getAll().subscribe({
      next: (products) => {
        this.productStore.setProducts(products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  loadTransfer(id: number): void {
    this.isLoading.set(true);
    
    // Mock transfer data loading (replace with actual API call)
    setTimeout(() => {
      const mockTransfer = {
        id: id,
        transferNumber: 'TRF-20240101-001',
        fromBranchId: 1,
        toBranchId: 2,
        productId: 1,
        quantity: 5,
        notes: 'Urgent - customer waiting',
        status: 'pending',
      };
      
      this.transferForm.patchValue({
        fromBranchId: mockTransfer.fromBranchId,
        toBranchId: mockTransfer.toBranchId,
        productId: mockTransfer.productId,
        quantity: mockTransfer.quantity,
        notes: mockTransfer.notes,
      });
      
      this.isLoading.set(false);
    }, 500);
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const quantity = this.transferForm.get('quantity')?.value || 0;
    const availableStock = this.availableStock();
    
    if (quantity > availableStock) {
      this.error.set(`Insufficient stock. Only ${availableStock} units available.`);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.transferForm.value;
    const user = this.authStore.user();

    const transferDto = {
      fromBranchId: formValue.fromBranchId!,
      toBranchId: formValue.toBranchId!,
      productId: formValue.productId!,
      quantity: formValue.quantity!,
      notes: formValue.notes || undefined,
      requestedBy: user?.id || 1,
      status: 'pending',
    };

    // Mock submission (replace with actual API call)
    setTimeout(() => {
      console.log('Transfer request created:', transferDto);
      this.router.navigate(['/stock-transfers']);
    }, 1000);
  }

  getErrorMessage(field: string): string {
    const control = this.transferForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('min')) {
      return 'Quantity must be at least 1';
    }
    return '';
  }
}
