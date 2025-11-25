import {
  ChangeDetectionStrategy,
  Component, DestroyRef,
  ElementRef, forwardRef,
  inject,
  input,
  OnInit, signal,
  viewChild
} from '@angular/core';
import { ContentEditorContentEditableDirective } from '../../content-editor-content-editable.directive';
import { ContentBuilder } from '../../content-builder/content-builder';
import {
  CONTENT_BUILDER,
  CONTENT_EDITOR_BLOCK,
  ContentEditorDataBlock,
  ContentEditorItemProperty
} from '../../types';
import { ContentBuilderStore } from '../../content-builder.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CursorController } from '../../utils/cursor-controller';

@Component({
  selector: 'mf-paragraph-block',
  imports: [
    ContentEditorContentEditableDirective
  ],
  providers: [
    {
      provide: CONTENT_EDITOR_BLOCK,
      useExisting: forwardRef(() => ParagraphBlock),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './paragraph-block.html',
  styleUrl: './paragraph-block.scss',
  host: {
    'class': 'mf-paragraph-block',
    '[class.is-empty]': '_isEmpty()'
  }
})
export class ParagraphBlock implements OnInit, ContentEditorDataBlock {
  private _store = inject(ContentBuilderStore);
  private _contentBuilder = inject<ContentBuilder>(CONTENT_BUILDER);
  private _destroyRef = inject(DestroyRef);

  private _contentRef = viewChild.required<ElementRef<HTMLParagraphElement>>('contentRef');

  id = input.required<string>();
  content = input.required<string>();
  options = input.required<any>();
  props = input<ContentEditorItemProperty[]>([]);
  index = input.required<number>();
  placeholder = input('Enter text here');

  protected _content = signal<string>('');
  protected _props = signal<ContentEditorItemProperty[]>([]);
  protected _isEmpty = signal<boolean>(true);
  readonly initialized = signal(false);

  ngOnInit() {
    this._content.set(this.content());
    this._props.set(this.props());
    this._isEmpty.set(this.content().length === 0);
    this._contentBuilder
      .focusChanged
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        if (this._store.focusedBlockId() === this.id()) {
          this.focus();
        }
      });
    this._store.addDataBlock(this);
  }

  focus() {
    const element = this._contentRef().nativeElement;
    const cursorController = new CursorController(element);
    cursorController.setToEnd();
  }

  getData(): any {
    return {
      content: this._content(),
      props: this._props(),
      options: {
        ...this.options(),
      }
    };
  }

  isEmpty(): boolean {
    return this.getData().content.trim().length === 0;
  }

  protected onContentChanged(content: string) {
    if (!this.initialized()) {
      return;
    }

    this._content.set(content);
    this._isEmpty.set(content.length === 0);
  }

  protected onPropsChanged(props: ContentEditorItemProperty[]) {
    this._contentBuilder.setBlockProps(this.id(), props);
  }

  protected onPressedEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._contentBuilder.insertEmptyBlock(this.index());
  }

  protected onContentEditableInitialized() {
    if (this._store.focusedBlockId() === this.id()) {
      this.focus();
    }

    this.initialized.set(true);
  }

  protected _onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this._content()) {
      this._contentBuilder.deleteBlock(this.id());
    }
  }
}
