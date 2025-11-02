import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

export interface EmptyStateConfig {
  title?: string;
  message?: string;
  icon?: string;
  showAction?: boolean;
  actionText?: string;
  actionIcon?: string;
  variant?: 'default' | 'search' | 'error' | 'loading' | 'success';
  size?: 'sm' | 'md' | 'lg';
  illustration?: boolean;
}

@Component({
  selector: 'mfc-empty-state',
  imports: [CommonModule, Icon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {
  // Inputs
  config = input<EmptyStateConfig>({});

  // Outputs
  actionClicked = output<void>();

  // Computed properties
  defaultConfig = computed(() => ({
    title: 'No data available',
    message: 'There are no items to display at the moment.',
    icon: 'solar:box-line-duotone',
    showAction: false,
    actionText: 'Add Item',
    actionIcon: 'solar:add-circle-line-duotone',
    variant: 'default' as const,
    size: 'md' as const,
    illustration: false,
    ...this.config()
  }));

  containerClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = [
      'mfc-empty-state',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'text-center'
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
      case 'search':
        classes.push('min-h-[40vh]');
        break;
      case 'error':
        classes.push('min-h-[50vh]');
        break;
      case 'loading':
        classes.push('min-h-[30vh]');
        break;
      default:
        classes.push('min-h-[45vh]');
    }

    return classes.join(' ');
  });

  iconClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['mb-4'];

    // Icon size based on component size
    switch (config.size) {
      case 'sm':
        classes.push('size-12');
        break;
      case 'lg':
        classes.push('size-20');
        break;
      default:
        classes.push('size-16');
    }

    // Icon color based on variant
    switch (config.variant) {
      case 'search':
        classes.push('text-info');
        break;
      case 'error':
        classes.push('text-error');
        break;
      case 'success':
        classes.push('text-success');
        break;
      case 'loading':
        classes.push('text-warning');
        break;
      default:
        classes.push('text-base-content/40');
    }

    return classes.join(' ');
  });

  titleClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['font-semibold', 'text-base-content', 'mb-2'];

    // Title size based on component size
    switch (config.size) {
      case 'sm':
        classes.push('text-lg');
        break;
      case 'lg':
        classes.push('text-2xl');
        break;
      default:
        classes.push('text-xl');
    }

    return classes.join(' ');
  });

  messageClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = ['text-base-content/60', 'max-w-md', 'mx-auto'];

    // Message size based on component size
    switch (config.size) {
      case 'sm':
        classes.push('text-sm', 'mb-4');
        break;
      case 'lg':
        classes.push('text-lg', 'mb-8');
        break;
      default:
        classes.push('text-base', 'mb-6');
    }

    return classes.join(' ');
  });

  getVariantIcon(): string {
    const config = this.defaultConfig();

    switch (config.variant) {
      case 'search':
        return 'solar:magnifer-line-duotone';
      case 'error':
        return 'solar:close-circle-line-duotone';
      case 'loading':
        return 'solar:clock-circle-line-duotone';
      case 'success':
        return 'solar:check-circle-line-duotone';
      default:
        return config.icon;
    }
  }

  onActionClick(): void {
    this.actionClicked.emit();
  }
}