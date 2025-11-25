import { Component, output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '@ng-mf/theme';

@Component({
  selector: 'mf-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private themeService = inject(ThemeService);
  
  menuToggle = output<void>();
  settingsToggle = output<void>();

  currentTheme = this.themeService.themeMode;

  onMenuToggle() {
    this.menuToggle.emit();
  }

  onSettingsToggle() {
    this.settingsToggle.emit();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    return this.currentTheme() === 'light' ? 'dark_mode' : 'light_mode';
  }
}
