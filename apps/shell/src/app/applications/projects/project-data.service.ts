import { Injectable, signal } from '@angular/core';
import { IProject } from '@/applications/projects/project-model';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private readonly projectsState = signal<IProject[]>([]);

  public readonly projects = this.projectsState.asReadonly();

  public deleteProject(id: any): void {
    this.projectsState.update(currentProjects =>
      currentProjects.filter(project => project.id !== id)
    );
  }

  public addProject(): void {
  }

  public editProject(id: any): void {
  }
}
