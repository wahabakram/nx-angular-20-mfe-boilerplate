import { Component, DestroyRef, EventEmitter, inject, input, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import {
  LessonBuilderCommunicatorService
} from '../../lesson-builder-communicator.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  HeadingBlockData,
  LessonBlock
} from '../../../models/lesson-block.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mf-heading-block-settings',
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule
  ],
  templateUrl: './heading-block-settings.html',
  styleUrl: './heading-block-settings.scss'
})
export class HeadingBlockSettings implements OnInit {
  private communicator = inject(LessonBuilderCommunicatorService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly block = input.required<LessonBlock<HeadingBlockData>>();
  readonly settingsChanged = input.required<EventEmitter<any>>();
  protected form!: FormGroup;

  ngOnInit() {
    this.form = this.formBuilder.group({
      level: [this.block().data.level],
    });
    this.form
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.communicator.updateBlockData(this.block().id, value);
      });
  }
}
