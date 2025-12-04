import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Branch } from '../models/branch.model';

interface BranchState {
  branches: Branch[];
  selectedBranchId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  selectedBranchId: null,
  isLoading: false,
  error: null,
};

export const BranchStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    activeBranches: computed(() => {
      return store.branches().filter(b => b.isActive);
    }),

    selectedBranch: computed(() => {
      const id = store.selectedBranchId();
      return store.branches().find(b => b.id === id) ?? null;
    }),

    mainBranch: computed(() => {
      return store.branches().find(b => b.isMainBranch) ?? null;
    }),

    branchCount: computed(() => store.branches().length),

    hasBranches: computed(() => store.branches().length > 0),
  })),
  withMethods((store) => ({
    setBranches(branches: Branch[]): void {
      patchState(store, { branches, error: null });
    },

    selectBranch(branchId: number | null): void {
      patchState(store, { selectedBranchId: branchId });
      // Persist to localStorage for session
      if (branchId) {
        localStorage.setItem('selectedBranchId', branchId.toString());
      }
    },

    loadSelectedBranchFromStorage(): void {
      const savedBranchId = localStorage.getItem('selectedBranchId');
      if (savedBranchId) {
        patchState(store, { selectedBranchId: parseInt(savedBranchId, 10) });
      }
    },

    addBranch(branch: Branch): void {
      patchState(store, (state) => ({
        branches: [...state.branches, branch],
      }));
    },

    updateBranch(branch: Branch): void {
      patchState(store, (state) => ({
        branches: state.branches.map(b => b.id === branch.id ? branch : b),
      }));
    },

    deleteBranch(id: number): void {
      patchState(store, (state) => ({
        branches: state.branches.filter(b => b.id !== id),
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
