import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { PanelBody, Panel, PanelHeader } from '@ng-mf/components';
import {
  ActivatedRoute,
  ROUTER_OUTLET_DATA,
  RouterLink,
} from '@angular/router';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LessonBuilder } from '@ng-mf/components';

@Component({
  imports: [
    Panel,
    PanelHeader,
    PanelBody,
    MatIconAnchor,
    RouterLink,
    MatIcon,
    MatTooltip,
    LessonBuilder,
    MatIconButton,
  ],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss',
})
export class Lesson implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  readonly data = inject(ROUTER_OUTLET_DATA) as Signal<{ courseId: string }>;
  readonly loaded = signal(false);
  readonly lesson = signal<any>(null);

  private timer!: any;

  ngOnInit() {
    const lessonId = this.activatedRoute.snapshot.params['id'];
    // Simulate loading lesson details with mock data
    setTimeout(() => {
      const mockLesson = {
        id: lessonId,
        name: 'Mock Lesson',
        moduleItem: {
          module: {
            id: 'mod-' + Math.random().toString(36).slice(2),
            name: 'Introduction',
          },
        },
        // Minimal content structure expected by LessonBuilder
        content: [
          {
            id: 'blk-' + Math.random().toString(36).slice(2),
            type: 'text',
            data: { content: 'Hello, this is a mock lesson.' },
          },
        ],
      };
      this.lesson.set(mockLesson);
      this.loaded.set(true);
    }, 300);
  }

  get courseUrl(): string {
    return `/applications/courses/course/1/content`;
  }

  onChanged(content: any[]) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // Simulate saving content
      // Optionally update local lesson content to reflect save
      const l = this.lesson();
      if (l) {
        this.lesson.set({ ...l, content });
      }
      // No API call, just a mock delay
    }, 1000);
  }
}
