import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Supplier, SupplierQueryParams, SupplierStatus } from '../models/supplier.model';

interface SupplierState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  filters: SupplierQueryParams;
  isLoading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  selectedSupplier: null,
  filters: {
    page: 1,
    limit: 50,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  isLoading: false,
  error: null,
};

export const SupplierStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    /**
     * Get filtered suppliers based on current filters
     */
    filteredSuppliers: computed(() => {
      const suppliers = store.suppliers();
      const filters = store.filters();

      let result = [...suppliers];

      // Apply status filter
      const status = filters.status;
      if (status) {
        result = result.filter((s: Supplier) => s.status === status);
      }

      // Apply search filter
      const search = filters.search;
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (s: Supplier) =>
            s.name.toLowerCase().includes(searchLower) ||
            s.companyName?.toLowerCase().includes(searchLower) ||
            s.phone.includes(search) ||
            s.email?.toLowerCase().includes(searchLower)
        );
      }

      return result;
    }),

    /**
     * Get suppliers by status
     */
    activeSuppliers: computed(() => {
      const suppliers = store.suppliers();
      return suppliers.filter((s: Supplier) => s.status === 'active');
    }),

    inactiveSuppliers: computed(() => {
      const suppliers = store.suppliers();
      return suppliers.filter((s: Supplier) => s.status === 'inactive');
    }),

    blockedSuppliers: computed(() => {
      const suppliers = store.suppliers();
      return suppliers.filter((s: Supplier) => s.status === 'blocked');
    }),

    /**
     * Get suppliers with outstanding payables
     */
    suppliersWithPayables: computed(() => {
      const suppliers = store.suppliers();
      return suppliers.filter((s: Supplier) => s.currentBalance > 0);
    }),

    /**
     * Calculate total payables
     */
    totalPayables: computed(() => {
      const suppliers = store.suppliers();
      return suppliers.reduce((sum: number, s: Supplier) => sum + s.currentBalance, 0);
    }),

    /**
     * Get supplier count by status
     */
    supplierCounts: computed(() => {
      const suppliers = store.suppliers();
      return {
        total: suppliers.length,
        active: suppliers.filter((s: Supplier) => s.status === 'active').length,
        inactive: suppliers.filter((s: Supplier) => s.status === 'inactive').length,
        blocked: suppliers.filter((s: Supplier) => s.status === 'blocked').length,
      };
    }),
  })),
  withMethods((store) => ({
    /**
     * Set all suppliers
     */
    setSuppliers(suppliers: Supplier[]): void {
      patchState(store, { suppliers });
    },

    /**
     * Add a new supplier
     */
    addSupplier(supplier: Supplier): void {
      patchState(store, (state) => ({
        suppliers: [...state.suppliers, supplier],
      }));
    },

    /**
     * Update an existing supplier
     */
    updateSupplier(id: number, updates: Partial<Supplier>): void {
      patchState(store, (state) => ({
        suppliers: state.suppliers.map((s: Supplier) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      }));
    },

    /**
     * Remove a supplier
     */
    removeSupplier(id: number): void {
      patchState(store, (state) => ({
        suppliers: state.suppliers.filter((s: Supplier) => s.id !== id),
      }));
    },

    /**
     * Set selected supplier
     */
    setSelectedSupplier(supplier: Supplier | null): void {
      patchState(store, { selectedSupplier: supplier });
    },

    /**
     * Update filters
     */
    setFilters(filters: Partial<SupplierQueryParams>): void {
      patchState(store, (state) => ({
        filters: { ...state.filters, ...filters },
      }));
    },

    /**
     * Clear filters
     */
    clearFilters(): void {
      patchState(store, {
        filters: {
          page: 1,
          limit: 50,
          sortBy: 'name',
          sortOrder: 'asc',
        },
      });
    },

    /**
     * Set loading state
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error });
    },

    /**
     * Clear all data
     */
    clear(): void {
      patchState(store, initialState);
    },
  }))
);
