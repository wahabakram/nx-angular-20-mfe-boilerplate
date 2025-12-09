# SAMBA Web - Location-Specific Patterns

**Purpose:** This file provides context-specific patterns and conventions for SAMBA Web development. It's automatically loaded by AI assistants when working in this directory.

---

## 🏪 SAMBA Context

You are working in **SAMBA Web** - a POS and inventory management ERP system with:
- Offline-first architecture
- Multi-branch support
- Domain-Driven Design
- Widget-based dashboards

---

## 📋 Quick Patterns

### File Naming (MANDATORY)
```
✅ CORRECT:
- feature.ts (not feature.component.ts)
- feature.html
- feature.scss (NEVER .css)
- export class Feature (not FeatureComponent)
```

### Dashboard Pages (MANDATORY)
```typescript
// ✅ ALWAYS use Dashboard + individual widgets
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

configs = signal<WidgetConfig[]>([
  { id: 'total-sales', component: TotalSalesWidget, title: 'Total Sales' },
  { id: 'low-stock', component: LowStockWidget, title: 'Low Stock' },
]);

// ❌ NEVER group metrics in one widget
// Create individual widgets instead
```

### Widget Styling (MANDATORY - Updated Dec 7, 2025)

**Chart Widgets** - MUST match Shell app pattern:
```html
<!-- ✅ CORRECT - Shell pattern (consistent padding & typography) -->
<div class="p-5 flex items-center justify-between">
  <h3 class="tracking-tight text-sm font-semibold">Widget Title</h3>
</div>
<div class="px-5 pb-5">
  <div #chartContainer class="chart-container h-[300px]"></div>
</div>

<!-- ❌ WRONG - Old SAMBA pattern (inconsistent) -->
<header class="flex justify-between items-center mb-4">
  <div class="font-semibold">Widget Title</div>
</header>
<div #chartContainer class="chart-container h-[300px]"></div>
```

**Metric Widgets** - SAMBA custom pattern (with icon + action button):
```html
<div class="relative overflow-hidden group h-full">
  <div class="flex gap-5 p-6">
    <div class="rounded-lg bg-primary size-12 flex-none flex items-center justify-center text-white">
      <mat-icon>icon_name</mat-icon>
    </div>
    <div>
      <div class="truncate text-sm font-medium text-neutral-500">Metric Label</div>
      <div class="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{{ value }}</div>
    </div>
  </div>
  <div class="absolute right-0 top-0 bottom-0">
    <button matRipple matTooltip="Action" class="...">
      <mat-icon>arrow_right_alt</mat-icon>
    </button>
  </div>
</div>
```

**Key Rules:**
- ✅ Chart widgets: Use Shell pattern (p-5 padding, tracking-tight text-sm font-semibold)
- ✅ Metric widgets: Use SAMBA pattern (icon + value + action button)
- ✅ Always include dark mode classes (dark:text-neutral-100, etc.)
- ❌ NEVER use old `<header class="flex justify-between items-center mb-4">` pattern

### Domain Store Usage
```typescript
// ✅ CORRECT - Import from domain libs
import { ProductStore, ProductService } from '@samba/product-domain';
import { InventoryStore } from '@samba/inventory-domain';

private productStore = inject(ProductStore);
products = this.productStore.products; // Signal
```

### Offline Operations
```typescript
// ✅ CORRECT - Use offline service
import { OfflineService } from '@samba/infrastructure';

private offlineService = inject(OfflineService);

async createSale(sale: Sale) {
  // Works offline, syncs when online
  await this.offlineService.queueOperation({
    type: 'CREATE',
    entity: 'sale',
    data: sale,
  });
}
```

---

## 🎯 What to Check First

1. **Existing Widgets**: `src/app/widgets/_widgets/`
2. **Domain Libraries**: `libs/samba/domain/*/src/`
3. **Shell App Reference**: `apps/shell/`
4. **Shared Components**: `libs/shared/components/`

---

## 🚫 Common Mistakes to Avoid

1. ❌ Using `.css` files (SCSS only)
2. ❌ Creating grouped metric widgets
3. ❌ Not using offline service for data operations
4. ❌ Ignoring multi-branch context
5. ❌ Putting business logic in components

---

## 📚 Local Documentation

- [docs/CLAUDE.md](docs/CLAUDE.md) - Complete SAMBA guide
- [docs/DDD-ARCHITECTURE.md](docs/DDD-ARCHITECTURE.md) - Architecture
- [docs/IMPLEMENTATION-GUIDE.md](docs/IMPLEMENTATION-GUIDE.md) - Patterns
- [docs/OFFLINE-SYNC-STRATEGY.md](docs/OFFLINE-SYNC-STRATEGY.md) - Offline strategy

---

*Auto-loaded when working in apps/samba-web/*
