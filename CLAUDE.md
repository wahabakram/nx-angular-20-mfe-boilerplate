<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

---

# SAMBA ERP Development Guidelines

## Critical Rules - MUST FOLLOW

### 1. Styling Files
**ALWAYS use `.scss` files, NEVER use `.css` files**
- When generating new components, always create `.scss` files
- Component decorator must use: `styleUrl: './component-name.scss'`
- If you accidentally create a `.css` file, immediately rename it to `.scss` and update the component decorator

### 2. UI Components Priority
**Follow this order when implementing UI features:**

1. **First Priority: Check Shell App** (`apps/shell/src/app/`)
   - The shell app contains reference implementations for common UI patterns
   - Auth components: `apps/shell/src/app/auth/` (signin, signup, forgot-password, etc.)
   - Always examine shell app components BEFORE creating new components
   - Replicate the exact same UI patterns, styles, and component structure

2. **Second Priority: Check Shared Libraries** (`libs/`)
   - Search for existing reusable components in `@ng-mf/components` and other shared libs
   - Common components like Logo, HorizontalDivider, etc. are already available
   - Use: `import { Logo, HorizontalDivider } from '@ng-mf/components';`

3. **Third Priority: Use Angular Material**
   - **ALWAYS prefer Angular Material components over custom implementations**
   - Common Material imports:
     ```typescript
     import { MatButton } from '@angular/material/button';
     import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
     import { MatInput } from '@angular/material/input';
     ```
   - Use Material form fields with mat-form-field, mat-label, and mat-error
   - Use Material buttons with `mat-flat-button` or `mat-raised-button`

4. **Last Resort: Custom Components**
   - Only create custom components when no existing solution is available
   - Even then, follow the shell app's styling patterns and Material Design principles

### 3. Component Structure Pattern (From Shell App)
When creating new components, follow this exact structure from shell app:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { HorizontalDivider, Logo } from '@ng-mf/components';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-component-name',
  imports: [
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    HorizontalDivider,
    Logo,
    ReactiveFormsModule
  ],
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss'  // ALWAYS .scss, never .css
})
export class ComponentName {
  // Component logic
}
```

### 4. Template Pattern (From Shell App)
Use Material Typography and proper layout structure:

```html
<div class="flex flex-wrap h-screen mat-typography">
  <!-- Use mat-typography class for consistent typography -->
  <div class="flex w-full flex-col md:w-1/2 h-screen">
    <!-- Logo -->
    <div>
      <a mf-logo routerLink="/">APP NAME</a>
    </div>

    <!-- Form content -->
    <div class="grow px-10 md:px-20 flex items-center justify-center overflow-y-auto">
      <div class="w-[500px]">
        <h2>Page Title</h2>
        <p class="mt-2 text-left text-neutral-500 text-sm">Description</p>

        <!-- Form with Material components -->
        <form class="flex flex-col pt-3 md:pt-8" [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Field Label</mat-label>
            <input type="text" matInput formControlName="fieldName">
            @if (hasError('fieldName', 'required')) {
              <mat-error>Field is required</mat-error>
            }
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="!h-12 mt-5">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Right side image (optional) -->
  <div class="pointer-events-none relative hidden h-screen flex items-center
              justify-center select-none bg-surface-container md:flex md:w-1/2">
    <img class="z-1 max-w-[80%] w-full mx-auto" ngSrc="assets/image.svg" alt="Image" fill>
  </div>
</div>
```

### 5. File Naming Convention
**Angular 20 Style (No Suffixes for SAMBA ERP)**
- Component: `login.ts`, `admin-dashboard.ts` (NOT `login.component.ts`)
- Template: `login.html` (NOT `login.component.html`)
- Styles: `login.scss` (NOT `login.component.scss`)
- Component class: `export class Login` (NOT `LoginComponent`)

### 6. Domain Model Alignment
**Always align with domain models in libs**
- User model: `libs/samba/domain/user/src/lib/models/user.model.ts`
  ```typescript
  interface User {
    id: number;
    username: string;  // NOT email for login
    email: string;
    firstName: string;  // NOT name
    lastName: string;   // Use firstName + lastName
    role: UserRole;
    branchId: number;
    isActive: boolean;
  }

  interface LoginCredentials {
    username: string;  // NOT email
    password: string;
  }
  ```

### 7. Development Workflow Checklist
Before creating ANY new component:
- [ ] Check `apps/shell/src/app/` for similar existing components
- [ ] Check `libs/` for reusable shared components
- [ ] Import and use `@ng-mf/components` (Logo, HorizontalDivider, etc.)
- [ ] Import Angular Material components
- [ ] Create `.scss` file (NEVER `.css`)
- [ ] Use Angular 20 naming (no `.component` suffix)
- [ ] Follow shell app's layout and styling patterns
- [ ] Use `mat-typography` class on root element
- [ ] Use reactive forms with proper validation
- [ ] Align with domain models in libs

### 8. UI Consistency Standards
- **Typography**: Use Material Typography (`mat-typography` class)
- **Colors**: Use Tailwind/Material color tokens (primary, error, neutral-500, etc.)
- **Layout**: Two-column layout for auth pages (form left, image right)
- **Forms**: Always use Angular Material form fields
- **Buttons**: Use `mat-flat-button` or `mat-raised-button` with `color="primary"`
- **Spacing**: Follow Tailwind spacing utilities (mt-4, px-10, etc.)
- **Responsive**: Use `md:` breakpoint prefixes for responsive design

---

## Quick Reference

### Component Generation Example
```bash
# When creating a new component, remember:
# 1. Check shell app first: apps/shell/src/app/auth/signin/
# 2. Use .scss not .css
# 3. Import Material components
# 4. Import @ng-mf/components
# 5. Follow Angular 20 naming (no .component suffix)
```

### Common Imports
```typescript
// Material Components (ALWAYS USE THESE)
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

// Shared Components (CHECK THESE FIRST)
import { Logo, HorizontalDivider } from '@ng-mf/components';

// Domain Services (USE FOR BUSINESS LOGIC)
import { AuthService, AuthStore } from '@samba/user-domain';

// Angular Core
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
```

### Shell App Reference Components
Check these BEFORE creating new components:
- **Auth Pages**: `apps/shell/src/app/auth/`
  - signin, signup, create-account, forgot-password, password-reset
- **Common Components**: Check `@ng-mf/components` library

---

## Remember
1. **SCSS, not CSS** - This is non-negotiable
2. **Check shell app first** - Don't reinvent the wheel
3. **Use Material components** - They're already styled and tested
4. **Reuse shared libs** - @ng-mf/components has many ready-to-use components
5. **Follow existing patterns** - Consistency is key for maintainability