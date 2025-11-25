import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  input, numberAttribute,
  OnInit, output, PLATFORM_ID,
  signal
} from '@angular/core';
import {
  CONTENT_BUILDER,
  ContentEditorBlock,
  ContentEditorBlockDef,
  ContentEditorDataBlock,
  ContentEditorItemProperty,
  ContentEditorOptions,
} from '../types';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, isPlatformServer, NgComponentOutlet } from '@angular/common';
import { v7 as uuid } from 'uuid';
import { ContentBuilderStore } from '../content-builder.store';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder, CdkDragStart,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { MatMenu, MatMenuItem, MatMenuTrigger, MenuCloseReason } from '@angular/material/menu';
import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { ContentEditorQuoteBlock } from '../_builder/quote-block/quote-block';
import { TextSelectionPopupDirective } from '../text-selection-popup.directive';
import { TextSelectionCommandBar } from '../command-bar/command-bar';
// import { compare } from '../utils/changeset';

@Component({
  selector: 'mf-content-builder',
  exportAs: 'mfContentBuilder',
  imports: [
    MatIcon,
    NgComponentOutlet,
    AsyncPipe,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    CdkDragPlaceholder,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    CdkMonitorFocus,
    TextSelectionPopupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContentBuilderStore,
    {
      provide: CONTENT_BUILDER,
      useExisting: forwardRef(() => ContentBuilder)
    }
  ],
  templateUrl: './content-builder.html',
  styleUrl: './content-builder.scss',
  host: {
    'class': 'mf-content-builder',
    '[class.is-block-dragging]': '_blockDragging()'
  }
})
export class ContentBuilder implements OnInit {
  private _platformId = inject(PLATFORM_ID);
  private _store = inject(ContentBuilderStore);

  private _blockDefs = signal<ContentEditorBlockDef[]>([
    {
      component: () => import('../_builder/divider-block/divider-block').then(c => c.DividerBlock),
      type: 'divider',
      options: {
      },
      empty: () => {
        return {
          content: null,
          options: {
          }
        };
      }
    },
    {
      component: () => import('../_builder/paragraph-block/paragraph-block').then(c => c.ParagraphBlock),
      type: 'paragraph',
      options: {
      },
      empty: () => {
        return {
          content: '',
          props: [],
          options: {
          }
        };
      }
    },
    {
      component: () => import('../_builder/code-block/code-block').then(c => c.CodeBlock),
      type: 'code',
      options: {
      },
      empty: () => {
        return {
          content: '',
          options: {
            language: 'none',
          }
        };
      }
    },
    {
      component: () => import('../_builder/heading-block/heading-block').then(c => c.HeadingBlock),
      type: 'heading',
      options: {
      },
      empty: () => {
        return {
          content: '',
          props: [],
          options: {
            level: 2
          }
        };
      }
    },
    {
      component: () => import('../_builder/image-block/image-block').then(c => c.ImageBlock),
      type: 'image',
      options: {
      },
      empty: () => {
        return {
          content: {
            src: '',
            alt: ''
          },
          options: {
            alignment: 'center',
            width: 'auto',
            height: 'auto',
            align: 'center',
            natualWidth: 'auto',
            naturalHeight: 'auto'
          }
        };
      }
    },
    {
      component: () => import('../_builder/list-block/list-block').then(c => c.ListBlock),
      type: 'bulletList',
      options: {
      },
      empty: () => {
        return {
          content: [],
          options: {
            listStyle: 'bullet'
          }
        };
      }
    },
    {
      component: () => import('../_builder/list-block/list-block').then(c => c.ListBlock),
      type: 'orderedList',
      options: {
      },
      empty: () => {
        return {
          content: [],
          options: {
            listStyle: 'ordered'
          }
        };
      }
    },
    {
      component: () => import('../_builder/table-block/table-block').then(c => c.TableBlock),
      type: 'table',
      options: {
      },
      empty: () => {
        return {
          content: [
            [
              {
                content: '',
                props: [],
                styles: {},
                options: {
                  colspan: 1,
                  rowspan: 1
                },
              },
              {
                content: '',
                props: [],
                styles: {},
                options: {
                  colspan: 1,
                  rowspan: 1
                }
              },
              {
                content: '',
                props: [],
                styles: {},
                options: {
                  colspan: 1,
                  rowspan: 1
                }
              }
            ],
            [
              {
                content: '',
                props: [],
                styles: {},
                options: {
                  colspan: 1,
                  rowspan: 1
                }
              },
              {
                content: '',
                props: [],
                options: {
                  colspan: 1,
                  rowspan: 1
                }
              },
              {
                content: '',
                props: [],
                styles: {},
                options: {
                  colspan: 1,
                  rowspan: 1
                }
              }
            ],
          ],
          options: {
          }
        };
      }
    },
    {
      component: () => import('../_builder/quote-block/quote-block').then(c => c.QuoteBlock),
      type: 'quote',
      options: {
      },
      empty: (): ContentEditorQuoteBlock => {
        return {
          content: {
            cite: {
              content: '',
              props: []
            },
            caption: {
              content: '',
              props: []
            }
          },
          options: {
          }
        };
      }
    }
  ]);

  content = input<ContentEditorBlock[]>([]);
  contentChangedDelay = input(500, {
    transform: numberAttribute
  });
  suggestions = input<any>([
    {
      type: 'heading',
      title: 'Headings',
    },
    {
      type: 'item',
      title: 'Heading 1',
      description: 'Top-level heading',
      iconName: 'format_h1',
      hotKeys: 'ALT + 1',
      blockType: 'heading',
      blockOptions: {
        level: 1
      }
    },
    {
      type: 'item',
      title: 'Heading 2',
      description: 'Key section heading',
      iconName: 'format_h2',
      hotKeys: 'ALT + 2',
      blockType: 'heading',
      blockOptions: {
        level: 2
      }
    },
    {
      type: 'item',
      title: 'Heading 3',
      description: 'Subsection and group heading',
      iconName: 'format_h3',
      hotKeys: 'ALT + 3',
      blockType: 'heading',
      blockOptions: {
        level: 3
      }
    },
    {
      type: 'heading',
      title: 'Basic blocks',
    },
    {
      type: 'item',
      title: 'Paragraph',
      description: 'The body of your document',
      iconName: 'format_paragraph',
      hotKeys: 'ALT + 0',
      blockType: 'paragraph',
      blockOptions: {
      }
    },
    {
      type: 'item',
      title: 'Numbered List',
      description: 'List with ordered items',
      iconName: 'format_list_numbered',
      hotKeys: 'ALT + 0',
      blockType: 'orderedList',
      blockOptions: {
      }
    },
    {
      type: 'item',
      title: 'Bullet List',
      description: 'List with unordered items',
      iconName: 'list',
      hotKeys: 'ALT + 0',
      blockType: 'bulletList',
      blockOptions: {
      }
    },
    {
      type: 'item',
      title: 'Quote',
      description: 'Quote or excerpt',
      iconName: 'format_quote',
      hotKeys: 'ALT + 0',
      blockType: 'quote',
      blockOptions: {
      }
    },
    {
      type: 'item',
      title: 'Code',
      description: 'The code block with syntax highlighting',
      iconName: 'code',
      hotKeys: 'ALT + 0',
      blockType: 'code',
      blockOptions: {
      }
    },
    {
      type: 'item',
      title: 'Divider',
      description: 'Visually divide blocks',
      iconName: 'horizontal_rule',
      hotKeys: 'ALT + 0',
      blockType: 'divider',
      blockOptions: {
      }
    },
    {
      type: 'item',
      title: 'Table',
      description: 'Table with editable cells',
      iconName: 'table_rows',
      hotKeys: 'ALT + 0',
      blockType: 'table',
      blockOptions: {
      }
    },
    {
      type: 'heading',
      title: 'Media',
    },
    {
      type: 'item',
      title: 'Image',
      description: 'Resizable image with caption',
      iconName: 'image',
      hotKeys: 'ALT + 0',
      blockType: 'image',
      blockOptions: {
        uploadFn: (file: File, base64: string) => {
          return new Promise((resolve, reject) => {
            resolve({
              src: base64
            });
          });
        }
      }
    },
  ]);
  options = input<ContentEditorOptions>({});

  readonly contentChanged = output<ContentEditorBlock[]>();

  readonly focusChanged = new EventEmitter<void>();
  protected _content = signal<ContentEditorBlock[]>([]);
  protected _blockDefsMap = new Map<string, any>();
  protected _blockDragging = signal(false);

  _oldContent = signal({});

  private _contentChangedTimeout: any = null;

  commandBar = TextSelectionCommandBar;

  get api() {
    return {
      focusChanged: new EventEmitter<void>(),
    }
  }

  ngOnInit() {
    const content = this.content();

    if (content.length > 0) {
      const lastItem = content[content.length - 1];

      if (lastItem.type !== 'paragraph' || (lastItem.type === 'paragraph' && lastItem.content !== '')) {
        content.push(this._createBlock('paragraph'));
      }
    } else {
      content.push(this._createBlock('paragraph'));
    }

    this._content.set(content);
    this._oldContent.set(this._content());
    this._blockDefs().forEach((dataBlock) => {
      if (!this._blockDefsMap.has(dataBlock.type)) {
        this._blockDefsMap.set(dataBlock.type, dataBlock.component());
      }
    });

    if (isPlatformServer(this._platformId)) {
      return;
    }

    if (content.length === 1) {
      this.focusBlock(content[0].id);
    }
  }

  appendBlock(type: string, focus: boolean = true) {
    this.insertBlock(type, this._content().length, {}, focus);
  }

  insertBlock(type: string, index: number, options?: object, focus: boolean = true): any {
    const isLastIndex = index === this._content().length;
    const newBlock = this._createBlock(type, options);

    if (focus) {
      this.focusBlock(newBlock.id);
    }

    this._content.update(data => {
      data.splice(index, 0, newBlock);
      return data;
    });

    if (isLastIndex && this._content()[index].type !== 'paragraph') {
      this.appendBlock('paragraph', false);
    }

    return newBlock;
  }

  private _createBlock(type: string, options = {}) {
    const blockDef = this._blockDefs().find(blockDefItem => blockDefItem.type === type) as ContentEditorBlockDef;
    const empty = blockDef.empty();

    if (options) {
      empty.options = {
        ...empty.options,
        ...options
      };
    }

    if (this.options()) {
      if (type in this.options()) {
        empty.options = {
          ...empty.options,
          ...this.options()[type]
        };
      }
    }

    return {
      id: uuid(),
      type: blockDef.type,
      ...empty
    };
  }

  addBlock(type: string, options: object, index: number = -1) {
    if (index === -1) {
      if (this._store.activeBlockId()) {
        index = this._content().findIndex(dataBlock => dataBlock.id === this._store.activeBlockId()) + 1;
      } else {
        index = this._content().length;
      }
    }

    this.insertBlock(type, index, options);
  }

  deleteBlock(blockId: string) {
    const index = this._content().findIndex(dataBlock => dataBlock.id === blockId);

    if (index !== -1) {
      this._content.update(data => {
        data.splice(index, 1);
        return data;
      });
    }
  }

  setBlockContent(id: string, content: any) {
    const data: ContentEditorBlock[] = this._content();
    const index = data.findIndex((dataBlock) => dataBlock.id === id);
    data[index].content = content;
    this.contentChanged.emit(data);
  }

  setBlockProps(id: string, props: ContentEditorItemProperty[]) {
    const data: ContentEditorBlock[] = this._content();
    const index = data.findIndex((dataBlock) => dataBlock.id === id);
    data[index].props = props;
    this.emitContentChangeEvent();
  }

  insertEmptyBlock(index: number) {
    if (this._content()[index].type === 'paragraph') {
      const dataBlock = this.getDataBlock(this._content()[index].id);

      if (!dataBlock.isEmpty()) {
        this.insertBlock('paragraph', index + 1);
      } else {
        this.focusBlock(this._content()[index].id);
      }
    } else {
      const dataBlock = this.getDataBlock(this._content()[index + 1].id);
      this.focusBlock(this._content()[index + 1].id);
      dataBlock.focus();
    }
  }

  focusBlock(id: string | null) {
    this._store.setFocusedBlockId(id);
  }

  isBlockFocused(id: string) {
    return this._store.focusedBlockId() === id;
  }

  isActiveBlock(id: string) {
    return this._store.activeBlockId() === id;
  }

  drop(event: CdkDragDrop<ContentEditorBlock[]>) {
    moveItemInArray(this._content(), event.previousIndex, event.currentIndex);
  }

  onTagSelected(tagName: string | null): void {
    // console.log('Tag selected event received:', tagName);
  }

  getDataBlock(blockId: string): ContentEditorDataBlock {
    return this._store.dataBlocks().find(
      dataBlock => dataBlock.id() === blockId
    ) as ContentEditorDataBlock;
  }

  getData() {
    const dataBlocksMap = new Map<string, ContentEditorDataBlock>();
    this._store.dataBlocks().forEach((dataBlock: ContentEditorDataBlock) => {
      dataBlocksMap.set(dataBlock.id(), {
        id: dataBlock.id(),
        ...dataBlock.getData()
      });
    });
    const data: any[] = [];
    this._content().map((blockDef: ContentEditorBlock) => {
      data.push({
        ...dataBlocksMap.get(blockDef.id),
        type: blockDef.type,
      });
    });
    return JSON.parse(JSON.stringify(data));
  }

  emitContentChangeEvent() {
    if (!this._isAllBlockInitialized()) {
      return;
    }

    // this.contentChanged.emit(this.getData());
  }

  private _isAllBlockInitialized() {
    return false;
  }

  protected onDragStarted(event: CdkDragStart, block: ContentEditorBlock) {
    this._blockDragging.set(true);
  }

  protected onDragEnded(event: CdkDragStart, block: ContentEditorBlock) {
    this._blockDragging.set(false);
  }

  protected addBlockFromSuggestionMenu(suggestionsMenu: MatMenu, type: string, options: object) {
    suggestionsMenu.closed.emit('click');
    this.addBlock(type, options);
  }

  protected preventMenuClose(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  protected setActiveBlockId(event: Event, id: string | null) {
    event.stopPropagation();
    event.preventDefault();
    this._store.setActiveBlockId(id);
    this._store.setFocusedBlockId(id);
    this.focusChanged.emit();
  }

  protected onFocusChange(origin: string | null, dataBlock: ContentEditorBlock) {
  }

  protected onSuggestionsMenuOpen() {
  }

  protected onSuggestionsMenuClose(reason: MenuCloseReason) {
    if (!reason) {
      this._store.setFocusedBlockId(this._store.activeBlockId());
      this.focusChanged.emit();
    }

    // need some delay to prevent the flickering
    setTimeout(() => this._store.setActiveBlockId(null), 250);
  }
}
