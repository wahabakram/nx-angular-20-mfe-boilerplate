import {
  Component,
  ElementRef,
  TemplateRef,
  contentChild,
  effect,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { trigger, transition, query, stagger, style, animate } from '@angular/animations';

@Component({
  selector: 'mf-notes',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Notes<T extends { id: any }> {
  items = input.required<T[]>();
  minColumnWidth = input<number>(250);
  gap = input<number>(16);
  itemsChange = output<T[]>();

  containerRef = viewChild.required<ElementRef<HTMLElement>>('container');
  itemTemplate = contentChild.required<TemplateRef<any>>(TemplateRef);

  private itemWrappers = viewChildren<ElementRef>('itemWrapper');

  private columnCount = signal(1);
  columns = signal<T[][]>([]);

  private lastEmittedItems: T[] | undefined;

  private itemHeights = new Map<T['id'], number>();
  private columnHeights: number[] = [];

  constructor() {
    effect(() => {
      this.itemWrappers().forEach(wrapperRef => {
        const element = wrapperRef.nativeElement as HTMLElement;
        const id = element.dataset['itemId'];
        if (id) {
          this.itemHeights.set(id, element.offsetHeight);
        }
      });
    });

    effect(() => {
      const newItems = this.items();

      if (newItems === this.lastEmittedItems) {
        return;
      }

      this.rebuildAllColumns(newItems);
    });

    effect((onCleanup) => {
      const container = this.containerRef()?.nativeElement;
      if (!container) return;
      const observer = new ResizeObserver(() => {
        const newCount = this.calculateColumnCount();
        if (newCount !== this.columnCount()) {
          this.columnCount.set(newCount);
          this.rebuildAllColumns(this.items());
        }
      });
      observer.observe(container);
      onCleanup(() => observer.disconnect());
    });
  }

  // private removeItemsFromColumns(itemsToRemove: T[], columns: T[][]): void {
  //   const idsToRemove = new Set(itemsToRemove.map(item => item.id));
  //   for (let i = 0; i < columns.length; i++) {
  //     columns[i] = columns[i].filter(item => !idsToRemove.has(item.id));
  //   }
  // }
  //
  // private addItemsToColumns(itemsToAdd: T[], columns: T[][]): void {
  //   this.recalculateAllColumnHeights(columns);
  //
  //   for (const item of itemsToAdd) {
  //     const shortestColumnIndex = this.getShortestColumnIndex();
  //     if (columns[shortestColumnIndex]) {
  //       columns[shortestColumnIndex].push(item);
  //       const estimatedHeight = this.itemHeights.get(item.id) ?? 200;
  //       this.columnHeights[shortestColumnIndex] += estimatedHeight + this.gap();
  //     }
  //   }
  // }

  private rebuildAllColumns(items: T[]): void {
    const count = this.columnCount();
    const newColumns: T[][] = Array.from({ length: count }, () => []);
    this.columnHeights = Array(count).fill(0);

    for (const item of items) {
      const shortestColumnIndex = this.getShortestColumnIndex();
      newColumns[shortestColumnIndex].push(item);
      const itemHeight = this.itemHeights.get(item.id) ?? 200;
      this.columnHeights[shortestColumnIndex] += itemHeight + this.gap();
    }

    this.columns.set(newColumns);
  }

  // onDrop(event: CdkDragDrop<T[]>) {
  //   const columns = this.columns();
  //
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  //
  //   this.columns.set([...columns]);
  //   const newFlatArray = this.flattenColumns(columns);
  //   this.lastEmittedItems = newFlatArray;
  //   this.itemsChange.emit(newFlatArray);
  // }

  // private recalculateAllColumnHeights(columns: T[][]): void {
  //   this.columnHeights = columns.map(column =>
  //     column.reduce((totalHeight, item) => {
  //       const itemHeight = this.itemHeights.get(item.id) ?? 200;
  //       return totalHeight + itemHeight + this.gap();
  //     }, 0)
  //   );
  // }

  private calculateColumnCount(): number {
    const container = this.containerRef()?.nativeElement;
    if (!container) return 1;
    return Math.max(1, Math.floor((container.offsetWidth + this.gap()) / (this.minColumnWidth() + this.gap())));
  }

  private getShortestColumnIndex(): number {
    if (this.columnHeights.length === 0) {
      if (this.columnCount() > 0) {
        this.columnHeights = Array(this.columnCount()).fill(0);
      } else {
        return 0;
      }
    }
    return this.columnHeights.indexOf(Math.min(...this.columnHeights));
  }

  private flattenColumns(columns: T[][]): T[] {
    const newItems: T[] = [];
    const longestColumnLength = Math.max(...columns.map(col => col.length));
    for (let i = 0; i < longestColumnLength; i++) {
      for (const column of columns) {
        if (column[i]) {
          newItems.push(column[i]);
        }
      }
    }
    return newItems;
  }
}
