import { InjectionToken, Signal } from '@angular/core';

export const CONTENT_BUILDER = new InjectionToken('CONTENT_BUILDER');
export const CONTENT_EDITOR_BLOCK = new InjectionToken<ReadonlyArray<ContentEditorDataBlock>>('CONTENT_EDITOR_BLOCK');

export interface ContentEditorDataBlock {
  id: Signal<string>;
  getData(): any;
  focus(): void;
  isEmpty(): boolean;
  initialized: Signal<boolean>;
}

export interface ContentEditorBlockEmpty {
  content: any;
  options: {
    [prop: string]: any;
  }
}

export interface ContentEditorBlock {
  id: string;
  type: string;
  content: any;
  props?: ContentEditorItemProperty[],
  options: {
    [prop: string]: any;
  }
}

export interface ContentEditorBlockDef {
  component: () => any,
  type: string,
  empty: () => ContentEditorBlockEmpty,
  options: {
    [prop: string]: any;
  }
}

export interface ContentEditorHeadingBlockOptions {
  level: number;
}

export interface ContentEditorSuggestionHeading {
  type: 'item' | 'heading';
  title: string;
}

export interface ContentEditorSuggestionItem {
  type: 'item' | 'heading';
  title: string;
  description: string;
  iconName: string;
  hotKeys: string;
  blockType: string;
  blockOptions: object;
}

export interface ContentEditorImageContent {
  src: string;
  alt: string;
  [prop: string]: any;
}

export interface ContentEditorImageBlockOptions {
  uploadFn: (file: File, base64: string | ArrayBuffer | null) => Promise<ContentEditorImageContent>;
  width?: number;
  height?: number;
  actualWidth?: number;
  actualHeight?: number;
}

export interface ContentEditorListItem {
  content: string;
  children: ContentEditorListItem[];
  [prop: string]: any;
}

export interface ContentEditorListOptions {
  listStyle: string;
}

export interface ContentEditorItemProperty {
  name: string;
  value: string;
}

export interface ContentEditorTableBlockOptions {

}

export interface ContentEditorOptions {
  [prop: string]: any;
}
