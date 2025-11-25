import { Component, DestroyRef, EventEmitter, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderByPipe } from '../../../../core/pipes';
import { MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatFormField } from '@angular/material/input';
import { CodeBlockData, LessonBlock } from '../../../models/lesson-block.model';
import {
  LessonBuilderCommunicatorService
} from '../../lesson-builder-communicator.service';
import { codeLanguages } from '../../../models/code-block.model';

@Component({
  selector: 'mf-code-block-settings',
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    OrderByPipe,
    ReactiveFormsModule,
    MatLabel
  ],
  templateUrl: './code-block-settings.html',
  styleUrl: './code-block-settings.scss'
})
export class CodeBlockSettings {
  private communicator = inject(LessonBuilderCommunicatorService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly block = input.required<LessonBlock<CodeBlockData>>();
  readonly settingsChanged = input.required<EventEmitter<any>>();
  protected form!: FormGroup;

  protected languages = signal<any[]>(codeLanguages);

  ngOnInit() {
    this.form = this.formBuilder.group({
      language: [this.block().data.language],
    });
    this.form
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.communicator.updateBlockData(this.block().id, value);
      });
  }
}
