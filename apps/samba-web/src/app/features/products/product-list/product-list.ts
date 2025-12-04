import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { HorizontalDivider } from '@ng-mf/components';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Product, ProductService, ProductStore } from '@samba/product-domain';
import { AuthService, AuthStore } from '@samba/user-domain';

@Component({
  selector: 'app-product-list',
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
    MatProgressSpinner
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);
  private router = inject(Router);

  user = this.authStore.user;
  products = this.productStore.filteredProducts;
  isLoading = this.productStore.isLoading;
  searchTerm = signal('');

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
      error: (error) => {
        this.productStore.setError('Failed to load products');
        this.productStore.setLoading(false);
        console.error('Error loading products:', error);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.productStore.setFilter({ search: value });
  }

  filterByStatus(status: Product['status'] | null): void {
    this.productStore.setFilter({
      ...this.productStore.filter(),
      status: status || undefined
    });
  }

  filterLowStock(): void {
    this.productStore.setFilter({ lowStock: true });
  }

  editProduct(product: Product): void {
    this.router.navigate(['/admin/products/edit', product.id]);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.delete(product.id).subscribe({
        next: () => {
          this.productStore.deleteProduct(product.id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  getStockStatus(product: Product): 'low' | 'normal' | 'high' {
    if (product.stockLevel <= product.lowStockThreshold) {
      return 'low';
    } else if (product.stockLevel >= product.maxStockLevel * 0.8) {
      return 'high';
    }
    return 'normal';
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
