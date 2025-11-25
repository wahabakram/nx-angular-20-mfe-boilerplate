import { Component, effect, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'mf-masonry',
  imports: [],
  templateUrl: './masonry.html',
  styleUrl: './masonry.scss',
  host: {
    '(window:resize)': 'layout()',
  },
})
export class Masonry {
  public items = input.required<unknown[]>();
  public columnWidth = input<number>(250);
  public gutter = input<number>(15);

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('masonryContainer');

  constructor() {
    effect(() => {
      this.items();
      this.columnWidth();
      this.gutter();
      this.container();

      Promise.resolve().then(() => this.layout());
    });
  }

  public layout(): void {
    const containerEl = this.container()?.nativeElement;
    if (!containerEl) {
      return;
    }

    const colWidth = this.columnWidth();
    const gutter = this.gutter();
    const containerWidth = containerEl.offsetWidth;
    const numColumns = Math.max(1, Math.floor((containerWidth + gutter) / (colWidth + gutter)));
    const columnHeights = Array(numColumns).fill(0);
    const masonryItems = Array.from(containerEl.children) as HTMLElement[];

    if (masonryItems.length === 0) {
      containerEl.style.height = '0px';
      return;
    }

    for (const item of masonryItems) {
      const minHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minHeight);

      item.style.position = 'absolute';
      item.style.width = `${colWidth}px`;
      item.style.left = `${columnIndex * (colWidth + gutter)}px`;
      item.style.top = `${minHeight}px`;

      columnHeights[columnIndex] += item.offsetHeight + gutter;
    }

    const containerHeight = Math.max(...columnHeights);
    containerEl.style.height = `${containerHeight - gutter}px`;
  }
}
