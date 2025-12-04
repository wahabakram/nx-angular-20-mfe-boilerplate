import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Customer, CustomerFilter } from '../models/customer.model';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filter: CustomerFilter;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredCustomers: computed(() => {
      const filter = store.filter();
      let customers = store.customers();

      if (filter.search) {
        const search = filter.search.toLowerCase();
        customers = customers.filter(
          c => c.name.toLowerCase().includes(search) ||
               c.phone.includes(search) ||
               c.email?.toLowerCase().includes(search)
        );
      }

      if (filter.customerType) {
        customers = customers.filter(c => c.customerType === filter.customerType);
      }

      if (filter.isActive !== undefined) {
        customers = customers.filter(c => c.isActive === filter.isActive);
      }

      if (filter.hasBalance) {
        customers = customers.filter(c => c.currentBalance > 0);
      }

      return customers;
    }),

    activeCustomers: computed(() => {
      return store.customers().filter(c => c.isActive);
    }),

    customersWithBalance: computed(() => {
      return store.customers().filter(c => c.currentBalance > 0);
    }),

    totalCustomers: computed(() => store.customers().length),
  })),
  withMethods((store) => ({
    setCustomers(customers: Customer[]): void {
      patchState(store, { customers, error: null });
    },

    addCustomer(customer: Customer): void {
      patchState(store, (state) => ({
        customers: [...state.customers, customer],
      }));
    },

    updateCustomer(customer: Customer): void {
      patchState(store, (state) => ({
        customers: state.customers.map(c => c.id === customer.id ? customer : c),
      }));
    },

    deleteCustomer(id: number): void {
      patchState(store, (state) => ({
        customers: state.customers.filter(c => c.id !== id),
      }));
    },

    selectCustomer(customer: Customer | null): void {
      patchState(store, { selectedCustomer: customer });
    },

    setFilter(filter: CustomerFilter): void {
      patchState(store, { filter });
    },

    clearFilter(): void {
      patchState(store, { filter: {} });
    },

    updateBalance(customerId: number, amount: number): void {
      patchState(store, (state) => ({
        customers: state.customers.map(c =>
          c.id === customerId
            ? { ...c, currentBalance: c.currentBalance + amount }
            : c
        ),
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
