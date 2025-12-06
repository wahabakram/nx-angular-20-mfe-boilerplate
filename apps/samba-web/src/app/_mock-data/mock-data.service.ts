import { Injectable, inject } from '@angular/core';
import { ProductService, ProductStore } from '@samba/product-domain';
import { generateMockProducts, PRODUCT_CATEGORIES } from './product-mock-data';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);

  private readonly STORAGE_KEY = 'samba_mock_data_seeded';

  isDataSeeded(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  markDataAsSeeded(): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  clearSeededFlag(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  seedAllData(force: boolean = false) {
    // Check if data already seeded
    if (!force && this.isDataSeeded()) {
      console.log('Mock data already seeded. Use force=true to re-seed.');
      return of(null);
    }

    console.log('Starting mock data seeding...');

    return this.seedProducts().pipe(
      tap(() => {
        this.markDataAsSeeded();
        console.log('✅ Mock data seeding completed!');
      }),
      catchError((error) => {
        console.error('❌ Mock data seeding failed:', error);
        return of(null);
      })
    );
  }

  private seedProducts() {
    const mockProducts = generateMockProducts(50, 1);
    console.log(`Seeding ${mockProducts.length} products...`);

    // Create all products in parallel
    const createRequests = mockProducts.map((productDto) =>
      this.productService.create(productDto).pipe(
        catchError((err) => {
          console.error('Failed to create product:', productDto.name, err);
          return of(null);
        })
      )
    );

    return forkJoin(createRequests).pipe(
      tap((products) => {
        const successCount = products.filter((p) => p !== null).length;
        console.log(`✅ Created ${successCount} products`);

        // Update the store with all products
        const validProducts = products.filter((p) => p !== null);
        if (validProducts.length > 0) {
          this.productStore.setProducts(validProducts as any[]);
        }
      })
    );
  }

  // Helper method to get category names for display
  getCategoryName(categoryId: number): string {
    const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  }

  getCategories() {
    return PRODUCT_CATEGORIES;
  }
}
