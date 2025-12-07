# ⚠️ ALWAYS READ THIS FIRST - Critical Instructions

**This file contains MANDATORY rules that MUST be followed for every implementation.**

---

## 🚨 Rule #1: NEVER Create What Already Exists

### We Have 100+ Production-Ready Components - USE THEM!

**Location:** `libs/shared/components/`  
**Full List:** `libs/shared/components/docs/COMPONENT-MAPPING.md`

```typescript
// ❌ WRONG - Creating a custom table
export class MyCustomTable {
  // This already exists as Datatable!
}

// ✅ CORRECT - Using existing component
import { Datatable } from '@ng-mf/components';
```

---

## 🚨 Rule #2: Shell App is THE Reference

### Shell Has Complete Examples for Everything

**Location:** `apps/shell/src/app/`

```bash
apps/shell/src/app/
├── dashboard/         # 8 dashboard examples - COPY THESE PATTERNS
│   ├── analytics/     # Analytics dashboard
│   ├── basic/         # Basic layout
│   ├── dynamic/       # Dynamic widgets
│   ├── ecommerce/     # E-commerce metrics
│   ├── explore/       # Exploration UI
│   ├── finance/       # Financial dashboard
│   └── getting-started/ # Onboarding
│
├── widgets/_widgets/  # 60+ widget examples - USE AS TEMPLATES
│   ├── analytics/     # Analytics widgets
│   ├── common/        # Common widgets
│   ├── crypto/        # Crypto widgets
│   ├── finance/       # Finance widgets
│   └── general/       # General widgets
│
├── auth/              # Complete auth flow - COPY THIS
│   ├── signin/
│   ├── signup/
│   ├── forgot-password/
│   └── password-reset/
│
└── applications/      # Feature examples - REFERENCE THESE
    ├── calendar/
    ├── contacts/
    ├── email-app/
    ├── file-manager/
    ├── invoice/
    └── projects/
```

**Before implementing ANYTHING, search Shell for similar example!**

---

## 🚨 Rule #3: Follow This Priority Order

### EVERY time you implement a feature:

```
┌─────────────────────────────────────────────────┐
│ 1️⃣ Check @ng-mf/components (100+ components)     │
│    libs/shared/components/                      │
│    See: COMPONENT-MAPPING.md                    │
└─────────────────────────────────────────────────┘
                      ↓
          Component doesn't exist?
                      ↓
┌─────────────────────────────────────────────────┐
│ 2️⃣ Search Shell app for similar example        │
│    apps/shell/src/app/                          │
│    Copy the pattern                             │
└─────────────────────────────────────────────────┘
                      ↓
          No similar example?
                      ↓
┌─────────────────────────────────────────────────┐
│ 3️⃣ Check app-specific components               │
│    apps/[app-name]/src/app/_shared/             │
└─────────────────────────────────────────────────┘
                      ↓
          Still nothing?
                      ↓
┌─────────────────────────────────────────────────┐
│ 4️⃣ Create new component                        │
│    Follow patterns from Shell                   │
│    Use Tailwind CSS                             │
│    Write tests                                  │
└─────────────────────────────────────────────────┘
```

---

## 📋 Pre-Implementation Checklist

**BEFORE writing ANY code, complete this checklist:**

- [ ] **Searched** `libs/shared/components/docs/COMPONENT-MAPPING.md`
- [ ] **Verified** component doesn't exist in shared library
- [ ] **Searched** Shell app (`apps/shell/`) for similar implementation
- [ ] **Checked** app-specific components (`apps/[app]/_shared/`)
- [ ] **Confirmed** I need to create something new (rare!)

---

## ❌ Common Mistakes to Avoid

### DON'T Recreate These (They Already Exist!)

| ❌ Don't Create | ✅ Use Instead | Import From |
|----------------|---------------|-------------|
| Custom table/grid | `Datatable` | @ng-mf/components |
| Dashboard layout | `Dashboard` | @ng-mf/components |
| Form builder | `FormRenderer` | @ng-mf/components |
| Modal/Dialog | `Dialog` | @ng-mf/components |
| Panel/Card | `Panel` | @ng-mf/components |
| Sidebar/Nav | `Sidebar`, `Navigation` | @ng-mf/components |
| Charts | `Charts` | @ng-mf/components |
| Timeline | `Timeline` | @ng-mf/components |
| Carousel | `Carousel` | @ng-mf/components |
| Avatar | `Avatar` | @ng-mf/components |
| Loading state | `Skeleton`, `BlockLoader` | @ng-mf/components |
| Empty state | `EmptyState` | @ng-mf/components |
| Alert/Notification | `Alert`, `Notification` | @ng-mf/components |
| Popover | `Popover` | @ng-mf/components |
| Tabs | `TabPanel` | @ng-mf/components |
| Stepper | `Stepper` | @ng-mf/components |
| Code editor | `TextEditor`, `CodeHighlighter` | @ng-mf/components |
| Markdown editor | `MarkdownEditor` | @ng-mf/components |
| Image upload | `Upload`, `ImageResizer` | @ng-mf/components |
| Date picker | Use Angular Material | @angular/material |
| Select dropdown | `CountrySelect`, `CurrencySelect` or Material | @ng-mf/components |

---

## 📚 Quick Links

### Must-Read Documentation
1. **Component Library:** [libs/shared/components/docs/COMPONENT-MAPPING.md](../libs/shared/components/docs/COMPONENT-MAPPING.md)
2. **Shell App Guide:** [ARCHITECTURE.md → Shell Section](./.claude/ARCHITECTURE.md)
3. **Quick Reference:** [QUICK_REFERENCE.md](./.claude/QUICK_REFERENCE.md)

### Before You Code
1. Open `libs/shared/components/docs/COMPONENT-MAPPING.md`
2. Search for your component name
3. If found → Import it!
4. If not found → Search Shell app
5. Still not found → Check app-specific components
6. Only then → Consider creating new

---

## 🎯 Success Criteria

### Your implementation is successful if:

✅ You used existing components from `@ng-mf/components` where possible  
✅ You copied patterns from Shell app for new features  
✅ You maintained consistency with existing code  
✅ You didn't recreate components that already exist  
✅ Code is clean, tested, and follows Angular 20 patterns  

### Your implementation is a FAILURE if:

❌ You created a component that already exists in `@ng-mf/components`  
❌ You didn't check Shell app for similar examples  
❌ You ignored established patterns  
❌ Code doesn't match the style/structure of Shell app  

---

## 💡 Example: Correct Workflow

**Task:** "Create a product list page with a data table"

### ❌ WRONG Approach (Don't do this)
```typescript
// Creating custom table component
@Component({
  selector: 'app-product-table',
  template: `
    <table>
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  `
})
export class ProductTable { }
```

### ✅ CORRECT Approach (Do this)
```typescript
// Step 1: Check COMPONENT-MAPPING.md → Found "Datatable"
// Step 2: Check Shell app → Found example in apps/shell/src/app/datatables/
// Step 3: Import and use existing component

import { Datatable, DatatableColumn } from '@ng-mf/components';
import { ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [Datatable],
  template: `
    <mf-datatable
      [data]="products()"
      [columns]="columns"
      [loading]="loading()"
    />
  `
})
export class ProductList {
  private productStore = inject(ProductStore);
  
  products = this.productStore.products;
  loading = this.productStore.loading;
  
  columns: DatatableColumn[] = [
    { key: 'name', header: 'Product Name' },
    { key: 'price', header: 'Price' },
    { key: 'stock', header: 'Stock' },
  ];
}
```

**Time saved:** 2-3 hours  
**Code quality:** Consistent with existing patterns  
**Bugs avoided:** Many (Datatable is battle-tested)

---

## 🔥 Remember

**"If you're about to create a component, you're probably doing it wrong."**

Check existing code first. Always.

---

*Last Updated: December 7, 2025*
