import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import { ContentBuilderStore } from '../../content-builder.store';
import {
  CONTENT_BUILDER,
  CONTENT_EDITOR_BLOCK,
  ContentEditorDataBlock,
  ContentEditorItemProperty
} from '../../types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentEditorContentEditableDirective } from '../../content-editor-content-editable.directive';
import { SafeHtmlPipe } from '../../../core/pipes';
import { ContentBuilder } from '../../content-builder/content-builder';

export interface ContentEditorQuoteBlockContent {
  cite: {
    content: string;
    props: ContentEditorItemProperty[];
  };
  caption?: {
    content: string;
    props: ContentEditorItemProperty[];
  }
}

export interface ContentEditorQuoteBlock {
  content: ContentEditorQuoteBlockContent,
  options: any
}

@Component({
  selector: 'mf-quote-block',
  exportAs: 'mfQuoteBlock',
  imports: [
    ContentEditorContentEditableDirective,
    SafeHtmlPipe
  ],
  providers: [
    {
      provide: CONTENT_EDITOR_BLOCK,
      useExisting: QuoteBlock,
      multi: true
    }
  ],
  templateUrl: './quote-block.html',
  styleUrl: './quote-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteBlock implements OnInit, ContentEditorDataBlock {
  private _store = inject(ContentBuilderStore);
  private _contentBuilder = inject<ContentBuilder>(CONTENT_BUILDER);
  private _destroyRef = inject(DestroyRef);

  private _contentRef = viewChild.required<ElementRef<HTMLParagraphElement>>('contentRef');

  id = input.required<string>();
  content = input.required<ContentEditorQuoteBlockContent>();
  options = input.required<any>();
  index = input.required<number>();
  placeholder = input('Enter quote here');
  captionPlaceholder = input('Enter caption here');

  protected _citeContent = signal<string>('');
  protected _citeProps = signal<ContentEditorItemProperty[]>([]);
  protected _captionContent = signal<string>('');
  protected _captionProps = signal<ContentEditorItemProperty[]>([]);
  protected _isEmpty = signal<boolean>(true);
  readonly initialized = signal(false);

  ngOnInit() {
    this._citeContent.set(this.content().cite.content || '');
    this._citeProps.set(this.content().cite.props || []);
    this._captionContent.set(this.content().caption?.content || '');
    this._captionProps.set(this.content().caption?.props || []);
    this._isEmpty.set(this._citeContent().length === 0);
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
    const range = window.document.createRange();
    range.setStart(element, 0);
    range.setEnd(element, 0);
    const selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  getData(): any {
    return {
      content: {
        cite: {
          content: this._citeContent(),
          props: this._citeProps(),
        },
        caption: {
          content: this._captionContent(),
          props: this._captionProps(),
        }
      },
      options: {
        ...this.options(),
      }
    };
  }

  isEmpty(): boolean {
    return this.getData().content.cite.content.trim().length === 0;
  }

  protected onContentChanged(
    contentEditableRef: ContentEditorContentEditableDirective,
    captionEditableRef: ContentEditorContentEditableDirective
  ) {
    if (!this.initialized()) {
      return;
    }

    this._isEmpty.set(contentEditableRef.getContent().length === 0);
    this._contentBuilder.emitContentChangeEvent();
  }

  protected onCitePropsChanged(props: ContentEditorItemProperty[]) {
    this._citeProps.set(props);
    this._contentBuilder.emitContentChangeEvent();
  }

  protected onCaptionPropsChanged(props: ContentEditorItemProperty[]) {
    this._captionProps.set(props);
    this._contentBuilder.emitContentChangeEvent();
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
}
