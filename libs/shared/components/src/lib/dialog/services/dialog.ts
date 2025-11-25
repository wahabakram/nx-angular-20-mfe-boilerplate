import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogLayout } from '../dialog-layout/dialog-layout';
import { DialogOptions } from '../types';
import { DialogFooter } from '../dialog-footer/dialog-footer';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { AlertDialog } from '../alert-dialog/alert-dialog';
import { LoadingDialog } from '../loading-dialog/loading-dialog';

export interface DialogButton {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  private matDialog = inject(MatDialog);

  /**
   * Opens a dialog with the specified component and options
   */
  open<T = any, R = any>(
    content: ComponentType<any>,
    options: DialogOptions<T> = {}
  ): Observable<R | undefined> {
    const dialogRef = this.matDialog.open(DialogLayout, {
      ...options,
      width: options.width || '600px',
      panelClass: [
        'mf-dialog',
        ...(Array.isArray(options.panelClass)
          ? options.panelClass
          : options.panelClass
          ? [options.panelClass]
          : []),
      ],
      data: {
        content,
        title: options.title,
        data: options.data,
        footer: options.footer,
        header: options.header,
      },
    });

    return dialogRef.afterClosed();
  }

  /**
   * Opens a confirmation dialog
   */
  openConfirmation(
    title: string,
    message: string,
    options: {
      confirmText?: string;
      cancelText?: string;
      variant?: 'warning' | 'error' | 'info';
      width?: string;
    } = {}
  ): Observable<boolean> {
    return this.open(ConfirmationDialog, {
      title,
      width: options.width || '400px',
      data: {
        message,
        variant: options.variant || 'info',
      },
      footer: {
        component: DialogFooter,
        buttons: [
          {
            action: 'cancel',
            label: options.cancelText || 'Cancel',
            class: 'btn btn-ghost',
          },
          {
            action: 'confirm',
            label: options.confirmText || 'Confirm',
            class:
              options.variant === 'error' ? 'btn btn-error' : 'btn btn-primary',
          },
        ],
      },
    }).pipe(map((result) => result === 'confirm'));
  }

  /**
   * Opens an alert dialog
   */
  openAlert(
    title: string,
    message: string,
    variant: 'success' | 'warning' | 'error' | 'info' = 'info',
    options: { width?: string } = {}
  ): Observable<void> {
    return this.open(AlertDialog, {
      title,
      width: options.width || '400px',
      data: { message, variant },
      footer: {
        component: DialogFooter,
        buttons: [
          {
            action: 'ok',
            label: 'OK',
            class: 'btn btn-primary',
          },
        ],
      },
    }).pipe(map(() => void 0));
  }

  /**
   * Opens a loading dialog
   */
  openLoading(
    title = 'Loading...',
    message = 'Please wait while we process your request.',
    options: { width?: string } = {}
  ): Observable<void> {
    return this.open(LoadingDialog, {
      title,
      width: options.width || '350px',
      data: { message },
      disableClose: true,
    });
  }

  /**
   * Opens a dialog with custom buttons
   */
  openWithButtons<T = any, R = any>(
    content: ComponentType<any>,
    title: string,
    buttons: DialogButton[],
    options: DialogOptions<T> = {}
  ): Observable<R | undefined> {
    return this.open<T, R>(content, {
      ...options,
      title,
      footer:
        buttons.length > 0
          ? {
              component: DialogFooter,
              buttons: buttons.map((btn) => ({
                id: btn.id,
                label: btn.label,
                class: this.getButtonClasses(btn),
                icon: btn.icon,
                disabled: btn.disabled || btn.loading,
                loading: btn.loading,
              })),
            }
          : undefined,
    });
  }

  private getButtonClasses(button: DialogButton): string {
    const baseClasses = ['btn', 'btn-sm'];

    switch (button.variant) {
      case 'primary':
        baseClasses.push('btn-primary');
        break;
      case 'secondary':
        baseClasses.push('btn-secondary');
        break;
      case 'success':
        baseClasses.push('btn-success');
        break;
      case 'warning':
        baseClasses.push('btn-warning');
        break;
      case 'error':
        baseClasses.push('btn-error');
        break;
      case 'ghost':
      default:
        baseClasses.push('btn-ghost');
        break;
    }

    if (button.loading) {
      baseClasses.push('loading');
    }

    return baseClasses.join(' ');
  }
}
