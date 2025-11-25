import { Component, DestroyRef, EventEmitter, inject, input, OnInit } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  LessonBuilderCommunicatorService
} from '../../lesson-builder-communicator.service';
import { ImageBlockData, LessonBlock } from '../../../models/lesson-block.model';

@Component({
  selector: 'mf-image-block-settings',
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './image-block-settings.html',
  styleUrl: './image-block-settings.scss'
})
export class ImageBlockSettings implements OnInit {
  private communicator = inject(LessonBuilderCommunicatorService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly block = input.required<LessonBlock<ImageBlockData>>();
  readonly settingsChanged = input.required<EventEmitter<any>>();
  protected form!: FormGroup;

  ngOnInit() {
    this.form = this.formBuilder.group({
      alt: [this.block().data.alt],
      align: [this.block().data.align]
    });
    this.form
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.communicator.updateBlockData(this.block().id, value);
      });
  }
}
