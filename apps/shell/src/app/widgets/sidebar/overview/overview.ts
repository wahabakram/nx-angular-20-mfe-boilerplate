import { Component } from '@angular/core';
import { GoToPremiumWidgetExample } from '../_examples/go-to-premium-widget-example/go-to-premium-widget-example';
import { ToolbarWidgetExample } from '../_examples/toolbar-widget-example/toolbar-widget-example';
import { ToolbarAWidgetExample } from '../_examples/toolbar-a-widget-example/toolbar-a-widget-example';
import { UpgradeNowWidgetExample } from '../_examples/upgrade-now-widget-example/upgrade-now-widget-example';
import { UpgradeToProWidgetExample } from '../_examples/upgrade-to-pro-widget-example/upgrade-to-pro-widget-example';
import { UsedSpaceWidgetExample } from '../_examples/used-space-widget-example/used-space-widget-example';
import { Page } from '@/meta/page/page';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { Playground } from '@/meta/playground/playground';

@Component({
  imports: [
    Page,
    PageContentDirective,
    Playground,
    GoToPremiumWidgetExample,
    ToolbarWidgetExample,
    ToolbarAWidgetExample,
    UpgradeNowWidgetExample,
    UpgradeToProWidgetExample,
    UsedSpaceWidgetExample,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {}
