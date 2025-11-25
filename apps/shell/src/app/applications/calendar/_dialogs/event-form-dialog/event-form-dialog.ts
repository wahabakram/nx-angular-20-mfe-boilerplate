import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIcon } from '@angular/material/icon';

import { ScheduleDataService } from '../../schedule-data.service';
import { CalendarEvent, Category } from '../../types';

@Component({
  selector: 'app-event-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatIcon,
  ],
  templateUrl: './event-form-dialog.html',
  styleUrl: './event-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EventFormDialog>);
  private scheduleDataService = inject(ScheduleDataService);
  protected data?: CalendarEvent = inject(MAT_DIALOG_DATA, { optional: true });

  readonly categories = this.scheduleDataService.categories;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    range: new FormGroup({
      start: new FormControl<Date | null>(null, Validators.required),
      end: new FormControl<Date | null>(null, Validators.required),
    }),
    startTime: new FormControl<Date | string>('09:00', Validators.required),
    endTime: new FormControl<Date | string>('10:00', Validators.required),
    category: ['personal', Validators.required],
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        title: this.data.title,
        description: this.data.description,
        category: this.data.category,
        range: {
          start: this.data.startTime,
          end: this.data.endTime,
        },
        startTime: this.data.startTime,
        endTime: this.data.endTime,
      });
    }
  }

  get rangeGroup(): FormGroup {
    return this.form.get('range') as FormGroup;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.getRawValue();
    const finalStartDate = formValue.range.start ? new Date(formValue.range.start) : null;
    const finalEndDate = formValue.range.end ? new Date(formValue.range.end) : null;

    const startTimeValue = formValue.startTime;
    const endTimeValue = formValue.endTime;

    if (!finalStartDate || !finalEndDate || !startTimeValue || !endTimeValue) {
      return;
    }

    if (startTimeValue instanceof Date && endTimeValue instanceof Date) {
      finalStartDate.setHours(startTimeValue.getHours(), startTimeValue.getMinutes(), 0, 0);
      finalEndDate.setHours(endTimeValue.getHours(), endTimeValue.getMinutes(), 0, 0);
      this.dialogRef.close({
        id: this.data?.id,
        title: formValue.title,
        description: formValue.description,
        start: finalStartDate,
        end: finalEndDate,
        category: formValue.category,
      });
    } else {
      console.error('Time value is not a Date object:', { startTimeValue, endTimeValue });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
