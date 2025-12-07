# Shared Components Library - Location-Specific Patterns

**Purpose:** This file provides context-specific patterns for the shared components library. These components are used across all applications.

---

## 🧩 Shared Components Context

You are working in **libs/shared/components** - the central UI component library with 100+ production-ready components used across all apps.

---

## 📋 Key Principles

### Component Library Standards

1. **Standalone Components Only** - No NgModules
2. **Signal-Based** - Use Angular signals for reactivity
3. **Type-Safe** - Strict TypeScript with proper interfaces
4. **Documented** - Every component has JSDoc comments
5. **Tested** - Unit tests for all components

---

## 🎨 Component Categories

### Available Components (100+)

```typescript
// Layout
Dashboard, Layout, Sidebar, Panel, Drawer, Navigation

// Data Display
Datatable, DataView, Timeline, Carousel, Avatar, Skeleton

// Forms
FormRenderer, CountrySelect, PhoneInput, PasswordStrength, SignaturePad

// Feedback
Alert, Confirm, Dialog, Popover, Notification, BlockLoader

// Charts & Visualizations
Charts, MicroChart, Gauge

// Media
ImageViewer, ImageResizer, MediaGallery, Upload

// Editors
TextEditor, MarkdownEditor, CodeHighlighter, ContentEditor

// Specialized
InvoiceBuilder, KanbanBoard, CourseBuilder, FilterBuilder
```

---

## 📝 Component Creation Pattern

### File Structure
```
src/lib/component-name/
├── component-name.ts           Main component
├── component-name.html         Template
├── component-name.scss         Styles
├── component-name.spec.ts      Tests
├── component-name.types.ts     Type definitions
└── index.ts                    Public API
```

### Component Template
```typescript
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

/**
 * ComponentName - Brief description
 * 
 * @example
 * <mf-component-name [prop]="value" (event)="handler($event)" />
 */
@Component({
  selector: 'mf-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss',
})
export class ComponentName {
  /**
   * Input property description
   */
  @Input() prop?: string;

  /**
   * Output event description
   */
  @Output() event = new EventEmitter<string>();

  // Internal state using signals
  state = signal<string>('initial');

  handleAction() {
    this.event.emit('value');
  }
}
```

---

## 🔧 Export Pattern

### index.ts (Public API)
```typescript
// Export component
export * from './component-name';

// Export types
export * from './component-name.types';
```

### lib/index.ts (Library Root)
```typescript
// Always add new components to main index
export * from './component-name';
```

---

## 🎨 Styling Patterns

### Use Tailwind First
```html
<div class="flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm">
  <div class="flex-1">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
  </div>
</div>
```

### Component-Specific SCSS
```scss
:host {
  display: block;
}

.component-wrapper {
  @apply rounded-lg border border-gray-200;
  
  &:hover {
    @apply border-gray-300 shadow-md;
  }
}
```

---

## 🧪 Testing Pattern

### Unit Test Template
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on action', () => {
    const spy = jest.fn();
    component.event.subscribe(spy);
    
    component.handleAction();
    
    expect(spy).toHaveBeenCalledWith('value');
  });
});
```

---

## 📚 Documentation Pattern

### Component README
Every component folder should have clear usage examples:

```markdown
# ComponentName

Brief description of the component.

## Usage

\`\`\`typescript
import { ComponentName } from '@ng-mf/components';

@Component({
  imports: [ComponentName],
  template: '<mf-component-name [prop]="value" />'
})
\`\`\`

## API

### Inputs
- `prop: string` - Description

### Outputs
- `event: EventEmitter<string>` - Description
```

---

## 🚫 Common Mistakes to Avoid

1. ❌ Don't create `.css` files - Use `.scss`
2. ❌ Don't use NgModules - Standalone only
3. ❌ Don't forget to export in index.ts
4. ❌ Don't skip unit tests
5. ❌ Don't use `any` types
6. ❌ Don't mix business logic with UI components

---

## ✅ Checklist for New Components

- [ ] Component file created (`.ts`)
- [ ] Template file created (`.html`)
- [ ] Style file created (`.scss`)
- [ ] Test file created (`.spec.ts`)
- [ ] Types file created if complex (`.types.ts`)
- [ ] Exported in local `index.ts`
- [ ] Exported in `src/index.ts`
- [ ] JSDoc comments added
- [ ] Unit tests written
- [ ] Usage example documented
- [ ] Standalone component
- [ ] Uses signals for state
- [ ] Tailwind CSS for styling

---

## 📚 Local Documentation

- [docs/README.md](docs/README.md) - Component library overview
- [docs/COMPONENT-MAPPING.md](docs/COMPONENT-MAPPING.md) - Complete component list
- [docs/COMPONENT_API_FIXES.md](docs/COMPONENT_API_FIXES.md) - API changes log

---

*Auto-loaded when working in libs/shared/components/*
