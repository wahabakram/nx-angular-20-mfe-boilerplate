import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatBadge } from '@angular/material/badge';
import { HorizontalDivider } from '@ng-mf/components';
import { Product, ProductService, ProductStore } from '@samba/product-domain';
import { AuthService, AuthStore } from '@samba/user-domain';

@Component({
  selector: 'app-inventory-list',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButton,
    MatIconButton,
    MatToolbar,
    MatIcon,
    MatCard,
    MatCardContent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    HorizontalDivider,
    MatFormField,
    MatLabel,
    MatInput,
    MatChip,
    MatChipSet,
    MatProgressSpinner,
    MatBadge,
  ],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss'
})
export class InventoryList implements OnInit {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);
  private router = inject(Router);

  user = this.authStore.user;
  products = this.productStore.filteredProducts;
  isLoading = this.productStore.isLoading;
  searchTerm = signal('');

  lowStockCount = this.productStore.lowStockProducts;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productStore.setLoading(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productStore.setProducts(products);
        this.productStore.setLoading(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.productStore.setLoading(false);
      },
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.productStore.setFilter({ search: value });
  }

  filterLowStock(): void {
    this.productStore.setFilter({ lowStock: true });
  }

  filterByStatus(status: Product['status'] | null): void {
    this.productStore.setFilter({
      ...this.productStore.filter(),
      status: status || undefined,
      lowStock: undefined,
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.productStore.clearFilter();
  }

  adjustStock(product: Product, adjustment: number): void {
    const newStock = product.stockLevel + adjustment;
    if (newStock < 0) {
      alert('Stock cannot be negative');
      return;
    }

    // Update locally
    this.productStore.updateStock(product.id, adjustment);

    // Update on server
    this.productService
      .update({
        id: product.id,
        stockLevel: newStock,
      })
      .subscribe({
        next: () => {
          console.log('Stock updated successfully');
        },
        error: (err) => {
          console.error('Failed to update stock:', err);
          // Revert on error
          this.productStore.updateStock(product.id, -adjustment);
          alert('Failed to update stock');
        },
      });
  }

  getStockStatus(product: Product): 'low' | 'normal' | 'high' {
    if (product.stockLevel <= product.lowStockThreshold) {
      return 'low';
    } else if (product.stockLevel >= product.maxStockLevel * 0.8) {
      return 'high';
    }
    return 'normal';
  }

  getStockPercentage(product: Product): number {
    return (product.stockLevel / product.maxStockLevel) * 100;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
