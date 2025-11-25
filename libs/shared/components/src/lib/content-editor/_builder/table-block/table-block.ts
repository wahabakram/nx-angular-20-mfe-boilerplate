import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  input, OnInit, signal,
  viewChild
} from '@angular/core';
import {
  CONTENT_BUILDER,
  CONTENT_EDITOR_BLOCK,
  ContentEditorDataBlock,
  ContentEditorTableBlockOptions
} from '../../types';
import { ContentEditorContentEditableDirective } from '../../content-editor-content-editable.directive';
import SelectionArea from '@viselect/vanilla';
import { MatIcon } from '@angular/material/icon';
import { TableColumnsManagerDirective } from '../../table-columns-manager.directive';
import { TableRowsManagerDirective } from '../../table-rows-manager.directive';
import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { ResizableTableDirective } from '../../resizable-table.directive';
import { DraggableTable } from '../../draggable-table/draggable-table';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ContentBuilderStore } from '../../content-builder.store';
import { CursorController } from '../../utils/cursor-controller';
import { ContentBuilder } from '../../content-builder/content-builder';

@Component({
  selector: 'mf-table-block',
  imports: [
    ContentEditorContentEditableDirective,
    MatIcon,
    TableColumnsManagerDirective,
    TableRowsManagerDirective,
    CdkMonitorFocus,
    ResizableTableDirective,
    DraggableTable
  ],
  providers: [
    {
      provide: CONTENT_EDITOR_BLOCK,
      useExisting: TableBlock,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-block.html',
  styleUrl: './table-block.scss',
  host: {
    '[class.is-column-managing]': '_columnManaging()',
    '[class.is-row-managing]': '_rowManaging()',
  }
})
export class TableBlock implements OnInit, AfterViewInit, ContentEditorDataBlock {
  private _contentBuilder = inject<ContentBuilder>(CONTENT_BUILDER);
  private _store = inject(ContentBuilderStore);
  private _cdr = inject(ChangeDetectorRef);
  private _tableRef = viewChild.required<ElementRef>('table');

  id = input.required<string>();
  content = input.required<any[]>();
  options = input.required<ContentEditorTableBlockOptions>();
  index = input.required<number>();

  _content = signal<any[]>([]);
  _columnManaging = signal(false);
  _rowManaging = signal(false);
  _tableManging = signal(false);
  _resizeManging = signal(false);
  readonly initialized = signal(false);

  ngOnInit() {
    this._content.set(this.content());
    this._store.addDataBlock(this);
  }

  ngAfterViewInit() {
    const selection = new SelectionArea({
      selectables: ['.table td'],
      boundaries: ['.table'],
      features: {
        touch: true,
        range: true,
        deselectOnBlur: true,
        singleTap: {
          allow: false,
          intersect: 'native'
        }
      }
    }).on('start', ({ store, event }: any) => {
      if (!event.ctrlKey && !event.metaKey) {
        store.stored.forEach((el: any) => el.classList.remove('selected'));
        selection.clearSelection();
      }
    })
    .on('start', ({ store, event }: any) => {
      if (!event.ctrlKey && !event.metaKey) {
        store.stored.forEach((el: any) => el.classList.remove('selected'));
        selection.clearSelection();
      }
    })
    .on('move', ({ store: { changed: { added, removed } } }) => {
      if (this._tableManging() || this._columnManaging() || this._rowManaging()) {
        return;
      }

      added.forEach(el => el.classList.add('selected'));
      removed.forEach(el => el.classList.remove('selected'));
    });
    this.initialized.set(true);
  }

  focus() {

  }

  onTableFocusChange(type: any) {
    if (type === null) {
      this.clearCellsSelection();
    }
  }

  clearCellsSelection() {
    this._tableRef().nativeElement.querySelectorAll('td')
      .forEach((el: any) => el.classList.remove('selected'))
    ;
    this._contentBuilder.emitContentChangeEvent();
  }

  onColAdded() {
    this._content.update((content: any[]) => {
      content.forEach((row: any) => {
        row.push({
          content: '',
          props: [],
          styles: {},
          options: {
            colspan: 1,
            rowspan: 1
          }
        });
      });
      return content;
    });
    this._cdr.markForCheck();
    this._contentBuilder.emitContentChangeEvent();
  }

  onColDeleted() {
    if (this._content().length > 0 && this._content()[0].length === 1) {
      return;
    }

    let isLastColEmpty = false;

    this._content().forEach((row: any) => {
      if (row[row.length - 1].content) {
        isLastColEmpty = true;
      }
    });

    if (isLastColEmpty) {
      return;
    }

    this._content.update((content: any[]) => {
      content.forEach((row: any) => {
        row.splice(row.length - 1, 1);
      });
      return content;
    });
    this._cdr.markForCheck();
    this._contentBuilder.emitContentChangeEvent();
  }

  onRowAdded() {
    this._content.update((content: any[]) => {
      const row: any[] = [];

      for (let i = 0; i < content[0].length; i++) {
        row.push({
          content: '',
          props: [],
          styles: {},
          options: {
            colspan: 1,
            rowspan: 1
          }
        });
      }

      content.push(row);
      return content;
    });
    this._cdr.markForCheck();
    this._contentBuilder.emitContentChangeEvent();
  }

  onRowDeleted() {
    if (this._content().length === 1) {
      return;
    }

    let isLastRowEmpty = false;

    this._content()[this._content().length - 1].forEach((cell: any) => {
      if (cell.content) {
        isLastRowEmpty = true;
      }
    });

    if (isLastRowEmpty) {
      return;
    }

    this._content.update((content: any[]) => {
      content.splice(content.length - 1, 1);
      return content;
    });
    this._cdr.markForCheck();
    this._contentBuilder.emitContentChangeEvent();
  }

  onColumnManagingStart() {
    this._columnManaging.set(true);
  }

  onColumnManagingEnd() {
    this._columnManaging.set(false);
  }

  onRowManagingStart() {
    this._rowManaging.set(true);
  }

  onRowManagingEnd() {
    this._rowManaging.set(false);
  }

  onColumnWidthChange(event: any) {
    this._content.update((content: any[]) => {
      content.forEach(row => {
        row[event.columnIndex].options['width'] = event.width;
      })
      return content;
    });
    this._contentBuilder.emitContentChangeEvent();
  }

  onColumnMoved(event: any) {
    this._content.update((content: any[]) => {
      content.forEach(row => {
        moveItemInArray(row, event.startElementIndex, event.finalTargetIndex);
      });
      return content;
    });
    this._cdr.markForCheck();
    this._contentBuilder.emitContentChangeEvent();
  }

  onRowMoved(event: any) {
    this._content.update((content: any[]) => {
      moveItemInArray(content, event.startElementIndex, event.finalTargetIndex);
      return content;
    });
    this._cdr.markForCheck();
    this._contentBuilder.emitContentChangeEvent();
  }

  onMoveStart() {
    this._tableManging.set(true);
  }

  onMoveEnd() {
    this._tableManging.set(false);
  }

  onColumnWidthChangeStart() {
    this._tableManging.set(true);
    this._resizeManging.set(true);
  }

  onColumnWidthChangeEnd() {
    this._tableManging.set(false);
    this._resizeManging.set(false);
    this._cdr.markForCheck();
  }

  getData(): any {
    return {
      content: this._content(),
      options: {
        ...this.options(),
      }
    };
  }

  isEmpty(): boolean {
    return false;
  }
}
