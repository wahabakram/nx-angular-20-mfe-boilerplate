import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal
} from '@angular/core';
import { ContentBuilderStore } from '../../content-builder.store';
import {
  CONTENT_BUILDER, CONTENT_EDITOR_BLOCK,
  ContentEditorDataBlock,
  ContentEditorItemProperty,
  ContentEditorListItem,
  ContentEditorListOptions
} from '../../types';
import { ContentEditorContentEditableDirective } from '../../content-editor-content-editable.directive';
import { NgTemplateOutlet } from '@angular/common';
import { ContentObserverDirective } from '../../content-observer.directive';
import { CursorController } from '../../utils/cursor-controller';
import { ContentBuilder } from '../../content-builder/content-builder';

@Component({
  selector: 'mf-list-block',
  exportAs: 'mfListBlock',
  imports: [
    ContentEditorContentEditableDirective,
    NgTemplateOutlet,
    ContentObserverDirective
  ],
  templateUrl: './list-block.html',
  styleUrl: './list-block.scss',
  providers: [
    {
      provide: CONTENT_EDITOR_BLOCK,
      useExisting: ListBlock,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.list-bullet]': "_listStyle() === 'bullet'",
    '[class.list-ordered]': "_listStyle() === 'ordered'",
  }
})
export class ListBlock implements OnInit, ContentEditorDataBlock, AfterViewInit {
  private _elementRef = inject(ElementRef);
  private _store = inject(ContentBuilderStore);
  private _contentBuilder = inject<ContentBuilder>(CONTENT_BUILDER);
  private _destroyRef = inject(DestroyRef);

  id = input.required<string>();
  content = input.required<ContentEditorListItem[]>();
  options = input.required<ContentEditorListOptions>();
  index = input.required<number>();

  protected _placeholder = signal<string>('List item');
  protected _content = signal<ContentEditorListItem[]>([
    {
      content: '',
      props: [],
      children: []
    }
  ]);
  protected _listStyle = signal('');
  readonly initialized = signal(false);

  ngOnInit() {
    this._listStyle.set(this.options().listStyle);

    if (this.content().length !== 0) {
      this._content.set(this.content());
    }

    this._store.addDataBlock(this);
  }

  ngAfterViewInit() {
    this.initialized.set(true);
  }

  focus() {
  }

  protected onContentChanged(content: string, list: ContentEditorListItem[], index: number) {
    if (!list[index]) {
      return;
    }

    list[index].content = content;
  }

  protected onPressedEnter(
    event: KeyboardEvent,
    contentEditable: ContentEditorContentEditableDirective,
    list: ContentEditorListItem[],
    index: number,
    level: number,
    parentItem: ContentEditorListItem | null,
    parentList: ContentEditorListItem[]
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (level === 0) {
      const content = contentEditable.getContent();

      if (content) {
        list.splice(index + 1, 0, {
          content: '',
          props: [],
          styles: {},
          children: []
        });
      } else {
        list.splice(index, 1);

        if (list.length === 0) {
          this._contentBuilder.deleteBlock(this.id());
        }

        this._contentBuilder.insertEmptyBlock(this.index());
      }
    } else {
      if (list[index] && !list[index].content) {
        list.splice(index, 1);
        const parentIndex = parentList.findIndex(item => item === parentItem);
        parentList.splice(parentIndex + 1, 0, {
          content: '',
          props: [],
          children: []
        });
      } else {
        list.splice(index + 1, 0, {
          content: '',
          props: [],
          styles: {},
          children: []
        });
      }
    }

    this._contentBuilder.emitContentChangeEvent();
  }

  getId(level: number, index: number): string {
    return 'item-level-' + (level + index + 2).toString();
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
    return this.getData().content.find((item: any) => item.content.trim().length > 0);
  }

  protected _onNodeAdded(node: HTMLElement) {
    this._focusItem(node.querySelector('.list-item-content') as HTMLElement);
  }

  protected _focusItem(element: HTMLElement) {
    const cursorController = new CursorController(element);
    cursorController.setToEnd();
  }

  protected _onKeyDown(
    event: KeyboardEvent,
    contentEditable: ContentEditorContentEditableDirective,
    list: ContentEditorListItem[],
    index: number,
    level: number,
    parentItem: ContentEditorListItem | null,
    parentList: ContentEditorListItem[],
    listItem: HTMLElement
  ) {
    if (event.key === 'Backspace' && !contentEditable.getContent()) {
      const latestElementInParentList = (listItem.closest('.list') as HTMLElement)?.parentNode;
      list.splice(index, 1);
      const prevElement = listItem.previousSibling as HTMLElement;

      if (prevElement) {
        this._focusItem(prevElement.querySelector('.list-item-content') as HTMLElement);
      } else {
        if (latestElementInParentList) {
          this._focusItem(latestElementInParentList.querySelector('.list-item-content') as HTMLElement);
        }
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();

      if (event.shiftKey && parentItem) {
        const cached = JSON.parse(JSON.stringify(list[index]));
        list.splice(index, 1);
        const parentIndex = parentList.findIndex(item => item === parentItem);
        parentList.splice(parentIndex + 1, 0, cached);
      } else {
        if (list[index - 1]) {
          const cached = JSON.parse(JSON.stringify(list[index]));
          list.splice(index, 1);
          list[index - 1].children.push(cached);
        }
      }
    }

    if (level === 0 && list.length === 0) {
      this._contentBuilder.deleteBlock(this.id());
    }

    this._contentBuilder.emitContentChangeEvent();
  }

  onPropsChanged(props: ContentEditorItemProperty[], item: any) {
    item.props = props;
    this._contentBuilder.emitContentChangeEvent();
  }
}
