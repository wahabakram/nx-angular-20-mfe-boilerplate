# Web Components - Documentation Index

## About Web Components
The Web Components application is a library of framework-agnostic, reusable UI components that can be consumed by any application in the workspace, including non-Angular applications.

## Documentation Structure

- **[logs/WEBCOMPONENTS_SUMMARY.md](./logs/WEBCOMPONENTS_SUMMARY.md)** - Initial web components implementation summary (archived)
- **[WEBCOMPONENTS_FINAL_SUMMARY.md](./WEBCOMPONENTS_FINAL_SUMMARY.md)** - Final implementation and migration summary

## Overview

This module provides a collection of web components using Angular Elements, compiled to native Web Components that can be used anywhere.

### Key Features

- **Framework Agnostic**: Can be used in any framework or vanilla JavaScript
- **Self-Contained**: Each component includes its own styles and logic
- **Custom Elements**: Standard Web Components API
- **Module Federation**: Exposed via Module Federation for dynamic loading

## Component Library

### Available Components

The web components library includes reusable UI elements that can be integrated into any application:

- Form controls
- Data display components
- Interactive widgets
- Utility components

### Component Architecture

```
apps/webcomponents/src/app/
├── remote-entry/           - Module federation entry point
└── [components]/           - Individual web components
```

## Usage

### In Angular Applications

```typescript
// Import via Module Federation
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<custom-component></custom-component>'
})
```

### In Non-Angular Applications

```html
<!-- Load the web component bundle -->
<script src="https://your-domain.com/webcomponents/main.js"></script>

<!-- Use the component -->
<custom-component property="value"></custom-component>
```

## Development Guidelines

### Creating a New Web Component

1. **Create Component**
   ```typescript
   @Component({
     selector: 'app-custom-element',
     template: '...',
     styles: ['...'],
     encapsulation: ViewEncapsulation.ShadowDom
   })
   export class CustomElementComponent {
     @Input() property!: string;
     @Output() customEvent = new EventEmitter();
   }
   ```

2. **Register as Custom Element**
   ```typescript
   import { createCustomElement } from '@angular/elements';
   
   const element = createCustomElement(CustomElementComponent, {
     injector: this.injector
   });
   customElements.define('custom-element', element);
   ```

3. **Export via Module Federation**
   ```typescript
   // module-federation.config.ts
   exposes: {
     './CustomElement': './src/app/components/custom-element'
   }
   ```

### Best Practices

#### 1. Self-Contained Styling
```typescript
@Component({
  styles: [`
    :host {
      display: block;
      /* All styles scoped to component */
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
```

#### 2. Property Binding
```typescript
// Use Input decorators for properties
@Input() value: string = '';
@Input() disabled: boolean = false;

// Use Output for events
@Output() valueChange = new EventEmitter<string>();
```

#### 3. Attribute Reflection
```typescript
// Reflect properties as attributes
@HostBinding('attr.value') get attrValue() {
  return this.value;
}
```

## Module Federation Configuration

### Exposed Modules
```typescript
// module-federation.config.ts
module.exports = {
  name: 'webcomponents',
  exposes: {
    './Components': './src/app/remote-entry/entry.routes.ts',
    './CustomElement': './src/app/components/custom-element'
  },
  shared: {
    '@angular/core': { singleton: true },
    '@angular/common': { singleton: true }
  }
};
```

### Loading in Shell/Host
```typescript
// Load remote component
const remoteComponent = await loadRemoteModule({
  remoteName: 'webcomponents',
  exposedModule: './CustomElement'
});
```

## Testing

### Unit Testing
```typescript
describe('CustomElementComponent', () => {
  it('should emit events correctly', () => {
    const component = new CustomElementComponent();
    component.customEvent.subscribe(value => {
      expect(value).toBe('test');
    });
    component.emitEvent('test');
  });
});
```

### Integration Testing
```typescript
// Test as Web Component
const element = document.createElement('custom-element');
element.setAttribute('value', 'test');
document.body.appendChild(element);

// Verify behavior
expect(element.getAttribute('value')).toBe('test');
```

### E2E Testing
```typescript
// Playwright test
test('custom element renders correctly', async ({ page }) => {
  await page.goto('/webcomponents');
  const element = page.locator('custom-element');
  await expect(element).toBeVisible();
});
```

## Building & Deployment

### Development Build
```bash
nx serve webcomponents
# Available at http://localhost:4203
```

### Production Build
```bash
nx build webcomponents --prod
# Output: dist/apps/webcomponents
```

### Build Configuration
```typescript
// webpack.prod.config.ts
module.exports = {
  output: {
    uniqueName: 'webcomponents',
    publicPath: 'auto'
  },
  optimization: {
    minimize: true,
    splitChunks: false
  }
};
```

## Component Communication

### Properties (Input)
```html
<custom-element 
  property1="value1"
  property2="value2">
</custom-element>
```

### Events (Output)
```javascript
const element = document.querySelector('custom-element');
element.addEventListener('customEvent', (event) => {
  console.log('Event data:', event.detail);
});
```

### Slots (Content Projection)
```html
<custom-element>
  <div slot="header">Header Content</div>
  <div slot="content">Main Content</div>
</custom-element>
```

## Browser Compatibility

### Polyfills Required
- Custom Elements v1
- Shadow DOM v1
- ES2015+ features

### Supported Browsers
- Chrome/Edge: 88+
- Firefox: 85+
- Safari: 14+

## Performance Considerations

### Lazy Loading
- Load components on demand
- Use dynamic imports
- Implement intersection observers for below-fold components

### Bundle Size
- Tree-shaking enabled
- Minimize third-party dependencies
- Use shared dependencies via Module Federation

### Shadow DOM Performance
- Scoped styles (no global CSS pollution)
- Better encapsulation
- Potential style recalculation cost

## Common Patterns

### Pattern 1: Stateful Component
```typescript
@Component({
  selector: 'stateful-component'
})
export class StatefulComponent {
  private state = signal({ value: '' });
  
  @Input() 
  set initialValue(value: string) {
    this.state.update(s => ({ ...s, value }));
  }
}
```

### Pattern 2: Event Delegation
```typescript
@Component({
  selector: 'event-component'
})
export class EventComponent {
  @Output() action = new EventEmitter<ActionEvent>();
  
  handleClick(type: string) {
    this.action.emit({ type, timestamp: Date.now() });
  }
}
```

### Pattern 3: Lifecycle Integration
```typescript
export class LifecycleComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Initialize component
  }
  
  ngOnDestroy() {
    // Cleanup
  }
}
```

## Migration Guide

### From Angular Component to Web Component

1. **Ensure Proper Encapsulation**
   ```typescript
   encapsulation: ViewEncapsulation.ShadowDom
   ```

2. **Update Selectors**
   ```typescript
   // Before: app-component
   // After:  custom-component (no prefix)
   ```

3. **Register Custom Element**
   ```typescript
   createCustomElement(Component, { injector });
   customElements.define('custom-component', element);
   ```

4. **Test in Non-Angular Context**
   - Verify in vanilla HTML
   - Test property binding
   - Test event emission

## Troubleshooting

### Component Not Rendering
- Check if custom element is registered
- Verify CUSTOM_ELEMENTS_SCHEMA is imported
- Check browser console for errors
- Ensure script is loaded before usage

### Styles Not Applying
- Verify encapsulation mode
- Check Shadow DOM support
- Ensure styles are component-scoped
- Review CSS specificity

### Events Not Firing
- Check event listener attachment
- Verify event name matches
- Ensure EventEmitter is used correctly
- Check event bubbling/composition

## Related Documentation

- **Root**: [../../.claude/](../../.claude/) - Global Claude AI context
- **Shell**: [../shell/docs/](../shell/docs/) - Shell application
- **Shared Components**: [../../libs/shared/components/docs/](../../libs/shared/components/docs/)

## Resources

- [Angular Elements Documentation](https://angular.io/guide/elements)
- [Web Components Standard](https://www.webcomponents.org/)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Custom Elements v1](https://html.spec.whatwg.org/multipage/custom-elements.html)
