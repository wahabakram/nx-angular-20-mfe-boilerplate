import { ChangeDetectionStrategy, Component, forwardRef, inject, input, model, OnInit, signal } from '@angular/core';
import { UploadArea, UploadFileSelectedEvent, UploadTriggerDirective } from '../../../media/upload';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  CONTENT_BUILDER,
  CONTENT_EDITOR_BLOCK, ContentEditorDataBlock,
  ContentEditorImageBlockOptions,
  ContentEditorImageContent
} from '../../types';
import { ImageResizer, ImageResizerImageDirective } from '../../../media/image-resizer';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ContentBuilderStore } from '../../content-builder.store';
import { ContentBuilder } from '../../content-builder/content-builder';

@Component({
  selector: 'mf-image-block',
  imports: [
    UploadArea,
    UploadTriggerDirective,
    MatProgressBar,
    MatIconButton,
    MatIcon,
    ImageResizer,
    MatFormField,
    MatInput,
    FormsModule,
    ImageResizerImageDirective,
    MatLabel
  ],
  providers: [
    {
      provide: CONTENT_EDITOR_BLOCK,
      useExisting: forwardRef(() => ImageBlock),
      multi: true
    }
  ],
  templateUrl: './image-block.html',
  styleUrl: './image-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageBlock implements OnInit, ContentEditorDataBlock {
  private _store = inject(ContentBuilderStore);
  private _contentBuilder = inject<ContentBuilder>(CONTENT_BUILDER);

  id = input.required<string>();
  content = input.required<ContentEditorImageContent>();
  options = input.required<ContentEditorImageBlockOptions>();
  index = input.required<number>();

  uploading = signal(false);
  selectedImage = signal<string>('');

  protected _src = signal<string>('');
  protected _alt = model<string>('');
  protected _options = model<ContentEditorImageBlockOptions | object>({});
  readonly initialized = signal(false);

  ngOnInit() {
    this._src.set(this.content().src);
    this._alt.set(this.content().alt);
    this._options.set(this._options());
    this._store.addDataBlock(this);
    this.initialized.set(true);
  }

  focus() {
    if (this._src()) {
      this._contentBuilder.focusBlock(this.id());
    }
  }

  getData(): any {
    return {
      content: {
        src: this._src(),
        alt: this._alt()
      },
      options: {
        ...this._options(),
      }
    };
  }

  isEmpty(): boolean {
    return this.getData().content.src.trim().length === 0;
  }

  protected cancelUploading() {
    this.uploading.set(false);
  }

  protected onFileSelected(event: UploadFileSelectedEvent): void {
    this.uploading.set(true);
    const reader  = new FileReader();
    reader.addEventListener('load', () => {
      this.selectedImage.set(reader.result as string);
      this.options()
        .uploadFn(event.files[0], reader.result)
        .then(result => {
          if (!this.uploading()) {
            this.selectedImage.set('');
            return;
          }

          this._src.set(result.src);
          this.selectedImage.set('');
          this.uploading.set(false);
          this.focus();
          this._contentBuilder.emitContentChangeEvent();
        });
    }, false);
    reader.readAsDataURL(event.files[0]);
  }

  protected _onAltChange() {
  }

  protected _onImageResized(options: any) {
    this._options.set(options);
  }
}
