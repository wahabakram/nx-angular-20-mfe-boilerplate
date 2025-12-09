# Web Components - Framework-Agnostic Components

> **Context**: WebComponents app creates framework-agnostic web components using Angular Elements. These components can be used in any framework (React, Vue, vanilla JS) or embedded in other applications.

---

## 🎯 Purpose

WebComponents provides:
1. **Angular Elements** - Angular components as custom elements
2. **Framework-Agnostic** - Use in any framework or vanilla JS
3. **Module Federation** - Exposed via MFE architecture
4. **Reusable Components** - Shared across different tech stacks
5. **Embeddable Widgets** - Drop-in components for any application

---

## 🏗️ Architecture

### Angular Elements + Module Federation

**How it works:**
```typescript
// 1. Create Angular component
@Component({
  selector: 'app-my-widget',
  template: `<div>{{ message }}</div>`
})
export class MyWidget {
  @Input() message: string;
  @Output() action = new EventEmitter();
}

// 2. Convert to custom element
const MyWidgetElement = createCustomElement(MyWidget, { injector });
customElements.define('my-widget', MyWidgetElement);

// 3. Use in any framework
<my-widget message="Hello"></my-widget>
```

**Module Federation:**
```typescript
// module-federation.config.ts
module.exports = {
  name: 'webcomponents',
  exposes: {
    './widgets': './src/app/widgets/index.ts'
  }
};
```

---

## 📁 Key Features

### 1. **Custom Elements**
- Angular components as Web Components
- Standard DOM API
- Works in any framework
- Progressive enhancement

### 2. **Component Library**
- Reusable widgets
- Business logic components
- UI components
- Utility components

### 3. **Integration Examples**
- React integration
- Vue integration
- Vanilla JS usage
- Module Federation loading

---

## 🎨 Implementation Patterns

### Creating a Web Component

```typescript
// File: my-widget.ts (Angular 20: NO .component suffix)
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-widget',
  template: `
    <div class="widget">
      <h3>{{ title }}</h3>
      <button (click)="handleClick()">Action</button>
    </div>
  `
})
export class MyWidget { // Angular 20: NO Component suffix
  @Input() title: string = '';
  @Output() widgetAction = new EventEmitter<string>();

  handleClick() {
    this.widgetAction.emit('clicked');
  }
}
```

### Registering as Custom Element

```typescript
// File: bootstrap.ts
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { MyWidget } from './my-widget';

(async () => {
  const app = await createApplication({
    providers: [/* ... */]
  });

  const MyWidgetElement = createCustomElement(MyWidget, {
    injector: app.injector
  });

  customElements.define('my-widget', MyWidgetElement);
})();
```

### Usage in Other Frameworks

**Vanilla JS:**
```html
<script src="webcomponents-bundle.js"></script>
<my-widget title="Hello" id="widget"></my-widget>
<script>
  const widget = document.getElementById('widget');
  widget.addEventListener('widgetAction', (e) => {
    console.log('Action:', e.detail);
  });
</script>
```

**React:**
```jsx
import React, { useRef, useEffect } from 'react';

function App() {
  const widgetRef = useRef();

  useEffect(() => {
    const widget = widgetRef.current;
    widget.addEventListener('widgetAction', handleAction);
    return () => widget.removeEventListener('widgetAction', handleAction);
  }, []);

  const handleAction = (e) => {
    console.log('Action:', e.detail);
  };

  return <my-widget ref={widgetRef} title="Hello" />;
}
```

**Vue:**
```vue
<template>
  <my-widget :title="title" @widgetAction="handleAction" />
</template>

<script>
export default {
  data() {
    return { title: 'Hello' };
  },
  methods: {
    handleAction(e) {
      console.log('Action:', e.detail);
    }
  }
};
</script>
```

---

## 🔧 Technology Stack

| Technology | Usage |
|------------|-------|
| **Angular 20** | Base framework |
| **Angular Elements** | Web Components API |
| **Module Federation** | Distribution |
| **Tailwind CSS 4** | Styling (scoped) |
| **TypeScript** | Type safety |

---

## 📚 Best Practices

### 1. **Input/Output Naming**

```typescript
// ✅ GOOD - Use @Input/@Output for web components
@Component({ /* ... */ })
export class MyWidget {
  @Input() message: string;      // Property binding
  @Output() action = new EventEmitter(); // Event binding
}

// Usage: <my-widget message="Hi" (action)="handler()"></my-widget>
```

### 2. **Styling Considerations**

```scss
// Use :host for component-level styles
:host {
  display: block;
  padding: 1rem;
}

// Be careful with global styles
// Use Shadow DOM or scoped styles
```

### 3. **Change Detection**

```typescript
// Use OnPush for better performance
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyWidget {
  // ...
}
```

### 4. **Size Optimization**

- Tree-shake unused Angular features
- Use lazy loading for large components
- Minimize bundle size
- Use Module Federation for code sharing

---

## 🚨 Critical Rules

### ❌ DON'T:
- Use Angular-specific features that don't translate to web components
- Rely on Angular Router (web components are stateless)
- Use complex dependency injection (keep it simple)
- Create large, monolithic components

### ✅ DO:
- Keep components focused and small
- Use standard Input/Output patterns
- Provide clear API documentation
- Test in multiple frameworks
- Follow Angular 20 naming conventions
- Use Tailwind for styling (scoped)

---

## 📖 Documentation References

### Core Guides
- **Main Guide:** [Root CLAUDE.md](../../CLAUDE.md)
- **Senior Engineer:** [.claude/SENIOR_ENGINEER.md](../../.claude/SENIOR_ENGINEER.md)
- **Angular 20:** [.claude/ANGULAR_20_GUIDE.md](../../.claude/ANGULAR_20_GUIDE.md)
- **Styling:** [.claude/STYLING_GUIDE.md](../../.claude/STYLING_GUIDE.md)

### Reference Implementations
- **Shell App:** [apps/shell/CLAUDE.md](../shell/CLAUDE.md) - UI patterns
- **Component Library:** [libs/shared/components/](../../libs/shared/components/)

### External Resources
- [Angular Elements Guide](https://angular.dev/guide/elements)
- [Web Components API](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements v1](https://html.spec.whatwg.org/multipage/custom-elements.html)

---

## 🎯 Quick Examples

### Example 1: Simple Counter Widget

```typescript
// File: counter-widget.ts
@Component({
  selector: 'app-counter-widget',
  template: `
    <div class="counter">
      <button (click)="decrement()">-</button>
      <span>{{ count }}</span>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterWidget { // Angular 20: NO Component suffix
  @Input() count: number = 0;
  @Output() countChanged = new EventEmitter<number>();

  increment() {
    this.count++;
    this.countChanged.emit(this.count);
  }

  decrement() {
    this.count--;
    this.countChanged.emit(this.count);
  }
}
```

### Example 2: Data Display Widget

```typescript
// File: user-card-widget.ts
@Component({
  selector: 'app-user-card-widget',
  template: `
    <div class="card">
      <img [src]="avatar" [alt]="name" />
      <h3>{{ name }}</h3>
      <p>{{ email }}</p>
      <button (click)="onViewProfile()">View Profile</button>
    </div>
  `
})
export class UserCardWidget { // Angular 20: NO Component suffix
  @Input() name: string = '';
  @Input() email: string = '';
  @Input() avatar: string = '';
  @Output() viewProfile = new EventEmitter<void>();

  onViewProfile() {
    this.viewProfile.emit();
  }
}
```

---

## ✅ Testing Web Components

### Unit Testing

```typescript
describe('CounterWidget', () => {
  it('should increment count', () => {
    const fixture = TestBed.createComponent(CounterWidget);
    const component = fixture.componentInstance;

    component.increment();
    expect(component.count).toBe(1);
  });
});
```

### Integration Testing (Browser)

```javascript
describe('counter-widget', () => {
  it('should work as custom element', () => {
    const widget = document.createElement('counter-widget');
    widget.setAttribute('count', '5');
    document.body.appendChild(widget);

    const button = widget.shadowRoot.querySelector('button:last-child');
    button.click();

    expect(widget.getAttribute('count')).toBe('6');
  });
});
```

---

**Remember:** Web Components bridge Angular and the web platform. Keep them simple, focused, and framework-agnostic! 🌐
