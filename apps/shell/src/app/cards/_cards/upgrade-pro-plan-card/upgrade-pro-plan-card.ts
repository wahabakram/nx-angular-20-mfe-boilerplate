import { ChangeDetectionStrategy, Component, ElementRef, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-upgrade-pro-plan-card',
  imports: [
    RouterLink,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './upgrade-pro-plan-card.html',
  styleUrl: './upgrade-pro-plan-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'card-container'
  }
})
export class UpgradeProPlanCard {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly dismiss = output<void>();

  protected onDismiss(): void {
    this.dismiss.emit();
    this.elementRef.nativeElement.remove();
  }
}
