import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

export interface NotFoundConfig {
  title?: string;
  message?: string;
  icon?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  backButtonText?: string;
  homeButtonText?: string;
  customActions?: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link';
  }>;
  variant?: 'default' | 'minimal' | 'illustration';
  size?: 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'mfc-not-found',
  imports: [CommonModule, Icon],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  // Inputs
  config = input<NotFoundConfig>({});

  // Outputs
  backClicked = output<void>();
  homeClicked = output<void>();
  actionClicked = output<string>();

  // Computed properties
  defaultConfig = computed(() => ({
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist or has been moved.',
    icon: 'solar:card-search-line-duotone',
    showBackButton: true,
    showHomeButton: true,
    backButtonText: 'Go Back',
    homeButtonText: 'Go Home',
    customActions: [],
    variant: 'default' as const,
    size: 'md' as const,
    ...this.config(),
  }));

  containerClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = [
      'mfc-not-found',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'text-center',
    ];

    // Size classes
    switch (config.size) {
      case 'sm':
        classes.push('py-8', 'px-4');
        break;
      case 'lg':
        classes.push('py-16', 'px-8');
        break;
      default:
        classes.push('py-12', 'px-6');
    }

    // Variant classes
    switch (config.variant) {
      case 'minimal':
        classes.push('min-h-[50vh]');
        break;
      case 'illustration':
        classes.push('min-h-[70vh]');
        break;
      default:
        classes.push('min-h-[100vh]');
    }

    return classes.join(' ');
  });

  iconClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['text-base-content/40', 'mb-6'];

    // Icon size based on component size
    switch (config.size) {
      case 'sm':
        classes.push('size-16');
        break;
      case 'lg':
        classes.push('size-32');
        break;
      default:
        classes.push('size-24');
    }

    return classes.join(' ');
  });

  titleClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['font-bold', 'text-base-content', 'mb-4'];

    // Title size based on component size
    switch (config.size) {
      case 'sm':
        classes.push('text-xl');
        break;
      case 'lg':
        classes.push('text-4xl');
        break;
      default:
        classes.push('text-2xl');
    }

    return classes.join(' ');
  });

  messageClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['text-base-content/70', 'mb-8', 'max-w-md', 'mx-auto'];

    // Message size based on component size
    switch (config.size) {
      case 'sm':
        classes.push('text-sm');
        break;
      case 'lg':
        classes.push('text-lg');
        break;
      default:
        classes.push('text-base');
    }

    return classes.join(' ');
  });

  actionContainerClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['flex', 'flex-wrap', 'gap-3', 'justify-center'];

    // Layout adjustment for variant
    if (config.variant === 'minimal') {
      classes.push('flex-col', 'items-center');
    }

    return classes.join(' ');
  });

  onBackClick(): void {
    this.backClicked.emit();
  }

  onHomeClick(): void {
    this.homeClicked.emit();
  }

  onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }

  getButtonClass(variant = 'primary'): string {
    const baseClasses = ['btn'];

    switch (variant) {
      case 'secondary':
        baseClasses.push('btn-secondary');
        break;
      case 'accent':
        baseClasses.push('btn-accent');
        break;
      case 'ghost':
        baseClasses.push('btn-ghost');
        break;
      case 'link':
        baseClasses.push('btn-link');
        break;
      default:
        baseClasses.push('btn-primary');
    }

    return baseClasses.join(' ');
  }
}
