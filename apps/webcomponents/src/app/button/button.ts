import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';

@Component({
  selector: 'mfc-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  label = input<string>('Click me');
  icon = input<string>('');
  color = input<'primary' | 'accent' | 'warn'>('primary');
  disabled = input<boolean>(false);

  // Keep output for normal usage
  clicked = output<void>();

  // Add Subject input for NgComponentOutlet usage (when outputs can't be bound)
  clickHandler = input<Subject<void>>();

  onClick(): void {
    // Emit to output for normal usage
    this.clicked.emit();

    // Emit to Subject if provided (for NgComponentOutlet)
    const handler = this.clickHandler();
    if (handler) {
      handler.next();
    }
  }
}
