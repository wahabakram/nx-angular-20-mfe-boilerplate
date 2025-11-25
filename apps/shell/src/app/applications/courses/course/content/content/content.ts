import { Component, inject, signal, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { OverlayScrollbar } from '@ng-mf/components';
import { CourseBuilder } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [OverlayScrollbar, CourseBuilder],
  templateUrl: './content.html',
  styleUrl: './content.scss',
})
export class Content {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly data = inject(ROUTER_OUTLET_DATA) as Signal<{ courseId: string }>;
  readonly loaded = signal(false);
  readonly course = signal<any>(null);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'courses',
        name: 'Courses',
        route: '/applications/courses/list',
        type: 'link',
      },
      {
        id: 'createNewCourse',
        name: 'Create New Course',
        type: null,
      },
    ]);
  }

  private _id(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  ngOnInit() {
    // Simulate loading course details with mock data
    setTimeout(() => {
      const mockCourse = {
        id: this.data().courseId,
        name: 'Mock Course',
        modules: [
          {
            id: this._id(),
            name: 'Introduction',
            items: [
              {
                type: 'lesson',
                lesson: {
                  id: this._id(),
                  name: 'Welcome',
                },
              },
            ],
          },
        ],
      };
      this.course.set(mockCourse);
      this.loaded.set(true);
    }, 300);
  }
}
