import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

export interface IHeadingWidget {
  title: string;
  viewMore?: {
    link: string;
    name: string;
    external: boolean;
  };
}

@Component({
  selector: 'app-heading-widget',
  imports: [RouterLink],
  templateUrl: './heading-widget.html',
  styleUrl: './heading-widget.scss',
})
export class HeadingWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input.required<IHeadingWidget>();

  ngOnInit() {}

  protected get external(): boolean {
    return this.widget().viewMore?.external || false;
  }
}
