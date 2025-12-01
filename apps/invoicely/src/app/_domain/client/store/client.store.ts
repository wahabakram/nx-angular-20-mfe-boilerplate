import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Client, ClientStatistics } from '../models/client.model';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: 'active' | 'inactive';
    search?: string;
    tagId?: number;
  };
}

const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  filters: {},
};

export const ClientStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Filtered clients based on current filters
    filteredClients: computed(() => {
      let filtered = store.clients();
      const filters = store.filters();

      // Filter by status
      if (filters.status) {
        filtered = filtered.filter((client) => client.status === filters.status);
      }

      // Filter by search query
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (client) =>
            client.name.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query) ||
            client.company?.toLowerCase().includes(query)
        );
      }

      // Filter by tag
      if (filters.tagId) {
        filtered = filtered.filter((client) =>
          client.tags?.some((tag) => tag.id === filters.tagId)
        );
      }

      return filtered;
    }),

    // Active clients only
    activeClients: computed(() => {
      return store.clients().filter((client) => client.status === 'active');
    }),

    // Inactive clients only
    inactiveClients: computed(() => {
      return store.clients().filter((client) => client.status === 'inactive');
    }),

    // Client statistics
    statistics: computed((): ClientStatistics => {
      const clients = store.clients();
      const active = clients.filter((c) => c.status === 'active');
      const inactive = clients.filter((c) => c.status === 'inactive');

      return {
        total: clients.length,
        active: active.length,
        inactive: inactive.length,
        totalRevenue: 0, // To be calculated from invoices
        totalInvoices: 0, // To be calculated from invoices
      };
    }),

    // Check if there are any clients
    hasClients: computed(() => {
      return store.clients().length > 0;
    }),

    // Check if any filters are active
    hasActiveFilters: computed(() => {
      const filters = store.filters();
      return !!(filters.status || filters.search || filters.tagId);
    }),
  })),
  withMethods((store) => {
    return {
      // Set all clients
      setClients(clients: Client[]): void {
        patchState(store, { clients });
      },

      // Add a new client
      addClient(client: Client): void {
        patchState(store, { clients: [...store.clients(), client] });
      },

      // Update an existing client
      updateClient(id: number, updates: Partial<Client>): void {
        patchState(store, {
          clients: store.clients().map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        });
      },

      // Delete a client
      deleteClient(id: number): void {
        patchState(store, {
          clients: store.clients().filter((client) => client.id !== id),
        });
      },

      // Select a client
      selectClient(client: Client | null): void {
        patchState(store, { selectedClient: client });
      },

      // Set filters
      setFilters(filters: Partial<ClientState['filters']>): void {
        patchState(store, { filters: { ...store.filters(), ...filters } });
      },

      // Clear all filters
      clearFilters(): void {
        patchState(store, { filters: {} });
      },

      // Set loading state
      setLoading(loading: boolean): void {
        patchState(store, { loading });
      },

      // Set error state
      setError(error: string | null): void {
        patchState(store, { error, loading: false });
      },
    };
  })
);
