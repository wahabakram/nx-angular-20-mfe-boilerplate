import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import {
  PanelBody,
  Panel,
  PanelFooter,
  PanelHeader,
  PanelSidebar,
} from '@ng-mf/components';
import { OverlayScrollbar } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Navigation, NavigationItem } from '@ng-mf/components';
import { CourseItem, categoriesMock, coursesMock } from './mock-data';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  BlockState,
  BlockStateContent,
  BlockStateIcon,
  BlockStateTitle,
} from '@ng-mf/components';
import { BlockLoader } from '@ng-mf/components';

@Component({
  selector: 'app-courses',
  imports: [
    NgClass,
    Navigation,
    NavigationItem,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatPaginatorModule,
    Panel,
    PanelSidebar,
    PanelBody,
    PanelHeader,
    PanelFooter,
    OverlayScrollbar,
    MatIcon,
    MatTooltip,
    BlockStateTitle,
    BlockStateIcon,
    BlockStateContent,
    BlockState,
    BlockLoader,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Courses {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  // mock categories for sidebar navigation
  readonly categories = signal(categoriesMock);

  // mock catalog
  readonly courses = signal<CourseItem[]>(coursesMock);

  // filters
  readonly levelFilters = signal<Set<CourseItem['level']>>(new Set());
  readonly priceFilters = signal<Set<CourseItem['price']>>(new Set());
  readonly typeFilters = signal<Set<CourseItem['type']>>(new Set());
  readonly durationFilter = signal<
    | 'All'
    | 'Less than 5 hours'
    | '5–10 hours'
    | '10–20 hours'
    | '20–60 hours'
    | '60+ hours'
  >('All');
  readonly sortBy = signal<
    'Most popular' | 'Newest' | 'Duration asc' | 'Duration desc'
  >('Most popular');

  readonly filteredCourses = computed(() => {
    let list = this.courses();

    // filter by selected category if any
    const category = this.activeCategoryId();
    if (category) list = list.filter((c) => c.categoryId === category);

    const L = this.levelFilters();
    if (L.size) list = list.filter((c) => L.has(c.level));

    const P = this.priceFilters();
    if (P.size) list = list.filter((c) => P.has(c.price));

    const T = this.typeFilters();
    if (T.size) list = list.filter((c) => T.has(c.type));

    const D = this.durationFilter();
    list = list.filter((c) => {
      switch (D) {
        case 'Less than 5 hours':
          return c.hours < 5;
        case '5–10 hours':
          return c.hours >= 5 && c.hours <= 10;
        case '10–20 hours':
          return c.hours > 10 && c.hours <= 20;
        case '20–60 hours':
          return c.hours > 20 && c.hours <= 60;
        case '60+ hours':
          return c.hours > 60;
        default:
          return true;
      }
    });

    switch (this.sortBy()) {
      case 'Duration asc':
        list = [...list].sort((a, b) => a.hours - b.hours);
        break;
      case 'Duration desc':
        list = [...list].sort((a, b) => b.hours - a.hours);
        break;
      default:
        break;
    }

    return list;
  });

  // pagination
  readonly pageIndex = signal(0);
  readonly pageSize = signal(9);

  // ensure page index stays valid when filtered list or page size changes
  readonly totalCount = computed(() => {
    const total = this.filteredCourses().length;
    const maxIndex = Math.max(0, Math.ceil(total / this.pageSize()) - 1);
    if (this.pageIndex() > maxIndex) this.pageIndex.set(0);
    return total;
  });

  readonly pagedCourses = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredCourses().slice(start, end);
  });

  // number of active filters for badge display (total)
  readonly activeFiltersCount = computed(
    () =>
      this.levelFilters().size +
      this.priceFilters().size +
      this.typeFilters().size +
      (this.durationFilter() !== 'All' ? 1 : 0)
  );

  // per-menu badge counts
  readonly levelBadgeCount = computed(() => this.levelFilters().size);
  readonly priceBadgeCount = computed(() => this.priceFilters().size);
  readonly typeBadgeCount = computed(() => this.typeFilters().size);
  readonly durationBadgeCount = computed(() =>
    this.durationFilter() !== 'All' ? 1 : 0
  );

  readonly activeCategoryId = signal(null);
  readonly loading = signal(false);

  // Indicates if any filter or category is active (true when any of Level/Price/Type/Duration is set, or a category is selected)
  readonly anyFilterOrCategoryActive = computed(
    () => !!this.activeCategoryId() || this.activeFiltersCount() > 0
  );

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'courses',
        name: 'Courses',
        type: null,
      },
    ]);
  }

  onPage(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  toggleSet<T>(setSig: ReturnType<typeof signal<Set<T>>>, value: T): void {
    const s = new Set(setSig());
    if (s.has(value)) s.delete(value);
    else s.add(value);
    setSig.set(s);
    this.loadCourses();
  }

  // Per-menu clear helpers
  clearLevel(): void {
    this.levelFilters.set(new Set());
    this.loadCourses();
  }

  clearPrice(): void {
    this.priceFilters.set(new Set());
    this.loadCourses();
  }

  clearType(): void {
    this.typeFilters.set(new Set());
    this.loadCourses();
  }

  clearDuration(): void {
    this.durationFilter.set('All');
    this.loadCourses();
  }

  clearCategory() {
    this.activeCategoryId.set(null);
    this.pageIndex.set(0);
    this.loadCourses();
  }

  onCategorySelect(categoryId: any) {
    this.activeCategoryId.set(categoryId);
    // reset pagination to the first page when category changes
    this.pageIndex.set(0);
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }
}
