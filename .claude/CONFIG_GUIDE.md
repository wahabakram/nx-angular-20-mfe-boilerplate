# Claude AI Context Configuration - Integration Guide

**Effective Date:** December 6, 2025  
**Purpose:** Enable Claude AI to work autonomously as a senior engineer

---

## 📋 What Changed

### Before
- ❌ Claude worked like a freelancer
- ❌ Needed same instructions repeatedly
- ❌ Created solutions without checking existing code
- ❌ Didn't understand architecture deeply
- ❌ Docs scattered everywhere
- ❌ No clear patterns or examples

### After (Now)
- ✅ Claude works as senior engineer
- ✅ Understands context deeply
- ✅ Leverages 100+ existing components
- ✅ Follows established patterns
- ✅ Complete documentation hierarchy
- ✅ Clear implementation guides
- ✅ No repeated instructions needed

---

## 📂 New Documentation Structure

```
.claude/
├── INDEX.md                  # Navigation hub
├── SYSTEM_CONTEXT.md         # Core system context (READ FIRST)
├── QUICK_REFERENCE.md        # Coding reference (open while coding)
├── ARCHITECTURE.md           # Architecture deep dive
├── APP_GUIDE.md              # App-specific implementation
└── CONFIG_GUIDE.md           # This file

ROOT DOCS (already exist):
├── CLAUDE.md                 # Main architectural guide
├── ANGULAR-20-BEST-PRACTICES.md  # Coding standards
└── COMPONENT-MAPPING.md      # Component reference
```

---

## 🎯 How Claude AI Should Use These Docs

### When Starting a Task
1. **Reference SYSTEM_CONTEXT** for project context
2. **Check QUICK_REFERENCE** for appropriate template
3. **Review APP_GUIDE** for app-specific patterns
4. **Verify with checklist** before considering complete

### When Implementing a Feature
1. **Search existing code** - Check apps and libs first
2. **Reference shell app** - Use as pattern source
3. **Use appropriate template** - From QUICK_REFERENCE
4. **Follow standards** - From ANGULAR-20-BEST-PRACTICES
5. **🚨 CRITICAL: Check existing components FIRST** - 100+ components in @ng-mf/components, Shell app has all patterns

### When Making Architecture Decisions
1. **Review ARCHITECTURE.md** - Understand structure
2. **Check project patterns** - What's already done
3. **Reference best practices** - ANGULAR-20-BEST-PRACTICES
4. **Consider scalability** - DDD, modular approach
5. **Verify with SYSTEM_CONTEXT** - Alignment with approach

---

## 💡 Key Claude AI Behaviors

### Do This
✅ **Leverage existing** - Check shell app, shared components  
✅ **Use domain stores** - @samba/* for business logic  
✅ **Follow patterns** - Shell app is reference  
✅ **Think like senior** - Make decisions, don't ask repeatedly  
✅ **Optimize for reuse** - Don't recreate existing code  
✅ **Maintain consistency** - Follow established standards  

### Don't Do This
❌ **Ask for same instruction twice** - Context is stored  
❌ **Create custom components** - Check shared library first  
❌ **Ignore existing patterns** - Shell app shows the way  
❌ **Skip architecture** - Understand DDD, MFE, signals  
❌ **Reinvent solutions** - 100+ components available  
❌ **Work in isolation** - Reference established code  

---

## 🚀 Usage by Scenario

### Scenario 1: "Build a product list page"
```
Process:
1. Check apps/shell/src/app/ for similar page
2. Find SAMBA product list (if building for SAMBA)
3. Reference QUICK_REFERENCE data table template
4. Use Datatable component from @ng-mf/components
5. Inject ProductStore from @samba/product-domain
6. Build with shared components
7. Verify checklist
Done! No questions needed.
```

### Scenario 2: "Add a new metric widget to sales dashboard"
```
Process:
1. Check apps/shell/src/app/widgets/_widgets/ for examples
2. Reference QUICK_REFERENCE dashboard widget template
3. Create new widget component in SAMBA
4. Inject SaleStore for data
5. Use Panel component from shared library
6. Add to dashboard config
7. Verify checklist
Done! Pattern is clear.
```

### Scenario 3: "Create invoice form"
```
Process:
1. Check Invoicely for form patterns
2. Reference QUICK_REFERENCE form templates
3. Use FormRenderer or reactive forms
4. Add validation rules
5. Handle submission
6. Verify responsive design
7. Complete checklist
Done! Template is provided.
```

### Scenario 4: "Set up new SAMBA feature domain"
```
Process:
1. Review ARCHITECTURE.md domain section
2. Check existing @samba/product-domain pattern
3. Create domain structure:
   - models/
   - store/
   - services/
   - index.ts
4. Export from libs/samba/domain/index
5. Test and verify
Done! Pattern exists.
```

---

## ✅ Implementation Verification

Before considering work complete:

### Code Quality ✓
- [ ] No console errors or warnings
- [ ] TypeScript strict mode passes
- [ ] Used shared components where possible
- [ ] No duplication of code
- [ ] Proper error handling

### Architecture ✓
- [ ] Follows established pattern
- [ ] Uses domain stores (if SAMBA)
- [ ] Components are standalone
- [ ] File naming is correct
- [ ] Folder structure is consistent

### Design ✓
- [ ] Responsive (mobile-first)
- [ ] Accessible (ARIA, semantic HTML)
- [ ] Material Design 3 compliant
- [ ] Tailwind utilities used
- [ ] Loading/error states handled

### Testing ✓
- [ ] Unit tests added/updated
- [ ] Happy path covered
- [ ] No test failures
- [ ] E2E tests updated if needed
- [ ] Manual testing done

### Documentation ✓
- [ ] Code is clear and commented
- [ ] Complex logic explained
- [ ] Reusable patterns noted
- [ ] Team can maintain it

---

## 📊 Context Map

```
Where Claude Gets Context
│
├─→ SYSTEM_CONTEXT.md
│   └─→ Project overview, patterns, standards
│
├─→ QUICK_REFERENCE.md
│   └─→ Templates, checklists, examples
│
├─→ ARCHITECTURE.md
│   └─→ App structure, libraries, MFE setup
│
├─→ APP_GUIDE.md
│   └─→ App-specific patterns & workflows
│
├─→ Workspace Code
│   ├─→ Shell app (reference)
│   ├─→ SAMBA app (main)
│   └─→ Invoicely app (example)
│
├─→ Shared Libraries
│   ├─→ @ng-mf/components (100+ UI)
│   ├─→ @samba/*/domain (business logic)
│   └─→ Shared styles & theming
│
└─→ Root Documentation
    ├─→ CLAUDE.md (main guide)
    ├─→ ANGULAR-20-BEST-PRACTICES.md (standards)
    └─→ COMPONENT-MAPPING.md (component reference)
```

---

## 🔑 Critical Success Factors

### 1. Use Shell App as Reference ⭐⭐⭐
- Every new feature should check shell app first
- Patterns exist for: dashboards, widgets, forms, auth
- Styling follows shell app standards

### 2. Leverage Shared Components ⭐⭐⭐
- 100+ components available
- Reuse before creating
- Check COMPONENT-MAPPING.md first

### 3. Follow Domain-Driven Design ⭐⭐⭐
- Use @samba/* domain stores for business logic
- Signals for reactivity
- Services handle API calls

### 4. Maintain Consistency ⭐⭐
- Follow established file naming
- Use consistent folder structure
- Apply same styling approach

### 5. Test Before Delivering ⭐⭐
- Verify responsive design
- Check accessibility
- Run unit & E2E tests

---

## 🎓 Learning for Claude AI

### What Claude Should Know
- ✅ 100+ shared components available
- ✅ 8+ domain stores for business logic
- ✅ Shell app shows all patterns
- ✅ Signals are the state management
- ✅ Standalone components required
- ✅ Tailwind + Material Design 3
- ✅ Module federation setup
- ✅ TypeScript strict mode

### What Claude Should Do
- ✅ Check existing code first
- ✅ Use templates from QUICK_REFERENCE
- ✅ Reference shell app patterns
- ✅ Inject domain stores
- ✅ Use shared components
- ✅ Follow naming conventions
- ✅ Test before completing
- ✅ Think autonomously

### What Claude Should Avoid
- ❌ Creating components that exist
- ❌ Ignoring shell app patterns
- ❌ Using services instead of stores
- ❌ Non-standalone components
- ❌ Repeating code
- ❌ Wrong naming conventions
- ❌ Inconsistent styling
- ❌ Asking for repeated instructions

---

## 🔄 Feedback Loop

### How This Works
1. **Documentation provides context** - SYSTEM_CONTEXT, ARCHITECTURE, guides
2. **Claude uses context** - Makes informed decisions
3. **Code follows patterns** - Consistent with project
4. **Quality improves** - Faster, better implementations
5. **Cost reduces** - No repeated instructions

### Continuous Improvement
- If patterns change → Update documentation
- If new decisions → Add to APP_GUIDE
- If new components → Update COMPONENT-MAPPING
- If new standards → Update ANGULAR-20-BEST-PRACTICES

---

## 📞 Quick Help

**I need to...**

- Build a dashboard → Check apps/shell/src/app/dashboard/analytics/
- Create a widget → Use QUICK_REFERENCE widget template
- Build a form → Reference FormRenderer in COMPONENT-MAPPING.md
- Understand architecture → Read ARCHITECTURE.md
- Know best practices → Check ANGULAR-20-BEST-PRACTICES.md
- Find component API → Search COMPONENT-MAPPING.md
- Implement SAMBA feature → Read apps/samba-web/CLAUDE.md

---

## 🎉 Result

### Before
- Manual instructions each time
- High token usage
- Repeated context
- Lower quality

### After
- Autonomous decisions
- Reduced token usage
- Consistent context
- Higher quality
- Better architecture adherence
- Faster implementation
- Lower overall cost

---

## 📝 Implementation Checklist

To set up Claude AI properly:

- [ ] Read SYSTEM_CONTEXT.md completely
- [ ] Understand QUICK_REFERENCE templates
- [ ] Review ARCHITECTURE.md overview
- [ ] Study APP_GUIDE.md
- [ ] Check shell app code
- [ ] Review component library
- [ ] Understand domain libraries
- [ ] Review best practices
- [ ] Test with new feature
- [ ] Verify quality

---

## 🚀 Ready to Start

Claude AI is now configured to:
1. ✅ Work autonomously as senior engineer
2. ✅ Leverage existing code effectively
3. ✅ Follow established patterns
4. ✅ Make architecture decisions
5. ✅ Reduce repeated instructions
6. ✅ Improve code quality
7. ✅ Optimize costs
8. ✅ Maintain consistency

**Start with any feature request - the context is ready!**

---

**Version:** 2.0 | **Date:** December 6, 2025 | **Status:** ✅ Ready
