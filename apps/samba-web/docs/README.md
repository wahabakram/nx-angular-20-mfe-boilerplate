# Samba Web - Documentation Index

## About Samba Web
Samba Web is a comprehensive POS (Point of Sale) and inventory management system built with Angular 20, featuring offline-first capabilities, multi-branch support, and real-time synchronization.

## Documentation Structure

### Architecture & Design
- **[DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md)** - Domain-Driven Design implementation guide
- **[OFFLINE-SYNC-STRATEGY.md](./OFFLINE-SYNC-STRATEGY.md)** - Offline synchronization strategy and implementation
- **[MODULE-FEDERATION-MIGRATION.md](./MODULE-FEDERATION-MIGRATION.md)** - Module federation setup and migration

### Implementation Guides
- **[IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)** - Comprehensive feature implementation guide
- **[NX-LIBRARIES-MIGRATION.md](./NX-LIBRARIES-MIGRATION.md)** - Nx library structure and migration
- **[MULTI-BRANCH-GUIDE.md](./MULTI-BRANCH-GUIDE.md)** - Multi-branch/multi-tenant implementation

### Progress & Fixes
- **[logs/WEEK-1-PROGRESS.md](./logs/WEEK-1-PROGRESS.md)** - Initial week development progress
- **[logs/FIXES-APPLIED.md](./logs/FIXES-APPLIED.md)** - Bug fixes and improvements log

### Claude AI Context
- **[CLAUDE.md](./CLAUDE.md)** - Samba-specific Claude AI context and guidelines

## Key Features

### Domain Structure
```
libs/samba/domain/
├── product/      - Product management
├── inventory/    - Stock and inventory tracking
├── sale/         - Sales and transactions
├── customer/     - Customer management
├── branch/       - Multi-branch support
├── category/     - Product categorization
└── user/         - User management and permissions
```

### Core Capabilities
- **POS System**: Fast checkout, receipt generation, payment processing
- **Inventory Management**: Stock tracking, alerts, transfers between branches
- **Offline-First**: Works without internet, syncs when online
- **Multi-Branch**: Support for multiple store locations
- **Reports**: Sales reports, inventory reports, financial analytics
- **Real-time Updates**: WebSocket-based real-time synchronization

## Quick Links

### For Feature Development
1. Read [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) for patterns
2. Check [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md) for structure
3. Review [OFFLINE-SYNC-STRATEGY.md](./OFFLINE-SYNC-STRATEGY.md) for data handling

### For Architecture Decisions
1. Review [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md) for domain design
2. Check [MODULE-FEDERATION-MIGRATION.md](./MODULE-FEDERATION-MIGRATION.md) for MFE setup
3. See [NX-LIBRARIES-MIGRATION.md](./NX-LIBRARIES-MIGRATION.md) for library structure

### For Multi-Tenant Features
1. Read [MULTI-BRANCH-GUIDE.md](./MULTI-BRANCH-GUIDE.md)
2. Check branch domain library: `libs/samba/domain/branch`

## Development Workflow

### Adding a New Feature
1. **Domain Layer**: Create entities, services, repository interfaces
2. **Infrastructure Layer**: Implement repository, API calls
3. **Application Layer**: Create facade, state management
4. **Presentation Layer**: Build components, forms, views

### Testing Strategy
- **Unit Tests**: All services, entities, and utilities
- **Integration Tests**: API calls and state management
- **E2E Tests**: Critical user flows (checkout, inventory updates)

## Architecture Principles

### Layered Architecture
```
Presentation (Components)
    ↓
Application (Facades)
    ↓
Domain (Entities, Services)
    ↓
Infrastructure (Repositories, API)
```

### Offline-First Design
- All critical operations work offline
- Queue-based sync mechanism
- Conflict resolution strategies
- Optimistic UI updates

### State Management
- Signal-based state management (Angular 20)
- Facade pattern for business logic
- Immutable state updates
- Time-travel debugging support

## Common Patterns

### Data Flow Pattern
```typescript
Component → Facade → Service → Repository → API
                ↓
              State Store
```

### Offline Operation Pattern
```typescript
1. User Action
2. Optimistic Update (UI)
3. Queue Operation
4. When Online: Sync
5. Update with Server Response
```

## Related Documentation

- **Root**: [../../.claude/](../../.claude/) - Global Claude AI context
- **Shared Components**: [../../libs/shared/components/docs/](../../libs/shared/components/docs/)
- **Infrastructure**: [../../libs/samba/infrastructure/](../../libs/samba/infrastructure/)

## Support & Contact

For questions or issues related to Samba Web development, refer to the documentation above or check the main workspace README.
