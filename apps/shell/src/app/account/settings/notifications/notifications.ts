import { Component, inject } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { HorizontalDivider } from '@ng-mf/components';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [MatSlideToggle, HorizontalDivider, ReactiveFormsModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss'],
})
export class Notifications {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly notificationsForm = this.formBuilder.group({
    desktopNotifications: [false],
    unreadBadge: [false],
    emailCommunication: [false],
    emailAnnouncements: [false],
    disableSounds: [false],
  });

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Account',
        route: '/account/settings',
        type: 'link',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        type: null,
      },
    ]);
    this.notificationsForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((value) => {
        console.log('Form value changed, ready to save:', value);
      });
  }
}
