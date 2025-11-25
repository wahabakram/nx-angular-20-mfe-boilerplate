import { Component, inject, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    Dashboard
  ],
  templateUrl: './explore.html',
  styleUrl: './explore.scss'
})
export class Explore {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  configs = signal<WidgetConfig[]>([
    {
      type: 'explore-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/explore-widget/explore-widget').then(c => c.ExploreWidget)
    },
    {
      type: 'heading-widget',
      skeleton: null,
      plain: true,
      component: () =>
        import('@/widgets/_widgets/heading-widget/heading-widget').then(c => c.HeadingWidget)
    },
    {
      type: 'action-required-widget',
      skeleton: null,
      plain: true,
      component: () =>
        import('@/widgets/_widgets/action-required-widget/action-required-widget').then(c => c.ActionRequiredWidget)
    },
    {
      type: 'article-snippet-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/article-snippet-widget/article-snippet-widget').then(c => c.ArticleSnippetWidget)
    },
  ]);
  items = signal<WidgetItem[]>([
    {
      id: 20,
      type: 'action-required-widget',
      columns: 12,
      widget: {
        description: 'Please provide your company details to access our services seamlessly, whether forming a new company or adding existing information.',
        buttonText: 'Fix the problem',
      }
    },
    {
      id: 1,
      type: 'explore-widget',
      columns: 4,
      widget: {
        iconName: 'hub',
        title: 'Community',
        description: 'Connect with other Makers, exchange ideas and tips.',
      }
    },
    {
      id: 2,
      type: 'explore-widget',
      columns: 4,
      widget: {
        iconName: 'school',
        title: 'Academy',
        description: 'Level up your developer skills.',
      }
    },
    {
      id: 3,
      type: 'explore-widget',
      columns: 4,
      widget: {
        iconName: 'question_mark',
        title: 'Help Center',
        description: 'Explore our detailed documentation.',
      }
    },
    {
      id: 4,
      type: 'explore-widget',
      columns: 4,
      widget: {
        iconName: 'group',
        title: 'Mentor Directory',
        description: 'Find the perfect mentor to support your business.',
      }
    },
    {
      id: 4,
      type: 'explore-widget',
      columns: 4,
      widget: {
        iconName: 'menu_book',
        title: 'Blog',
        description: 'Access popular guides & stories about automation.',
      }
    },
    {
      id: 5,
      type: 'explore-widget',
      columns: 4,
      widget: {
        iconName: 'leaderboard',
        title: 'Use Cases',
        description: 'Get inspired by all the ways you can automate.',
      }
    },
    {
      id: 6,
      type: 'heading-widget',
      columns: 12,
      widget: {
        title: 'Blog articles',
        viewMore: {
          name: 'Browse all',
          link: '/content/posts/list',
        }
      }
    },
    {
      id: 7,
      type: 'article-snippet-widget',
      columns: 4,
      widget: {
        title: 'The Must-Have SEO Checklist for Developers For 2025',
        imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
        publishedAt: new Date(),
      }
    },
    {
      id: 8,
      type: 'article-snippet-widget',
      columns: 4,
      widget: {
        title: 'Build a Distributed Task Scheduler Using RabbitMQ and Redis',
        imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
        publishedAt: new Date(),
      }
    },
    {
      id: 9,
      type: 'article-snippet-widget',
      columns: 4,
      widget: {
        title: 'How to retrieve values from all types of HTML Inputs in JavaScript',
        imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
        publishedAt: new Date(),
      }
    },
    {
      id: 10,
      type: 'article-snippet-widget',
      columns: 4,
      widget: {
        title: 'Mastering Async/Await and DOM Manipulation',
        imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
        publishedAt: new Date(),
      }
    },
    {
      id: 11,
      type: 'article-snippet-widget',
      columns: 4,
      widget: {
        title: '20 senior Angular developer interview questions and answers',
        imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
        publishedAt: new Date(),
      }
    },
    {
      id: 12,
      type: 'article-snippet-widget',
      columns: 4,
      widget: {
        title: 'Master clean code principles and best practices',
        imagePreviewUrl: 'assets/widgets/article-snippet-preview.png',
        publishedAt: new Date(),
      }
    },
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
        id: 'explore',
        name: 'Explore',
        type: null
      }
    ]);
  }
}
