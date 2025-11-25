import {
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

export interface StatCardConfig {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  description?: string;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'mf-stat-card',
  imports: [CommonModule, Icon],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCard {
  // Inputs
  config = input.required<StatCardConfig>();

  // Outputs
  cardClick = output<void>();

  // Computed properties
  cardClasses = computed(() => {
    const config = this.config();
    const classes = ['stat-card', 'card', 'bg-base-100', 'shadow-sm', 'border'];

    // Variant classes
    switch (config.variant) {
      case 'primary':
        classes.push('border-primary/20', 'hover:border-primary/40');
        break;
      case 'secondary':
        classes.push('border-secondary/20', 'hover:border-secondary/40');
        break;
      case 'success':
        classes.push('border-success/20', 'hover:border-success/40');
        break;
      case 'warning':
        classes.push('border-warning/20', 'hover:border-warning/40');
        break;
      case 'error':
        classes.push('border-error/20', 'hover:border-error/40');
        break;
      default:
        classes.push('border-base-300', 'hover:border-base-400');
    }

    // Size classes
    switch (config.size) {
      case 'sm':
        classes.push('p-3');
        break;
      case 'lg':
        classes.push('p-6');
        break;
      default:
        classes.push('p-4');
    }

    // Interactive classes
    if (config.clickable) {
      classes.push(
        'cursor-pointer',
        'hover:shadow-md',
        'transition-all',
        'duration-200'
      );
    }

    return classes.join(' ');
  });

  iconClasses = computed(() => {
    const config = this.config();
    const classes = ['flex-shrink-0'];

    // Icon size based on card size
    switch (config.size) {
      case 'sm':
        classes.push('size-8');
        break;
      case 'lg':
        classes.push('size-12');
        break;
      default:
        classes.push('size-10');
    }

    // Icon color based on variant
    switch (config.variant) {
      case 'primary':
        classes.push('text-primary');
        break;
      case 'secondary':
        classes.push('text-secondary');
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
      default:
        classes.push('text-base-content/60');
    }

    return classes.join(' ');
  });

  trendClasses = computed(() => {
    const trend = this.config().trend;
    if (!trend) return '';

    const classes = ['flex', 'items-center', 'gap-1', 'text-xs', 'font-medium'];

    switch (trend.direction) {
      case 'up':
        classes.push('text-success');
        break;
      case 'down':
        classes.push('text-error');
        break;
      default:
        classes.push('text-base-content/60');
    }

    return classes.join(' ');
  });

  valueClasses = computed(() => {
    const config = this.config();
    const classes = ['font-bold', 'text-base-content', 'truncate'];

    // Value size based on card size
    switch (config.size) {
      case 'sm':
        classes.push('text-lg');
        break;
      case 'lg':
        classes.push('text-3xl');
        break;
      default:
        classes.push('text-2xl');
    }

    return classes.join(' ');
  });

  titleClasses = computed(() => {
    const config = this.config();
    const classes = ['text-base-content/70', 'font-medium', 'truncate'];

    // Title size based on card size
    switch (config.size) {
      case 'sm':
        classes.push('text-xs');
        break;
      case 'lg':
        classes.push('text-base');
        break;
      default:
        classes.push('text-sm');
    }

    return classes.join(' ');
  });

  getTrendIcon(): string {
    const trend = this.config().trend;
    if (!trend) return '';

    switch (trend.direction) {
      case 'up':
        return 'solar:arrow-up-line-duotone';
      case 'down':
        return 'solar:arrow-down-line-duotone';
      default:
        return 'solar:minus-line-duotone';
    }
  }

  formatValue(value: string | number): string {
    if (typeof value === 'number') {
      // Format large numbers with suffixes
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toLocaleString();
    }
    return String(value);
  }

  onCardClick(): void {
    if (this.config().clickable) {
      this.cardClick.emit();
    }
  }
}
