import { Component, forwardRef, signal } from '@angular/core';
import { NAVIGATION_GROUP } from '../types';

let nextId = 0;

@Component({
  selector: 'mf-navigation-group',
  exportAs: 'mfNavigationGroup',
  templateUrl: './navigation-group.html',
  styleUrl: './navigation-group.scss',
  providers: [
    {
      provide: NAVIGATION_GROUP,
      useExisting: forwardRef(() => NavigationGroup)
    }
  ],
  host: {
    'class': 'mf-navigation-group'
  }
})
export class NavigationGroup {
  readonly key = signal(`mf-navigation-group-${nextId++}`);
}
