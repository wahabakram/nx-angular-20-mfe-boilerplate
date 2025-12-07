# Nx Angular 20 MFE Boilerplate

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

**Enterprise-grade Angular 20 monorepo with Module Federation, Domain-Driven Design, and 100+ shared components**

[![Angular 20](https://img.shields.io/badge/Angular-20.3-red?logo=angular)](https://angular.dev)
[![Nx 22](https://img.shields.io/badge/Nx-22.0-blue?logo=nx)](https://nx.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 Documentation Hub

**Start here for comprehensive guides and context:**

- 🚀 **[Quick Start Guide](./CLAUDE.md)** - Main development guide and workspace overview
- 📚 **[Documentation Index](./.claude/INDEX.md)** - Complete navigation to all documentation
- 👨‍💻 **[Senior Engineer Guide](./.claude/SENIOR_ENGINEER.md)** - Role definition and decision framework
- 🏗️ **[Architecture Deep Dive](./.claude/ARCHITECTURE.md)** - Apps, libs, and Module Federation
- 🎨 **[Styling Guide](./.claude/STYLING_GUIDE.md)** - Tailwind CSS 4 + SCSS patterns

---

## 🎯 What's Inside

This workspace contains **4 applications** and **multiple domain libraries** built with cutting-edge technologies:

### Applications

| App | Description | Port | Tech Stack |
|-----|-------------|------|------------|
| **Shell** | Reference implementation & host app | 4200 | Angular 20, Module Federation, 60+ widgets |
| **SAMBA Web** | POS & inventory management ERP | 4200 | DDD, Offline-first, Multi-branch |
| **Invoicely** | Invoice & payment management | 4200 | Domain architecture, Signal stores |
| **WebComponents** | 60+ shared UI components | 4201 | Module Federation remote |

### Libraries

| Library | Description |
|---------|-------------|
| **@ng-mf/components** | 100+ production-ready UI components |
| **@ng-mf/theme** | Multi-theme system with 12+ themes |
| **@samba/domain** | 7 domain libraries (Product, Inventory, Sale, etc.) |
| **@samba/infrastructure** | Shared API, auth, and offline services |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nx-angular-20-mfe-boilerplate

# Install dependencies
npm install
```

### Development

```bash
# Start Shell app with WebComponents remote
npm start
# Visit: http://localhost:4200

# Start SAMBA Web ERP
npm run start:samba-web
# Visit: http://localhost:4200

# Start Invoicely
npm run start:invoicely
# Visit: http://localhost:4200

# Run SAMBA mock API (for development)
npm run mock-api
# API: http://localhost:3000
```

### Building

```bash
# Build all apps
npx nx run-many --target=build --all

# Build specific app
npx nx build shell
npx nx build samba-web
npx nx build invoicely
npx nx build webcomponents
```

### Testing

```bash
# Run unit tests
npx nx test <project-name>

# Run E2E tests
npx nx e2e <project-name>-e2e

# Run all tests
npx nx run-many --target=test --all
```

---

## 🏗️ Architecture Overview

### Module Federation Setup

```
┌─────────────────────────────────────────┐
│           Shell (Host App)              │
│         Port 4200 (Production)          │
│                                         │
│  ┌────────────────────────────────┐   │
│  │     Dynamic Remote Loading      │   │
│  └────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
               ├──► WebComponents Remote (Port 4201)
               │    • 60+ UI components
               │    • Dynamic import
               │
               ├──► Invoicely Remote
               │    • Invoice management
               │    • Payment processing
               │
               └──► Future Remotes
```

### Domain-Driven Design (SAMBA)

```
libs/samba/domain/
├── product/        Product catalog & management
├── inventory/      Stock tracking & transfers
├── sale/          POS & transaction processing
├── customer/      Customer relationship mgmt
├── branch/        Multi-branch/multi-tenant
├── category/      Product categorization
└── user/          Authentication & permissions
```

### Shared Component Library

100+ production-ready components organized by category:
- **Layout** - Dashboard, Sidebar, Navigation, Panel
- **Data** - Datatable, DataView, Timeline, Charts
- **Forms** - FormRenderer, Inputs, Validation
- **Feedback** - Alert, Dialog, Notifications
- **And much more...**

---

## 🎨 Key Features

### ✨ Modern Angular 20
- Signal-based state management
- Standalone components (no NgModules)
- New control flow syntax (@if, @for)
- Improved performance & DX

### 🎯 Module Federation
- Micro-frontend architecture
- Independent deployments
- Shared dependencies
- Dynamic remote loading

### 🏢 Domain-Driven Design
- Clean architecture layers
- Domain models & services
- Repository pattern
- Facade pattern for state

### 🎨 Advanced Styling
- Tailwind CSS 4.1 (latest)
- 12+ pre-built themes
- Dark mode support
- Material Design integration
- SCSS for component styles

### 📱 Offline-First (SAMBA)
- IndexedDB storage
- Background sync
- Conflict resolution
- Queue-based operations

### 📊 Widget Architecture
- Reusable dashboard widgets
- Drag-and-drop layouts
- Responsive grid system
- 60+ pre-built widgets

---

## 📁 Workspace Structure

```
workspace/
├── apps/
│   ├── shell/              ⭐ Reference implementation
│   ├── samba-web/          🏪 POS & ERP system
│   ├── invoicely/          💰 Invoice management
│   ├── webcomponents/      🧩 Component library MFE
│   └── *-e2e/             🧪 E2E tests
│
├── libs/
│   ├── shared/
│   │   ├── components/     100+ UI components
│   │   ├── styles/         Shared styles & themes
│   │   └── ui-theme/       Theme system
│   │
│   └── samba/
│       ├── domain/         7 domain libraries (DDD)
│       └── infrastructure/ Shared services
│
├── .claude/               📚 AI context & guides
└── docs/                  📖 Additional documentation
```

---

## 🛠️ Technology Stack

### Core
- **Angular** 20.3 - Latest framework features
- **Nx** 22.0 - Monorepo tooling
- **TypeScript** 5.9 - Type safety
- **RxJS** 7.8 - Reactive programming

### UI & Styling
- **Tailwind CSS** 4.1.16 - Utility-first CSS
- **Angular Material** 20.2 - Material Design components
- **SCSS** - Component styling
- **ECharts** 6.0 - Data visualization

### State Management
- **Angular Signals** - Built-in reactivity
- **NgRx Signals** - Advanced state management
- **RxJS** - Async operations

### Module Federation
- **@module-federation/enhanced** 0.18
- **Webpack** - Module bundling
- **Vite** - Development server

### Testing
- **Vitest** 3.0 - Unit testing
- **Playwright** 1.36 - E2E testing
- **@analogjs/vitest-angular** - Angular testing utilities

### Development Tools
- **ESLint** 9.8 - Code linting
- **Prettier** 2.6 - Code formatting
- **Nx Cloud** - Build caching & CI

---

## 📚 Learn More

### Documentation
- [Complete Documentation Index](./DOCS_INDEX.md)
- [Architecture Guide](./.claude/ARCHITECTURE.md)
- [SAMBA Development Guide](./apps/samba-web/docs/CLAUDE.md)
- [Component Library Guide](./libs/shared/components/docs/README.md)

### External Resources
- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.dev)
- [Module Federation](https://module-federation.io/)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contributing

This workspace follows strict architectural patterns and conventions. Before contributing:

1. Read the [Senior Engineer Guide](./.claude/SENIOR_ENGINEER.md)
2. Review [CLAUDE.md](./CLAUDE.md) for development standards
3. Check app-specific documentation in `apps/*/docs/`
4. Follow established patterns from the Shell app

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Next Steps

1. **Explore the Shell App** - See all patterns and components in action
2. **Read CLAUDE.md** - Understand the development workflow
3. **Check .claude/INDEX.md** - Navigate all documentation
4. **Build Something** - Leverage existing components and patterns

**Ready to build enterprise Angular applications? Let's go!** 🚀

---

*Built with ❤️ using Angular 20, Nx, and modern web technologies*
