import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';

interface GettingStartedItem {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly link: string;
}

@Component({
  selector: 'app-getting-started-widget',
  imports: [
    MatIcon,
    RouterLink,
    MatIconButton
  ],
  templateUrl: './getting-started-widget.html',
  styleUrl: './getting-started-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class GettingStartedWidget {
  isExpanded = signal(true);

  items = signal<readonly GettingStartedItem[]>([
    {
      icon: 'school',
      title: 'Create your first course',
      subtitle: 'Learn how to create a course',
      link: '/',
    },
    {
      icon: 'palette',
      title: 'Customize your app theme',
      subtitle: 'Learn how to customize',
      link: '/',
    },
    {
      icon: 'monetization_on',
      title: 'Connect a payment gateway',
      subtitle: 'Quick start guide',
      link: '/',
    },
    {
      icon: 'mail',
      title: 'Set up a welcome email for new users',
      subtitle: 'Learn how to set up a welcome email',
      link: '/',
    },
    {
      icon: 'notifications',
      title: 'Set up notifications',
      subtitle: 'Learn how to set up notifications',
      link: '/',
    },
  ]);

  toggleExpansion(): void {
    this.isExpanded.update((currentValue) => !currentValue);
  }
}
