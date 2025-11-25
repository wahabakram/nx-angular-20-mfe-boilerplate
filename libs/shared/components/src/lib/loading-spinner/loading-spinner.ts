import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LoadingSpinnerConfig {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  message?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

@Component({
  selector: 'mf-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinner {
  // Inputs
  config = input<LoadingSpinnerConfig>({});

  // Computed properties
  defaultConfig = computed(() => ({
    size: 'md' as const,
    variant: 'spinner' as const,
    color: 'primary' as const,
    message: '',
    overlay: false,
    fullScreen: false,
    ...this.config()
  }));

  containerClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['mf-loading-spinner'];

    if (config.overlay) {
      classes.push('loading-overlay');
    }

    if (config.fullScreen) {
      classes.push('loading-fullscreen');
    }

    return classes.join(' ');
  });

  spinnerClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['loading'];

    // Variant classes
    switch (config.variant) {
      case 'spinner':
        classes.push('loading-spinner');
        break;
      case 'dots':
        classes.push('loading-dots');
        break;
      case 'ring':
        classes.push('loading-ring');
        break;
      case 'ball':
        classes.push('loading-ball');
        break;
      case 'bars':
        classes.push('loading-bars');
        break;
      case 'infinity':
        classes.push('loading-infinity');
        break;
    }

    // Size classes
    switch (config.size) {
      case 'xs':
        classes.push('loading-xs');
        break;
      case 'sm':
        classes.push('loading-sm');
        break;
      case 'md':
        classes.push('loading-md');
        break;
      case 'lg':
        classes.push('loading-lg');
        break;
      case 'xl':
        classes.push('loading-xl');
        break;
    }

    // Color classes
    switch (config.color) {
      case 'primary':
        classes.push('text-primary');
        break;
      case 'secondary':
        classes.push('text-secondary');
        break;
      case 'accent':
        classes.push('text-accent');
        break;
      case 'neutral':
        classes.push('text-neutral');
        break;
      case 'info':
        classes.push('text-info');
        break;
      case 'success':
        classes.push('text-success');
        break;
      case 'warning':
        classes.push('text-warning');
        break;
      case 'error':
        classes.push('text-error');
        break;
    }

    return classes.join(' ');
  });

  messageClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['loading-message', 'text-base-content/70'];

    // Message size based on spinner size
    switch (config.size) {
      case 'xs':
        classes.push('text-xs');
        break;
      case 'sm':
        classes.push('text-sm');
        break;
      case 'md':
        classes.push('text-base');
        break;
      case 'lg':
        classes.push('text-lg');
        break;
      case 'xl':
        classes.push('text-xl');
        break;
    }

    return classes.join(' ');
  });
}