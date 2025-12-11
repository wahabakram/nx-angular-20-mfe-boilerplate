import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Purchase, PurchaseQueryParams, PurchaseStatus, PaymentStatus } from '../models/purchase.model';

interface PurchaseState {
  purchases: Purchase[];
  selectedPurchase: Purchase | null;
  filters: PurchaseQueryParams;
  isLoading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  purchases: [],
  selectedPurchase: null,
  filters: {
    page: 1,
    limit: 50,
    sortBy: 'purchaseDate',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
};

export const PurchaseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    /**
     * Get filtered purchases based on current filters
     */
    filteredPurchases: computed(() => {
      const purchases = store.purchases();
      const filters = store.filters();

      let result = [...purchases];

      // Apply status filter
      const status = filters.status;
      if (status) {
        result = result.filter((p: Purchase) => p.status === status);
      }

      // Apply payment status filter
      const paymentStatus = filters.paymentStatus;
      if (paymentStatus) {
        result = result.filter((p: Purchase) => p.paymentStatus === paymentStatus);
      }

      // Apply supplier filter
      const supplierId = filters.supplierId;
      if (supplierId) {
        result = result.filter((p: Purchase) => p.supplierId === supplierId);
      }

      // Apply branch filter
      const branchId = filters.branchId;
      if (branchId) {
        result = result.filter((p: Purchase) => p.branchId === branchId);
      }

      // Apply search filter
      const search = filters.search;
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (p: Purchase) =>
            p.purchaseNumber.toLowerCase().includes(searchLower) ||
            p.supplier?.name.toLowerCase().includes(searchLower) ||
            p.invoiceNumber?.toLowerCase().includes(searchLower)
        );
      }

      return result;
    }),

    /**
     * Get purchases by status
     */
    draftPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.status === 'draft');
    }),

    orderedPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.status === 'ordered');
    }),

    receivedPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.status === 'received');
    }),

    cancelledPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.status === 'cancelled');
    }),

    /**
     * Get purchases by payment status
     */
    pendingPaymentPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.paymentStatus === 'pending');
    }),

    partiallyPaidPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.paymentStatus === 'partial');
    }),

    fullyPaidPurchases: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.paymentStatus === 'paid');
    }),

    /**
     * Calculate total purchase amount
     */
    totalPurchaseAmount: computed(() => {
      const purchases = store.purchases();
      return purchases
        .filter((p: Purchase) => p.status !== 'cancelled')
        .reduce((sum: number, p: Purchase) => sum + p.total, 0);
    }),

    /**
     * Calculate total outstanding amount (unpaid)
     */
    totalOutstanding: computed(() => {
      const purchases = store.purchases();
      return purchases
        .filter((p: Purchase) => p.status === 'received' && p.paymentStatus !== 'paid')
        .reduce((sum: number, p: Purchase) => sum + (p.total - p.amountPaid), 0);
    }),

    /**
     * Get purchase count by status
     */
    purchaseCounts: computed(() => {
      const purchases = store.purchases();
      return {
        total: purchases.length,
        draft: purchases.filter((p: Purchase) => p.status === 'draft').length,
        ordered: purchases.filter((p: Purchase) => p.status === 'ordered').length,
        received: purchases.filter((p: Purchase) => p.status === 'received').length,
        cancelled: purchases.filter((p: Purchase) => p.status === 'cancelled').length,
      };
    }),

    /**
     * Get purchases pending receipt (ordered but not received)
     */
    pendingReceipt: computed(() => {
      const purchases = store.purchases();
      return purchases.filter((p: Purchase) => p.status === 'ordered');
    }),
  })),
  withMethods((store) => ({
    /**
     * Set all purchases
     */
    setPurchases(purchases: Purchase[]): void {
      patchState(store, { purchases });
    },

    /**
     * Add a new purchase
     */
    addPurchase(purchase: Purchase): void {
      patchState(store, (state) => ({
        purchases: [...state.purchases, purchase],
      }));
    },

    /**
     * Update an existing purchase
     */
    updatePurchase(id: number, updates: Partial<Purchase>): void {
      patchState(store, (state) => ({
        purchases: state.purchases.map((p: Purchase) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },

    /**
     * Remove a purchase
     */
    removePurchase(id: number): void {
      patchState(store, (state) => ({
        purchases: state.purchases.filter((p: Purchase) => p.id !== id),
      }));
    },

    /**
     * Set selected purchase
     */
    setSelectedPurchase(purchase: Purchase | null): void {
      patchState(store, { selectedPurchase: purchase });
    },

    /**
     * Update filters
     */
    setFilters(filters: Partial<PurchaseQueryParams>): void {
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
          sortBy: 'purchaseDate',
          sortOrder: 'desc',
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
