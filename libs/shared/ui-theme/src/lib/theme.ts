import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
export type ThemeName =
  | 'default'
  | 'cupcake'
  | 'synthwave'
  | 'forest'
  | 'aqua'
  | 'sunset'
  | 'retro'
  | 'cyberpunk'
  | 'valentine'
  | 'dracula'
  | 'business'
  | 'nord'
  | 'night'
  | 'coffee';
export type LayoutMode = 'compact' | 'comfortable' | 'spacious';
export type FontSize = 'xs' | 'small' | 'medium' | 'large' | 'xl' | '2xl';

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const AVAILABLE_THEMES: Theme[] = [
  {
    name: 'default',
    displayName: 'Default',
    description: 'Blue theme',
    colors: { primary: '#1976d2', secondary: '#dc004e' },
  },
  {
    name: 'cupcake',
    displayName: 'Cupcake',
    description: 'Pink pastel',
    colors: { primary: '#ff6666', secondary: '#9966ff' },
  },
  {
    name: 'synthwave',
    displayName: 'Synthwave',
    description: 'Neon purple',
    colors: { primary: '#8700b0', secondary: '#0051ff' },
  },
  {
    name: 'retro',
    displayName: 'Retro',
    description: 'Vintage warm',
    colors: { primary: '#f68a2f', secondary: '#897368' },
  },
  {
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
    description: 'Neon yellow',
    colors: { primary: '#fdc01a', secondary: '#e840ff' },
  },
  {
    name: 'valentine',
    displayName: 'Valentine',
    description: 'Pink romantic',
    colors: { primary: '#ff5cae', secondary: '#d786a1' },
  },
  {
    name: 'forest',
    displayName: 'Forest',
    description: 'Deep green',
    colors: { primary: '#006c3c', secondary: '#446b58' },
  },
  {
    name: 'aqua',
    displayName: 'Aqua',
    description: 'Fresh cyan',
    colors: { primary: '#006876', secondary: '#4a6267' },
  },
  {
    name: 'dracula',
    displayName: 'Dracula',
    description: 'Dark purple',
    colors: { primary: '#b69df8', secondary: '#b0a7c0' },
  },
  {
    name: 'business',
    displayName: 'Business',
    description: 'Professional',
    colors: { primary: '#0063aa', secondary: '#585e6b' },
  },
  {
    name: 'nord',
    displayName: 'Nord',
    description: 'Nordic blue',
    colors: { primary: '#6ab3f2', secondary: '#8b949d' },
  },
  {
    name: 'sunset',
    displayName: 'Sunset',
    description: 'Warm orange',
    colors: { primary: '#a33800', secondary: '#b35c00' },
  },
  {
    name: 'night',
    displayName: 'Night',
    description: 'Deep blue',
    colors: { primary: '#5c8fff', secondary: '#8591a9' },
  },
  {
    name: 'coffee',
    displayName: 'Coffee',
    description: 'Brown tones',
    colors: { primary: '#cd8300', secondary: '#85746c' },
  },
];

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Signals for reactive state
  themeMode = signal<ThemeMode>(this.getInitialTheme());
  themeName = signal<ThemeName>(this.getInitialThemeName());
  layoutMode = signal<LayoutMode>(this.getInitialLayout());
  fontSize = signal<FontSize>(this.getInitialFontSize());

  // Get available themes
  availableThemes = AVAILABLE_THEMES;

  constructor() {
    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme(
        this.themeMode(),
        this.themeName(),
        this.layoutMode(),
        this.fontSize()
      );
    });
  }

  private getInitialTheme(): ThemeMode {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'light';
  }

  private getInitialThemeName(): ThemeName {
    const saved = localStorage.getItem('theme-name');
    return (saved as ThemeName) || 'default';
  }

  private getInitialLayout(): LayoutMode {
    const saved = localStorage.getItem('layout-mode');
    return (saved as LayoutMode) || 'comfortable';
  }

  private getInitialFontSize(): FontSize {
    const saved = localStorage.getItem('font-size');
    return (saved as FontSize) || 'medium';
  }

  private applyTheme(
    themeMode: ThemeMode,
    themeName: ThemeName,
    layout: LayoutMode,
    fontSize: FontSize
  ): void {
    const html = document.documentElement;

    // Apply theme mode (light/dark)
    if (themeMode === 'dark') {
      html.classList.add('dark-theme');
    } else {
      html.classList.remove('dark-theme');
    }

    // Apply theme name
    html.classList.remove(
      'theme-default',
      'theme-cupcake',
      'theme-synthwave',
      'theme-forest',
      'theme-aqua',
      'theme-sunset',
      'theme-retro',
      'theme-cyberpunk',
      'theme-valentine',
      'theme-dracula',
      'theme-business',
      'theme-nord',
      'theme-night',
      'theme-coffee'
    );
    html.classList.add(`theme-${themeName}`);

    // Apply layout
    html.classList.remove(
      'layout-compact',
      'layout-comfortable',
      'layout-spacious'
    );
    html.classList.add(`layout-${layout}`);

    // Apply font size
    html.classList.remove(
      'font-xs',
      'font-small',
      'font-medium',
      'font-large',
      'font-xl',
      'font-2xl'
    );
    html.classList.add(`font-${fontSize}`);

    // Save to localStorage
    localStorage.setItem('theme-mode', themeMode);
    localStorage.setItem('theme-name', themeName);
    localStorage.setItem('layout-mode', layout);
    localStorage.setItem('font-size', fontSize);
  }

  setThemeMode(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  setThemeName(name: ThemeName): void {
    this.themeName.set(name);
  }

  setLayoutMode(mode: LayoutMode): void {
    this.layoutMode.set(mode);
  }

  setFontSize(size: FontSize): void {
    this.fontSize.set(size);
  }

  toggleTheme(): void {
    this.setThemeMode(this.themeMode() === 'light' ? 'dark' : 'light');
  }
}
