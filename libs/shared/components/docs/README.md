# Shared Components Library - Documentation Index

## About Shared Components
A comprehensive library of reusable, production-ready Angular 20 components used across all applications in the workspace. These components follow best practices, are fully tested, and designed for maximum reusability.

## Documentation Structure

- **[COMPONENT-MAPPING.md](./COMPONENT-MAPPING.md)** - Complete component inventory and usage guide
- **[COMPONENT_API_FIXES.md](./COMPONENT_API_FIXES.md)** - API changes and migration guide

## Library Overview

### Purpose
The shared components library provides a unified set of UI components that:
- Maintain consistent design across applications
- Reduce code duplication
- Provide tested, production-ready solutions
- Follow Angular 20 best practices
- Support theming and customization

### Component Categories

#### Core Components
Essential building blocks used throughout applications:
- **Avatar** - User profile images
- **Icon** - Icon system integration
- **Logo** - Application branding
- **Loading Spinner** - Loading indicators
- **Screen Loader** - Full-screen loading states

#### Layout Components
Structure and organization:
- **Layout** - Grid and flexbox layouts
- **Divider** - Content separation
- **Container** - Content containers
- **Page** - Page-level layout
- **Resizable Container** - Adjustable layouts

#### Navigation Components
User navigation and routing:
- **Navigation** - Main navigation menus
- **Rail Nav** - Side rail navigation
- **Sidebar** - Collapsible sidebars
- **Tab Panel** - Tabbed interfaces
- **Stepper** - Multi-step processes

#### Data Display Components
Showing information to users:
- **Data Table** - Advanced data tables
- **DataTable** - Simple data tables
- **Data View** - Data visualization
- **Card** - Content cards
- **Timeline** - Event timelines
- **Charts** - Data visualization charts
- **Micro Chart** - Inline charts
- **Gauge** - Progress indicators
- **Stat Card** - Statistical displays

#### Form Components
User input and validation:
- **Forms** - Form utilities and validators
- **Color Picker** - Color selection
- **Emoji Picker** - Emoji selection
- **Content Editor** - Rich text editing
- **Markdown Editor** - Markdown editing
- **Crop** - Image cropping
- **Filter Builder** - Dynamic filters

#### Feedback Components
User feedback and notifications:
- **Alert** - Alert messages
- **Notification** - Toast notifications
- **Dialog** - Modal dialogs
- **Confirm** - Confirmation dialogs
- **Empty State** - Empty data states
- **Block State** - Loading/error states
- **Action Required** - Action prompts

#### Overlay Components
Overlays and pop-ups:
- **Overlay** - Base overlay system
- **Popover** - Contextual popovers
- **Side Panel** - Sliding panels
- **Command Bar** - Command palette

#### Advanced Components
Complex, specialized components:
- **Kanban Board** - Task management
- **Invoice Builder** - Invoice creation
- **Course Builder** - Course creation
- **Notes** - Note-taking interface
- **Incidents** - Incident tracking

#### Utility Components
Helper components:
- **Overlay Scrollbar** - Custom scrollbars
- **Content Fade** - Fade effects
- **Expand** - Expandable content
- **Marquee** - Scrolling text
- **Masonry** - Masonry layouts
- **Carousel** - Image carousels
- **Comparison Slider** - Before/after slider

## Usage Guidelines

### Importing Components

#### Single Component Import
```typescript
import { ButtonComponent } from '@workspace/shared/components';

@Component({
  imports: [ButtonComponent],
  template: '<shared-button>Click me</shared-button>'
})
```

#### Multiple Components Import
```typescript
import { 
  CardComponent, 
  AvatarComponent,
  IconComponent 
} from '@workspace/shared/components';

@Component({
  imports: [CardComponent, AvatarComponent, IconComponent]
})
```

### Component Patterns

#### Pattern 1: Standalone Components
All components are standalone and can be imported directly:
```typescript
@Component({
  selector: 'shared-button',
  imports: [] // Specific imports only
})
export class Button { } // Angular 20: NO Component suffix
```

#### Pattern 2: Signal-Based State
Components use Angular signals for reactive state:
```typescript
export class DataTable { // Angular 20: NO Component suffix
  data = input.required<any[]>();
  selected = signal<any[]>([]);
  
  selectItem(item: any) {
    this.selected.update(items => [...items, item]);
  }
}
```

#### Pattern 3: Change Detection
All components use OnPush change detection:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Optimized { } // Angular 20: NO Component suffix
```

## Component API Standards

### Input Properties
```typescript
// ❌ OLD WAY - Decorator-based (Angular < 20)
@Input({ required: true }) data!: Data[];
@Input() size: 'sm' | 'md' | 'lg' = 'md';

// ✅ NEW WAY - Signal-based inputs (Angular 20)
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-example',
  imports: []
})
export class Example { // Angular 20: NO Component suffix
  // Required input
  data = input.required<Data[]>();
  
  // Optional input with default
  size = input<'sm' | 'md' | 'lg'>('md');
  
  // Optional input (can be undefined)
  label = input<string>();
}

// Usage in template
// Access with function call: data(), size(), label()
```

### Output Events
```typescript
// ❌ OLD WAY - EventEmitter (Angular < 20)
import { Component, Output, EventEmitter } from '@angular/core';

@Output() itemClick = new EventEmitter<Item>();
@Output() valueChange = new EventEmitter<string>();

// Emit events
this.itemClick.emit(item);

// ✅ NEW WAY - Signal-based outputs (Angular 20)
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-example',
  imports: []
})
export class Example { // Angular 20: NO Component suffix
  // Output signals
  itemClick = output<Item>();
  valueChange = output<string>();
  
  // Emit events (same syntax)
  protected handleClick(item: Item) {
    this.itemClick.emit(item);
  }
  
  protected handleChange(value: string) {
    this.valueChange.emit(value);
  }
}

// Parent usage
// <app-example (itemClick)="onItemClick($event)" (valueChange)="onValueChange($event)" />
```

### Content Projection
```typescript
@Component({
  template: `
    <div class="header">
      <ng-content select="[header]"></ng-content>
    </div>
    <div class="body">
      <ng-content></ng-content>
    </div>
  `
})
```

## Theming & Styling

### Theme Variables
Components use CSS custom properties for theming:
```scss
:host {
  --primary-color: var(--theme-primary);
  --background: var(--theme-background);
  --text-color: var(--theme-text);
}
```

### Component Sizing
Standardized size options:
- `xs` - Extra small (16px)
- `sm` - Small (24px)
- `md` - Medium (32px - default)
- `lg` - Large (48px)
- `xl` - Extra large (64px)

### Color Variants
Standard color options:
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `success` - Success states
- `warning` - Warning states
- `error` - Error states
- `info` - Informational states

## Accessibility

All components follow WCAG 2.1 Level AA standards:

### Keyboard Navigation
- Tab order support
- Keyboard shortcuts
- Focus management

### Screen Readers
- ARIA labels
- ARIA descriptions
- Role attributes

### Color Contrast
- Minimum 4.5:1 for text
- Minimum 3:1 for UI components

## Testing

### Unit Testing Template
```typescript
describe('SharedComponent', () => {
  let component: SharedComponent;
  let fixture: ComponentFixture<SharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on click', () => {
    jest.spyOn(component.itemClick, 'emit');
    component.onClick();
    expect(component.itemClick.emit).toHaveBeenCalled();
  });
});
```

### Testing Best Practices
- Test component logic, not Angular internals
- Use `jest.spyOn` for event verification
- Mock external dependencies
- Test accessibility features
- Verify keyboard navigation

## Performance Guidelines

### Optimization Techniques

#### 1. Virtual Scrolling
```typescript
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
```

#### 2. Lazy Loading
```typescript
// Lazy load heavy components
const HeavyComponent = await import('./heavy-component');
```

#### 3. TrackBy Functions
```typescript
trackByFn(index: number, item: any): any {
  return item.id; // Use unique identifier
}
```

#### 4. Memoization
```typescript
readonly expensiveComputation = computed(() => {
  return this.data().reduce((acc, item) => acc + item.value, 0);
});
```

## Common Patterns

### Pattern 1: List Display Component (Angular 20)
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

interface Item {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'shared-list',
  imports: [],
  template: `
    <div class="list-container">
      @for (item of items(); track item.id) {
        <div class="list-item" (click)="handleItemClick(item)">
          <h3>{{ item.name }}</h3>
          @if (item.description) {
            <p>{{ item.description }}</p>
          }
        </div>
      } @empty {
        <div class="empty-state">
          No items to display
        </div>
      }
    </div>
  `,
  styles: [`
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .list-item {
      padding: 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: var(--surface-hover);
      }
      
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }
      
      p {
        margin: 0;
        color: var(--text-secondary);
      }
    }
    
    .empty-state {
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List { // Angular 20: NO Component suffix
  // Signal-based inputs
  items = input.required<Item[]>();
  
  // Signal-based outputs
  itemClick = output<Item>();
  
  protected handleItemClick(item: Item) {
    this.itemClick.emit(item);
  }
}
```

### Pattern 2: Form Control Wrapper (Angular 20)
```typescript
import { Component, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'shared-input',
  imports: [],
  template: `
    <input
      [value]="value()"
      (input)="handleInput($event)"
      (blur)="handleBlur()"
      [disabled]="disabled()"
      class="form-input"
    />
  `,
  styles: [`
    .form-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-alpha);
      }
      
      &:disabled {
        background-color: var(--surface-disabled);
        cursor: not-allowed;
      }
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Input),
    multi: true
  }]
})
export class Input implements ControlValueAccessor { // Angular 20: NO Component suffix
  value = signal('');
  disabled = signal(false);
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  
  protected handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.value.set(newValue);
    this.onChange(newValue);
  }
  
  protected handleBlur(): void {
    this.onTouched();
  }
}

// Usage with Reactive Forms
// <shared-input formControlName="username" />
```

### Pattern 3: Data Loading Component (Angular 20)
```typescript
import { Component, computed, input } from '@angular/core';

interface Data {
  id: string;
  title: string;
  value: number;
}

@Component({
  selector: 'shared-data-view',
  imports: [],
  template: `
    @switch (state()) {
      @case ('loading') {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading data...</p>
        </div>
      }
      @case ('error') {
        <div class="error">
          <p>{{ error() }}</p>
          <button (click)="retry.emit()">Retry</button>
        </div>
      }
      @case ('empty') {
        <div class="empty">
          <p>No data available</p>
        </div>
      }
      @case ('loaded') {
        <div class="data-grid">
          @for (item of data(); track item.id) {
            <div class="data-item">
              <h3>{{ item.title }}</h3>
              <p>{{ item.value }}</p>
            </div>
          }
        </div>
      }
    }
  `,
  styles: [`
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      
      .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid var(--surface-variant);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
    
    .error {
      padding: 2rem;
      text-align: center;
      color: var(--error-color);
    }
    
    .empty {
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }
    
    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class DataView { // Angular 20: NO Component suffix
  // Inputs
  data = input.required<Data[]>();
  loading = input<boolean>(false);
  error = input<string | null>(null);
  
  // Output for retry action
  retry = output<void>();
  
  // Computed state based on inputs
  readonly state = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    if (this.data().length === 0) return 'empty';
    return 'loaded';
  });
}

// Usage
// <shared-data-view 
//   [data]="items" 
//   [loading]="isLoading" 
//   [error]="errorMessage"
//   (retry)="loadData()"
// />
```

## Migration Guide

### From Older Versions
See [COMPONENT_API_FIXES.md](./COMPONENT_API_FIXES.md) for:
- Breaking changes
- Migration steps
- Updated APIs
- Deprecated features

### Adding New Components

1. **Create Component**
   ```bash
   nx generate @nx/angular:component MyComponent \
     --project=shared-components \
     --changeDetection=OnPush \
     --standalone
   ```

2. **Follow Standards**
   - Use signals for state
   - Implement OnPush change detection
   - Add comprehensive tests
   - Document API

3. **Export Component**
   ```typescript
   // libs/shared/components/src/index.ts
   export * from './lib/my-component/my-component';
   ```

4. **Document Usage**
   - Add to COMPONENT-MAPPING.md
   - Include examples
   - Document props and events

## Troubleshooting

### Common Issues

#### Component Not Found
```
Error: Cannot find module '@workspace/shared/components'
```
**Solution**: Check `tsconfig.base.json` paths configuration

#### Styling Not Applied
**Solution**: Ensure component uses `:host` selector and proper encapsulation

#### Event Not Firing
**Solution**: Verify output is properly connected and change detection is triggered

#### Performance Issues
**Solution**: Implement virtual scrolling, trackBy, and OnPush change detection

## Best Practices

### DO ✅
- Use OnPush change detection
- Implement proper TypeScript types
- Write comprehensive tests
- Follow accessibility guidelines
- Use signals for state management
- Document component APIs
- Provide usage examples

### DON'T ❌
- Use `any` types
- Skip accessibility features
- Ignore keyboard navigation
- Have side effects in components
- Mutate input properties
- Skip error handling
- Forget loading states

## Related Documentation

- **Root**: [../../../.claude/](../../../.claude/) - Global Claude AI context
- **Component Mapping**: [./COMPONENT-MAPPING.md](./COMPONENT-MAPPING.md) - Complete component list
- **API Fixes**: [./COMPONENT_API_FIXES.md](./COMPONENT_API_FIXES.md) - Breaking changes

## Contributing

### Adding a Component Checklist
- [ ] Component implementation with OnPush
- [ ] Comprehensive unit tests (>80% coverage)
- [ ] Accessibility features (ARIA, keyboard)
- [ ] Documentation with examples
- [ ] Exported in index.ts
- [ ] Added to COMPONENT-MAPPING.md
- [ ] Theme support
- [ ] Responsive design

### Code Review Focus
- Type safety
- Accessibility
- Performance
- Test coverage
- Documentation
- Consistency with existing patterns

## Version History

- **v1.0** - Initial component library
- **v2.0** - Angular 20 migration with signals
- **v2.1** - Component API improvements
- **Current** - Ongoing enhancements
