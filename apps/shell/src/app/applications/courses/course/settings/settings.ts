import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  UploadArea,
  UploadAreaDropStateDirective,
  UploadAreaInvalidStateDirective,
  UploadAreaMainStateDirective,
} from '@ng-mf/components';
import { OverlayScrollbar } from '@ng-mf/components';

@Component({
  selector: 'app-settings',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
    UploadArea,
    OverlayScrollbar,
    UploadAreaDropStateDirective,
    UploadAreaInvalidStateDirective,
    UploadAreaMainStateDirective,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    courseName: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    courseDescription: this.fb.nonNullable.control('', {
      validators: [Validators.maxLength(2000)],
    }),
    instructorBio: this.fb.nonNullable.control('', {
      validators: [Validators.maxLength(500)],
    }),
    openEnrollment: this.fb.nonNullable.control(false),
    prerequisites: this.fb.nonNullable.control(''),
    modules: this.fb.nonNullable.control(''),
    assignments: this.fb.nonNullable.control(''),
    courseStatus: this.fb.nonNullable.control<'publish' | 'unpublish'>(
      'unpublish'
    ),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // In a real app, dispatch an action or call a service here
    // console.log('Settings saved', this.form.getRawValue());
  }
}
