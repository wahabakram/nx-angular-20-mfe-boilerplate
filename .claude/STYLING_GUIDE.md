# Styling Guide - Tailwind CSS 4 + SCSS

**Last Updated:** December 7, 2025  
**Tailwind Version:** 4.1.16  
**Philosophy:** Utility-First, Modern UI, Accessible, Responsive

---

## 📖 Table of Contents

1. [Philosophy & Principles](#philosophy--principles)
2. [Tailwind CSS 4 Setup](#tailwind-css-4-setup)
3. [Component Styling Patterns](#component-styling-patterns)
4. [SCSS Usage Guidelines](#scss-usage-guidelines)
5. [Theme System](#theme-system)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)
8. [Modern UI Patterns](#modern-ui-patterns)
9. [Performance Best Practices](#performance-best-practices)
10. [Common Patterns](#common-patterns)

---

## Philosophy & Principles

### Core Principles

1. **Utility-First**: Use Tailwind CSS classes over custom styles
2. **Component Consistency**: Maintain consistent spacing, colors, and typography
3. **Accessibility First**: WCAG 2.1 AA compliance minimum
4. **Responsive by Default**: Mobile-first approach
5. **Theme Support**: Dark mode and multiple theme support
6. **Performance**: Minimize custom CSS, leverage Tailwind's optimization

### When to Use What

| Scenario | Use |
|----------|-----|
| Layout, spacing, colors | Tailwind utility classes |
| Theme variables | CSS custom properties |
| Component-specific styles | SCSS with BEM if needed |
| Global styles | Minimal, in `styles.scss` |
| Animations | Tailwind classes or CSS custom properties |

---

## Tailwind CSS 4 Setup

### Configuration

Your project uses Tailwind CSS 4 with PostCSS:

```json
// .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Import in Styles

```scss
// apps/*/src/styles.scss
@use "libs/shared/styles/themes/coffee";
@use './themes/customization';
```

### Tailwind CSS 4 Features

- **Native CSS**: Uses modern CSS features
- **CSS Variables**: Better theming support
- **JIT Compilation**: Faster builds
- **Improved DX**: Better IntelliSense

---

## Component Styling Patterns

### ✅ DO: Use Tailwind Utilities

```typescript
@Component({
  selector: 'app-product-card',
  template: `
    <div class="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <img [src]="product().image" [alt]="product().name" class="w-full h-48 object-cover rounded-md" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ product().name }}</h3>
      <p class="text-gray-600 dark:text-gray-300">{{ product().description }}</p>
      <div class="flex items-center justify-between mt-auto">
        <span class="text-2xl font-bold text-primary-600">{{ product().price | currency }}</span>
        <button class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  `
})
export class ProductCard {
  product = input.required<Product>();
}
```

### ❌ DON'T: Use Custom Styles

```typescript
// ❌ BAD - Custom styles
@Component({
  template: `<div class="custom-card">...</div>`,
  styles: [`
    .custom-card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
```

---

## SCSS Usage Guidelines

### When to Use SCSS

SCSS should be used **sparingly** and only for:

1. **Theme variables** (CSS custom properties)
2. **Global resets** (minimal)
3. **Component-specific complex styles** (rare cases)
4. **Third-party library overrides** (when necessary)

### Theme Variables Pattern

```scss
// apps/*/src/themes/_customization.scss
:root {
  // Use Tailwind theme() function
  --mat-sys-corner-medium: theme(--radius-3xl);
  --mat-card-outlined-container-shape: theme(--radius-3xl);
  
  // Custom theme colors (use Tailwind color palette)
  --color-surface-container-lowest: theme(colors.gray.50);
  --color-surface-container: theme(colors.gray.100);
}

html.dark {
  --color-surface-container-lowest: theme(colors.gray-900);
  --color-surface-container: theme(colors.gray.800);
}
```

### ✅ GOOD: Minimal SCSS for Complex Patterns

```scss
// Only when Tailwind can't handle it
.widget-container {
  display: block;
  background: var(--color-surface-container-lowest);
  border-radius: theme(--radius-3xl);
  box-shadow: theme(--shadow-xs);
  
  // Use Tailwind classes for everything else
  // This is just for reusable container styling
}
```

### ❌ BAD: Overusing SCSS

```scss
// ❌ Don't do this - use Tailwind classes instead
.button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  
  &:hover {
    background-color: #2563eb;
  }
}
```

---

## Theme System

### Dark Mode Support

Always support both light and dark modes:

```typescript
@Component({
  template: `
    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 class="text-2xl font-bold">Hello World</h1>
      <p class="text-gray-600 dark:text-gray-400">Description</p>
    </div>
  `
})
```

### Theme Colors

Use Tailwind's color palette with semantic naming:

```typescript
// ✅ GOOD - Semantic color classes
class="bg-primary-600 text-white hover:bg-primary-700"
class="bg-success-500 text-white"
class="bg-error-600 text-white"
class="bg-warning-500 text-gray-900"

// ✅ GOOD - Neutral colors for surfaces
class="bg-gray-50 dark:bg-gray-900"
class="bg-gray-100 dark:bg-gray-800"
class="bg-white dark:bg-gray-950"

// ❌ BAD - Hardcoded colors
class="bg-[#3b82f6]"  // Use bg-blue-500 instead
class="text-[#000000]" // Use text-gray-900 instead
```

### CSS Variables for Dynamic Theming

```typescript
@Component({
  template: `
    <div [style.background-color]="'var(--color-surface-container)'">
      Content with theme variable
    </div>
  `
})
```

---

## Responsive Design

### Mobile-First Approach

Always design for mobile first, then add larger breakpoints:

```typescript
@Component({
  template: `
    <!-- Mobile: Stack vertically -->
    <!-- Tablet: 2 columns -->
    <!-- Desktop: 3 columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card">Card 1</div>
      <div class="card">Card 2</div>
      <div class="card">Card 3</div>
    </div>
  `
})
```

### Tailwind Breakpoints

```typescript
// Breakpoints (Tailwind defaults)
sm:  640px  // Small devices
md:  768px  // Tablets
lg:  1024px // Laptops
xl:  1280px // Desktops
2xl: 1536px // Large desktops

// Example usage
class="text-sm md:text-base lg:text-lg xl:text-xl"
class="p-4 md:p-6 lg:p-8"
class="hidden md:block" // Hide on mobile, show on tablet+
```

### Responsive Patterns

#### 1. Responsive Grid

```typescript
@Component({
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      @for (item of items(); track item.id) {
        <div class="card">{{ item.name }}</div>
      }
    </div>
  `
})
```

#### 2. Responsive Flexbox

```typescript
@Component({
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <aside class="w-full md:w-64">Sidebar</aside>
      <main class="flex-1">Main Content</main>
    </div>
  `
})
```

#### 3. Responsive Typography

```typescript
@Component({
  template: `
    <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
      Responsive Heading
    </h1>
    <p class="text-sm md:text-base lg:text-lg">
      Responsive paragraph text
    </p>
  `
})
```

#### 4. Responsive Spacing

```typescript
@Component({
  template: `
    <div class="p-4 md:p-6 lg:p-8 xl:p-12">
      <div class="space-y-4 md:space-y-6 lg:space-y-8">
        <section>Section 1</section>
        <section>Section 2</section>
      </div>
    </div>
  `
})
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### 1. Color Contrast

```typescript
// ✅ GOOD - High contrast
class="bg-gray-900 text-white"        // 15:1 ratio
class="bg-blue-600 text-white"        // 4.5:1 ratio
class="text-gray-900 dark:text-white" // Theme-aware

// ❌ BAD - Low contrast
class="bg-gray-300 text-gray-400"     // Insufficient contrast
class="text-gray-500"                 // May not meet standards
```

#### 2. Focus Indicators

Always provide visible focus indicators:

```typescript
@Component({
  template: `
    <button class="
      px-4 py-2 
      bg-primary-600 text-white 
      rounded-md
      hover:bg-primary-700
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      transition-all
    ">
      Accessible Button
    </button>
  `
})
```

#### 3. Keyboard Navigation

```typescript
@Component({
  template: `
    <div
      tabindex="0"
      role="button"
      [attr.aria-label]="label()"
      (click)="handleClick()"
      (keydown.enter)="handleClick()"
      (keydown.space)="handleClick()"
      class="
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary-500
        rounded-md
      "
    >
      Interactive Element
    </div>
  `
})
export class AccessibleElement {
  label = input.required<string>();
  clicked = output<void>();
  
  handleClick() {
    this.clicked.emit();
  }
}
```

#### 4. ARIA Attributes

```typescript
@Component({
  template: `
    <nav aria-label="Main navigation">
      <ul class="flex gap-4">
        <li>
          <a 
            href="/home" 
            aria-current="page"
            class="text-primary-600 font-semibold"
          >
            Home
          </a>
        </li>
      </ul>
    </nav>
    
    <div role="alert" aria-live="assertive" class="bg-error-100 text-error-900 p-4 rounded-md">
      Error message
    </div>
  `
})
```

#### 5. Screen Reader Support

```typescript
@Component({
  template: `
    <!-- Visually hidden but available to screen readers -->
    <span class="sr-only">Loading content</span>
    
    <!-- Skip to main content -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
      Skip to main content
    </a>
    
    <main id="main-content">
      <!-- Main content -->
    </main>
  `
})
```

### Accessibility Utilities

```scss
// Tailwind provides screen-reader-only utility
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: initial;
  margin: initial;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Modern UI Patterns

### 1. Glass Morphism

```typescript
@Component({
  template: `
    <div class="
      backdrop-blur-md bg-white/30 dark:bg-gray-900/30
      border border-white/20 dark:border-gray-700/20
      rounded-2xl shadow-xl
      p-6
    ">
      Glass morphism effect
    </div>
  `
})
```

### 2. Neumorphism (Soft UI)

```typescript
@Component({
  template: `
    <div class="
      bg-gray-100 dark:bg-gray-900
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
      dark:shadow-[8px_8px_16px_#000000,-8px_-8px_16px_#1a1a1a]
      rounded-2xl
      p-6
    ">
      Neumorphism card
    </div>
  `
})
```

### 3. Gradient Backgrounds

```typescript
@Component({
  template: `
    <div class="
      bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
      text-white
      p-8 rounded-2xl
    ">
      Gradient background
    </div>
    
    <div class="
      bg-gradient-to-br from-blue-50 to-indigo-100
      dark:from-gray-900 dark:to-gray-800
      p-8 rounded-2xl
    ">
      Subtle gradient
    </div>
  `
})
```

### 4. Hover Effects

```typescript
@Component({
  template: `
    <!-- Scale on hover -->
    <div class="
      transition-transform duration-300
      hover:scale-105
      cursor-pointer
    ">
      Scale effect
    </div>
    
    <!-- Lift on hover -->
    <div class="
      transition-all duration-300
      hover:shadow-2xl hover:-translate-y-1
    ">
      Lift effect
    </div>
    
    <!-- Shine effect -->
    <div class="
      relative overflow-hidden
      before:absolute before:inset-0
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:transition-transform before:duration-700
    ">
      Shine effect
    </div>
  `
})
```

### 5. Loading States

```typescript
@Component({
  template: `
    <!-- Skeleton loader -->
    <div class="animate-pulse space-y-4">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
    
    <!-- Spinner -->
    <div class="
      animate-spin
      h-8 w-8
      border-4 border-primary-200
      border-t-primary-600
      rounded-full
    "></div>
  `
})
```

### 6. Card Patterns

```typescript
@Component({
  template: `
    <!-- Elevated Card -->
    <div class="
      bg-white dark:bg-gray-800
      rounded-xl shadow-lg
      p-6
      hover:shadow-2xl
      transition-shadow duration-300
    ">
      <h3 class="text-xl font-semibold mb-2">Card Title</h3>
      <p class="text-gray-600 dark:text-gray-400">Card content</p>
    </div>
    
    <!-- Bordered Card -->
    <div class="
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-xl
      p-6
      hover:border-primary-500
      transition-colors duration-300
    ">
      Bordered card
    </div>
    
    <!-- Interactive Card -->
    <div class="
      group
      bg-white dark:bg-gray-800
      rounded-xl shadow-md
      p-6
      cursor-pointer
      hover:shadow-xl hover:scale-[1.02]
      transition-all duration-300
    ">
      <h3 class="group-hover:text-primary-600 transition-colors">
        Interactive Card
      </h3>
    </div>
  `
})
```

---

## Performance Best Practices

### 1. Minimize Custom CSS

```typescript
// ✅ GOOD - Use Tailwind utilities
class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"

// ❌ BAD - Custom CSS
styles: [`
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`]
```

### 2. Use @apply Sparingly

```scss
// ✅ OK - For truly reusable components
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors;
}

// ❌ BAD - Just use classes directly in template
.card {
  @apply bg-white p-4 rounded-lg shadow-md;
}
```

### 3. Conditional Classes

```typescript
// ✅ GOOD - Use computed classes
export class Button {
  variant = input<'primary' | 'secondary'>('primary');
  
  buttonClasses = computed(() => {
    const base = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    };
    return `${base} ${variants[this.variant()]}`;
  });
}
```

### 4. Avoid Inline Styles

```typescript
// ❌ BAD - Inline styles
<div [style.backgroundColor]="'#3b82f6'">

// ✅ GOOD - Tailwind classes
<div class="bg-blue-500">

// ✅ OK - Dynamic colors with CSS variables
<div [style.backgroundColor]="'var(--primary-color)'">
```

---

## Common Patterns

### Layout Patterns

#### 1. Centered Container

```typescript
@Component({
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Content -->
    </div>
  `
})
```

#### 2. Sidebar Layout

```typescript
@Component({
  template: `
    <div class="flex flex-col md:flex-row min-h-screen">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 lg:w-72 bg-gray-50 dark:bg-gray-900 p-4">
        <nav>Navigation</nav>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-6 lg:p-8">
        <router-outlet />
      </main>
    </div>
  `
})
```

#### 3. Grid Layout

```typescript
@Component({
  template: `
    <!-- Auto-fit grid -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
      @for (item of items(); track item.id) {
        <div class="card">{{ item.name }}</div>
      }
    </div>
    
    <!-- Responsive columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <!-- Items -->
    </div>
  `
})
```

#### 4. Sticky Header

```typescript
@Component({
  template: `
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="text-xl font-bold">Logo</div>
          <div class="flex items-center gap-4">
            <a href="/home" class="hover:text-primary-600 transition-colors">Home</a>
            <a href="/about" class="hover:text-primary-600 transition-colors">About</a>
          </div>
        </nav>
      </div>
    </header>
  `
})
```

### Form Patterns

#### 1. Form Field

```typescript
@Component({
  template: `
    <div class="space-y-2">
      <label 
        for="email" 
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Email Address
      </label>
      <input
        id="email"
        type="email"
        class="
          w-full px-4 py-2
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          placeholder:text-gray-400
          transition-all
        "
        placeholder="Enter your email"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        We'll never share your email with anyone else.
      </p>
    </div>
  `
})
```

#### 2. Button Group

```typescript
@Component({
  template: `
    <div class="flex gap-2">
      <button class="
        px-4 py-2
        bg-primary-600 text-white
        rounded-md
        hover:bg-primary-700
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        transition-colors
      ">
        Save
      </button>
      <button class="
        px-4 py-2
        bg-gray-200 text-gray-900
        dark:bg-gray-700 dark:text-white
        rounded-md
        hover:bg-gray-300 dark:hover:bg-gray-600
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
        transition-colors
      ">
        Cancel
      </button>
    </div>
  `
})
```

#### 3. Search Input

```typescript
@Component({
  template: `
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        class="
          w-full pl-10 pr-4 py-2
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500
          transition-all
        "
        placeholder="Search..."
      />
    </div>
  `
})
```

### Data Display Patterns

#### 1. Table

```typescript
@Component({
  template: `
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          @for (item of items(); track item.id) {
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-primary-600 hover:text-primary-900">Edit</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
```

#### 2. Badge/Tag

```typescript
@Component({
  template: `
    <!-- Status badges -->
    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      Active
    </span>
    
    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
      Pending
    </span>
    
    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      Inactive
    </span>
    
    <!-- Number badge -->
    <div class="relative inline-block">
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
      <span class="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
        5
      </span>
    </div>
  `
})
```

#### 3. Alert/Notification

```typescript
@Component({
  template: `
    <!-- Success Alert -->
    <div class="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
      <svg class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-green-800 dark:text-green-200">Success!</h4>
        <p class="text-sm text-green-700 dark:text-green-300">Your changes have been saved.</p>
      </div>
      <button class="text-green-500 hover:text-green-700 transition-colors">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Error Alert -->
    <div class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
      <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-red-800 dark:text-red-200">Error!</h4>
        <p class="text-sm text-red-700 dark:text-red-300">Something went wrong. Please try again.</p>
      </div>
    </div>
  `
})
```

### Modal/Dialog Pattern

```typescript
@Component({
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        (click)="close()"
      ></div>
      
      <!-- Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          class="
            bg-white dark:bg-gray-800
            rounded-2xl shadow-2xl
            w-full max-w-md
            p-6
            transform transition-all
          "
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'modal-title'"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 id="modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ title() }}
            </h2>
            <button 
              (click)="close()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close dialog"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="text-gray-600 dark:text-gray-300 mb-6">
            <ng-content></ng-content>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button 
              (click)="close()"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              (click)="confirm()"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class Modal {
  title = input.required<string>();
  isOpen = input<boolean>(false);
  closed = output<void>();
  confirmed = output<void>();
  
  close() {
    this.closed.emit();
  }
  
  confirm() {
    this.confirmed.emit();
  }
}
```

### Empty State Pattern

```typescript
@Component({
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <!-- Icon -->
      <div class="w-24 h-24 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      
      <!-- Text -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No items found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Get started by creating a new item. It will appear here once created.
      </p>
      
      <!-- Action -->
      <button class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        Create New Item
      </button>
    </div>
  `
})
```

---

## Typography Patterns

### Heading Hierarchy

```typescript
@Component({
  template: `
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      Main Heading
    </h1>
    
    <h2 class="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-3">
      Section Heading
    </h2>
    
    <h3 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
      Subsection Heading
    </h3>
    
    <h4 class="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-2">
      Minor Heading
    </h4>
    
    <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
      Body text with good readability. Use leading-relaxed for better line height.
    </p>
    
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Small text for captions or supplementary information.
    </p>
  `
})
```

### Text Utilities

```typescript
// Truncate text
class="truncate"                    // Single line with ellipsis
class="line-clamp-2"                // Multi-line clamp
class="break-words"                 // Break long words

// Text alignment
class="text-left md:text-center"    // Responsive alignment
class="text-justify"                // Justified text

// Font weights
class="font-light"                  // 300
class="font-normal"                 // 400
class="font-medium"                 // 500
class="font-semibold"               // 600
class="font-bold"                   // 700

// Letter spacing
class="tracking-tight"              // Tight
class="tracking-normal"             // Normal
class="tracking-wide"               // Wide
```

---

## Animation & Transitions

### Transition Utilities

```typescript
@Component({
  template: `
    <!-- All properties -->
    <div class="transition-all duration-300">...</div>
    
    <!-- Specific properties -->
    <div class="transition-colors duration-200">...</div>
    <div class="transition-transform duration-300">...</div>
    <div class="transition-opacity duration-500">...</div>
    
    <!-- Easing functions -->
    <div class="transition-all duration-300 ease-in">...</div>
    <div class="transition-all duration-300 ease-out">...</div>
    <div class="transition-all duration-300 ease-in-out">...</div>
  `
})
```

### Common Animations

```typescript
@Component({
  template: `
    <!-- Spin -->
    <div class="animate-spin h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
    
    <!-- Pulse -->
    <div class="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
    
    <!-- Bounce -->
    <div class="animate-bounce">↓</div>
    
    <!-- Fade in -->
    <div class="animate-fadeIn opacity-0">
      Content fades in
    </div>
  `
})
```

---

## Summary & Quick Reference

### DO ✅

- Use Tailwind utility classes
- Support dark mode (`dark:` prefix)
- Design mobile-first, add larger breakpoints
- Ensure WCAG 2.1 AA compliance
- Use semantic color names
- Provide focus indicators
- Test keyboard navigation
- Use CSS variables for theming
- Leverage Tailwind's built-in transitions

### DON'T ❌

- Write custom CSS when Tailwind can do it
- Hardcode colors (use theme colors)
- Ignore accessibility
- Skip responsive design
- Use inline styles
- Forget dark mode support
- Ignore performance

### Quick Class Reference

```typescript
// Layout
flex flex-col md:flex-row gap-4
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
container mx-auto px-4

// Spacing
p-4 md:p-6 lg:p-8
m-4 md:m-6 lg:m-8
space-y-4 md:space-y-6

// Colors
bg-white dark:bg-gray-900
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-700

// Typography
text-lg md:text-xl lg:text-2xl
font-semibold
leading-relaxed

// Effects
rounded-lg
shadow-md hover:shadow-lg
transition-all duration-300

// Interactive
hover:bg-primary-700
focus:outline-none focus:ring-2 focus:ring-primary-500
active:scale-95
```

---

**For complete Tailwind CSS 4 documentation, visit:** https://tailwindcss.com/docs

*Last Updated: December 7, 2025*
*Tailwind CSS 4.1.16 + Angular 20*
