import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { NoteItem, NoteLabel, NoteTask } from '@ng-mf/components';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { BrandColorsComponent } from '@ng-mf/components';

interface EditNoteDialogData {
  note: NoteItem;
  allLabels: NoteLabel[];
  allColors: string[];
}

@Component({
  selector: 'app-edit',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    CdkTextareaAutosize,
    BrandColorsComponent,
    ReactiveFormsModule
],
  templateUrl: './edit.modal.html',
  styleUrl: './edit.modal.scss'
})
export class EditModal {
  private dialogRef = inject(MatDialogRef<EditModal>);
  private data = inject<EditNoteDialogData>(MAT_DIALOG_DATA);
  private fb: FormBuilder = inject(FormBuilder);

  public noteForm: FormGroup;
  public allLabels = signal<NoteLabel[]>(this.data.allLabels);
  allColors = signal<string[]>(this.data.allColors);

  private newTaskInputRef = viewChild.required<ElementRef<HTMLInputElement>>('newTaskInput');

  constructor() {
    const note = this.data.note;
    this.noteForm = this.fb.group({
      id: [note.id],
      title: [note.title || '', [Validators.required]],
      content: [note.content || ''],
      color: [note.color],
      imageUrl: [note.imageUrl],
      labels: [note.labels || []],
      tasks: this.fb.array( (note.tasks || []).map(task => this.createTaskGroup(task)) )
    });
  }

  get tasksArray(): FormArray {
    return this.noteForm.get('tasks') as FormArray;
  }

  private createTaskGroup(task: NoteTask): FormGroup {
    return this.fb.group({
      content: [task.content],
      completed: [task.completed]
    });
  }

  public addTask(content: string): void {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    this.tasksArray.push(this.createTaskGroup({ content: trimmedContent, completed: false }));
    const inputEl = this.newTaskInputRef()?.nativeElement;

    if (inputEl) {
      inputEl.value = '';
      inputEl.focus()
    }
  }

  public removeTask(index: number): void {
    this.tasksArray.removeAt(index);
  }

  public toggleLabel(labelToToggle: NoteLabel): void {
    const currentLabels: NoteLabel[] = this.noteForm.get('labels')?.value || [];
    const index = currentLabels.findIndex(l => l.id === labelToToggle.id);

    if (index >= 0) {
      currentLabels.splice(index, 1);
    } else {
      currentLabels.push(labelToToggle);
    }

    this.noteForm.get('labels')?.setValue([...currentLabels]);
  }

  public isLabelSelected(labelToCheck: NoteLabel): boolean {
    const currentLabels: NoteLabel[] = this.noteForm.get('labels')?.value || [];
    return currentLabels.some(l => l.id === labelToCheck.id);
  }

  public save(): void {
    this.dialogRef.close(this.noteForm.value);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
