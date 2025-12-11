import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Return, ReturnStatus, RefundMethod } from '../models/return.model';

interface ReturnState {
  returns: Return[];
  selectedReturn: Return | null;
  isLoading: boolean;
  error: string | null;
  filter: {
    branchId?: number;
    customerId?: number;
    saleId?: number;
    status?: ReturnStatus;
    refundMethod?: RefundMethod;
    fromDate?: Date;
    toDate?: Date;
  };
}

const initialState: ReturnState = {
  returns: [],
  selectedReturn: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const ReturnStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredReturns: computed(() => {
      const filter = store.filter();
      let returns = store.returns();

      if (filter.branchId) {
        returns = returns.filter(r => r.branchId === filter.branchId);
      }

      if (filter.customerId) {
        returns = returns.filter(r => r.customerId === filter.customerId);
      }

      if (filter.saleId) {
        returns = returns.filter(r => r.saleId === filter.saleId);
      }

      if (filter.status) {
        returns = returns.filter(r => r.status === filter.status);
      }

      if (filter.refundMethod) {
        returns = returns.filter(r => r.refundMethod === filter.refundMethod);
      }

      if (filter.fromDate) {
        returns = returns.filter(r => new Date(r.returnDate) >= filter.fromDate!);
      }

      if (filter.toDate) {
        returns = returns.filter(r => new Date(r.returnDate) <= filter.toDate!);
      }

      return returns;
    }),

    todayReturns: computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return store.returns().filter(r => {
        const returnDate = new Date(r.returnDate);
        returnDate.setHours(0, 0, 0, 0);
        return returnDate.getTime() === today.getTime();
      });
    }),

    todayRefundAmount: computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayReturns = store.returns().filter(r => {
        const returnDate = new Date(r.returnDate);
        returnDate.setHours(0, 0, 0, 0);
        return returnDate.getTime() === today.getTime();
      });

      return todayReturns.reduce((sum, ret) => sum + ret.refundAmount, 0);
    }),

    thisMonthReturns: computed(() => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return store.returns().filter(r => {
        const returnDate = new Date(r.returnDate);
        return returnDate >= firstDayOfMonth && returnDate <= lastDayOfMonth;
      });
    }),

    thisMonthRefundAmount: computed(() => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const thisMonthReturns = store.returns().filter(r => {
        const returnDate = new Date(r.returnDate);
        return returnDate >= firstDayOfMonth && returnDate <= lastDayOfMonth;
      });

      return thisMonthReturns.reduce((sum, ret) => sum + ret.refundAmount, 0);
    }),

    totalRefundAmount: computed(() => {
      const filter = store.filter();
      let returns = store.returns();

      if (filter.branchId) {
        returns = returns.filter(r => r.branchId === filter.branchId);
      }

      if (filter.customerId) {
        returns = returns.filter(r => r.customerId === filter.customerId);
      }

      if (filter.saleId) {
        returns = returns.filter(r => r.saleId === filter.saleId);
      }

      if (filter.status) {
        returns = returns.filter(r => r.status === filter.status);
      }

      if (filter.refundMethod) {
        returns = returns.filter(r => r.refundMethod === filter.refundMethod);
      }

      if (filter.fromDate) {
        const fromDate = filter.fromDate;
        returns = returns.filter(r => new Date(r.returnDate) >= fromDate);
      }

      if (filter.toDate) {
        const toDate = filter.toDate;
        returns = returns.filter(r => new Date(r.returnDate) <= toDate);
      }

      return returns.reduce((sum: number, ret: Return) => sum + ret.refundAmount, 0);
    }),

    totalReturns: computed(() => {
      const filter = store.filter();
      let returns = store.returns();

      if (filter.branchId) {
        returns = returns.filter(r => r.branchId === filter.branchId);
      }

      if (filter.customerId) {
        returns = returns.filter(r => r.customerId === filter.customerId);
      }

      if (filter.saleId) {
        returns = returns.filter(r => r.saleId === filter.saleId);
      }

      if (filter.status) {
        returns = returns.filter(r => r.status === filter.status);
      }

      if (filter.refundMethod) {
        returns = returns.filter(r => r.refundMethod === filter.refundMethod);
      }

      if (filter.fromDate) {
        const fromDate = filter.fromDate;
        returns = returns.filter(r => new Date(r.returnDate) >= fromDate);
      }

      if (filter.toDate) {
        const toDate = filter.toDate;
        returns = returns.filter(r => new Date(r.returnDate) <= toDate);
      }

      return returns.length;
    }),

    returnsByStatus: computed(() => {
      const filter = store.filter();
      let returns = store.returns();

      if (filter.branchId) {
        returns = returns.filter(r => r.branchId === filter.branchId);
      }

      if (filter.customerId) {
        returns = returns.filter(r => r.customerId === filter.customerId);
      }

      if (filter.saleId) {
        returns = returns.filter(r => r.saleId === filter.saleId);
      }

      if (filter.status) {
        returns = returns.filter(r => r.status === filter.status);
      }

      if (filter.refundMethod) {
        returns = returns.filter(r => r.refundMethod === filter.refundMethod);
      }

      if (filter.fromDate) {
        const fromDate = filter.fromDate;
        returns = returns.filter(r => new Date(r.returnDate) >= fromDate);
      }

      if (filter.toDate) {
        const toDate = filter.toDate;
        returns = returns.filter(r => new Date(r.returnDate) <= toDate);
      }

      return {
        pending: returns.filter((r: Return) => r.status === 'pending').length,
        processed: returns.filter((r: Return) => r.status === 'processed').length,
        cancelled: returns.filter((r: Return) => r.status === 'cancelled').length,
      };
    }),

    returnsByRefundMethod: computed(() => {
      const filter = store.filter();
      let returns = store.returns();

      if (filter.branchId) {
        returns = returns.filter(r => r.branchId === filter.branchId);
      }

      if (filter.customerId) {
        returns = returns.filter(r => r.customerId === filter.customerId);
      }

      if (filter.saleId) {
        returns = returns.filter(r => r.saleId === filter.saleId);
      }

      if (filter.status) {
        returns = returns.filter(r => r.status === filter.status);
      }

      if (filter.refundMethod) {
        returns = returns.filter(r => r.refundMethod === filter.refundMethod);
      }

      if (filter.fromDate) {
        const fromDate = filter.fromDate;
        returns = returns.filter(r => new Date(r.returnDate) >= fromDate);
      }

      if (filter.toDate) {
        const toDate = filter.toDate;
        returns = returns.filter(r => new Date(r.returnDate) <= toDate);
      }

      return {
        cash: returns.filter((r: Return) => r.refundMethod === 'cash').length,
        card: returns.filter((r: Return) => r.refundMethod === 'card').length,
        'credit-note': returns.filter((r: Return) => r.refundMethod === 'credit-note').length,
        exchange: returns.filter((r: Return) => r.refundMethod === 'exchange').length,
      };
    }),
  })),
  withMethods((store) => ({
    setReturns(returns: Return[]): void {
      patchState(store, { returns, error: null });
    },

    addReturn(ret: Return): void {
      patchState(store, (state) => ({
        returns: [...state.returns, ret],
      }));
    },

    updateReturn(ret: Return): void {
      patchState(store, (state) => ({
        returns: state.returns.map(r => r.id === ret.id ? ret : r),
      }));
    },

    deleteReturn(id: number): void {
      patchState(store, (state) => ({
        returns: state.returns.filter(r => r.id !== id),
      }));
    },

    selectReturn(ret: Return | null): void {
      patchState(store, { selectedReturn: ret });
    },

    setFilter(filter: typeof initialState.filter): void {
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
  }))
);
