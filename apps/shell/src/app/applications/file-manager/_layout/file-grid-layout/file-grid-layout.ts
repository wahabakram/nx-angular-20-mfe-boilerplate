import { Component, inject, input, InputSignal, OnInit, output } from '@angular/core';
import { FileItem, FileSelectedEvent } from '../../types';
import { MatOption } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { FormatFileSizePipe, MenuOptionGroupDirective } from '@ng-mf/components';

@Component({
  selector: 'app-file-grid-layout',
  imports: [
    MatOption,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatDivider,
    MenuOptionGroupDirective,
    MatMenuTrigger,
    MatCheckbox,
    MatRipple,
    MatMenuItem,
    MatMenu,
    MatTooltip,
    FormatFileSizePipe
  ],
  templateUrl: './file-grid-layout.html',
  styleUrl: './file-grid-layout.scss'
})
export class FileGridLayout implements OnInit {
  private _fb = inject(FormBuilder);

  starredIds= input<string[]>([]);
  files: InputSignal<FileItem[]> = input<FileItem[]>([]);

  readonly fileSelected = output<FileSelectedEvent>();

  form: FormGroup;
  selectionModel!: SelectionModel<string>;
  groupByList = [
    {
      id: 'name',
      name: 'Name'
    },
    {
      id: 'modified',
      name: 'Modified'
    },
    {
      id: 'type',
      name: 'Type'
    },
    {
      id: 'extension',
      name: 'Extension'
    },
    {
      id: 'size',
      name: 'Size'
    }
  ];
  sortBy: string = 'asc';

  get groupByName(): string {
    return <string>this.groupByList.find(groupItem => groupItem.id === this.form.value['groupBy'])?.name;
  }

  constructor() {
    this.form = this._fb.group({
      groupBy: ['name']
    });
  }

  ngOnInit() {
    this.selectionModel = new SelectionModel<string>(true, []);
  }

  sort() {
    this.sortBy = this.sortBy === 'asc' ? 'desc' : 'asc';
  }

  preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  share(event: Event, file: FileItem) {
    this.preventDefault(event);
  }

  copyLink(event: Event, file: FileItem) {
    this.preventDefault(event);
  }

  toggleCheck(event: MatCheckboxChange, fileId: string): void {
    if (event.checked) {
      this.selectionModel.select(fileId);
    } else {
      this.selectionModel.deselect(fileId);
    }

    this.fileSelected.emit({
      files: this.files().filter(file => this.selectionModel.selected.includes(file.id))
    });
  }

  toggleStar(file: FileItem): void {
    file.isStarred = !file.isStarred;
  }
}
