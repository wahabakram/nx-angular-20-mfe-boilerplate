import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { ThemeService, LayoutMode, FontSize, ThemeName } from '@ng-mf/theme';

@Component({
  selector: 'mfc-settings-drawer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatRippleModule,
    MatSliderModule,
  ],
  templateUrl: './settings-drawer.html',
  styleUrl: './settings-drawer.scss',
})
export class SettingsDrawer {
  themeService = inject(ThemeService);

  // Computed signals for current settings
  currentTheme = computed(() => this.themeService.themeName());
  currentLayout = computed(() => this.themeService.layoutMode());
  currentFontSize = computed(() => this.themeService.fontSize());

  // Font size slider value (0 = xs, 1 = small, 2 = medium, 3 = large, 4 = xl, 5 = 2xl)
  fontSizeValue = computed(() => {
    const size = this.currentFontSize();
    switch (size) {
      case 'xs':
        return 0;
      case 'small':
        return 1;
      case 'medium':
        return 2;
      case 'large':
        return 3;
      case 'xl':
        return 4;
      case '2xl':
        return 5;
      default:
        return 2;
    }
  });

  onThemeChange(theme: ThemeName): void {
    this.themeService.setThemeName(theme);
  }

  onLayoutChange(layout: LayoutMode): void {
    this.themeService.setLayoutMode(layout);
  }

  onFontSizeChange(fontSize: FontSize): void {
    this.themeService.setFontSize(fontSize);
  }

  onFontSizeSliderChange(value: number): void {
    const fontSizeMap: Record<number, FontSize> = {
      0: 'xs',
      1: 'small',
      2: 'medium',
      3: 'large',
      4: 'xl',
      5: '2xl',
    };
    const fontSize = fontSizeMap[value] || 'medium';
    this.themeService.setFontSize(fontSize);
  }

  formatFontSizeLabel = (value: number): string => {
    const labels: Record<number, string> = {
      0: 'XS',
      1: 'Small',
      2: 'Medium',
      3: 'Large',
      4: 'XL',
      5: '2XL',
    };
    return labels[value] || 'Medium';
  };
}
