import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product, ProductFilter } from '../models/product.model';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filter: ProductFilter;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredProducts: computed(() => {
      const filter = store.filter();
      let products = store.products();

      if (filter.search) {
        const search = filter.search.toLowerCase();
        products = products.filter(
          p => p.name.toLowerCase().includes(search) ||
               p.sku.toLowerCase().includes(search) ||
               p.barcode?.toLowerCase().includes(search)
        );
      }

      if (filter.categoryId) {
        products = products.filter(p => p.categoryId === filter.categoryId);
      }

      if (filter.status) {
        products = products.filter(p => p.status === filter.status);
      }

      if (filter.branchId) {
        products = products.filter(p => p.branchId === filter.branchId);
      }

      if (filter.lowStock) {
        products = products.filter(p => p.stockLevel <= p.lowStockThreshold);
      }

      return products;
    }),

    lowStockProducts: computed(() => {
      return store.products().filter(p => p.stockLevel <= p.lowStockThreshold);
    }),

    totalProducts: computed(() => store.products().length),

    activeProducts: computed(() => {
      return store.products().filter(p => p.status === 'active');
    }),
  })),
  withMethods((store) => ({
    setProducts(products: Product[]): void {
      patchState(store, { products, error: null });
    },

    addProduct(product: Product): void {
      patchState(store, (state) => ({
        products: [...state.products, product],
      }));
    },

    updateProduct(product: Product): void {
      patchState(store, (state) => ({
        products: state.products.map(p => p.id === product.id ? product : p),
      }));
    },

    deleteProduct(id: number): void {
      patchState(store, (state) => ({
        products: state.products.filter(p => p.id !== id),
      }));
    },

    selectProduct(product: Product | null): void {
      patchState(store, { selectedProduct: product });
    },

    setFilter(filter: ProductFilter): void {
      patchState(store, { filter });
    },

    clearFilter(): void {
      patchState(store, { filter: {} });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },

    updateStock(productId: number, quantity: number): void {
      patchState(store, (state) => ({
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, stockLevel: p.stockLevel + quantity }
            : p
        ),
      }));
    },
  }))
);
