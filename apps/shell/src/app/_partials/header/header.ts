import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Dicebear } from '@ng-mf/components';
import { SoundEffectDirective } from '@ng-mf/components';
import { Popover, PopoverTriggerForDirective } from '@ng-mf/components';
import { LayoutApi } from '@ng-mf/components';
import { Drawer } from '@ng-mf/components';
import {
  ColorSchemeDarkDirective,
  ColorSchemeLightDirective,
  ColorSchemeSwitcher,
} from '@ng-mf/components';
import { NotificationsPopover } from '@/components/notifications-popover/notifications-popover';
import { Chat } from '@/components/chat/chat/chat';
import { Icon } from '@ng-mf/components';
import {
  BreadcrumbItemNameDefDirective,
  BreadcrumbsGlobal,
} from '@ng-mf/components';
import { AppsPopover } from '@/components/apps-popover/apps-popover';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatIconButton,
    MatBadge,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    Dicebear,
    MatDivider,
    MatButton,
    MatTooltip,
    RouterLink,
    MatAnchor,
    SoundEffectDirective,
    NotificationsPopover,
    PopoverTriggerForDirective,
    Drawer,
    Chat,
    ColorSchemeDarkDirective,
    ColorSchemeLightDirective,
    ColorSchemeSwitcher,
    Icon,
    BreadcrumbsGlobal,
    BreadcrumbItemNameDefDirective,
    Popover,
    AppsPopover,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'block w-full',
  },
})
export class Header {
  private _layoutApi = inject(LayoutApi);

  sidebarShown = computed(() => {
    return this._layoutApi.isSidebarShown('root');
  });
  isFavorite = signal(false);

  toggleSidebar(): void {
    if (this.sidebarShown()) {
      this._layoutApi.hideSidebar('root');
    } else {
      this._layoutApi.showSidebar('root');
    }
  }

  toggleFavorite(): void {
    this.isFavorite.update((value) => !value);
  }
}
