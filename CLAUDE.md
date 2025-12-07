# Nx Angular 20 Microfrontend Workspace - Development Guide

> **📖 New Documentation Structure:** This workspace now has organized documentation!
> - **Senior Engineer Guide:** `.claude/SENIOR_ENGINEER.md` - Your role and decision framework
> - **App-Specific Docs:** Each app has a `docs/` directory with detailed guides
> - **Component Docs:** `libs/shared/components/docs/` for component library
> - **Quick Start:** `.claude/INDEX.md` for navigation
>
> **👨‍💻 Start here:** [.claude/SENIOR_ENGINEER.md](./.claude/SENIOR_ENGINEER.md) to understand your role as a senior engineer.

> **Claude Context**: You are a **senior software engineer** working in a sophisticated Nx monorepo with multiple Angular applications using Module Federation. This workspace contains established patterns, extensive shared libraries, and reference implementations. Your role is to leverage existing code and maintain architectural consistency, not to reinvent solutions.

---

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## Nx Workspace Guidelines

- When running tasks (build, lint, test, e2e), always use `nx` commands (`nx run`, `nx run-many`, `nx affected`)
- Use Nx MCP server tools when available
- For repository questions, use `nx_workspace` tool to understand architecture
- For individual projects, use `nx_project_details` tool
- For nx configuration questions, use `nx_docs` tool
- For errors, use `nx_workspace` tool to diagnose

<!-- nx configuration end-->

---

## 📁 Workspace Structure

```
workspace/
├── apps/
│   ├── shell/              # ⭐ Reference Implementation (Complete Demo App)
│   ├── samba-web/          # SAMBA ERP Application
│   ├── invoicely/          # Invoicing Application
│   ├── webcomponents/      # Web Components App
│   └── *-e2e/             # E2E test projects
│
├── libs/
│   ├── shared/
│   │   ├── components/     # 70+ UI Components Library
│   │   ├── styles/         # Shared styles
│   │   └── ui-theme/       # Theming system
│   │
│   └── samba/
│       ├── domain/         # Domain-Driven Design modules
│       │   ├── user/       # User & auth domain
│       │   ├── product/    # Product catalog
│       │   ├── inventory/  # Stock management
│       │   ├── sale/       # Sales transactions
│       │   ├── customer/   # Customer management
│       │   ├── branch/     # Multi-branch support
│       │   └── category/   # Product categories
│       │
│       └── infrastructure/ # Shared infrastructure
│
└── CLAUDE.md              # This file
```

---

## 🎯 Project-Specific Documentation

**Each application has its own comprehensive development guide:**

### SAMBA ERP
📖 **[apps/samba-web/CLAUDE.md](apps/samba-web/CLAUDE.md)** - Complete SAMBA development guide

**Key Points:**
- Widget-based dashboard architecture (MANDATORY)
- Domain-driven design with signals
- Shell app as reference implementation
- 70+ shared components available
- Individual metric widgets (NOT grouped widgets)

### Shell App (Reference Implementation)
📖 **apps/shell/** - The definitive UI/UX reference

**Purpose**: Complete demo showcasing all patterns and components
- 8 dashboard examples (analytics, basic, dynamic, ecommerce, explore, finance, getting-started)
- Complete auth flow implementation
- 60+ widget examples
- UI/UX standards and patterns

**When to use**:
- Creating any new UI component → Check shell first
- Styling decisions → Follow shell patterns
- Layout questions → Reference shell layouts
- Widget patterns → Examine shell widgets

---

## 🔍 Component Discovery Process (CRITICAL)

**Before writing ANY code, search in this order:**

### 1. Project-Specific Components
Check the application's own components first:
```bash
# For SAMBA ERP
apps/samba-web/src/app/widgets/_widgets/     # Existing widgets
apps/samba-web/src/app/_cells/                # Data display components
apps/samba-web/src/app/_partials/             # Layout components
```

### 2. Shell App (Reference Patterns)
The shell app is your source of truth for implementation patterns:
```bash
apps/shell/src/app/dashboard/    # 8 complete dashboard examples
apps/shell/src/app/auth/         # Auth flow implementation
apps/shell/src/app/widgets/      # 60+ widget examples
```

### 3. Shared Component Library
70+ pre-built, production-ready components:
```bash
libs/shared/components/src/lib/
```

**Available Categories:**
- **Layout**: Dashboard, Layout, Sidebar, Panel, Drawer, Navigation
- **Data**: Datatable, DataView, Timeline, Carousel, Avatar
- **Forms**: FormRenderer, CountrySelect, PhoneInput, PasswordStrength, SignaturePad
- **Feedback**: Alert, Confirm, BlockLoader, Announcement, Notifications
- **Visualizations**: Charts, MicroChart, Gauge (use echarts directly for custom)
- **Media**: ImageViewer, ImageResizer, Upload
- **Editors**: TextEditor, MarkdownEditor, CodeHighlighter, ContentEditor
- **UI Elements**: Logo, Icon, ColorPicker, Popover, FilterBuilder, EmojiPicker
- **Specialized**: InvoiceBuilder, KanbanBoard, CourseBuilder, Notes, Incidents

**Import Example:**
```typescript
import {
  Dashboard,      // Widget-based dashboard system
  Datatable,      // Feature-rich data table
  Panel,          // Collapsible panels
  Logo,           // App logo
  FormRenderer    // Dynamic forms
} from '@ng-mf/components';
```

### 4. Angular Material
Only after checking above:
```typescript
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
```

### 5. Create Custom (Last Resort)
Only if no existing solution exists. Then:
- Follow shell app patterns exactly
- Use Tailwind + Material Design
- Document in project's CLAUDE.md

---

## 🏗️ Key Architectural Patterns

### Widget-Based Architecture (Dashboards/Reports)
**Mandatory for**: Dashboards, reports, analytics pages

```typescript
// Page uses Dashboard component
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

configs = signal<WidgetConfig[]>([/* widget definitions */]);
items = signal<WidgetItem[]>([/* layout grid */]);

// Template
<mf-dashboard [configs]="configs()" [items]="items()" />
```

**Widget Types:**
- Individual metric widgets (total-sales-widget, revenue-widget)
- Chart widgets (using echarts)
- Table widgets (using Datatable)
- Custom widgets (following shell patterns)

**See**: [apps/samba-web/CLAUDE.md](apps/samba-web/CLAUDE.md) for complete widget documentation

### Domain-Driven Design (SAMBA)
Business logic separated from UI:
```typescript
// Import from domain libs
import { ProductStore, ProductService } from '@samba/product-domain';
import { SaleStore, SaleService } from '@samba/sale-domain';

// Use stores in components
private productStore = inject(ProductStore);
products = this.productStore.products; // Signal-based reactivity
```

### Module Federation
Applications are independently deployable microfrontends.

**Structure:**
- `shell` - Host application
- `samba-web`, `invoicely` - Remote applications
- Shared dependencies via Module Federation

---

## 📐 Development Standards

### File Naming
```
✅ Angular 20 Style (SAMBA ERP):
- feature.ts, feature.html, feature.scss
- export class Feature

✅ Traditional Style (Other apps):
- feature.component.ts, feature.component.html, feature.component.scss
- export class FeatureComponent
```

### Styling
- **ALWAYS `.scss`**, NEVER `.css` (SAMBA ERP)
- Use Tailwind utilities first
- Material Design tokens for colors
- Responsive design with breakpoint prefixes

### State Management
- Use Angular signals for reactive state
- Domain stores for business data (SAMBA)
- Inject services, don't instantiate

### Type Safety
- Strict TypeScript
- Align with domain models
- No `any` types

---

## 🚀 Getting Started

### For New Features:
1. Read project-specific CLAUDE.md ([apps/samba-web/CLAUDE.md](apps/samba-web/CLAUDE.md))
2. Check shell app for reference implementation
3. Search shared components library
4. Review domain libs for data models
5. Implement following established patterns

### For UI Components:
1. Check shell app first (`apps/shell/`)
2. Check shared libs (`libs/shared/components/`)
3. Use Angular Material if above don't have it
4. Create custom only as last resort

### For Business Logic (SAMBA):
1. Check domain libs (`libs/samba/domain/`)
2. Use domain stores for state
3. Use domain services for operations
4. Create new domain modules if needed

---

## 📚 Key Documentation

| Document | Purpose |
|----------|---------|
| [apps/samba-web/CLAUDE.md](apps/samba-web/CLAUDE.md) | Complete SAMBA development guide |
| [libs/shared/components/README.md](libs/shared/components/README.md) | Component library documentation |
| apps/shell/ | Reference implementation (browse code) |

---

## ⚠️ Common Mistakes to Avoid

1. **Creating components without searching first** - Check shell app and libs
2. **Ignoring widget architecture** - Use Dashboard + widgets for dashboards/reports
3. **Creating grouped widgets** - Create individual widgets instead
4. **Using deprecated components** - StatCard, ChartWidget are old
5. **Not following shell app patterns** - Shell app is the standard
6. **Creating `.css` files** - Always use `.scss`
7. **Reinventing UI components** - 70+ components already exist

---

## 🎯 Core Philosophy

**"Don't Repeat Yourself (DRY)"**

This workspace is designed for maximum code reuse:
- Shell app = Reference implementation
- Shared libs = Reusable components
- Domain libs = Business logic
- Module Federation = Code sharing

**Your Role**: Senior engineer who leverages existing architecture, not a freelancer starting from scratch.

**Approach**: Search first, code second. Maintain consistency with established patterns.

---

## 💡 Quick Tips

1. **Always check shell app first** for any UI question
2. **Use Dashboard component** for any dashboard/report page
3. **Create individual widgets** not grouped metric cards
4. **Import from shared libs** before creating custom components
5. **Use domain stores** for data in SAMBA ERP
6. **Follow Tailwind + Material** styling standards
7. **Use signals** for reactive state
8. **Read project CLAUDE.md** before starting work on that project

---

**Remember**: This workspace has years of development and established patterns. Your job is to build on this foundation, not replace it. When in doubt, check shell app and existing documentation.
