import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import {
  CustomerLedgerEntry,
  CustomerAccountSummary,
  LedgerQueryParams,
  TransactionType,
} from '../models/ledger.model';

interface LedgerState {
  entries: CustomerLedgerEntry[];
  currentCustomerId: number | null;
  summary: CustomerAccountSummary | null;
  allSummaries: CustomerAccountSummary[];
  filters: LedgerQueryParams;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: LedgerState = {
  entries: [],
  currentCustomerId: null,
  summary: null,
  allSummaries: [],
  filters: {
    page: 1,
    limit: 50,
    sortBy: 'transactionDate',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 50,
};

export const LedgerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    /**
     * Get filtered entries based on current filters
     */
    filteredEntries: computed(() => {
      const entries = store.entries();
      const filters = store.filters();

      let result = [...entries];

      // Apply transaction type filter
      const transactionType = filters.transactionType;
      if (transactionType) {
        result = result.filter((entry: CustomerLedgerEntry) => entry.transactionType === transactionType);
      }

      // Apply date range filters
      const startDate = filters.startDate;
      const endDate = filters.endDate;
      if (startDate) {
        result = result.filter((entry: CustomerLedgerEntry) =>
          new Date(entry.transactionDate) >= new Date(startDate)
        );
      }
      if (endDate) {
        result = result.filter((entry: CustomerLedgerEntry) =>
          new Date(entry.transactionDate) <= new Date(endDate)
        );
      }

      // Apply branch filter
      const branchId = filters.branchId;
      if (branchId) {
        result = result.filter((entry: CustomerLedgerEntry) => entry.branchId === branchId);
      }

      return result;
    }),

    /**
     * Calculate total debit amount
     */
    totalDebit: computed(() => {
      const entries = store.entries();
      return entries.reduce((sum: number, entry: CustomerLedgerEntry) => sum + entry.debit, 0);
    }),

    /**
     * Calculate total credit amount
     */
    totalCredit: computed(() => {
      const entries = store.entries();
      return entries.reduce((sum: number, entry: CustomerLedgerEntry) => sum + entry.credit, 0);
    }),

    /**
     * Calculate current balance
     */
    currentBalance: computed(() => {
      const entries = store.entries();
      if (entries.length === 0) return 0;
      // Return the balance from the most recent entry
      return entries[entries.length - 1]?.balance || 0;
    }),

    /**
     * Get entries by transaction type
     */
    salesEntries: computed(() => {
      const entries = store.entries();
      return entries.filter((entry: CustomerLedgerEntry) => entry.transactionType === 'SALE');
    }),

    returnEntries: computed(() => {
      const entries = store.entries();
      return entries.filter((entry: CustomerLedgerEntry) => entry.transactionType === 'RETURN');
    }),

    paymentEntries: computed(() => {
      const entries = store.entries();
      return entries.filter((entry: CustomerLedgerEntry) => entry.transactionType === 'PAYMENT');
    }),

    /**
     * Get customers with outstanding balances
     */
    customersWithBalance: computed(() => {
      const summaries = store.allSummaries();
      return summaries.filter((summary: CustomerAccountSummary) => summary.currentBalance > 0);
    }),

    /**
     * Has more pages
     */
    hasMore: computed(() => {
      const page = store.page();
      const limit = store.limit();
      const total = store.total();
      return page * limit < total;
    }),
  })),
  withMethods((store) => ({
    /**
     * Set ledger entries
     */
    setEntries(entries: CustomerLedgerEntry[]): void {
      patchState(store, { entries });
    },

    /**
     * Add a single entry
     */
    addEntry(entry: CustomerLedgerEntry): void {
      patchState(store, (state) => ({
        entries: [...state.entries, entry],
      }));
    },

    /**
     * Update an entry
     */
    updateEntry(id: number, updates: Partial<CustomerLedgerEntry>): void {
      patchState(store, (state) => ({
        entries: state.entries.map((entry: CustomerLedgerEntry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        ),
      }));
    },

    /**
     * Remove an entry
     */
    removeEntry(id: number): void {
      patchState(store, (state) => ({
        entries: state.entries.filter((entry: CustomerLedgerEntry) => entry.id !== id),
      }));
    },

    /**
     * Set current customer ID
     */
    setCurrentCustomerId(customerId: number | null): void {
      patchState(store, { currentCustomerId: customerId });
    },

    /**
     * Set customer summary
     */
    setSummary(summary: CustomerAccountSummary): void {
      patchState(store, { summary });
    },

    /**
     * Set all summaries
     */
    setAllSummaries(summaries: CustomerAccountSummary[]): void {
      patchState(store, { allSummaries: summaries });
    },

    /**
     * Update filters
     */
    setFilters(filters: Partial<LedgerQueryParams>): void {
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
          sortBy: 'transactionDate',
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
     * Set pagination
     */
    setPagination(page: number, limit: number, total: number): void {
      patchState(store, { page, limit, total });
    },

    /**
     * Clear all data
     */
    clear(): void {
      patchState(store, initialState);
    },
  }))
);
