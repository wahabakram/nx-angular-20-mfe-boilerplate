import {
  booleanAttribute,
  // ChangeDetectionStrategy,
  Component,
  computed,
  input, numberAttribute,
  OnInit,
  output,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  NgZone,
  viewChild,
  Renderer2,
} from '@angular/core';
import {
  ColumnDef,
  createAngularTable,
  flexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table
} from '@tanstack/angular-table';
import { HeadSelectionCell } from '../cells/head-selection-cell/head-selection-cell';
import { RowSelectionCell } from '../cells/row-selection-cell/row-selection-cell';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { OverlayScrollbar } from '../../overlay-scrollbar';

@Component({
  selector: 'mf-datatable',
  exportAs: 'mfDatatable',
  imports: [
    FlexRenderDirective,
    MatIcon,
    MatIconButton,
    OverlayScrollbar,
  ],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mf-datatable',
    '[class.is-compact]': 'compact()',
    '[class.table-fixed]': 'tableFixed()',
  }
})
export class Datatable<T> implements OnInit, AfterViewInit, OnDestroy {
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  private readonly rowSelection = signal<RowSelectionState>({});
  sorting = signal<SortingState>([]);
  globalFilter = signal<string>('');

  showHeader = input(true, {
    transform: booleanAttribute
  });
  data = input.required<any[]>();
  compact = input(false, {
    transform: booleanAttribute
  });
  columns = input.required<ColumnDef<T>[]>();
  enableRowSelection = input(false, {
    transform: booleanAttribute
  });
  showPagination = input(false, {
    transform: booleanAttribute
  });
  pageSize = input(50, {
    transform: numberAttribute
  });
  tableFixed = input(false, {
    transform: booleanAttribute
  });

  showingFrom = computed(() => {
    const { pageIndex, pageSize } = this.table.getState().pagination;
    return pageIndex * pageSize + 1;
  });
  showingTo = computed(() => {
    const { pageIndex, pageSize } = this.table.getState().pagination;
    return Math.min(this.table.getFilteredRowModel().rows.length, pageIndex * pageSize + pageSize);
  });
  dataLength = computed(() => this.table.getFilteredRowModel().rows.length);

  #table!: Table<any>;

  constructor() {}

  readonly theadRef = viewChild<ElementRef<HTMLElement>>('theadEl');
  readonly tbodyRef = viewChild<ElementRef<HTMLElement>>('tbodyEl');
  readonly paginationRef = viewChild<ElementRef<HTMLElement>>('paginationEl');

  private readonly zone = inject(NgZone);
  private resizeObs?: ResizeObserver;
  private mutationObs?: MutationObserver;

  readonly rowSelectionChanged = output<any>();

  readonly rowSelectionLength = computed(
    () => Object.keys(this.rowSelection()).length
  );
  protected readonly selectedRowsIdsCache = signal<string[]>([]);

  ngOnInit() {
    const columns = this.columns();

    if (this.enableRowSelection()) {
      columns.unshift({
        id: 'select',
        size: 60,
        minSize: 60,
        header: () => {
          return flexRenderComponent(HeadSelectionCell, {
            inputs: {}
          })
        },
        cell: () => {
          return flexRenderComponent(RowSelectionCell, {
            inputs: {}
          })
        },
      });
    }

    this.#table = createAngularTable(() => ({
      data: this.data(),
      columns: this.columns(),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      enableColumnResizing: false,
      debugTable: false,
      state: {
        sorting: this.sorting(),
        globalFilter: this.globalFilter(),
        rowSelection: this.rowSelection(),
      },
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: this.pageSize(),
        }
      },
      enableRowSelection: this.enableRowSelection(),
      onRowSelectionChange: updaterOrValue => {
        this.rowSelection.set(
          typeof updaterOrValue === 'function'
            ? updaterOrValue(this.rowSelection())
            : updaterOrValue
        );
        this.selectedRowsIdsCache.set(this.table.getSelectedRowModel().rows.map(row => row.id));
        this.rowSelectionChanged.emit({
          selectedRowModel: this.table.getSelectedRowModel(),
          rowSelectionLength: this.rowSelectionLength(),
        });
      },
      onSortingChange: (updater: any) => this.sorting.set(updater(this.sorting())),
    }));
  }

  get table(): Table<any> {
    return this.#table;
  }

  checkAll() {
    this.table.toggleAllRowsSelected();
  }

  uncheckAll() {
    this.table.toggleAllRowsSelected(false);
  }

  protected isRowSelected(row: any) {
    return this.selectedRowsIdsCache().includes(row.id);
  }

  // Allows parent components to control global filtering in a reactive way
  setGlobalFilter(value: string) {
    this.globalFilter.set(value ?? '');
  }

  ngAfterViewInit(): void {
    // Defer initial calculation to ensure view is laid out
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.recalcTbodyMaxHeight());
    });

    // Observe host size changes
    const hostEl = this.hostRef.nativeElement;
    this.resizeObs = new ResizeObserver(() => this.recalcTbodyMaxHeight());
    this.resizeObs.observe(hostEl);

    // Observe mutations affecting header/body/footer sizes
    this.mutationObs = new MutationObserver(() => this.recalcTbodyMaxHeight());
    this.mutationObs.observe(hostEl, { childList: true, subtree: true, attributes: true, characterData: false });
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    this.mutationObs?.disconnect();
  }

  private recalcTbodyMaxHeight() {
    if (!this.tableFixed()) {
      return;
    }

    const host = this.hostRef.nativeElement;
    const thead = this.theadRef() as ElementRef<HTMLElement> | undefined;
    const pagination = this.paginationRef() as ElementRef<HTMLElement> | undefined;

    const hostHeight = host.getBoundingClientRect().height;
    const headerHeight = thead ? thead.nativeElement.getBoundingClientRect().height : 0;
    const footerHeight = pagination ? pagination.nativeElement.getBoundingClientRect().height : 0;

    // Guard: if pagination not shown (ngIf), paginationRef may be undefined
    const available = Math.max(0, Math.floor(hostHeight - headerHeight - footerHeight));

    host.style.setProperty('--mf-datatable-tbody-max-height', available + 'px');
  }
}
