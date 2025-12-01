import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { Invoice, InvoiceStatistics, InvoiceStatus } from '../models/invoice.model';

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: InvoiceStatus | 'all';
    searchQuery: string;
    clientId: number | null;
  };
}

const initialState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    searchQuery: '',
    clientId: null,
  },
};

export const InvoiceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Filtered invoices based on current filters
    filteredInvoices: computed(() => {
      const invoices = store.invoices();
      const filters = store.filters();

      return invoices.filter((invoice) => {
        // Status filter
        if (filters.status !== 'all' && invoice.status !== filters.status) {
          return false;
        }

        // Client filter
        if (filters.clientId && invoice.clientId !== filters.clientId) {
          return false;
        }

        // Search filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          return (
            invoice.invoiceNumber.toLowerCase().includes(query) ||
            invoice.client?.name.toLowerCase().includes(query) ||
            invoice.notes?.toLowerCase().includes(query)
          );
        }

        return true;
      });
    }),

    // Invoice statistics
    statistics: computed((): InvoiceStatistics => {
      const invoices = store.invoices();

      const stats: InvoiceStatistics = {
        total: invoices.length,
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0,
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
      };

      invoices.forEach((invoice: Invoice) => {
        // Count by status
        const statusKey = invoice.status as keyof Pick<InvoiceStatistics, 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'>;
        stats[statusKey]++;

        // Sum amounts
        stats.totalAmount += invoice.total;
        if (invoice.status === 'paid') {
          stats.paidAmount += invoice.total;
        } else {
          stats.unpaidAmount += invoice.total;
        }
      });

      return stats;
    }),

    // Filtered statistics (computed from filters inline to avoid circular dependency)
    filteredStatistics: computed((): InvoiceStatistics => {
      const invoices = store.invoices();
      const filters = store.filters();

      const filteredInvoices = invoices.filter((invoice) => {
        if (filters.status !== 'all' && invoice.status !== filters.status) {
          return false;
        }
        if (filters.clientId && invoice.clientId !== filters.clientId) {
          return false;
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          return (
            invoice.invoiceNumber.toLowerCase().includes(query) ||
            invoice.client?.name.toLowerCase().includes(query) ||
            invoice.notes?.toLowerCase().includes(query)
          );
        }
        return true;
      });

      const stats: InvoiceStatistics = {
        total: filteredInvoices.length,
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0,
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
      };

      filteredInvoices.forEach((invoice: Invoice) => {
        const statusKey = invoice.status as keyof Pick<InvoiceStatistics, 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'>;
        stats[statusKey]++;
        stats.totalAmount += invoice.total;
        if (invoice.status === 'paid') {
          stats.paidAmount += invoice.total;
        } else {
          stats.unpaidAmount += invoice.total;
        }
      });

      return stats;
    }),

    // Recent invoices (last 5)
    recentInvoices: computed(() => {
      const invoices = store.invoices();
      return [...invoices]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    }),

    // Overdue invoices
    overdueInvoices: computed(() => {
      return store.invoices().filter((inv) => inv.status === 'overdue');
    }),

    // Check if invoice exists
    hasInvoices: computed(() => store.invoices().length > 0),
  })),
  withMethods((store) => {
    return {
      // Set all invoices
      setInvoices(invoices: Invoice[]): void {
        patchState(store, { invoices, error: null });
      },

      // Add invoice
      addInvoice(invoice: Invoice): void {
        patchState(store, {
          invoices: [invoice, ...store.invoices()],
          error: null,
        });
      },

      // Update invoice
      updateInvoice(id: number, updates: Partial<Invoice>): void {
        patchState(store, {
          invoices: store.invoices().map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
          selectedInvoice:
            store.selectedInvoice()?.id === id
              ? { ...store.selectedInvoice()!, ...updates }
              : store.selectedInvoice(),
          error: null,
        });
      },

      // Delete invoice
      deleteInvoice(id: number): void {
        patchState(store, {
          invoices: store.invoices().filter((inv) => inv.id !== id),
          selectedInvoice:
            store.selectedInvoice()?.id === id ? null : store.selectedInvoice(),
          error: null,
        });
      },

      // Select invoice
      selectInvoice(invoice: Invoice | null): void {
        patchState(store, { selectedInvoice: invoice });
      },

      // Select invoice by ID
      selectInvoiceById(id: number): void {
        const invoice = store.invoices().find((inv) => inv.id === id) || null;
        patchState(store, { selectedInvoice: invoice });
      },

      // Update invoice status
      updateInvoiceStatus(id: number, status: InvoiceStatus): void {
        patchState(store, {
          invoices: store.invoices().map((inv) =>
            inv.id === id ? { ...inv, status } : inv
          ),
          selectedInvoice:
            store.selectedInvoice()?.id === id
              ? { ...store.selectedInvoice()!, status }
              : store.selectedInvoice(),
        });
      },

      // Set filters
      setFilters(filters: Partial<InvoiceState['filters']>): void {
        patchState(store, {
          filters: { ...store.filters(), ...filters },
        });
      },

      // Clear filters
      clearFilters(): void {
        patchState(store, {
          filters: initialState.filters,
        });
      },

      // Set loading
      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },

      // Set error
      setError(error: string | null): void {
        patchState(store, { error, isLoading: false });
      },

      // Clear error
      clearError(): void {
        patchState(store, { error: null });
      },

      // Reset store
      reset(): void {
        patchState(store, initialState);
      },
    };
  })
);
