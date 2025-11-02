import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../icon/icon';

@Component({
  selector: 'mfc-footer',
  imports: [CommonModule, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected currentYear = new Date().getFullYear();
}
