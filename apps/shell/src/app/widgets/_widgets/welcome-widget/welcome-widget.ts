import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-welcome-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './welcome-widget.html',
  styleUrl: './welcome-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'widget-container'
  }
})
export class WelcomeWidget {
  id = input();
  widget = input();
}
