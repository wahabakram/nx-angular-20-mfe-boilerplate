import { Component, inject } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HorizontalDivider } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [MatSlideToggle, ReactiveFormsModule, HorizontalDivider],
  templateUrl: './notifications-2.html',
  styleUrl: './notifications-2.scss',
})
export class Notifications2 {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly notificationsForm = this.formBuilder.group({
    alerts: this.formBuilder.group({
      communication: [true],
      security: [true],
      meetups: [false],
    }),
    accountActivity: this.formBuilder.group({
      comments: [false],
      mentions: [true],
      follows: [true],
      jobReplies: [true],
    }),
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
