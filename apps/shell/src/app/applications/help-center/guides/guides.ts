import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Container } from '@/_partials/container/container';

interface ResourceLink {
  title: string;
  url: string;
}

interface ResourceSection {
  title: string;
  links: ResourceLink[];
  showViewAll: boolean;
}

@Component({
  imports: [
    MatIcon,
    RouterLink,
    Container
  ],
  templateUrl: './guides.html',
  styleUrl: './guides.scss'
})
export class Guides {
  sections: ResourceSection[] = [
    {
      title: 'Getting Started',
      showViewAll: true,
      links: [
        { title: 'What is this app?', url: '#' },
        { title: 'Start using the app', url: '#' },
        { title: 'Signing in to the dashboard', url: '#' },
        { title: 'Navigating within the app', url: '#' },
      ],
    },
    {
      title: 'Projects',
      showViewAll: true,
      links: [
        { title: 'Creating a project', url: '#' },
        { title: 'Renaming a project', url: '#' },
        { title: 'Displaying a project', url: '#' },
        { title: 'Deleting a project', url: '#' },
      ],
    },
    {
      title: 'Settings',
      showViewAll: true,
      links: [
        { title: 'General settings', url: '#' },
        { title: 'Project settings', url: '#' },
        { title: 'Media settings', url: '#' },
        { title: 'Domain settings', url: '#' },
      ],
    },
    {
      title: 'Payments',
      showViewAll: false,
      links: [
        { title: 'Subscriptions', url: '#' },
        { title: 'Discounts', url: '#' },
        { title: 'Payment methods', url: '#' },
        { title: 'Overdue payments', url: '#' },
      ],
    },
    {
      title: 'Your Account',
      showViewAll: true,
      links: [
        { title: 'Changing your username', url: '#' },
        { title: 'Changing your email', url: '#' },
        { title: 'Changing your password', url: '#' },
        { title: 'Closing your account', url: '#' },
      ],
    },
  ];
}
