# Shell Application - Documentation Index

## About Shell
The Shell application is the main container and orchestrator for the microfrontend architecture. It provides the core navigation, layout, and loads remote applications dynamically using Module Federation.

## Documentation Structure

### Phase Documentation
- **[logs/PHASE_3_PROGRESS.md](./logs/PHASE_3_PROGRESS.md)** - Phase 3 development progress (archived)
- **[logs/PHASE_3_COMPLETE.md](./logs/PHASE_3_COMPLETE.md)** - Phase 3 completion summary (archived)

## Architecture Overview

### Module Federation Setup
The Shell app uses Webpack Module Federation to dynamically load remote applications:

```typescript
// Remote Applications
- samba-web: POS and Inventory Management
- invoicely: Invoice Management
- webcomponents: Reusable Web Components Library
```

### Core Responsibilities

#### 1. Navigation & Routing
- Top-level route management
- Dynamic route loading for remotes
- Route guards and authentication

#### 2. Layout Management
- Header with app switcher
- Sidebar navigation
- Main content area
- Footer

#### 3. Authentication
- User authentication state
- JWT token management
- Protected route guards
- Session management

#### 4. Theme Management
- Global theme switching
- Theme persistence
- CSS variable management

#### 5. Remote Loading
- Dynamic remote app loading
- Fallback handling
- Error boundaries
- Loading states

## Key Features

### App Switcher
Quick navigation between microfrontends:
- Dashboard
- Samba Web (POS)
- Invoicely
- Applications menu

### Global State
Manages cross-cutting concerns:
- User authentication
- Theme preferences
- Global notifications
- App configuration

### Shared Services
- Authentication service
- Theme service
- Notification service
- Logger service

## Structure

```
apps/shell/src/app/
├── _partials/          - Reusable layout components
│   ├── header/         - Global header
│   ├── sidebar/        - Navigation sidebar
│   ├── container/      - Content container
│   └── page/           - Page wrapper
├── _state/             - Global state management
├── _utils/             - Utility functions
├── auth/               - Authentication flows
├── dashboard/          - Dashboard views
└── app.routes.ts       - Main routing configuration
```

## Module Federation Configuration

### Shell Configuration (`module-federation.config.ts`)
```typescript
remotes: [
  ['samba-web', 'http://localhost:4201'],
  ['invoicely', 'http://localhost:4202'],
  ['webcomponents', 'http://localhost:4203']
]

shared: {
  '@angular/core': { singleton: true, strictVersion: true },
  '@angular/common': { singleton: true, strictVersion: true },
  '@angular/router': { singleton: true, strictVersion: true }
}
```

### Loading Remote Routes
```typescript
// Dynamic route loading
{
  path: 'samba',
  loadChildren: () => loadRemoteModule('samba-web', './Routes')
}
```

## Development Guidelines

### Adding a New Remote App

1. **Configure Module Federation**
   ```typescript
   // module-federation.config.ts
   remotes: [
     ['new-app', 'http://localhost:4204']
   ]
   ```

2. **Add Route**
   ```typescript
   // app.routes.ts
   {
     path: 'new-app',
     loadChildren: () => loadRemoteModule('new-app', './Routes')
   }
   ```

3. **Add Navigation Item**
   ```typescript
   // _partials/sidebar/sidebar.ts
   { path: '/new-app', label: 'New App', icon: 'app-icon' }
   ```

### Layout Components

#### Header Component
- App switcher
- User profile menu
- Notifications
- Theme toggle

#### Sidebar Component
- Navigation menu
- Route highlighting
- Collapsible sections
- Search

### State Management

Using Angular Signals for global state:
```typescript
// _state/app.store.ts
export const AppStore = signalStore(
  withState({
    user: null,
    theme: 'light',
    isAuthenticated: false
  }),
  withMethods((store) => ({
    setUser: (user: User) => patchState(store, { user }),
    setTheme: (theme: string) => patchState(store, { theme })
  }))
);
```

## Testing Strategy

### Unit Tests
- Components (header, sidebar, etc.)
- Services (auth, theme, etc.)
- Guards and interceptors
- Utilities

### Integration Tests
- Remote loading
- Authentication flow
- Theme switching
- Navigation

### E2E Tests
- User login flow
- App switching
- Theme persistence
- Protected routes

## Routing Architecture

### Top-Level Routes
```
/               → Dashboard
/auth/*         → Authentication flows
/samba/*        → Samba Web (remote)
/invoicely/*    → Invoicely (remote)
/applications/* → Various applications
/account/*      → User account settings
```

### Route Guards
- `AuthGuard`: Protects authenticated routes
- `RoleGuard`: Role-based access control
- `RemoteLoadGuard`: Handles remote loading errors

## Theme System

### Available Themes
- Vibrant (default)
- Cyan-Orange
- Magenta-Violet
- Rose-Red

### Theme Switching
```typescript
// Theme service
setTheme(themeName: string) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}
```

## Performance Considerations

### Code Splitting
- Route-level lazy loading
- Remote app lazy loading
- Component lazy loading

### Bundle Optimization
- Tree shaking enabled
- Production builds optimized
- Shared dependencies deduplicated

### Loading Strategies
- Preload strategy for common routes
- On-demand loading for remote apps
- Progressive enhancement

## Common Patterns

### Loading Remote Components
```typescript
const RemoteComponent = loadRemoteModule({
  remoteName: 'samba-web',
  exposedModule: './Component'
});
```

### Error Handling
```typescript
// Error boundary for remote loading
{
  path: 'remote',
  loadChildren: () => loadRemote().catch(err => {
    this.notificationService.error('Failed to load module');
    return import('./fallback-routes');
  })
}
```

## Related Documentation

- **Root**: [../../.claude/](../../.claude/) - Global Claude AI context
- **Samba Web**: [../samba-web/docs/](../samba-web/docs/)
- **Invoicely**: [../invoicely/docs/](../invoicely/docs/)
- **Shared Components**: [../../libs/shared/components/docs/](../../libs/shared/components/docs/)

## Troubleshooting

### Remote App Not Loading
1. Check remote app is running on correct port
2. Verify `module-federation.config.ts` configuration
3. Check browser console for CORS errors
4. Ensure remote exposes correct modules

### Theme Not Applying
1. Check localStorage for theme preference
2. Verify CSS variables are defined
3. Check `data-theme` attribute on `<html>`
4. Clear browser cache

### Authentication Issues
1. Verify JWT token is valid
2. Check token expiration
3. Ensure auth guard is applied
4. Check API CORS configuration
