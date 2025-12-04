import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { InventoryAdjustment, InventoryFilter, StockTransfer } from '../models/inventory.model';

interface InventoryState {
  adjustments: InventoryAdjustment[];
  stockTransfers: StockTransfer[];
  selectedAdjustment: InventoryAdjustment | null;
  selectedTransfer: StockTransfer | null;
  isLoading: boolean;
  error: string | null;
  filter: InventoryFilter;
}

const initialState: InventoryState = {
  adjustments: [],
  stockTransfers: [],
  selectedAdjustment: null,
  selectedTransfer: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const InventoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredAdjustments: computed(() => {
      const filter = store.filter();
      let adjustments = store.adjustments();

      if (filter.branchId) {
        adjustments = adjustments.filter(a => a.branchId === filter.branchId);
      }

      if (filter.productId) {
        adjustments = adjustments.filter(a => a.productId === filter.productId);
      }

      if (filter.adjustmentType) {
        adjustments = adjustments.filter(a => a.adjustmentType === filter.adjustmentType);
      }

      if (filter.fromDate) {
        adjustments = adjustments.filter(a => new Date(a.createdAt) >= filter.fromDate!);
      }

      if (filter.toDate) {
        adjustments = adjustments.filter(a => new Date(a.createdAt) <= filter.toDate!);
      }

      if (filter.synced !== undefined) {
        adjustments = adjustments.filter(a => a.synced === filter.synced);
      }

      return adjustments;
    }),

    unsyncedAdjustments: computed(() => {
      return store.adjustments().filter(a => !a.synced);
    }),

    pendingTransfers: computed(() => {
      return store.stockTransfers().filter(t => t.status === 'pending');
    }),

    inTransitTransfers: computed(() => {
      return store.stockTransfers().filter(t => t.status === 'in-transit');
    }),
  })),
  withMethods((store) => ({
    setAdjustments(adjustments: InventoryAdjustment[]): void {
      patchState(store, { adjustments, error: null });
    },

    addAdjustment(adjustment: InventoryAdjustment): void {
      patchState(store, (state) => ({
        adjustments: [...state.adjustments, adjustment],
      }));
    },

    setStockTransfers(stockTransfers: StockTransfer[]): void {
      patchState(store, { stockTransfers, error: null });
    },

    addStockTransfer(transfer: StockTransfer): void {
      patchState(store, (state) => ({
        stockTransfers: [...state.stockTransfers, transfer],
      }));
    },

    updateStockTransfer(transfer: StockTransfer): void {
      patchState(store, (state) => ({
        stockTransfers: state.stockTransfers.map(t => t.id === transfer.id ? transfer : t),
      }));
    },

    selectAdjustment(adjustment: InventoryAdjustment | null): void {
      patchState(store, { selectedAdjustment: adjustment });
    },

    selectTransfer(transfer: StockTransfer | null): void {
      patchState(store, { selectedTransfer: transfer });
    },

    setFilter(filter: InventoryFilter): void {
      patchState(store, { filter });
    },

    clearFilter(): void {
      patchState(store, { filter: {} });
    },

    markAdjustmentAsSynced(id: number): void {
      patchState(store, (state) => ({
        adjustments: state.adjustments.map(a => a.id === id ? { ...a, synced: true } : a),
      }));
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  }))
);
