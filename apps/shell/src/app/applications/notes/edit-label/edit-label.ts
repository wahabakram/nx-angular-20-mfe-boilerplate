import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { NoteLabel } from '@ng-mf/components';

interface EditLabelDialogData {
  label: NoteLabel;
}

@Component({
  selector: 'app-edit-label',
  imports: [
    FormsModule,
    MatDialogModule,
    MatDialogContent,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatDialogActions,
  ],
  templateUrl: './edit-label.html',
  styleUrl: './edit-label.scss'
})
export class EditLabel implements OnInit {
  private data = inject<EditLabelDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private formBuilder = inject(FormBuilder);

  protected form!: FormGroup;

  ngOnInit() {
    const label = this.data.label;
    this.form = this.formBuilder.group(
      {
        id: [label.id, [Validators.required]],
        name: [label.name, [Validators.required]],
      }
    )
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
}
