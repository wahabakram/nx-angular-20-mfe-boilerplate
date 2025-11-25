import { Component, inject, signal } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatPrefix } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { BreadcrumbsStore } from '@ng-mf/components';

type HelpCategory = {
  readonly icon: string;
  readonly title: string;
  readonly tags: readonly string[];
};

type CommonQuestion = {
  readonly text: string;
  readonly link: string;
};

@Component({
  imports: [
    MatIcon,
    MatCardContent,
    MatCard,
    MatFormField,
    MatInput,
    MatPrefix,
    MatFabButton
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly helpCategories = signal<readonly HelpCategory[]>([
    { icon: 'people', title: 'Community', tags: ['Share', 'Discussion', 'Network'] },
    { icon: 'description', title: 'Orders', tags: ['Tracking', 'Delivery', 'Management'] },
    { icon: 'published_with_changes', title: 'Return and Refund', tags: ['Methods', 'Process'] },
    { icon: 'person', title: 'Account Issues', tags: ['Profile', 'Settings', 'Password'] },
    { icon: 'insights', title: 'Business Help', tags: ['Dashboard', 'Reports', 'Logistics'] },
    { icon: 'payment', title: 'Payment', tags: ['Methods', 'VAT', 'Security'] },
    { icon: 'privacy_tip', title: 'Security & Privacy', tags: ['2FA', 'Data', 'GDPR'] },
    { icon: 'video_library', title: 'Guides', tags: ['Tutorials', 'Blogs', 'Newsletters'] },
    { icon: 'quiz', title: 'FAQ', tags: ['Help', 'Articles'] }
  ]);
  readonly commonQuestions = signal<readonly CommonQuestion[]>([
    { text: 'How do I reset my password?', link: '#' },
    { text: 'What payment methods are accepted?', link: '#' },
    { text: 'Where can I track my order status?', link: '#' },
    { text: 'What is your return policy?', link: '#' },
    { text: 'Can I change my shipping address after placing an order?', link: '#' },
    { text: 'How do I update my account information?', link: '#' },
    { text: 'Where can I find my past invoices?', link: '#' },
    { text: 'How do I reset my password?', link: '#' },
    { text: 'What payment methods are accepted?', link: '#' },
    { text: 'Where can I track my order status?', link: '#' },
    { text: 'What is your return policy?', link: '#' },
    { text: 'Can I change my shipping address after placing an order?', link: '#' },
    { text: 'How do I update my account information?', link: '#' },
    { text: 'Where can I find my past invoices?', link: '#' }
  ]);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'contacts',
        name: 'Help Center',
        type: null
      }
    ]);
  }
}
