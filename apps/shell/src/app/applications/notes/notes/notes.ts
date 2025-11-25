import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  PanelBody,
  Panel,
  PanelHeader,
  PanelSidebar
} from '@ng-mf/components';
import {
  NoteCard,
  NoteItem,
  NoteLabel,
  Notes as BaseNotes,
  NoteTask
} from '@ng-mf/components';
import {
  Navigation,
  NavigationItem,
  NavigationItemIconDirective
} from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { EditModal } from '@/applications/notes/edit/edit.modal';
import { EditLabel } from '@/applications/notes/edit-label/edit-label';
import { OverlayScrollbar } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-notes',
  imports: [
    MatButton,
    Panel,
    PanelSidebar,
    PanelBody,
    PanelHeader,
    BaseNotes,
    NoteCard,
    Navigation,
    NavigationItem,
    MatIcon,
    NavigationItemIconDirective,
    ReactiveFormsModule,
    FormsModule,
    MatIconButton,
    MatCheckbox,
    OverlayScrollbar
  ],
  templateUrl: './notes.html',
  styleUrl: './notes.scss'
})
export class Notes implements OnInit {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private dialog = inject(MatDialog);

  noteItems = signal<NoteItem[]>([]);
  activeLinkId = signal('allNotes');
  searchTerm = model('');
  readonly allLabels = signal<NoteLabel[]>([
    { id: 'personal', name: 'Personal' },
    { id: 'work', name: 'Work' },
    { id: 'project-x', name: 'Project X' },
    { id: 'ideas', name: 'Ideas' },
    { id: 'urgent', name: 'Urgent' },
    { id: 'tasks', name: 'Tasks' },
  ]);
  readonly navigation = signal([
    {
      key: 'allNotes',
      name: 'All Notes',
      icon: 'notes',
    },
    {
      key: 'starredNotes',
      name: 'Starred Notes',
      icon: 'star',
    },
    {
      key: 'archivedNotes',
      name: 'Archived Notes',
      icon: 'archive',
    }
  ]);
  readonly filterByLabel = signal<NoteLabel | null>(null);
  readonly filteredNotes = computed(() => {
    const allNotes = this.noteItems();
    const term = this.searchTerm().toLowerCase().trim();
    const selectedLabel = this.filterByLabel();

    return allNotes.filter(note => {
      const matchesSearchTerm = term
        ? note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term)
        : true;

      const matchesLabel = selectedLabel
        ? note.labels?.some(l => l.id === selectedLabel.id) ?? false
        : true;

      return matchesSearchTerm && matchesLabel;
    });
  });

  private noteColors = [
    '#fff8e1', '#fce4ec', '#e3f2fd', '#e8f5e9', '#f3e5f5', '#ede7f6',
  ];
  private noteContents = [
    'A short note for testing.',
    'Remember to buy milk, bread, and eggs on the way home. Also, check the mail.',
    'Project idea: create a habit tracker in Angular using Signals and ngrx/signal-store for state management.',
    'Quote of the day: "The only way to do great work is to love what you do." – Steve Jobs.',
    'This note is a bit longer to see how the masonry grid handles content of varying heights.',
    'Prepare for the 3 PM meeting. Topics: 1. Last quarter\'s report. 2. Plans for the next quarter.',
    'Just a thought.',
  ];

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'contacts',
        name: 'Notes',
        type: null
      }
    ]);
  }

  ngOnInit(): void {
    const initialNotes = this.generateNotes(7);
    this.noteItems.set(initialNotes);
  }

  onNavItemClicked(navItem: any) {
    this.filterByLabel.set(null);
    this.activeLinkId.set(navItem.key);
  }

  onSortByLabelChange(label: NoteLabel): void {
    this.activeLinkId.set(label.id);
    this.filterByLabel.set(label);
  }

  onItemsChange(newFilteredOrder: NoteItem[]): void {
    const originalNotes = this.noteItems();
    const newOrderIds = new Set(newFilteredOrder.map(n => n.id));
    const untouchedNotes = originalNotes.filter(n => !newOrderIds.has(n.id));
    this.noteItems.set([...newFilteredOrder, ...untouchedNotes]);
  }

  addNewLabel() {
    const dialogRef = this.dialog.open(EditLabel, {
      width: '560px',
      data: {
        label: {
          id: Date.now(),
          name: '',
        },
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.allLabels.update((labels: NoteLabel[]) => {
          labels.push(result);
          return labels;
        });
      }
    });
  }

  editLabel(label: NoteLabel) {
    const dialogRef = this.dialog.open(EditLabel, {
      width: '560px',
      data: {
        label,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.allLabels.update((labels: NoteLabel[]) => {
          const index = labels.findIndex(l => l.id === result.id);
          if (index > -1) {
            const newLabels = [...labels];
            newLabels[index] = result;
            return newLabels;
          }
          return labels;
        });
        // TODO: update notes label
      }
    });
  }

  edit(note: NoteItem) {
    const dialogRef = this.dialog.open(EditModal, {
      width: '560px',
      data: {
        note,
        allLabels: this.allLabels(),
        allColors: this.noteColors,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.noteItems.update(notes => {
          const index = notes.findIndex(n => n.id === result.id);

          if (index > -1) {
            const newNotes = [...notes];
            newNotes[index] = result;
            return newNotes;
          }
          return notes;
        });
      }
    });
  }

  addNew(): void {
    const newNoteTemplate = this.createNewNoteTemplate();
    const dialogRef = this.dialog.open(EditModal, {
      width: '560px',
      data: {
        note: newNoteTemplate,
        allLabels: this.allLabels(),
        allColors: this.noteColors,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.noteItems.update(notes => [...notes, result]);
      }
    });
  }

  deleteNoteById(noteId: number): void {
    this.noteItems.update(notes => notes.filter(n => n.id !== noteId));
  }

  private generateNotes(count: number, startIndex = 0): NoteItem[] {
    return Array.from({ length: count }, (_, i) => {
      const id = startIndex + i + 1;
      const note: NoteItem = {
        id: id,
        title: `Note #${id}`,
        content: this.noteContents[Math.floor(Math.random() * this.noteContents.length)],
        color: this.noteColors[Math.floor(Math.random() * this.noteColors.length)],
      };
      if (id % 4 === 0) {
        note.imageUrl = `https://picsum.photos/400/250?random=${id}`;
      }
      if (id % 3 === 0) {
        note.labels = [...this.allLabels()].sort(() => 0.5 - Math.random()).slice(0, 2);
      }

      if (id % 2 === 0) {
        note.tasks = [
          { content: 'Finalize the report', completed: true },
          { content: 'Send follow-up email', completed: false },
          { content: 'Prepare for the demo', completed: false },
        ];
      }
      return note;
    });
  }

  toggleTask(note: NoteItem, taskToToggle: NoteTask): void {
    this.noteItems.update(notes =>
      notes.map(currentNote => {
        if (currentNote.id === note.id) {
          return {
            ...currentNote,
            tasks: currentNote.tasks?.map(task =>
              task === taskToToggle ? { ...task, completed: !task.completed } : task
            )
          };
        }
        return currentNote;
      })
    );
  }

  private createNewNoteTemplate(): NoteItem {
    return {
      id: Date.now(),
      title: '',
      content: '',
      color: '',
      labels: [],
      tasks: [],
    };
  }
}
