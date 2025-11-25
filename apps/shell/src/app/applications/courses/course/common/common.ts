import { Component, computed, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Navigation, NavigationItem } from '@ng-mf/components';
import { PanelBody, Panel, PanelHeader, PanelSidebar } from '@ng-mf/components';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TimeAgoPipe } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-common',
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    Navigation,
    NavigationItem,
    PanelBody,
    Panel,
    PanelHeader,
    PanelSidebar,
    RouterLink,
    TimeAgoPipe,
    RouterOutlet,
  ],
  templateUrl: './common.html',
  styleUrl: './common.scss',
})
export class Common {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private activatedRoute = inject(ActivatedRoute);

  readonly navItems = signal<any[]>([]);
  readonly loading = signal(true);
  readonly course = signal<any>({
    id: 1,
    name: 'Course Name',
    status: { type: 'draft' },
    updatedAt: null,
  });
  readonly saving = signal<any>(false);
  readonly courseId = computed(() => {
    return this.activatedRoute.snapshot.params['id'];
  });

  ngOnInit() {
    this.loading.set(false);
  }

  publish() {}

  constructor() {
    this.navItems.set([
      {
        key: 'overview',
        name: 'Overview',
        route: ['/applications/courses/course', this.courseId(), 'overview'],
      },
      {
        key: 'content',
        name: 'Content',
        route: ['/applications/courses/course', this.courseId(), 'content'],
      },
      {
        key: 'settings',
        name: 'Settings',
        route: ['/applications/courses/course', this.courseId(), 'settings'],
      },
      {
        key: 'analytics',
        name: 'Analytics',
        route: ['/applications/courses/course', this.courseId(), 'analytics'],
      },
      {
        key: 'landing',
        name: 'Landing',
        route: ['/applications/courses/course', this.courseId(), 'landing'],
      },
      {
        key: 'students',
        name: 'Students',
        route: ['/applications/courses/course', this.courseId(), 'students'],
      },
    ]);
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'courses',
        name: 'Create New Course',
        type: null,
      },
    ]);
  }
}
