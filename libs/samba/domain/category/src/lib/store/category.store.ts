import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Category } from '../models/category.model';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    activeCategories: computed(() => {
      return store.categories().filter(c => c.isActive);
    }),

    rootCategories: computed(() => {
      return store.categories().filter(c => !c.parentId);
    }),

    totalCategories: computed(() => store.categories().length),
  })),
  withMethods((store) => ({
    setCategories(categories: Category[]): void {
      patchState(store, { categories, error: null });
    },

    addCategory(category: Category): void {
      patchState(store, (state) => ({
        categories: [...state.categories, category],
      }));
    },

    updateCategory(category: Category): void {
      patchState(store, (state) => ({
        categories: state.categories.map(c => c.id === category.id ? category : c),
      }));
    },

    deleteCategory(id: number): void {
      patchState(store, (state) => ({
        categories: state.categories.filter(c => c.id !== id),
      }));
    },

    selectCategory(category: Category | null): void {
      patchState(store, { selectedCategory: category });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  }))
);
