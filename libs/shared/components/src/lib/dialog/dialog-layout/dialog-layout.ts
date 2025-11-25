import {
  Component,
  ComponentRef,
  inject,
  inputBinding,
  OnInit,
  outputBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogLayoutData } from '../types';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'mf-dialog-layout',
  imports: [MatDialogModule, DragDropModule],
  templateUrl: './dialog-layout.html',
  styleUrl: './dialog-layout.scss',
  host: {
    class: 'dialog-layout',
    '[class.w-full]': 'true',
    '[class.h-full]': 'true',
  },
})
export class DialogLayout implements OnInit {
  private _headerRef = viewChild('headerContainer', {
    read: ViewContainerRef,
  });
  private _contentRef = viewChild.required('contentContainer', {
    read: ViewContainerRef,
  });
  private _footerRef = viewChild.required('footerContainer', {
    read: ViewContainerRef,
  });

  private _contentComponentRef!: ComponentRef<any>;

  dialogRef = inject(MatDialogRef<DialogLayout>);
  config = inject<DialogLayoutData<unknown>>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log('config =>', this.config);
    // Load dynamic header if provided
    if (this.config.header && this._headerRef()) {
      this.loadDynamicComponent(
        this._headerRef()!,
        this.config.header.component,
        '_headerRef'
      );
    }

    this.loadDynamicComponent(
      this._contentRef(),
      this.config.content,
      '_contentRef'
    );

    if (this.config.footer) {
      this.loadDynamicComponent(
        this._footerRef(),
        this.config.footer.component,
        '_footerRef'
      );
    }
  }

  private loadDynamicComponent(
    container: ViewContainerRef,
    component: ComponentType<any>,
    refName: '_headerRef' | '_contentRef' | '_footerRef'
  ) {
    // Clear the container before creating a new component
    container.clear();

    const bindings = [];
    if (refName === '_contentRef') {
      bindings.push(
        inputBinding('data', () => this.config.data || {})
      );
    }

    // Footer specific bindings
    if (refName === '_footerRef') {
      bindings.push(
        inputBinding('config', () => {
          // Get dynamic footer configuration from content component if available
          if (this._contentComponentRef?.instance?.getFooterButtons) {
            return {
              ...this.config.footer,
              buttons: this._contentComponentRef.instance.getFooterButtons()
            };
          }
          return this.config.footer || {};
        }),
        outputBinding('buttonClick', (buttonId: string) => {
          console.log('buttonId =>', buttonId);
          
          // Check if content component has onFooterAction method and call it
          if (this._contentComponentRef?.instance?.onFooterAction) {
            try {
              this._contentComponentRef.instance.onFooterAction(buttonId);
            } catch (error) {
              console.warn('Error calling onFooterAction:', error);
              this.dialogRef.close(buttonId);
            }
          } else {
            // Fallback: just close the dialog
            this.dialogRef.close(buttonId);
          }
        })
      );
    }

    const compRef: ComponentRef<any> = container.createComponent(component, {
      bindings,
    });

    compRef.instance.dialogRef = this.dialogRef;

    // Store content component reference for footer button actions
    if (refName === '_contentRef') {
      this._contentComponentRef = compRef;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
