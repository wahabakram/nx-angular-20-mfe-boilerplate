export interface NoteTask {
  content: string;
  completed: boolean;
}

export interface NoteLabel {
  id: string;
  name: string;
}

export interface NoteItem {
  id: number;
  title: string;
  content: string;
  color: string;
  imageUrl?: string;
  labels?: NoteLabel[];
  tasks?: NoteTask[];
}
