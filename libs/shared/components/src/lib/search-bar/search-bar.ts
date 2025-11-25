import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  startWith,
} from 'rxjs';
import { Icon } from '../icon/icon';

export interface SearchSuggestion {
  value: string;
  label: string;
  category?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchFilter {
  key: string;
  label: string;
  value: unknown;
  removable?: boolean;
}

export interface SearchBarConfig {
  placeholder?: string;
  debounceTime?: number;
  showSuggestions?: boolean;
  showFilters?: boolean;
  showClearButton?: boolean;
  maxSuggestions?: number;
  appearance?: 'fill' | 'outline';
  size?: 'small' | 'medium' | 'large';
  hint?: string;
}

@Component({
  selector: 'mf-search-bar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatMenuModule,
    Icon,
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Inputs
  value = input<string>('');
  suggestions = input<SearchSuggestion[]>([]);
  filters = input<SearchFilter[]>([]);
  config = input<SearchBarConfig>({});
  disabled = input<boolean>(false);

  // Outputs
  searchQuery = output<string>();
  suggestionSelected = output<SearchSuggestion>();
  filterRemoved = output<SearchFilter>();
  focused = output<void>();
  blurred = output<void>();

  // Form Control
  searchControl = new FormControl('');

  // Internal state
  isSearching = signal(false);
  showSuggestions = signal(false);

  // Computed properties
  filteredSuggestions = computed(() => {
    const query = this.searchControl.value?.toLowerCase() || '';
    const maxSuggestions = this.defaultConfig().maxSuggestions;

    if (!this.defaultConfig().showSuggestions) {
      return [];
    }

    // If no query, return all suggestions (up to maxSuggestions)
    if (!query) {
      return this.suggestions().slice(0, maxSuggestions);
    }

    // Filter suggestions based on query
    return this.suggestions()
      .filter(
        (suggestion) =>
          suggestion.label.toLowerCase().includes(query) ||
          suggestion.value.toLowerCase().includes(query)
      )
      .slice(0, maxSuggestions);
  });

  groupedSuggestions = computed(() => {
    const suggestions = this.filteredSuggestions();
    const groups: { [key: string]: SearchSuggestion[] } = {};

    suggestions.forEach((suggestion) => {
      const category = suggestion.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(suggestion);
    });

    return Object.entries(groups).map(([category, items]) => ({
      category,
      items,
    }));
  });

  defaultConfig = computed(() => ({
    placeholder: 'Search...',
    debounceTime: 300,
    showSuggestions: true,
    showFilters: true,
    showClearButton: true,
    maxSuggestions: 10,
    appearance: 'outline' as const,
    size: 'medium' as const,
    hint: '',
    ...this.config(),
  }));

  constructor() {
    effect(() => {
      console.log('suggestions', this.suggestions());
    })
    // Update search control when value input changes
    effect(() => {
      const newValue = this.value();
      if (this.searchControl.value !== newValue) {
        this.searchControl.setValue(newValue, { emitEvent: false });
      }
    });

    // Update disabled state
    effect(() => {
      if (this.disabled()) {
        this.searchControl.disable();
      } else {
        this.searchControl.enable();
      }
    });
  }

  ngOnInit() {
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        startWith(this.value()),
        debounceTime(this.defaultConfig().debounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value !== null && value !== undefined) {
          this.searchQuery.emit(value);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFocus() {
    this.showSuggestions.set(true);
    this.focused.emit();
  }

  onBlur() {
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      this.showSuggestions.set(false);
      this.blurred.emit();
    }, 200);
  }

  onSuggestionSelected(suggestion: SearchSuggestion) {
    this.searchControl.setValue(suggestion.value);
    this.showSuggestions.set(false);
    this.suggestionSelected.emit(suggestion);
  }

  onFilterRemoved(filter: SearchFilter) {
    this.filterRemoved.emit(filter);
  }

  clearSearch() {
    this.searchControl.setValue('');
    // Focus is handled by the input element itself
  }

  getFieldClass(): string {
    const config = this.defaultConfig();
    const classes = ['mf-search-field'];

    if (config.size) {
      classes.push(`size-${config.size}`);
    }

    return classes.join(' ');
  }

  getSuggestionIcon(suggestion: SearchSuggestion): string {
    if (suggestion.icon) {
      return suggestion.icon;
    }

    switch (suggestion.category?.toLowerCase()) {
      case 'customers':
        return 'solar:user-line-duotone';
      case 'products':
        return 'solar:box-line-duotone';
      case 'orders':
        return 'solar:cart-line-duotone';
      case 'campaigns':
        return 'solar:megaphone-line-duotone';
      default:
        return 'solar:magnifer-line-duotone';
    }
  }

  trackBySuggestion(index: number, suggestion: SearchSuggestion): string {
    return suggestion.value;
  }

  trackByFilter(index: number, filter: SearchFilter): string {
    return filter.key;
  }
}
