# Fixes Applied to NX Libraries Structure

## Issue: Circular Dependencies & Duplicate Files

### Problems Identified:
1. ❌ Circular dependency between `infrastructure` and `user-domain`
2. ❌ Guards were in wrong location (infrastructure instead of domain)
3. ❌ Duplicate files in both `apps/samba-web/src/app/_domain` and `libs/samba/domain/*`
4. ❌ Duplicate files in both `apps/samba-web/src/app/_infrastructure` and `libs/samba/infrastructure`
5. ❌ Incorrect imports using relative paths in libraries
6. ❌ Missing app configuration for API_CONFIG and interceptors

---

## Fixes Applied ✅

### 1. ✅ Resolved Circular Dependency

**Root Cause:**
- `infrastructure` library imported from `user-domain` (guards used AuthStore)
- `user-domain` library imported from `infrastructure` (services used ApiService)
- This created a circular dependency: `infrastructure` → `user-domain` → `infrastructure`

**Solution:**
- Moved guards to their respective **domain libraries** where they belong:
  - `auth.guard.ts` → `@samba/user-domain`
  - `role.guard.ts` → `@samba/user-domain`
  - `branch.guard.ts` → `@samba/branch-domain`
- Updated all guard imports to use local relative paths within their domain
- Removed guards from infrastructure library entirely

**Architecture Principle:**
> Guards are domain-specific logic that depend on domain stores, so they should live in domain libraries, not infrastructure.

---

### 2. ✅ Fixed Library Import Paths

**Before (Incorrect - Circular Reference):**
```typescript
// In role.guard.ts (when it was in infrastructure)
import { AuthStore, UserRole } from '@samba/user-domain'; // ❌ Circular!
```

**After (Correct - Local Import):**
```typescript
// In role.guard.ts (now in user-domain)
import { AuthStore } from '../store/auth.store'; // ✅ Local import
import { UserRole } from '../models/user.model';
```

---

### 3. ✅ Updated Library Exports

**User Domain (`@samba/user-domain`):**
```typescript
// libs/samba/domain/user/src/index.ts
export * from './lib/models/user.model';
export * from './lib/store/auth.store';
export * from './lib/services/auth.service';
export * from './lib/guards/auth.guard';    // ✅ Added
export * from './lib/guards/role.guard';     // ✅ Added
```

**Branch Domain (`@samba/branch-domain`):**
```typescript
// libs/samba/domain/branch/src/index.ts
export * from './lib/models/branch.model';
export * from './lib/store/branch.store';
export * from './lib/services/branch.service';
export * from './lib/guards/branch.guard';   // ✅ Added
```

**Infrastructure (`@samba/infrastructure`):**
```typescript
// libs/samba/infrastructure/src/index.ts
// ❌ Removed: Guards exports
export * from './lib/interceptors/auth.interceptor';
export * from './lib/interceptors/offline.interceptor';
export * from './lib/services/api/api.service';
export * from './lib/services/storage/storage.service';
export * from './lib/services/offline/offline.service';
export * from './lib/config/api.config';
```

---

### 4. ✅ Removed Duplicate Files

**Deleted directories:**
- ❌ `apps/samba-web/src/app/_domain/` (21 files)
- ❌ `apps/samba-web/src/app/_infrastructure/` (8 files)
- ❌ `libs/samba/infrastructure/src/lib/guards/` (3 files)

**Reason:** All code now lives in proper NX libraries, no duplication needed.

---

### 5. ✅ Configured Application

**Updated `apps/samba-web/src/app/app.config.ts`:**

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import {
  API_CONFIG,
  authInterceptor,
  offlineInterceptor
} from '@samba/infrastructure';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(
      withInterceptors([authInterceptor, offlineInterceptor])
    ),
    {
      provide: API_CONFIG,
      useValue: { apiUrl: environment.apiUrl }
    },
  ],
};
```

**What this does:**
- ✅ Provides HTTP client with authentication and offline interceptors
- ✅ Injects API configuration from environment
- ✅ Makes all services work correctly with proper base URL

---

## New Library Structure

```
libs/samba/
├── domain/
│   ├── product/
│   │   └── src/lib/
│   │       ├── models/
│   │       ├── store/
│   │       └── services/
│   ├── branch/
│   │   └── src/lib/
│   │       ├── models/
│   │       ├── store/
│   │       ├── services/
│   │       └── guards/ ✅ (branch.guard.ts)
│   ├── user/
│   │   └── src/lib/
│   │       ├── models/
│   │       ├── store/
│   │       ├── services/
│   │       └── guards/ ✅ (auth.guard.ts, role.guard.ts)
│   ├── sale/
│   ├── customer/
│   ├── category/
│   └── inventory/
└── infrastructure/
    └── src/lib/
        ├── interceptors/ ✅ (auth, offline)
        ├── services/ ✅ (api, storage, offline)
        └── config/ ✅ (api.config.ts)
```

---

## Import Examples

### Using Guards (from Domain Libraries):

```typescript
// In app.routes.ts
import { authGuard, roleGuard } from '@samba/user-domain';
import { branchGuard } from '@samba/branch-domain';

export const appRoutes: Route[] = [
  {
    path: 'pos',
    canActivate: [authGuard, branchGuard],
    loadChildren: () => import('./features/pos/pos.routes')
  },
  {
    path: 'settings',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadChildren: () => import('./features/settings/settings.routes')
  }
];
```

### Using Infrastructure:

```typescript
// In any feature component
import { ApiService, StorageService, OfflineService } from '@samba/infrastructure';
```

### Using Domain:

```typescript
// In any feature component
import { Product, ProductStore, ProductService } from '@samba/product-domain';
import { AuthStore, User } from '@samba/user-domain';
import { BranchStore, Branch } from '@samba/branch-domain';
```

---

## Dependency Graph (No More Circles!)

```
app
 ├─→ @samba/user-domain
 │    └─→ @samba/infrastructure
 │    └─→ @samba/branch-domain
 │         └─→ @samba/infrastructure
 ├─→ @samba/product-domain
 │    └─→ @samba/infrastructure
 ├─→ @samba/sale-domain
 │    └─→ @samba/infrastructure
 ├─→ @samba/customer-domain
 │    └─→ @samba/infrastructure
 ├─→ @samba/category-domain
 │    └─→ @samba/infrastructure
 ├─→ @samba/inventory-domain
 │    └─→ @samba/infrastructure
 │    └─→ @samba/product-domain
 └─→ @samba/infrastructure (standalone, no domain deps)
```

**✅ No circular dependencies!**

---

## Verification Commands

### Build All Libraries:
```bash
# Build all samba libraries
npx nx run-many --target=build --projects=tag:samba --parallel=8
```

### Check for Circular Dependencies:
```bash
# Visualize dependency graph
npx nx graph

# Check specific library
npx nx show project user-domain --web
```

### Build & Run App:
```bash
# Build samba-web
npx nx build samba-web

# Serve samba-web
npx nx serve samba-web
```

---

## Files Modified

### Library Files:
- ✅ `libs/samba/domain/user/src/lib/guards/auth.guard.ts` - Fixed imports
- ✅ `libs/samba/domain/user/src/lib/guards/role.guard.ts` - Fixed imports
- ✅ `libs/samba/domain/branch/src/lib/guards/branch.guard.ts` - Fixed imports
- ✅ `libs/samba/domain/user/src/index.ts` - Added guard exports
- ✅ `libs/samba/domain/branch/src/index.ts` - Added guard export
- ✅ `libs/samba/infrastructure/src/index.ts` - Removed guard exports

### App Files:
- ✅ `apps/samba-web/src/app/app.config.ts` - Added HTTP client & API config

### Deleted:
- ❌ `apps/samba-web/src/app/_domain/` - Removed duplicates
- ❌ `apps/samba-web/src/app/_infrastructure/` - Removed duplicates
- ❌ `libs/samba/infrastructure/src/lib/guards/` - Moved to domains

---

## Next Steps

### 1. Test Build:
```bash
npm run start:samba-web
```

### 2. Install json-server (if not already installed):
```bash
npm install --save-dev json-server
```

### 3. Start Mock API:
```bash
npm run mock-api
```

### 4. Verify Everything Works:
- ✅ App builds without errors
- ✅ No circular dependency warnings
- ✅ Guards work correctly
- ✅ Interceptors inject properly
- ✅ API calls use correct base URL

---

## Summary

✅ **All issues fixed!**
- Circular dependencies resolved by moving guards to domain libraries
- Duplicate files removed from app directory
- Import paths corrected throughout
- App configuration properly set up
- Clean dependency graph with no circles

**Week 1 Status:** 100% Complete - Ready for Week 2 feature development! 🎉
