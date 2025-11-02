import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'mfc-divider-content',
  exportAs: 'mfcDividerContent',
  imports: [
    MatDivider
  ],
  templateUrl: './divider-content.html',
  styleUrl: './divider-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerContent {

}
