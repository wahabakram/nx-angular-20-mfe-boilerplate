# Module Federation Migration Guide

This guide explains how to migrate the samba-web monolithic application to a Module Federation micro-frontend architecture after the MVP is complete.

## Overview

The current implementation uses **Option A (Monolithic App)** to accelerate MVP development. This guide provides a clear path to migrate to **Option B (Module Federation)** when the time is right.

### Why Defer Module Federation?

**Benefits of starting monolithic:**
- Faster MVP development (no Module Federation configuration overhead)
- Simpler debugging and testing
- Easier state management across features
- No remote loading complexity
- Better DX during rapid prototyping

**When to migrate:**
- MVP is stable and feature-complete
- Team size grows and needs independent deployments
- Different features need separate release cycles
- Performance optimization requires lazy-loaded remotes
- Multiple teams need to work on different modules independently

---

## Architecture Comparison

### Current: Monolithic App

```
samba-web (Host App - Port 4200)
├── features/
│   ├── auth/          # Authentication
│   ├── pos/           # Point of Sale
│   ├── inventory/     # Inventory Management
│   ├── sales/         # Sales & Quotations
│   ├── reports/       # Reports & Dashboard
│   └── settings/      # Settings
├── _domain/           # Shared domain logic
├── _infrastructure/   # Shared infrastructure
└── _shared/           # Shared UI components
```

**All features bundled in a single application.**

### Future: Module Federation Architecture

```
Host App (samba-web - Port 4200)
├── _domain/           # Shared domain logic
├── _infrastructure/   # Shared infrastructure
├── _shared/           # Shared UI components
└── Shell layout + routing

Remote: POS Module (pos-remote - Port 4201)
└── features/pos/

Remote: Inventory Module (inventory-remote - Port 4202)
└── features/inventory/

Remote: Sales Module (sales-remote - Port 4203)
└── features/sales/

Remote: Reports Module (reports-remote - Port 4204)
└── features/reports/

Remote: Settings Module (settings-remote - Port 4205)
└── features/settings/
```

**Features are independent micro-frontends loaded dynamically.**

---

## Migration Strategy

### Phase 1: Preparation (Week 1)

#### 1.1 Extract Shared Code to Libraries

Move shared domain, infrastructure, and UI components to NX libraries:

```bash
# Generate shared libraries
npx nx g @nx/angular:library domain \
  --directory=libs/samba/domain \
  --importPath=@samba/domain \
  --standalone

npx nx g @nx/angular:library infrastructure \
  --directory=libs/samba/infrastructure \
  --importPath=@samba/infrastructure \
  --standalone

npx nx g @nx/angular:library shared-ui \
  --directory=libs/samba/shared-ui \
  --importPath=@samba/shared-ui \
  --standalone
```

**File structure:**

```
libs/samba/
├── domain/              # Business logic & domain models
│   ├── product/
│   ├── inventory/
│   ├── sale/
│   ├── customer/
│   ├── branch/
│   └── user/
├── infrastructure/      # Guards, interceptors, services
│   ├── guards/
│   ├── interceptors/
│   └── services/
└── shared-ui/           # Shared UI components
    ├── layouts/
    ├── components/
    └── directives/
```

#### 1.2 Update Import Paths

Replace relative imports with library imports:

**Before:**
```typescript
import { ProductStore } from '../../_domain/product/store/product.store';
import { authGuard } from '../../_infrastructure/guards/auth.guard';
```

**After:**
```typescript
import { ProductStore } from '@samba/domain/product';
import { authGuard } from '@samba/infrastructure/guards';
```

#### 1.3 Update tsconfig.base.json

```json
{
  "compilerOptions": {
    "paths": {
      "@samba/domain/product": ["libs/samba/domain/product/src/index.ts"],
      "@samba/domain/inventory": ["libs/samba/domain/inventory/src/index.ts"],
      "@samba/domain/sale": ["libs/samba/domain/sale/src/index.ts"],
      "@samba/infrastructure/guards": ["libs/samba/infrastructure/guards/src/index.ts"],
      "@samba/infrastructure/services": ["libs/samba/infrastructure/services/src/index.ts"],
      "@samba/shared-ui/layouts": ["libs/samba/shared-ui/layouts/src/index.ts"],
      "@samba/shared-ui/components": ["libs/samba/shared-ui/components/src/index.ts"]
    }
  }
}
```

---

### Phase 2: Create Remote Applications (Week 2-3)

#### 2.1 Generate Remote Applications

```bash
# Generate POS remote
npx nx g @nx/angular:host samba-web --remotes=pos-remote --standalone

# Generate additional remotes
npx nx g @nx/angular:remote inventory-remote --host=samba-web --standalone
npx nx g @nx/angular:remote sales-remote --host=samba-web --standalone
npx nx g @nx/angular:remote reports-remote --host=samba-web --standalone
npx nx g @nx/angular:remote settings-remote --host=samba-web --standalone
```

This generates:
- Host app configuration in `apps/samba-web/`
- Remote apps in `apps/pos-remote/`, `apps/inventory-remote/`, etc.
- Module Federation config files

#### 2.2 Configure Module Federation

**Host: `apps/samba-web/module-federation.config.ts`**

```typescript
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'samba-web',
  remotes: [
    ['pos-remote', 'http://localhost:4201'],
    ['inventory-remote', 'http://localhost:4202'],
    ['sales-remote', 'http://localhost:4203'],
    ['reports-remote', 'http://localhost:4204'],
    ['settings-remote', 'http://localhost:4205'],
  ],
  shared: (name, config) => {
    // Share Angular, RxJS, and other common dependencies
    if (name === '@angular/core' || name === '@angular/common' || name === '@angular/router') {
      return { singleton: true, strictVersion: true, requiredVersion: config.requiredVersion };
    }
    if (name === 'rxjs' || name === '@ngrx/signals') {
      return { singleton: true, strictVersion: true, requiredVersion: config.requiredVersion };
    }
    // Share custom libraries
    if (name.startsWith('@samba/')) {
      return { singleton: true, strictVersion: false };
    }
    return false;
  },
};

export default config;
```

**Remote: `apps/pos-remote/module-federation.config.ts`**

```typescript
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'pos-remote',
  exposes: {
    './Routes': 'apps/pos-remote/src/app/remote-entry/entry.routes.ts',
  },
  shared: (name, config) => {
    if (name === '@angular/core' || name === '@angular/common' || name === '@angular/router') {
      return { singleton: true, strictVersion: true, requiredVersion: config.requiredVersion };
    }
    if (name === 'rxjs' || name === '@ngrx/signals') {
      return { singleton: true, strictVersion: true, requiredVersion: config.requiredVersion };
    }
    if (name.startsWith('@samba/')) {
      return { singleton: true, strictVersion: false };
    }
    return false;
  },
};

export default config;
```

---

### Phase 3: Move Features to Remotes (Week 3-4)

#### 3.1 Move POS Feature

**Step 1:** Copy POS feature from monolith to remote:

```bash
# Copy feature code
cp -r apps/samba-web/src/app/features/pos/* apps/pos-remote/src/app/
```

**Step 2:** Create remote entry point:

`apps/pos-remote/src/app/remote-entry/entry.routes.ts`:

```typescript
import { Route } from '@angular/router';
import { POS } from '../pos/pos';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: POS,
  },
];
```

**Step 3:** Update host routing to load remote:

`apps/samba-web/src/app/app.routes.ts`:

```typescript
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { authGuard } from '@samba/infrastructure/guards';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'pos',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule('pos-remote', './Routes').then(m => m.remoteRoutes),
  },
  // Other routes...
];
```

#### 3.2 Move Remaining Features

Repeat the same process for:
- **Inventory** → `inventory-remote`
- **Sales** → `sales-remote`
- **Reports** → `reports-remote`
- **Settings** → `settings-remote`

---

### Phase 4: Update Development Workflow (Week 4)

#### 4.1 Update package.json Scripts

```json
{
  "scripts": {
    "start": "nx run-many --target=serve --projects=samba-web,pos-remote,inventory-remote,sales-remote,reports-remote,settings-remote --parallel=6",
    "start:host": "nx serve samba-web",
    "start:pos": "nx serve pos-remote",
    "start:inventory": "nx serve inventory-remote",
    "start:sales": "nx serve sales-remote",
    "start:reports": "nx serve reports-remote",
    "start:settings": "nx serve settings-remote",
    "build:all": "nx run-many --target=build --projects=samba-web,pos-remote,inventory-remote,sales-remote,reports-remote,settings-remote --parallel=6",
    "test:all": "nx run-many --target=test --all"
  }
}
```

#### 4.2 Configure Port Mapping

Update `apps/*/project.json` files to set unique ports:

**samba-web**: Port 4200 (Host)
**pos-remote**: Port 4201
**inventory-remote**: Port 4202
**sales-remote**: Port 4203
**reports-remote**: Port 4204
**settings-remote**: Port 4205

---

## State Management in Module Federation

### Challenge: Shared State Across Remotes

NgRx Signal Stores with `providedIn: 'root'` are shared across remotes when configured correctly.

### Solution: Shared Libraries

All stores are in `@samba/domain/*` libraries, which are:
1. Configured as `singleton: true` in Module Federation
2. Shared across host and all remotes
3. Maintain single instance of each store

**Example:**

```typescript
// libs/samba/domain/product/src/lib/store/product.store.ts
export const ProductStore = signalStore(
  { providedIn: 'root' }, // ✅ Singleton across all remotes
  withState(initialState),
  // ...
);
```

**Usage in any remote:**

```typescript
// apps/pos-remote/src/app/pos/pos.ts
import { ProductStore } from '@samba/domain/product';

export class POS {
  productStore = inject(ProductStore); // Same instance as host
}
```

---

## Routing Strategy

### Dynamic Remote Loading

Use `loadRemoteModule` for dynamic imports:

```typescript
{
  path: 'pos',
  loadChildren: () =>
    loadRemoteModule('pos-remote', './Routes').then(m => m.remoteRoutes),
}
```

### Deep Linking Support

Ensure each remote handles its own child routes:

```typescript
// apps/pos-remote/src/app/remote-entry/entry.routes.ts
export const remoteRoutes: Route[] = [
  {
    path: '',
    component: POS,
    children: [
      { path: '', component: POSMain },
      { path: 'history', component: POSHistory },
      { path: 'settings', component: POSSettings },
    ],
  },
];
```

---

## Build & Deployment Strategy

### Development

```bash
# Start all applications
npm start

# Or start individually
npm run start:host
npm run start:pos
```

### Production Build

```bash
# Build all applications
npm run build:all

# Or build individually
npx nx build samba-web --configuration=production
npx nx build pos-remote --configuration=production
```

### Deployment

Each remote can be deployed independently:

```
Host: https://electric-store.com (samba-web)
POS: https://pos.electric-store.com (pos-remote)
Inventory: https://inventory.electric-store.com (inventory-remote)
Sales: https://sales.electric-store.com (sales-remote)
Reports: https://reports.electric-store.com (reports-remote)
Settings: https://settings.electric-store.com (settings-remote)
```

Update Module Federation config for production URLs:

```typescript
const config: ModuleFederationConfig = {
  name: 'samba-web',
  remotes: [
    ['pos-remote', 'https://pos.electric-store.com'],
    ['inventory-remote', 'https://inventory.electric-store.com'],
    ['sales-remote', 'https://sales.electric-store.com'],
    ['reports-remote', 'https://reports.electric-store.com'],
    ['settings-remote', 'https://settings.electric-store.com'],
  ],
  // ...
};
```

---

## Testing Strategy

### Unit Tests

Each remote has its own test suite:

```bash
# Test individual remote
npx nx test pos-remote

# Test all remotes
npx nx run-many --target=test --all
```

### E2E Tests

Test the integrated application:

```bash
# E2E test for host + remotes
npx nx e2e samba-web-e2e
```

---

## Benefits After Migration

### Independent Deployments
- Deploy POS module without affecting Inventory
- Faster release cycles for individual features
- Reduced risk of breaking other modules

### Parallel Development
- Multiple teams can work on different remotes
- No merge conflicts between features
- Independent versioning

### Performance
- Lazy load remotes on-demand
- Smaller initial bundle size
- Faster page loads

### Scalability
- Add new remotes without touching existing code
- Remove deprecated modules easily
- Scale teams independently

---

## Potential Challenges & Solutions

### Challenge 1: Shared Dependencies Version Mismatch

**Solution:** Use `singleton: true` and `strictVersion: true` in Module Federation config.

### Challenge 2: State Synchronization

**Solution:** All stores in shared libraries (`@samba/domain/*`) with `providedIn: 'root'`.

### Challenge 3: Debugging Complexity

**Solution:** Use NX dev tools and Module Federation DevTools extension.

### Challenge 4: CORS Issues in Development

**Solution:** Configure proxy in `proxy.conf.json` for local development.

---

## Migration Checklist

- [ ] Extract shared code to NX libraries
- [ ] Update all imports to use library paths
- [ ] Generate host and remote applications
- [ ] Configure Module Federation for host and remotes
- [ ] Move POS feature to pos-remote
- [ ] Move Inventory feature to inventory-remote
- [ ] Move Sales feature to sales-remote
- [ ] Move Reports feature to reports-remote
- [ ] Move Settings feature to settings-remote
- [ ] Update routing to use `loadRemoteModule`
- [ ] Test all features in Module Federation mode
- [ ] Update build and deployment scripts
- [ ] Configure production URLs
- [ ] Update documentation

---

## Conclusion

This migration path allows the team to:
1. **Start fast** with a monolithic MVP
2. **Migrate gradually** when needed
3. **Scale independently** as the team grows

The DDD architecture ensures clean boundaries, making the migration straightforward when the time comes.

---

## Additional Resources

- [NX Module Federation Documentation](https://nx.dev/recipes/module-federation)
- [Angular Module Federation Guide](https://www.angulararchitects.io/en/blog/the-microfrontend-revolution-module-federation-in-webpack-5/)
- [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md)
- [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)
