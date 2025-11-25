import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  output,
  signal,
  Type, viewChild,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragMove,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ImageBlock } from '../blocks/image-block/image-block';
import { TextBlock } from '../blocks/text-block/text-block';
import { HeadingBlock } from '../blocks/heading-block/heading-block';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';
import {
  PanelAside,
  PanelBody,
  Panel, PanelHeader,
} from '../../../layout/panel';
import { OverlayScrollbar } from '../../../overlay-scrollbar';

import { MatIconButton } from '@angular/material/button';
import { NgComponentOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LessonBlockHostDirective } from '../lesson-block-host.directive';
import {
  LessonBuilderCommunicatorService
} from '../lesson-builder-communicator.service';
import { BlockData, LessonBlock, PaletteBlock } from '../../models/lesson-block.model';
import {
  ImageBlockSettings
} from '../blocks/image-block-settings/image-block-settings';
import {
  CodeBlock
} from '../blocks/code-block/code-block';
import {
  CodeBlockSettings
} from '../blocks/code-block-settings/code-block-settings';
import {
  YoutubeBlock
} from '../blocks/youtube-block/youtube-block';
import {
  TextBlockSettings
} from '../blocks/text-block-settings/text-block-settings';
import {
  YoutubeBlockSettings
} from '../blocks/youtube-block-settings/youtube-block-settings';
import {
  HeadingBlockSettings
} from '../blocks/heading-block-settings/heading-block-settings';
import { FocusWithinDirective } from '../focus-within.directive';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'mf-lesson-builder',
  imports: [
    CdkDropList,
    CdkDrag,
    MatToolbarModule,
    MatIconModule,
    DndModule,
    CdkDragHandle,
    Panel,
    PanelBody,
    PanelAside,
    OverlayScrollbar,
    LessonBlockHostDirective,
    PanelHeader,
    MatIconButton,
    NgComponentOutlet,
    FocusWithinDirective,
    MatRipple,
  ],
  providers: [
    LessonBuilderCommunicatorService
  ],
  templateUrl: './lesson-builder.html',
  styleUrl: './lesson-builder.scss',
  host: {
    'class': 'mf-lesson-builder',
    '[class.is-dragging]': 'isDragging()'
  }
})
export class LessonBuilder implements OnInit {
  private destroyRef = inject(DestroyRef);
  readonly content = input.required<LessonBlock[]>();

  private lessonAreaContainer = viewChild.required<ElementRef<HTMLDivElement>>('lessonAreaContainer');
  private blocks = signal<any[]>([]);

  isDragging = signal(false);
  dndPlaceholder = signal({ index: -1 });
  lessonBlocks = signal<LessonBlock[]>([]);
  activeBlock = signal<LessonBlock | null>(null);

  readonly changed = output<LessonBlock[]>();

  readonly availableBlocks: readonly PaletteBlock<any>[] = [
    {
      type: 'heading',
      name: 'Heading',
      component: HeadingBlock,
      settings: HeadingBlockSettings,
      defaultData: {
        content: '',
        level: 2
      },
      icon: 'title'
    },
    {
      type: 'text',
      name: 'Text',
      component: TextBlock,
      settings: TextBlockSettings,
      defaultData: {
        content: ''
      },
      icon: 'text_fields'
    },
    {
      type: 'image',
      name: 'Image',
      component: ImageBlock,
      settings: ImageBlockSettings,
      defaultData: {
        src: '',
        align: 'center',
        alt: ''
      },
      icon: 'image'
    },
    {
      type: 'code',
      name: 'Code',
      component: CodeBlock,
      settings: CodeBlockSettings,
      defaultData: {
        content: '',
        language: 'none'
      },
      icon: 'code'
    },
    {
      type: 'youtube',
      name: 'Youtube',
      component: YoutubeBlock,
      settings: YoutubeBlockSettings,
      defaultData: {
        embedUrl: ''
      },
      icon: 'media_link'
    },
  ];
  private readonly blockComponentMap: { [key in LessonBlock['type']]: Type<any> } = {
    text: TextBlock,
    heading: HeadingBlock,
    image: ImageBlock,
    code: CodeBlock,
    youtube: YoutubeBlock,
  };
  private lastClientY = 0;
  private animationFrameId: number | null = null;
  private readonly SCROLL_ZONE_SIZE = 50;
  private readonly SCROLL_SPEED = 10;

  protected settingsComponent!: any;
  readonly settingsChanged = new EventEmitter<any>();

  ngOnInit() {
    const content = this.content().map(block => {
      return {
        ...block,
        component: this.blockComponentMap[block.type],
      }
    });
    this.lessonBlocks.set(content);
    this.settingsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: BlockData) => {
        if (!this.activeBlock()) {
          return;
        }

        this.emitChange();
      });
  }

  private updateScroll = (): void => {
    if (!this.isDragging()) {
      this.animationFrameId = null;
      return;
    }

    const container = this.lessonAreaContainer().nativeElement;
    const rect = container.getBoundingClientRect();

    if (this.lastClientY < rect.top + this.SCROLL_ZONE_SIZE) {
      container.scrollTop -= this.SCROLL_SPEED;
    }
    else if (this.lastClientY > rect.bottom - this.SCROLL_ZONE_SIZE) {
      container.scrollTop += this.SCROLL_SPEED;
    }

    this.animationFrameId = requestAnimationFrame(this.updateScroll);
  };

  get builder() {
    return this;
  }

  isLessonEmpty() {
    return this.lessonBlocks().length === 0;
  }

  onDragOverContainer(event: DragEvent): void {
    this.lastClientY = event.clientY;
    event.preventDefault();
  }

  private startDrag(): void {
    this.isDragging.set(true);

    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(this.updateScroll);
    }
  }

  private endDrag(): void {
    this.isDragging.set(false);
  }

  onDragStart(): void {
    this.startDrag();
  }

  onDragEnd(event: DragEvent): void {
    this.endDrag();
    this.dndPlaceholder.set({ index: -1 });
  }

  onCdkDragStarted(): void {
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(this.updateScroll);
    }
  }

  onCdkDragEnded(): void {
    this.endDrag();
  }

  onCdkDragMoved(event: CdkDragMove): void {
    this.lastClientY = event.pointerPosition.y;
  }

  onDragOverItem(event: DragEvent, index: number): void {
    this.lastClientY = event.clientY;
    event.preventDefault();
    event.stopPropagation();

    const targetElement = event.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    if (event.clientY < midpoint) {
      this.dndPlaceholder.set({ index });
    } else {
      this.dndPlaceholder.set({ index: index + 1 });
    }
  }

  onDragOverPlaceholder(event: DragEvent): void {
    this.lastClientY = event.clientY;
    event.preventDefault();
    event.stopPropagation();
  }

  onDndDrop(event: DndDropEvent): void {
    const paletteItem = event.data as PaletteBlock<BlockData>;
    const dropIndex = this.dndPlaceholder().index !== -1
      ? this.dndPlaceholder().index
      : this.lessonBlocks().length;

    this.addBlock(paletteItem, dropIndex);
    this.endDrag();
    this.dndPlaceholder.set({ index: -1 });
    this.isDragging.set(false);
  }

  onCdkDrop(event: CdkDragDrop<LessonBlock[]>): void {
    this.moveBlock(event.previousIndex, event.currentIndex);
  }

  private moveBlock(fromIndex: number, toIndex: number): void {
    this.lessonBlocks.update(blocks => {
      const newBlocks = [...blocks];
      const [movedItem] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedItem);
      return newBlocks;
    });
    this.emitChange();
  }

  private addBlock(paletteItem: PaletteBlock<BlockData>, atIndex: number): void {
    const component_ = this.blockComponentMap[paletteItem.type];

    if (!component_) {
      console.error(`Component for type "${paletteItem.type}" not found.`);
      return;
    }

    const newBlock: LessonBlock = {
      id: `${paletteItem.type}-${Date.now()}`,
      type: paletteItem.type,
      component: component_,
      data: { ...paletteItem.defaultData },
    };
    this.lessonBlocks.update(blocks => {
      const newBlocks = [...blocks];
      newBlocks.splice(atIndex, 0, newBlock);
      return newBlocks;
    });
    this.emitChange();
  }

  delete(block: LessonBlock, index: number) {
    if (this.activeBlock()?.id === block.id) {
      this.closeSettings();
    }

    this.lessonBlocks.update((blocks: LessonBlock[])  => {
      blocks.splice(index, 1);
      return blocks;
    });
    this.emitChange();
  }

  getData(): LessonBlock[] {
    const data: LessonBlock[] = [];
    this.lessonBlocks().forEach(block => {
      const componentBlock = this.blocks().find(c => c.block().id === block.id);
      data.push({
        ...block,
        data: {
          ...block.data,
          ...componentBlock?.getData(),
        }
      });
    });
    return data;
  }

  settings(block: LessonBlock) {
    if (this.activeBlock()?.id === block.id) {
      return;
    }

    const item = this.availableBlocks.find(b => b.type === block.type);

    if (item?.settings) {
      this.settingsComponent = item.settings;
      this.activeBlock.set(block);
    }
  }

  emitChange() {
    this.changed.emit(this.getData());
  }

  closeSettings() {
    this.activeBlock.set(null);
    this.settingsComponent = null;
  }

  protected onComponentActivate(component: any) {
    this.blocks.update((blocks: any) => {
      blocks.push(component);
      return blocks;
    });
  }
}
