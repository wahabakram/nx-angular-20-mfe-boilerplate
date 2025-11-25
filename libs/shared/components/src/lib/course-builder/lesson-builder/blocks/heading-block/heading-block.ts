import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LESSON_EDITOR_BLOCK } from '../../types';
import { HeadingBlockData, ImageBlockData, LessonBlock } from '../../../models/lesson-block.model';
import { LessonBuilder } from '../../lesson-builder/lesson-builder';
import { InlineTextEdit } from '../../../../forms/inline-text-edit';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import {
  LessonBuilderCommunicatorService
} from '../../lesson-builder-communicator.service';

@Component({
  selector: 'mf-heading-block',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    InlineTextEdit
  ],
  templateUrl: './heading-block.html',
  styleUrl: './heading-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: LESSON_EDITOR_BLOCK,
      multi: true,
      useExisting: forwardRef(() => HeadingBlock)
    }
  ]
})
export class HeadingBlock {
  private communicator = inject(LessonBuilderCommunicatorService);
  private destroyRef = inject(DestroyRef);

  block = input.required<LessonBlock<HeadingBlockData>>();
  builder = input.required<LessonBuilder>();

  protected localContent = signal<string>('');
  protected localLevel = signal<number>(2);

  ngOnInit() {
    this.localContent.set(this.block().data.content || '');
    const level = Number(this.block().data.level || 2);
    this.localLevel.set(isFinite(level) && level >= 1 && level <= 6 ? level : 2);
    this.communicator
      .blockDataChanged()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((v: { blockId: any; data: any }) => v.blockId === this.block().id)
      )
      .subscribe((event: { blockId: any; data: any }) => {
        this.localLevel.set(event.data.level);
        this.builder().emitChange();
      });
  }

  getData(): HeadingBlockData {
    return {
      content: this.localContent(),
      level: this.localLevel()
    };
  }

  protected onChanged(value: string) {
    if (value === this.localContent()) {
      return
    }

    this.localContent.set(value);
    this.builder().emitChange();
  }
}
