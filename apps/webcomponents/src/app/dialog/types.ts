import { ComponentType } from '@angular/cdk/portal';
import { MatDialogConfig } from '@angular/material/dialog';

export interface DialogLayoutData<T> extends DialogOptions<T> {
  content: ComponentType<any>;
}

export interface DialogOptions<T> extends MatDialogConfig {
  title?: string;
  data?: T;
  header?: {
    component: ComponentType<any>;
  };
  footer?: {
    component: ComponentType<any>;
    buttons?: DialogFooterButton[];
  };
  width?: string;
}

export interface DialogFooterButton {
  label: string;
  type?: 'submit' | 'button' | 'reset';
  icon?: string; // e.g. 'save', 'cancel', 'trash'
  class?: string; // e.g. 'btn-primary', 'btn-error'
  action?: string; // emitted as string on click
  disabled?: boolean;
  loading?: boolean; // Show loading spinner when true
}
