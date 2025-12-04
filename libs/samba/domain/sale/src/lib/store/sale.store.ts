import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Sale, SaleFilter } from '../models/sale.model';

interface SaleState {
  sales: Sale[];
  selectedSale: Sale | null;
  isLoading: boolean;
  error: string | null;
  filter: SaleFilter;
}

const initialState: SaleState = {
  sales: [],
  selectedSale: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const SaleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredSales: computed(() => {
      const filter = store.filter();
      let sales = store.sales();

      if (filter.branchId) {
        sales = sales.filter(s => s.branchId === filter.branchId);
      }

      if (filter.userId) {
        sales = sales.filter(s => s.userId === filter.userId);
      }

      if (filter.customerId) {
        sales = sales.filter(s => s.customerId === filter.customerId);
      }

      if (filter.paymentMethod) {
        sales = sales.filter(s => s.paymentMethod === filter.paymentMethod);
      }

      if (filter.paymentStatus) {
        sales = sales.filter(s => s.paymentStatus === filter.paymentStatus);
      }

      if (filter.fromDate) {
        sales = sales.filter(s => new Date(s.createdAt) >= filter.fromDate!);
      }

      if (filter.toDate) {
        sales = sales.filter(s => new Date(s.createdAt) <= filter.toDate!);
      }

      if (filter.synced !== undefined) {
        sales = sales.filter(s => s.synced === filter.synced);
      }

      return sales;
    }),

    unsyncedSales: computed(() => {
      return store.sales().filter(s => !s.synced);
    }),

    todaySales: computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return store.sales().filter(s => {
        const saleDate = new Date(s.createdAt);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
      });
    }),

    todayRevenue: computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaySales = store.sales().filter(s => {
        const saleDate = new Date(s.createdAt);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
      });

      return todaySales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);
    }),

    totalRevenue: computed(() => {
      const filter = store.filter();
      let sales = store.sales();

      if (filter.branchId) {
        sales = sales.filter(s => s.branchId === filter.branchId);
      }

      if (filter.userId) {
        sales = sales.filter(s => s.userId === filter.userId);
      }

      if (filter.customerId) {
        sales = sales.filter(s => s.customerId === filter.customerId);
      }

      if (filter.paymentMethod) {
        sales = sales.filter(s => s.paymentMethod === filter.paymentMethod);
      }

      if (filter.paymentStatus) {
        sales = sales.filter(s => s.paymentStatus === filter.paymentStatus);
      }

      if (filter.fromDate) {
        sales = sales.filter(s => new Date(s.createdAt) >= filter.fromDate!);
      }

      if (filter.toDate) {
        sales = sales.filter(s => new Date(s.createdAt) <= filter.toDate!);
      }

      if (filter.synced !== undefined) {
        sales = sales.filter(s => s.synced === filter.synced);
      }

      return sales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);
    }),

    totalSales: computed(() => {
      const filter = store.filter();
      let sales = store.sales();

      if (filter.branchId) {
        sales = sales.filter(s => s.branchId === filter.branchId);
      }

      if (filter.userId) {
        sales = sales.filter(s => s.userId === filter.userId);
      }

      if (filter.customerId) {
        sales = sales.filter(s => s.customerId === filter.customerId);
      }

      if (filter.paymentMethod) {
        sales = sales.filter(s => s.paymentMethod === filter.paymentMethod);
      }

      if (filter.paymentStatus) {
        sales = sales.filter(s => s.paymentStatus === filter.paymentStatus);
      }

      if (filter.fromDate) {
        sales = sales.filter(s => new Date(s.createdAt) >= filter.fromDate!);
      }

      if (filter.toDate) {
        sales = sales.filter(s => new Date(s.createdAt) <= filter.toDate!);
      }

      if (filter.synced !== undefined) {
        sales = sales.filter(s => s.synced === filter.synced);
      }

      return sales.length;
    }),
  })),
  withMethods((store) => ({
    setSales(sales: Sale[]): void {
      patchState(store, { sales, error: null });
    },

    addSale(sale: Sale): void {
      patchState(store, (state) => ({
        sales: [...state.sales, sale],
      }));
    },

    updateSale(sale: Sale): void {
      patchState(store, (state) => ({
        sales: state.sales.map(s => s.id === sale.id ? sale : s),
      }));
    },

    deleteSale(id: number): void {
      patchState(store, (state) => ({
        sales: state.sales.filter(s => s.id !== id),
      }));
    },

    selectSale(sale: Sale | null): void {
      patchState(store, { selectedSale: sale });
    },

    setFilter(filter: SaleFilter): void {
      patchState(store, { filter });
    },

    clearFilter(): void {
      patchState(store, { filter: {} });
    },

    markAsSynced(id: number): void {
      patchState(store, (state) => ({
        sales: state.sales.map(s => s.id === id ? { ...s, synced: true } : s),
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
