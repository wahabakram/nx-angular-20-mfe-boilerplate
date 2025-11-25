import {
  Component,
  input,
  output,
  signal,
  computed,
  ViewChild,
  AfterViewInit,
  OnInit,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { Icon } from '../icon/icon';

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'custom';
  format?: (value: unknown, row: T) => string;
  render?: (value: unknown, row: T) => string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: 'start' | 'end';
  hidden?: boolean;
}

export interface DataTableAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: (row: T) => boolean;
  visible?: (row: T) => boolean;
  tooltip?: string;
}

export interface DataTableConfig {
  selectable?: boolean;
  multiSelect?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  sorting?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  density?: 'compact' | 'standard' | 'comfcortable';
  showProgress?: boolean;
}

@Component({
  selector: 'mf-data-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
    Icon
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable<T = Record<string, unknown>> implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inputs
  data = input<T[]>([]);
  columns = input<DataTableColumn<T>[]>([]);
  actions = input<DataTableAction<T>[]>([]);
  config = input<DataTableConfig>({});

  // Outputs
  actionClick = output<{ action: string; row: T }>();
  selectionChange = output<T[]>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();
  rowClick = output<T>();

  // Internal state
  dataSource = new MatTableDataSource<T>([]);
  selection = new SelectionModel<T>(true, []);
  loading = signal(false);

  // Computed properties
  displayedColumns = computed(() => {
    const cols = [];

    if (this.config().selectable) {
      cols.push('select');
    }

    cols.push(...this.columns()
      .filter(col => !col.hidden)
      .map(col => col.key)
    );

    if (this.actions().length > 0) {
      cols.push('actions');
    }

    return cols;
  });

  visibleColumns = computed(() =>
    this.columns().filter(col => !col.hidden)
  );

  hasData = computed(() => this.data().length > 0);

  defaultConfig = computed(() => ({
    selectable: false,
    multiSelect: false,
    pagination: true,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    sorting: true,
    loading: false,
    emptyMessage: 'No data available',
    stickyHeader: true,
    density: 'standard' as const,
    showProgress: false,
    ...this.config()
  }));

  constructor() {
    // Update data source when data changes
    effect(() => {
      this.dataSource.data = this.data();
    });

    // Update loading state when config changes
    effect(() => {
      this.loading.set(this.defaultConfig().loading);
    });
  }

  ngOnInit() {
    // Configure selection
    this.selection = new SelectionModel<T>(
      this.defaultConfig().multiSelect,
      []
    );

    // Listen to selection changes
    this.selection.changed.subscribe(() => {
      this.selectionChange.emit(this.selection.selected);
    });
  }

  ngAfterViewInit() {
    if (this.defaultConfig().pagination && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.defaultConfig().sorting && this.sort) {
      this.dataSource.sort = this.sort;

      this.sort.sortChange.subscribe((sort: Sort) => {
        this.sortChange.emit(sort);
      });
    }
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  toggleRow(row: T): void {
    this.selection.toggle(row);
  }

  // Action methods
  onActionClick(action: DataTableAction<T>, row: T): void {
    this.actionClick.emit({ action: action.id, row });
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  // Utility methods
  getColumnValue(row: T, column: DataTableColumn<T>): unknown {
    const value = this.getNestedProperty(row, column.key);

    if (column.format) {
      return column.format(value, row);
    }

    if (column.render) {
      return column.render(value, row);
    }

    return this.formatValue(value, column.type);
  }

  private getNestedProperty(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current, prop) => {
      return current && typeof current === 'object' && prop in current
        ? (current as Record<string, unknown>)[prop]
        : undefined;
    }, obj);
  }

  private formatValue(value: unknown, type?: string): string {
    if (value == null) return '';

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value));

      case 'number':
        return new Intl.NumberFormat().format(Number(value));

      case 'date':
        return new Date(String(value)).toLocaleDateString();

      case 'boolean':
        return value ? 'Yes' : 'No';

      default:
        return String(value);
    }
  }

  getActionColor(action: DataTableAction<T>): string {
    switch (action.color) {
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-base-content';
    }
  }

  isActionDisabled(action: DataTableAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  isActionVisible(action: DataTableAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  getVisibleActions(row: T): DataTableAction<T>[] {
    return this.actions().filter(action => this.isActionVisible(action, row));
  }

  // Public methods for external control
  refresh(): void {
    this.dataSource.data = this.data();
  }

  clearSelection(): void {
    this.selection.clear();
  }

  selectAll(): void {
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getSelected(): T[] {
    return this.selection.selected;
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
}