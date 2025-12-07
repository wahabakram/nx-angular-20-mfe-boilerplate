# Documentation Index - Complete Guide

**Last Updated:** December 7, 2025  
**Version:** 3.0 (Organized Structure)

---

## 📚 Documentation Organization

This workspace has a comprehensive, organized documentation structure designed for both AI assistants (Claude) and human developers.

---

## 🎯 Quick Start

### For AI Assistants (Claude)
1. **Start here:** [.claude/SENIOR_ENGINEER.md](./.claude/SENIOR_ENGINEER.md) - Understand your role as a senior engineer
2. **Then read:** [.claude/INDEX.md](./.claude/INDEX.md) - Navigation and workflow guide
3. **Reference:** [.claude/SYSTEM_CONTEXT.md](./.claude/SYSTEM_CONTEXT.md) - Project context and patterns

### For Human Developers
1. **Start here:** [README.md](./README.md) - Project setup and overview
2. **Then read:** [.claude/INDEX.md](./.claude/INDEX.md) - Documentation navigation
3. **Reference:** App-specific docs in `apps/*/docs/` directories

---

## 📁 Documentation Structure

### 🤖 Core AI Context (`.claude/`)

Essential documentation for AI assistants to work as senior engineers:

| File | Purpose | When to Use |
|------|---------|-------------|
| **[SENIOR_ENGINEER.md](./.claude/SENIOR_ENGINEER.md)** | Role definition, decision framework, standards | Before ANY task |
| **[INDEX.md](./.claude/INDEX.md)** | Documentation navigation and workflows | Finding the right doc |
| **[SYSTEM_CONTEXT.md](./.claude/SYSTEM_CONTEXT.md)** | Project structure, patterns, conventions | Understanding project |
| **[ARCHITECTURE.md](./.claude/ARCHITECTURE.md)** | Deep architectural knowledge | Planning & design |
| **[README.md](./.claude/README.md)** | Implementation guides and examples | Implementing features |
| **[APP_GUIDE.md](./.claude/APP_GUIDE.md)** | App-specific implementation details | App development |
| **[QUICK_REFERENCE.md](./.claude/QUICK_REFERENCE.md)** | Quick lookup reference | Daily development |
| **[ANGULAR-20-BEST-PRACTICES.md](./.claude/ANGULAR-20-BEST-PRACTICES.md)** | Angular 20 patterns | Using Angular 20 features |
| **[CONFIG_GUIDE.md](./.claude/CONFIG_GUIDE.md)** | Context usage guide | Optimizing AI usage |

---

### 🌐 Shell Application (`apps/shell/docs/`)

Module Federation orchestrator and main navigation:

- **[README.md](./apps/shell/docs/README.md)** - Shell overview and architecture
- **[PHASE_3_PROGRESS.md](./apps/shell/docs/PHASE_3_PROGRESS.md)** - Development progress
- **[PHASE_3_COMPLETE.md](./apps/shell/docs/PHASE_3_COMPLETE.md)** - Completion summary

**Topics covered:**
- Module Federation setup
- Remote app loading
- Navigation and routing
- Theme management
- Authentication

---

### 🏪 Samba Web Application (`apps/samba-web/docs/`)

Point of Sale and inventory management system:

- **[README.md](./apps/samba-web/docs/README.md)** - Samba overview
- **[DDD-ARCHITECTURE.md](./apps/samba-web/docs/DDD-ARCHITECTURE.md)** - Domain-driven design
- **[OFFLINE-SYNC-STRATEGY.md](./apps/samba-web/docs/OFFLINE-SYNC-STRATEGY.md)** - Offline capabilities
- **[IMPLEMENTATION-GUIDE.md](./apps/samba-web/docs/IMPLEMENTATION-GUIDE.md)** - Feature implementation
- **[MODULE-FEDERATION-MIGRATION.md](./apps/samba-web/docs/MODULE-FEDERATION-MIGRATION.md)** - MFE setup
- **[MULTI-BRANCH-GUIDE.md](./apps/samba-web/docs/MULTI-BRANCH-GUIDE.md)** - Multi-branch support
- **[NX-LIBRARIES-MIGRATION.md](./apps/samba-web/docs/NX-LIBRARIES-MIGRATION.md)** - Library structure
- **[WEEK-1-PROGRESS.md](./apps/samba-web/docs/WEEK-1-PROGRESS.md)** - Initial progress
- **[FIXES-APPLIED.md](./apps/samba-web/docs/FIXES-APPLIED.md)** - Bug fixes log
- **[CLAUDE.md](./apps/samba-web/docs/CLAUDE.md)** - Samba-specific AI context

**Topics covered:**
- POS system implementation
- Inventory management
- Offline-first architecture
- Multi-branch/multi-tenant
- Domain-driven design

---

### 📄 Invoicely Application (`apps/invoicely/docs/`)

Invoice and payment management system:

- **[README.md](./apps/invoicely/docs/README.md)** - Invoicely overview and guide

**Topics covered:**
- Invoice lifecycle management
- Client management
- Payment tracking
- Reporting and analytics

---

### 🧩 Web Components (`apps/webcomponents/docs/`)

Framework-agnostic web components library:

- **[README.md](./apps/webcomponents/docs/README.md)** - Web components overview
- **[WEBCOMPONENTS_SUMMARY.md](./apps/webcomponents/docs/WEBCOMPONENTS_SUMMARY.md)** - Implementation summary
- **[WEBCOMPONENTS_FINAL_SUMMARY.md](./apps/webcomponents/docs/WEBCOMPONENTS_FINAL_SUMMARY.md)** - Final summary

**Topics covered:**
- Angular Elements integration
- Custom web components
- Module Federation exposure
- Cross-framework usage

---

### 🎨 Shared Components Library (`libs/shared/components/docs/`)

70+ reusable UI components:

- **[README.md](./libs/shared/components/docs/README.md)** - Component library overview
- **[COMPONENT-MAPPING.md](./libs/shared/components/docs/COMPONENT-MAPPING.md)** - Complete component inventory
- **[COMPONENT_API_FIXES.md](./libs/shared/components/docs/COMPONENT_API_FIXES.md)** - API changes and migration

**Topics covered:**
- Component inventory (70+ components)
- Usage guidelines
- API documentation
- Theming and customization
- Testing patterns

---

## 🗺️ Documentation by Use Case

### "I'm new to this project"
1. [README.md](./README.md) - Project setup
2. [.claude/INDEX.md](./.claude/INDEX.md) - Documentation navigation
3. [.claude/SYSTEM_CONTEXT.md](./.claude/SYSTEM_CONTEXT.md) - Project overview
4. [.claude/ARCHITECTURE.md](./.claude/ARCHITECTURE.md) - Architecture deep dive

### "I need to work on the Shell app"
1. [apps/shell/docs/README.md](./apps/shell/docs/README.md) - Shell overview
2. [.claude/APP_GUIDE.md](./.claude/APP_GUIDE.md) - Shell patterns
3. [.claude/ARCHITECTURE.md](./.claude/ARCHITECTURE.md) - Module Federation details

### "I need to add a feature to Samba"
1. [apps/samba-web/docs/README.md](./apps/samba-web/docs/README.md) - Samba overview
2. [apps/samba-web/docs/DDD-ARCHITECTURE.md](./apps/samba-web/docs/DDD-ARCHITECTURE.md) - DDD patterns
3. [apps/samba-web/docs/IMPLEMENTATION-GUIDE.md](./apps/samba-web/docs/IMPLEMENTATION-GUIDE.md) - Implementation guide
4. [.claude/SENIOR_ENGINEER.md](./.claude/SENIOR_ENGINEER.md) - Quality standards

### "I need to use a shared component"
1. [libs/shared/components/docs/COMPONENT-MAPPING.md](./libs/shared/components/docs/COMPONENT-MAPPING.md) - Find component
2. [libs/shared/components/docs/README.md](./libs/shared/components/docs/README.md) - Usage guide
3. [.claude/QUICK_REFERENCE.md](./.claude/QUICK_REFERENCE.md) - Quick syntax

### "I need to create a new component"
1. [.claude/SENIOR_ENGINEER.md](./.claude/SENIOR_ENGINEER.md) - Standards first
2. [libs/shared/components/docs/README.md](./libs/shared/components/docs/README.md) - Check if exists
3. [.claude/README.md](./.claude/README.md) - Implementation guide
4. [.claude/QUICK_REFERENCE.md](./.claude/QUICK_REFERENCE.md) - Templates

### "I need to work with offline sync"
1. [apps/samba-web/docs/OFFLINE-SYNC-STRATEGY.md](./apps/samba-web/docs/OFFLINE-SYNC-STRATEGY.md) - Offline strategy
2. [apps/samba-web/docs/IMPLEMENTATION-GUIDE.md](./apps/samba-web/docs/IMPLEMENTATION-GUIDE.md) - Implementation
3. [.claude/ARCHITECTURE.md](./.claude/ARCHITECTURE.md) - Architecture context

### "I need to understand Module Federation"
1. [.claude/ARCHITECTURE.md](./.claude/ARCHITECTURE.md) - MFE overview
2. [apps/shell/docs/README.md](./apps/shell/docs/README.md) - Shell MFE setup
3. [apps/samba-web/docs/MODULE-FEDERATION-MIGRATION.md](./apps/samba-web/docs/MODULE-FEDERATION-MIGRATION.md) - Migration guide

### "I need to understand the domain libraries"
1. [apps/samba-web/docs/DDD-ARCHITECTURE.md](./apps/samba-web/docs/DDD-ARCHITECTURE.md) - DDD patterns
2. [apps/samba-web/docs/NX-LIBRARIES-MIGRATION.md](./apps/samba-web/docs/NX-LIBRARIES-MIGRATION.md) - Library structure
3. [.claude/ARCHITECTURE.md](./.claude/ARCHITECTURE.md) - Domain layer architecture

---

## 📊 Documentation Hierarchy

```
workspace/
│
├── DOCS_INDEX.md                          ← You are here (master index)
├── README.md                              ← Project setup and overview
├── CLAUDE.md                              ← Root architecture guide
│
├── .claude/                               ← Core AI context
│   ├── INDEX.md                          ← Documentation navigation
│   ├── SENIOR_ENGINEER.md                ← Role & standards (START HERE for AI)
│   ├── SYSTEM_CONTEXT.md                 ← Project context
│   ├── ARCHITECTURE.md                   ← Deep architecture
│   ├── README.md                         ← Implementation guides
│   ├── APP_GUIDE.md                      ← App-specific patterns
│   ├── QUICK_REFERENCE.md                ← Daily reference
│   ├── ANGULAR-20-BEST-PRACTICES.md      ← Angular 20 patterns
│   └── CONFIG_GUIDE.md                   ← Context usage
│
├── apps/
│   ├── shell/docs/                       ← Shell app documentation
│   │   ├── README.md
│   │   ├── PHASE_3_PROGRESS.md
│   │   └── PHASE_3_COMPLETE.md
│   │
│   ├── samba-web/docs/                   ← Samba app documentation
│   │   ├── README.md
│   │   ├── CLAUDE.md
│   │   ├── DDD-ARCHITECTURE.md
│   │   ├── OFFLINE-SYNC-STRATEGY.md
│   │   ├── IMPLEMENTATION-GUIDE.md
│   │   ├── MODULE-FEDERATION-MIGRATION.md
│   │   ├── MULTI-BRANCH-GUIDE.md
│   │   ├── NX-LIBRARIES-MIGRATION.md
│   │   ├── WEEK-1-PROGRESS.md
│   │   └── FIXES-APPLIED.md
│   │
│   ├── invoicely/docs/                   ← Invoicely documentation
│   │   └── README.md
│   │
│   └── webcomponents/docs/               ← Web components documentation
│       ├── README.md
│       ├── WEBCOMPONENTS_SUMMARY.md
│       └── WEBCOMPONENTS_FINAL_SUMMARY.md
│
└── libs/shared/components/docs/          ← Shared components documentation
    ├── README.md
    ├── COMPONENT-MAPPING.md
    └── COMPONENT_API_FIXES.md
```

---

## 🎯 Key Principles

### For AI Assistants
1. **Always start with** `.claude/SENIOR_ENGINEER.md` - Understand your role
2. **Think like a senior engineer** - Question, improve, lead
3. **Use organized docs** - Navigate via `.claude/INDEX.md`
4. **Check app-specific docs** - Each app has detailed guides
5. **Reuse before creating** - Check component library first

### For Human Developers
1. **Use this index** - Find the right documentation quickly
2. **App-specific docs** - Deep dive into specific applications
3. **Component library** - 70+ components available
4. **Follow patterns** - Established patterns in docs
5. **Keep docs updated** - Documentation is living

---

## 🔄 Documentation Maintenance

### When to Update
- Adding new features
- Changing architecture
- Creating new components
- Fixing bugs (document in FIXES-APPLIED.md)
- Learning new patterns

### Where to Update
- **App changes** → `apps/*/docs/`
- **Component changes** → `libs/shared/components/docs/`
- **Architecture changes** → `.claude/ARCHITECTURE.md`
- **Pattern changes** → `.claude/SYSTEM_CONTEXT.md` and app docs

---

## 📞 Need Help?

### Can't find documentation?
1. Check this index (DOCS_INDEX.md)
2. Check `.claude/INDEX.md` for AI context
3. Check app-specific `docs/` directory
4. Check component library docs

### Documentation unclear?
1. Review related documentation
2. Check code examples in Shell app
3. Update documentation with learnings
4. Add clarifying examples

---

## ✅ Documentation Quality Standards

All documentation in this workspace follows these standards:

- **Clear structure** - Logical organization with headers
- **Practical examples** - Real code examples
- **Up-to-date** - Reflects current codebase
- **Searchable** - Good keywords and structure
- **Comprehensive** - Covers all major topics
- **Navigable** - Clear links between documents

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Read this index (DOCS_INDEX.md)
- [ ] Review README.md (project setup)
- [ ] Read .claude/SENIOR_ENGINEER.md (if using AI)
- [ ] Review .claude/SYSTEM_CONTEXT.md (project overview)

### Week 2: Deep Dive
- [ ] Study .claude/ARCHITECTURE.md (architecture)
- [ ] Review Shell app docs (reference implementation)
- [ ] Review Samba app docs (main application)
- [ ] Check component library docs (available components)

### Week 3: Specialized
- [ ] Deep dive into app you're working on
- [ ] Study relevant domain patterns
- [ ] Review offline sync (if relevant)
- [ ] Master Module Federation (if relevant)

---

## 📈 Version History

- **v3.0** (Dec 7, 2025) - Organized structure with app-specific docs
- **v2.0** (Dec 6, 2025) - Enhanced AI context
- **v1.0** (Nov 2025) - Initial documentation

---

## 🎯 Quick Links

- **Getting Started:** [README.md](./README.md)
- **AI Navigation:** [.claude/INDEX.md](./.claude/INDEX.md)
- **Senior Engineer Guide:** [.claude/SENIOR_ENGINEER.md](./.claude/SENIOR_ENGINEER.md)
- **Architecture:** [.claude/ARCHITECTURE.md](./.claude/ARCHITECTURE.md)
- **Component Library:** [libs/shared/components/docs/](./libs/shared/components/docs/)
- **Shell App:** [apps/shell/docs/](./apps/shell/docs/)
- **Samba App:** [apps/samba-web/docs/](./apps/samba-web/docs/)

---

**Remember:** Documentation is a living resource. Keep it updated, clear, and helpful!

---

*Master Documentation Index v3.0 (December 7, 2025)*
