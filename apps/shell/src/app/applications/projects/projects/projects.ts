import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Project } from '@/applications/projects/project/project';
import { ProjectDataService } from '@/applications/projects/project-data.service';
import { Page } from '@/_partials/page/page';
import { PROJECTS } from '@/applications/projects/mock-data';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-projects',
  imports: [
    Project,
    Page,
    Page,
    MatIcon
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  public readonly projectService = inject(ProjectDataService);
  public readonly projects = signal(PROJECTS);
  public readonly projectCount = computed(() => this.projects().length);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'projects',
        name: 'Projects',
        type: null
      }
    ]);
  }
}
