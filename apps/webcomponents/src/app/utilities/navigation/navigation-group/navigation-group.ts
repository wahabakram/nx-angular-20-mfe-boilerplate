import { Component, forwardRef, signal } from '@angular/core';
import { NAVIGATION_GROUP } from '../types';

let nextId = 0;

@Component({
  selector: 'mfc-navigation-group',
  exportAs: 'mfcNavigationGroup',
  templateUrl: './navigation-group.html',
  styleUrl: './navigation-group.scss',
  providers: [
    {
      provide: NAVIGATION_GROUP,
      useExisting: forwardRef(() => NavigationGroup)
    }
  ],
  host: {
    'class': 'mfc-navigation-group'
  }
})
export class NavigationGroup {
  readonly key = signal(`mfc-navigation-group-${nextId++}`);
}
