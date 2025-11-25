export type FileType =
  | 'folder'
  | 'shared_folder'
  | 'image'
  | 'pdf'
  | 'zip'
  | 'link'
  | 'rtf'
  | 'document';

export type AccessType = { type: 'members'; count: number } | { type: 'only_you' };

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: FileType;
  isShared: boolean;
  access: AccessType;
  isStarred: boolean;
  modified: Date | null | string;
  extension?: string;
  thumbnailUrl?: string;
  itemsCount?: number | null;
}

export interface FileSelectedEvent {
  files: FileItem[];
}
