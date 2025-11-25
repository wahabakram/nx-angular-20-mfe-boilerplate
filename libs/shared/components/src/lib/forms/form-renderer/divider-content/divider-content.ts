import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'mf-divider-content',
  exportAs: 'mfDividerContent',
  imports: [
    MatDivider
  ],
  templateUrl: './divider-content.html',
  styleUrl: './divider-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerContent {

}
