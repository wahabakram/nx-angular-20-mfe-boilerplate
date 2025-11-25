import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import {
  courseBenefitsMock, courseContentMock, courseDescriptionMock,
  courseDetailsMock, courseIncludesMock, courseRequirementsMock, relatedTopicsMock,
  courseReviewsMock
} from './mock-data';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Dicebear } from '@ng-mf/components';

@Component({
  selector: 'app-course-details',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIcon,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    DecimalPipe,
    Dicebear,
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetails {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private dialog = inject(MatDialog);
  @ViewChild('reportDialog') reportDialog?: TemplateRef<unknown>;
  readonly selectedReviewName = signal<string | null>(null);

  readonly course = signal(courseDetailsMock);

  benefits = courseBenefitsMock;
  readonly relatedTopics = relatedTopicsMock;
  readonly courseIncludes = courseIncludesMock;

  readonly contentSections = courseContentMock;
  readonly requirements = courseRequirementsMock;
  readonly description = courseDescriptionMock;
  readonly reviews = courseReviewsMock;

  // Instructor mock data moved from template into TS variables
  readonly instructor = {
    name: 'Alex Johnson',
    fullTitle: 'Alex Johnson | Senior Full-Stack Engineer & Instructor',
    tagline: 'Teaching React, TypeScript, Node.js, and scalable architecture',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
    rating: 4.8,
    reviews: 152340,
    students: 540000,
    courses: 24,
    bio: 'Alex is a senior full-stack engineer who has led teams building high‑traffic web apps. He teaches modern React, TypeScript, Node.js, and DevOps practices with a focus on real-world architecture and maintainability.',
  } as const;

  // Returns array of 5 entries: 'full' | 'half' | 'empty' according to rating value
  getStars(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    let remaining = Math.max(0, Math.min(5, rating));
    for (let i = 0; i < 5; i++) {
      if (remaining >= 1) {
        stars.push('full');
      } else if (remaining >= 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
      remaining -= 1;
    }
    return stars;
  }

  // UI state for showing limited sections with a "more sections" button
  readonly showAllSections = signal(false);
  readonly totalSections = computed(() => this.contentSections.length);
  readonly remainingCount = computed(() => Math.max(0, this.totalSections() - 10));
  readonly visibleSections = computed(() => this.showAllSections() ? this.contentSections : this.contentSections.slice(0, 10));

  openReport(rev?: { name: string }): void {
    this.selectedReviewName.set(rev?.name ?? null);
    if (this.reportDialog) {
      this.dialog.open(this.reportDialog, {
        width: '560px',
        autoFocus: false,
      });
    }
  }

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'courseDetails',
        name: 'Course Details',
        type: null
      }
    ]);
  }
}
