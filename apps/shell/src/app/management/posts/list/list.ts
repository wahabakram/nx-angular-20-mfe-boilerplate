import { Component, inject, signal } from '@angular/core';
import {
  PanelBody,
  Panel,
  PanelHeader
} from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Datatable } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { ActionsCell } from '@/management/posts/_cells/actions-cell/actions-cell';

export interface PostItem {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  createdAt: string; // e.g., '2025-08-01'
  updatedAt: string;
  views: number;
  comments: number;
  actions: any;
}

@Component({
  selector: 'app-list',
  imports: [
    Panel,
    PanelHeader,
    PanelBody,
    Datatable,
    MatButton,
    RouterLink,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  // TanStack Table columns configuration
  columns = signal<ColumnDef<PostItem>[]>([
    { header: 'Title', accessorKey: 'title', size: 320 },
    { header: 'Author', accessorKey: 'author', size: 160 },
    { header: 'Category', accessorKey: 'category', size: 140 },
    { header: 'Status', accessorKey: 'status', size: 120 },
    { header: 'Created', accessorKey: 'createdAt', size: 140 },
    { header: 'Updated', accessorKey: 'updatedAt', size: 140 },
    { header: 'Views', accessorKey: 'views', size: 100 },
    { header: 'Comments', accessorKey: 'comments', size: 110 },
    {
      header: '',
      accessorKey: 'actions',
      size: 150,
      cell: () => {
        return flexRenderComponent(ActionsCell, {
          inputs: {}
        })
      },
    }
  ]);

  // 100 mock posts
  data = signal<PostItem[]>(createMockPosts(100));

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'home',
        name: 'Posts',
        route: '/management/posts/list',
        type: 'link',
      },
      {
        id: 'allPosts',
        name: 'All Posts',
        type: null
      }
    ]);
  }
}

function createMockPosts(count: number): PostItem[] {
  const authors = ['Alice Johnson', 'Bob Smith', 'Charlie Lee', 'Diana Prince', 'Ethan Clark', 'Fiona Liu', 'George Martin', 'Hannah Kim', 'Ivan Petrov', 'Julia Roberts'];
  const categories = ['Technology', 'Design', 'Business', 'Marketing', 'Lifestyle', 'Health', 'Travel', 'Education', 'Finance', 'Culture'];
  const statuses: PostItem['status'][] = ['draft', 'published', 'scheduled', 'archived'];

  const today = new Date('2025-08-22T12:00:00Z');
  const posts: PostItem[] = [];

  for (let i = 1; i <= count; i++) {
    const author = authors[i % authors.length];
    const category = categories[(i * 3) % categories.length];
    const status = statuses[i % statuses.length];

    const created = new Date(today);
    created.setDate(created.getDate() - (i % 365));
    const updated = new Date(created);
    updated.setDate(updated.getDate() + (i % 30));

    const titlePrefixes = ['Exploring', 'Understanding', 'Top', 'How to', 'The Future of', 'Beginner’s Guide to', 'Advanced', 'Practical', 'Comprehensive', 'Essential'];
    const titleSubjects = ['Angular Signals', 'TypeScript Generics', 'UI/UX Patterns', 'SEO Strategies', 'Cloud Architecture', 'Microservices', 'AI Tools', 'Productivity Hacks', 'Design Systems', 'Web Performance'];

    const prefix = titlePrefixes[i % titlePrefixes.length];
    const subject = titleSubjects[(i * 7) % titleSubjects.length];

    posts.push({
      id: i,
      title: `${prefix} ${subject} ${i}`,
      author,
      category,
      status,
      createdAt: created.toISOString().slice(0, 10),
      updatedAt: updated.toISOString().slice(0, 10),
      views: Math.floor(100 + (i * 37) % 5000),
      comments: Math.floor((i * 13) % 120),
      actions: null
    });
  }

  // Shuffle a bit for variety
  return posts.sort(() => Math.random() - 0.5);
}
