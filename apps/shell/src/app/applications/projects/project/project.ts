import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IProject } from '@/applications/projects/project-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [
    NgOptimizedImage,
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card-container'
  }
})
export class Project {
  public project = input.required<IProject>();

  public readonly edit = output<number>();
  public readonly delete = output<number>();
}
