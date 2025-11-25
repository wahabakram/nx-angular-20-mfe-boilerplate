import { Component, inject, signal } from '@angular/core';
import { HorizontalDivider } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { POPOVER_TRIGGER, PopoverTriggerForDirective } from '@ng-mf/components';

@Component({
  selector: 'app-apps-popover',
  imports: [
    HorizontalDivider,
    MatIcon,
    RouterLink
  ],
  templateUrl: './apps-popover.html',
  styleUrl: './apps-popover.scss'
})
export class AppsPopover {
  private popoverTrigger = inject<PopoverTriggerForDirective>(POPOVER_TRIGGER);

  readonly myShopItems = signal([
    {
      name: 'Add Module',
      description: 'Enter the desired module name(s)',
      icon: 'add_shopping_cart',
      link: '/'
    },
    {
      name: 'Product',
      description: 'Go to the page where you want to add',
      icon: 'storefront',
      link: '/'
    }
  ]);
  readonly accountItems = signal([
    {
      name: 'Inventory',
      description: 'Finished goods',
      icon: 'inventory_2',
      link: '/'
    },
    {
      name: 'Payment',
      description: 'Go to e-payment',
      icon: 'payment',
      link: '/'
    },
    {
      name: 'Settings',
      description: 'Configure app settings',
      icon: 'settings',
      link: '/'
    },
    {
      name: 'Users',
      description: 'Manage user access',
      icon: 'group',
      link: '/'
    },
    {
      name: 'Statistics',
      description: 'View data and updates',
      icon: 'analytics',
      link: '/'
    },
    {
      name: 'Logout',
      description: 'Log out of your account',
      icon: 'logout',
      link: '/'
    }
  ]);

  close() {
    this.popoverTrigger.api.close();
  }
}
