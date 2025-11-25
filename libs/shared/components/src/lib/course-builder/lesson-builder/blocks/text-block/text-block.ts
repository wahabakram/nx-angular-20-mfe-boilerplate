import { ChangeDetectionStrategy, Component, forwardRef, input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TextEditorBubbleMenu,
  TextEditorCommandBlockquoteDirective,
  TextEditorCommandBoldDirective,
  TextEditorCommandCodeDirective,
  TextEditorCommandDirective,
  TextEditorCommandEditLinkDirective,
  TextEditorCommandHorizontalRuleDirective,
  TextEditorCommandItalicDirective,
  TextEditorCommandLinkDirective,
  TextEditorCommandStrikeDirective,
  TextEditorCommandUnsetLinkDirective,
  TextEditor,
  TextEditorDivider,
  TextEditorFloatingMenu,
} from '../../../../editors/text-editor';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LESSON_EDITOR_BLOCK } from '../../types';
import { LessonBlock, TextBlockData } from '../../../models/lesson-block.model';
import {
  LessonBuilder
} from '../../lesson-builder/lesson-builder';

@Component({
  selector: 'mf-text-block',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TextEditor,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TextEditorBubbleMenu,
    TextEditorDivider,
    TextEditorCommandDirective,
    TextEditorCommandBoldDirective,
    TextEditorCommandItalicDirective,
    TextEditorCommandStrikeDirective,
    TextEditorCommandBlockquoteDirective,
    TextEditorCommandEditLinkDirective,
    TextEditorCommandUnsetLinkDirective,
    TextEditorCommandLinkDirective,
    TextEditorCommandCodeDirective,
    TextEditorCommandHorizontalRuleDirective,
    TextEditorFloatingMenu
  ],
  providers: [
    {
      provide: LESSON_EDITOR_BLOCK,
      multi: true,
      useExisting: forwardRef(() => TextBlock)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-block.html',
  styleUrl: './text-block.scss',
})
export class TextBlock implements OnInit {
  block = input.required<LessonBlock<TextBlockData>>();
  builder = input.required<LessonBuilder>();

  private localContent = signal<string>('');

  ngOnInit() {
    this.localContent.set(this.block().data.content);
  }

  getData(): any {
    return {
      content: this.localContent(),
    };
  }

  onContentChange(content: string) {
    if (content === this.localContent()) {
      return;
    }

    this.localContent.set(content);
    this.builder().emitChange();
  }
}
