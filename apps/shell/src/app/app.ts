import {
  Component,
  inputBinding,
  OnInit,
  outputBinding,
  signal,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { Subject } from 'rxjs';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';

@Component({
  imports: [
    RouterModule,
    CommonModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
  ],
  selector: 'mf-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = signal('demo-shell');
  menuDrawer = viewChild.required('drawer', { read: MatDrawer });
  settingsDrawer = viewChild.required('settingsDrawer', { read: MatDrawer });

  header = viewChild.required('header', { read: ViewContainerRef });
  footer = viewChild.required('footer', { read: ViewContainerRef });
  sidenav = viewChild.required('sidenav', { read: ViewContainerRef });
  settings = viewChild.required('settings', { read: ViewContainerRef });

  protected buttonComponent: Type<unknown> | null = null;
  protected settingsComponent: Type<unknown> | null = null;
  protected isLoading = true;

  async ngOnInit() {
    // Footer component
    await this.loadFooterComponent();

    // Header component
    await this.loadHeaderComponent();

    // Sidenav component
    await this.loadSidenavComponent();

    // Settings component
    await this.loadSettingsComponent();
  }

  onButtonClick(): void {
    alert('Button from remote component clicked!');
  }

  async loadFooterComponent(): Promise<void> {
    try {
      const footerComponent = (
        (await loadRemote<typeof import('webcomponents/Footer')>(
          'webcomponents/Footer'
        )) as any
      ).Footer;
      this.footer()?.createComponent(footerComponent, {
        bindings: [inputBinding('appTitle', this.title)],
      });
    } catch (error) {
      console.error('Failed to load remote footer:', error);
    }
  }

  async loadSidenavComponent(): Promise<void> {
    try {
      const sidenavComponent = (
        (await loadRemote<typeof import('webcomponents/Sidenav')>(
          'webcomponents/Sidenav'
        )) as any
      ).Sidenav;
      this.sidenav()?.createComponent(sidenavComponent, {
        bindings: [],
      });
    } catch (error) {
      console.error('Failed to load remote sidenav:', error);
    }
  }

  async loadHeaderComponent(): Promise<void> {
    try {
      const headerComponent = (
        (await loadRemote<typeof import('webcomponents/Header')>(
          'webcomponents/Header'
        )) as any
      ).Header;
      this.header()?.createComponent(headerComponent, {
        bindings: [
          outputBinding('menuToggle', () => {
            this.menuDrawer().toggle();
          }),
          outputBinding('settingsToggle', () => {
            this.settingsDrawer().toggle();
          }),
        ],
      });
    } catch (error) {
      console.error('Failed to load remote header:', error);
    }
  }

  async loadSettingsComponent(): Promise<void> {
    try {
      const settingsComponent = (
        (await loadRemote<typeof import('webcomponents/SettingsDrawer')>(
          'webcomponents/SettingsDrawer'
        )) as any
      ).SettingsDrawer;
      this.settings()?.createComponent(settingsComponent, {
        bindings: [],
      });
    } catch (error) {
      console.error('Failed to load remote settings:', error);
    }
  }
}
