# Shell App - Location-Specific Patterns

**Purpose:** This file provides context-specific patterns for the Shell app. The Shell app is the **reference implementation** for the entire workspace.

---

## ⭐ Shell App Context

You are working in **Shell** - the **reference implementation** and host application. This app contains:
- 8 complete dashboard examples
- 60+ widget implementations
- Complete auth flow
- All UI/UX patterns and standards

---

## 🎯 Key Principles

### Shell is the Standard
```
When in doubt about how to implement something:
1. Search Shell app first
2. Copy the pattern from Shell
3. Adapt for your specific use case
```

### File Naming (Traditional)
```
✅ CORRECT for Shell:
- feature.component.ts
- feature.component.html
- feature.component.scss
- export class FeatureComponent
```

### Widget Examples to Reference

```typescript
// Find widget examples in:
src/app/widgets/_widgets/
├── analytics/          Analytics widgets
├── common/            General-purpose widgets  
├── crypto/            Cryptocurrency widgets
├── finance/           Financial widgets
└── general/           Misc widgets

// Find dashboard layouts in:
src/app/dashboard/
├── analytics/         Analytics dashboard
├── basic/            Simple dashboard
├── dynamic/          Dynamic widgets
├── ecommerce/        E-commerce dashboard
├── explore/          Exploration dashboard
├── finance/          Finance dashboard
└── getting-started/  Starter dashboard
```

---

## 📋 Common Patterns

### Dashboard Pattern
```typescript
// Shell uses Dashboard + WidgetConfig + WidgetItem
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Dashboard],
  template: `
    <mf-dashboard [configs]="configs()" [items]="items()" />
  `,
})
export class DashboardComponent {
  configs = signal<WidgetConfig[]>([/* widget configs */]);
  items = signal<WidgetItem[]>([/* grid layout */]);
}
```

### Widget Pattern
```typescript
// Individual widget component
@Component({
  selector: 'app-metric-widget',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="text-sm font-medium text-gray-500">{{ title }}</div>
      <div class="text-3xl font-bold mt-2">{{ value }}</div>
      <div class="text-xs text-gray-400 mt-1">{{ subtitle }}</div>
    </div>
  `,
})
export class MetricWidget {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() subtitle?: string;
}
```

### Layout Pattern
```typescript
// Shell layout with header, sidebar, content
<div class="flex h-screen">
  <app-sidebar />
  <div class="flex-1 flex flex-col">
    <app-header />
    <main class="flex-1 overflow-auto p-6">
      <router-outlet />
    </main>
  </div>
</div>
```

---

## 🎨 Styling Standards

### Tailwind CSS Usage
```html
<!-- Shell uses Tailwind extensively -->
<div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
  <div class="flex-1">
    <h3 class="text-lg font-semibold text-gray-900">Title</h3>
    <p class="text-sm text-gray-500">Description</p>
  </div>
</div>
```

### Theme Support
```typescript
// Shell supports multiple themes
import { ThemeService } from '@ng-mf/theme';

private themeService = inject(ThemeService);

changeTheme(theme: string) {
  this.themeService.setTheme(theme);
}
```

---

## 🧩 Component Usage

### Always Check Shell First
```typescript
// ✅ Before creating a component, search Shell:
// 1. Check if component already exists
// 2. Check how Shell implements similar feature
// 3. Copy pattern from Shell
// 4. Adapt for your needs

// Shell uses many shared components:
import {
  Datatable,
  Dashboard,
  Panel,
  Sidebar,
  Avatar,
  Logo,
  Icon,
  // ... and 60+ more
} from '@ng-mf/components';
```

---

## 📁 Directory Structure

```
src/app/
├── _partials/           Shared layout components
│   ├── header/         App header
│   ├── sidebar/        Navigation sidebar
│   ├── container/      Content container
│   └── page/           Page wrapper
│
├── _state/             Global state
│   └── app.store.ts    App-level store
│
├── dashboard/          Dashboard examples (8 types)
├── widgets/            Widget examples (60+)
├── applications/       Feature examples
├── auth/               Auth flow examples
└── components/         Reusable components
```

---

## 🎯 What to Reference

### For Dashboard Implementation
→ See `src/app/dashboard/analytics/` or any dashboard folder

### For Widget Creation
→ See `src/app/widgets/_widgets/`

### For Auth Flow
→ See `src/app/auth/`

### For Layout Components
→ See `src/app/_partials/`

### For State Management
→ See `src/app/_state/app.store.ts`

---

## 🚫 Shell-Specific Notes

1. ✅ Shell is the **reference** - copy patterns from here
2. ✅ Shell has **complete examples** - use as templates
3. ✅ Shell uses **traditional naming** - `.component.ts`
4. ✅ Shell showcases **all shared components**
5. ❌ Don't modify Shell patterns - they are the standard

---

## 📚 Local Documentation

- [docs/README.md](docs/README.md) - Shell overview
- [docs/PHASE_3_COMPLETE.md](docs/PHASE_3_COMPLETE.md) - Implementation details

---

*Auto-loaded when working in apps/shell/*
