# Layout Component System - Complete Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture & Design Principles](#architecture--design-principles)
3. [File Structure](#file-structure)
4. [Component Specifications](#component-specifications)
5. [Implementation Steps](#implementation-steps)
6. [Code Examples](#code-examples)
7. [Demo Components](#demo-components)
8. [Documentation](#documentation)
9. [Integration Checklist](#integration-checklist)
10. [Testing Strategy](#testing-strategy)

---

## Overview

### Goal
Create a flexible, accessible layout component system for ZardUI inspired by ng-zorro's layout components, following shadcn/ui design principles.

### Components to Create
- `z-layout` - Main container with intelligent flex-direction detection
- `z-header` - Header section with default 64px height
- `z-footer` - Footer section with default 64px height
- `z-content` - Flexible content area that fills available space
- `z-sider` - Collapsible sidebar with trigger, breakpoints, and theming

### Design Philosophy
- **Shadcn/ui approach**: Minimal styling, maximum flexibility
- **Modern Angular**: Signals, standalone components, OnPush change detection
- **Type-safe**: CVA (Class Variance Authority) for variants
- **Accessible**: ARIA attributes, keyboard navigation
- **Developer Experience**: Intuitive API matching ng-zorro patterns

---

## Architecture & Design Principles

### Design Patterns from Research

After analyzing 5+ existing components (Button, Card, Badge, Alert, Accordion), the following patterns emerged:

#### 1. **Component Structure**
```typescript
@Component({
  selector: 'z-[name], [element][z-[name]]',
  exportAs: 'z[Name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' }
})
```

#### 2. **Signal-Based Inputs**
```typescript
readonly zType = input<LayoutVariants['zType']>('default');
readonly class = input<ClassValue>('');
```

#### 3. **Computed Classes with CVA**
```typescript
protected readonly classes = computed(() =>
  mergeClasses(
    layoutVariants({ zType: this.zType() }),
    this.class()
  )
);
```

#### 4. **Styling Approach**
- Use Tailwind utility classes
- Design tokens: `bg-background`, `border-border`, `text-foreground`
- Minimal base styles (structural only)
- User customization via `class` input

#### 5. **Icon Usage**
- Use `icon-[name]` classes (lucide-static icons)
- Examples: `icon-chevron-left`, `icon-chevron-right`, `icon-menu`

---

## File Structure

```
libs/zard/src/lib/components/layout/
├── layout.component.ts           # Main container component
├── layout.variants.ts            # CVA variants for layout
├── header.component.ts           # Header component
├── header.variants.ts            # CVA variants for header
├── footer.component.ts           # Footer component
├── footer.variants.ts            # CVA variants for footer
├── content.component.ts          # Content component
├── content.variants.ts           # CVA variants for content
├── sider.component.ts            # Sidebar component (most complex)
├── sider.variants.ts             # CVA variants for sider
├── layout.module.ts              # Optional NgModule for convenience
├── demo/
│   ├── layout.ts                 # Main demo export with examples array
│   ├── basic.ts                  # 4 basic layout patterns
│   ├── collapsible.ts            # Collapsible sider demo
│   ├── responsive.ts             # Responsive breakpoint demo
│   ├── custom-trigger.ts         # Custom trigger template demo
│   ├── theme.ts                  # Light/dark theme demo
│   └── zero-trigger.ts           # Zero-width trigger demo
└── doc/
    ├── overview.md               # Component overview
    └── api.md                    # Complete API reference
```

---

## Component Specifications

### 1. LayoutComponent (`z-layout`)

**Purpose**: Main container that automatically detects layout structure and adjusts flex-direction.

**Selector**: `z-layout`

**Key Features**:
- Auto-detect `z-sider` children using `contentChildren()`
- Auto-adjust flex-direction based on sider position
- Manual override via `zDirection` input
- Support for nested layouts

**Inputs**:
```typescript
readonly class = input<ClassValue>('');
readonly zDirection = input<'horizontal' | 'vertical' | 'auto'>('auto');
```

**Template Structure**:
```html
<div [class]="classes()">
  <ng-content></ng-content>
</div>
```

**Variants (CVA)**:
```typescript
export const layoutVariants = cva(
  'flex w-full min-h-screen',
  {
    variants: {
      zDirection: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
        auto: 'flex-col', // default, will be overridden by logic
      }
    },
    defaultVariants: {
      zDirection: 'auto'
    }
  }
);
```

**Auto-Detection Logic**:
```typescript
readonly siders = contentChildren(SiderComponent);

ngAfterContentInit() {
  // Detect sider position and adjust flex-direction
  // If sider is first child → flex-row
  // If sider is not first → flex-col
}
```

---

### 2. HeaderComponent (`z-header`)

**Purpose**: Header section with consistent default height.

**Selector**: `z-header`

**Inputs**:
```typescript
readonly class = input<ClassValue>('');
readonly zHeight = input<string | number>(64);
```

**Variants (CVA)**:
```typescript
export const headerVariants = cva(
  'flex items-center px-6 bg-background border-b border-border',
  {
    variants: {
      zHeight: {
        default: 'h-16', // 64px
        sm: 'h-12',      // 48px
        lg: 'h-20',      // 80px
      }
    },
    defaultVariants: {
      zHeight: 'default'
    }
  }
);
```

**Template**:
```html
<header [class]="classes()" [style.height]="computedHeight()">
  <ng-content></ng-content>
</header>
```

---

### 3. FooterComponent (`z-footer`)

**Purpose**: Footer section with consistent default height.

**Selector**: `z-footer`

**Inputs**:
```typescript
readonly class = input<ClassValue>('');
readonly zHeight = input<string | number>(64);
```

**Variants (CVA)**:
```typescript
export const footerVariants = cva(
  'flex items-center px-6 bg-background border-t border-border',
  {
    variants: {
      zHeight: {
        default: 'h-16', // 64px
        sm: 'h-12',      // 48px
        lg: 'h-20',      // 80px
      }
    },
    defaultVariants: {
      zHeight: 'default'
    }
  }
);
```

**Template**:
```html
<footer [class]="classes()" [style.height]="computedHeight()">
  <ng-content></ng-content>
</footer>
```

---

### 4. ContentComponent (`z-content`)

**Purpose**: Flexible content area that fills available space.

**Selector**: `z-content`

**Inputs**:
```typescript
readonly class = input<ClassValue>('');
```

**Variants (CVA)**:
```typescript
export const contentVariants = cva(
  'flex-1 overflow-auto bg-background p-6'
);
```

**Template**:
```html
<main [class]="classes()">
  <ng-content></ng-content>
</main>
```

---

### 5. SiderComponent (`z-sider`) - Most Complex

**Purpose**: Collapsible sidebar with trigger, responsive breakpoints, and theming.

**Selector**: `z-sider`

**Inputs**:
```typescript
// Dimensions
readonly zWidth = input<string | number>(200);
readonly zCollapsedWidth = input<number>(64);

// Behavior
readonly zCollapsible = input(false, { transform: booleanAttribute });
readonly zCollapsed = input(false, { transform: booleanAttribute });
readonly zReverseArrow = input(false, { transform: booleanAttribute });

// Appearance
readonly zTheme = input<SiderVariants['zTheme']>('light');

// Custom Templates
readonly zTrigger = input<TemplateRef<void> | null>(null);
readonly zZeroTrigger = input<TemplateRef<void> | null>(null);

// Responsive
readonly zBreakpoint = input<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();

// Styling
readonly class = input<ClassValue>('');
```

**Outputs**:
```typescript
readonly zCollapsedChange = output<boolean>();
```

**Variants (CVA)**:
```typescript
export const siderVariants = cva(
  'relative flex flex-col transition-all duration-300 ease-in-out border-r',
  {
    variants: {
      zTheme: {
        light: 'bg-background border-border',
        dark: 'bg-zinc-900 dark:bg-zinc-950 border-zinc-800 text-white',
      },
      zCollapsed: {
        true: '',
        false: '',
      }
    },
    defaultVariants: {
      zTheme: 'light',
      zCollapsed: false,
    }
  }
);

export const siderTriggerVariants = cva(
  'absolute bottom-4 flex items-center justify-center cursor-pointer rounded-sm border bg-background hover:bg-accent transition-colors',
  {
    variants: {
      zPosition: {
        left: '-right-3',
        right: '-left-3',
      },
      zSize: {
        default: 'w-6 h-6',
        zero: 'w-8 h-8',
      }
    },
    defaultVariants: {
      zPosition: 'left',
      zSize: 'default',
    }
  }
);
```

**Key Features**:

1. **Collapsible Behavior**:
   - Toggle between `zWidth` and `zCollapsedWidth`
   - Smooth CSS transitions
   - Two-way binding with `zCollapsed` signal

2. **Trigger**:
   - Default trigger: chevron button at bottom
   - Custom trigger via `zTrigger` template
   - Special zero-width trigger via `zZeroTrigger`
   - Arrow direction: `icon-chevron-left` / `icon-chevron-right`
   - Reverse arrow support

3. **Responsive Breakpoints**:
   ```typescript
   private readonly breakpoints = {
     xs: 480,
     sm: 576,
     md: 768,
     lg: 992,
     xl: 1200,
     xxl: 1600,
   };

   // Use ResizeObserver or window resize events
   // Auto-collapse when below breakpoint
   ```

4. **Theme Support**:
   - Light: default background colors
   - Dark: darker background with adjusted text color

**Template Structure**:
```html
<aside
  [class]="classes()"
  [style.width.px]="currentWidth()"
  [attr.data-collapsed]="zCollapsed()">

  <!-- Sider Content -->
  <div class="flex-1 overflow-auto">
    <ng-content></ng-content>
  </div>

  <!-- Trigger -->
  @if (zCollapsible() && !zTrigger()) {
    <div
      [class]="triggerClasses()"
      (click)="toggleCollapsed()"
      (keydown.enter)="toggleCollapsed()"
      (keydown.space)="toggleCollapsed()"
      tabindex="0"
      role="button"
      [attr.aria-label]="zCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">

      @if (zCollapsedWidth() === 0 && zCollapsed()) {
        <!-- Zero trigger -->
        @if (zZeroTrigger()) {
          <ng-container *ngTemplateOutlet="zZeroTrigger()"></ng-container>
        } @else {
          <i class="icon-menu"></i>
        }
      } @else {
        <!-- Normal trigger -->
        <i [class]="chevronIcon()"></i>
      }
    </div>
  }

  <!-- Custom trigger -->
  @if (zCollapsible() && zTrigger()) {
    <ng-container *ngTemplateOutlet="zTrigger()"></ng-container>
  }
</aside>
```

**Methods**:
```typescript
toggleCollapsed(): void {
  const newState = !this.zCollapsed();
  this.zCollapsedChange.emit(newState);
}

protected readonly currentWidth = computed(() => {
  return this.zCollapsed() ? this.zCollapsedWidth() : this.computeWidth();
});

protected readonly chevronIcon = computed(() => {
  const collapsed = this.zCollapsed();
  const reverse = this.zReverseArrow();

  if (reverse) {
    return collapsed ? 'icon-chevron-left' : 'icon-chevron-right';
  }
  return collapsed ? 'icon-chevron-right' : 'icon-chevron-left';
});
```

---

## Implementation Steps

### Phase 1: Core Components (1-2 hours)

#### Step 1: Create Base Components
1. Create `layout/` directory
2. Implement `LayoutComponent` with basic flexbox structure
3. Implement `HeaderComponent` with default height
4. Implement `FooterComponent` with default height
5. Implement `ContentComponent` with flex-1

#### Step 2: Create Variants Files
1. Create `*.variants.ts` for each component
2. Define CVA variants with Tailwind classes
3. Export TypeScript types for each variant

#### Step 3: Test Basic Structure
```typescript
// Quick test in any component
<z-layout>
  <z-header>Header</z-header>
  <z-content>Content</z-content>
  <z-footer>Footer</z-footer>
</z-layout>
```

---

### Phase 2: Sider Component (2-3 hours)

#### Step 4: Implement Basic Sider
1. Create `SiderComponent` with width control
2. Add theme variants (light/dark)
3. Test with basic layout

#### Step 5: Add Collapse Functionality
1. Add `zCollapsed` signal input
2. Add `zCollapsedChange` output
3. Implement width transition
4. Add default trigger button
5. Test collapse/expand behavior

#### Step 6: Add Advanced Features
1. Implement custom trigger support (`zTrigger`)
2. Implement zero-width trigger (`zZeroTrigger`)
3. Add reverse arrow logic
4. Implement responsive breakpoints (optional)

---

### Phase 3: Layout Intelligence (1 hour)

#### Step 7: Auto-Detection in LayoutComponent
1. Use `contentChildren()` to query `SiderComponent`
2. Detect sider position (first child vs others)
3. Auto-adjust flex-direction
4. Respect manual `zDirection` override
5. Test nested layouts

---

### Phase 4: Demo Components (2-3 hours)

#### Step 8: Create Demo Components

**demo/basic.ts** - 4 layout patterns:
```typescript
@Component({
  template: `
    <div class="flex flex-wrap gap-4">
      <!-- Pattern 1: Header-Content-Footer -->
      <z-layout class="w-[calc(50%-8px)]">
        <z-header>Header</z-header>
        <z-content>Content</z-content>
        <z-footer>Footer</z-footer>
      </z-layout>

      <!-- Pattern 2: Header-Sider/Content-Footer -->
      <z-layout class="w-[calc(50%-8px)]">
        <z-header>Header</z-header>
        <z-layout>
          <z-sider>Sider</z-sider>
          <z-content>Content</z-content>
        </z-layout>
        <z-footer>Footer</z-footer>
      </z-layout>

      <!-- Pattern 3: Header-Content/Sider-Footer -->
      <z-layout class="w-[calc(50%-8px)]">
        <z-header>Header</z-header>
        <z-layout>
          <z-content>Content</z-content>
          <z-sider>Sider</z-sider>
        </z-layout>
        <z-footer>Footer</z-footer>
      </z-layout>

      <!-- Pattern 4: Sider-Header/Content/Footer -->
      <z-layout class="w-[calc(50%-8px)]">
        <z-sider>Sider</z-sider>
        <z-layout>
          <z-header>Header</z-header>
          <z-content>Content</z-content>
          <z-footer>Footer</z-footer>
        </z-layout>
      </z-layout>
    </div>
  `
})
```

**demo/collapsible.ts** - Collapsible sider:
```typescript
@Component({
  template: `
    <z-layout>
      <z-sider
        [zCollapsible]="true"
        [(zCollapsed)]="collapsed">
        <div class="p-4">Sider content</div>
      </z-sider>
      <z-layout>
        <z-header>Header with toggle</z-header>
        <z-content>Content area</z-content>
        <z-footer>Footer</z-footer>
      </z-layout>
    </z-layout>
  `
})
export class LayoutDemoCollapsibleComponent {
  collapsed = signal(false);
}
```

**demo/theme.ts** - Theme variants:
```typescript
@Component({
  template: `
    <div class="flex gap-4">
      <z-layout class="flex-1">
        <z-sider zTheme="light">Light Sider</z-sider>
        <z-content>Content</z-content>
      </z-layout>

      <z-layout class="flex-1">
        <z-sider zTheme="dark">Dark Sider</z-sider>
        <z-content>Content</z-content>
      </z-layout>
    </div>
  `
})
```

**demo/custom-trigger.ts** - Custom trigger:
```typescript
@Component({
  template: `
    <z-layout>
      <z-sider
        [zCollapsible]="true"
        [zTrigger]="customTrigger">
        Sider content
      </z-sider>
      <z-content>Content</z-content>
    </z-layout>

    <ng-template #customTrigger>
      <button z-button zType="ghost" zSize="icon">
        <i class="icon-panel-left"></i>
      </button>
    </ng-template>
  `
})
```

**demo/responsive.ts** - Responsive breakpoint:
```typescript
@Component({
  template: `
    <z-layout>
      <z-sider
        [zCollapsible]="true"
        zBreakpoint="md"
        [(zCollapsed)]="collapsed">
        Responsive Sider
      </z-sider>
      <z-content>
        Resize window to see auto-collapse at md breakpoint (768px)
      </z-content>
    </z-layout>
  `
})
```

**demo/layout.ts** - Main export:
```typescript
export const LAYOUT = {
  componentName: 'layout',
  componentType: 'layout',
  examples: [
    { name: 'basic', component: LayoutDemoBasicComponent },
    { name: 'collapsible', component: LayoutDemoCollapsibleComponent },
    { name: 'theme', component: LayoutDemoThemeComponent },
    { name: 'custom-trigger', component: LayoutDemoCustomTriggerComponent },
    { name: 'responsive', component: LayoutDemoResponsiveComponent },
  ],
};
```

---

### Phase 5: Documentation (1-2 hours)

#### Step 9: Write Overview (doc/overview.md)

```markdown
# Layout

A set of layout components for creating common page structures with header, footer, sidebar, and content areas.

## Features

- 🎯 **Flexible Structure** - Compose layouts with multiple patterns
- 🎨 **Auto-Detection** - Automatically adjusts flex-direction based on children
- 📱 **Responsive** - Built-in breakpoint support for sider
- 🎭 **Collapsible Sider** - Smooth collapse/expand with customizable triggers
- 🌗 **Theme Support** - Light and dark sider themes
- ♿ **Accessible** - ARIA attributes and keyboard navigation
- 🎛️ **Customizable** - Full control via class input

## When to Use

- Creating dashboard layouts
- Building admin panels
- Implementing navigation structures
- Designing documentation sites

## Basic Usage

```typescript
import { LayoutComponent, HeaderComponent, ContentComponent, FooterComponent } from '@zard/layout';

@Component({
  imports: [LayoutComponent, HeaderComponent, ContentComponent, FooterComponent],
  template: `
    <z-layout>
      <z-header>Header</z-header>
      <z-content>Content</z-content>
      <z-footer>Footer</z-footer>
    </z-layout>
  `
})
```
```

#### Step 10: Write API Reference (doc/api.md)

```markdown
# API Reference

## Components

### z-layout

Main container component with intelligent layout detection.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zDirection]` | Flex direction (auto-detects if 'auto') | `'horizontal' \| 'vertical' \| 'auto'` | `'auto'` |

### z-header

Header section component.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zHeight]` | Header height | `string \| number` | `64` |

### z-footer

Footer section component.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zHeight]` | Footer height | `string \| number` | `64` |

### z-content

Content area component.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sider

Collapsible sidebar component.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zWidth]` | Sider width when expanded | `string \| number` | `200` |
| `[zCollapsedWidth]` | Sider width when collapsed | `number` | `64` |
| `[zCollapsible]` | Enable collapse functionality | `boolean` | `false` |
| `[zCollapsed]` | Collapsed state (two-way binding) | `boolean` | `false` |
| `[zReverseArrow]` | Reverse trigger arrow direction | `boolean` | `false` |
| `[zTheme]` | Color theme | `'light' \| 'dark'` | `'light'` |
| `[zTrigger]` | Custom trigger template | `TemplateRef<void> \| null` | `null` |
| `[zZeroTrigger]` | Custom trigger for zero-width | `TemplateRef<void> \| null` | `null` |
| `[zBreakpoint]` | Responsive breakpoint | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `undefined` |
| `(zCollapsedChange)` | Emits when collapsed state changes | `EventEmitter<boolean>` | - |

## Accessibility

- Header uses semantic `<header>` element
- Footer uses semantic `<footer>` element
- Content uses semantic `<main>` element
- Sider uses semantic `<aside>` element
- Trigger button includes proper ARIA labels
- Keyboard navigation supported (Enter, Space)

## Examples

See demo components for complete usage examples.
```

---

### Phase 6: Integration (30 min)

#### Step 11: Export Components

**libs/zard/src/index.ts**:
```typescript
// Layout
export * from './lib/components/layout/layout.component';
export * from './lib/components/layout/header.component';
export * from './lib/components/layout/footer.component';
export * from './lib/components/layout/content.component';
export * from './lib/components/layout/sider.component';
export * from './lib/components/layout/layout.module'; // optional
```

#### Step 12: Register in Documentation System

**apps/web/src/app/shared/constants/components.constant.ts**:
```typescript
import { LAYOUT } from '@zard/components/layout/demo/layout';

export const COMPONENTS: ComponentData[] = [
  // ... existing components in alphabetical order
  LAYOUT,
  // ... remaining components
];
```

**apps/web/src/app/shared/constants/routes.constant.ts**:
```typescript
const COMPONENTS_PATH = {
  title: 'Components',
  data: [
    // ... existing routes
    { name: 'Layout', path: '/docs/components/layout', available: true },
    // ... remaining routes
  ].sort((a, b) => a.name.localeCompare(b.name)),
};
```

---

### Phase 7: Testing (1 hour)

#### Step 13: Write Unit Tests

**layout.component.spec.ts**:
```typescript
describe('LayoutComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should auto-detect sider and adjust flex-direction', () => {
    // Test auto-detection logic
  });

  it('should respect manual zDirection override', () => {
    // Test manual override
  });
});
```

**sider.component.spec.ts**:
```typescript
describe('SiderComponent', () => {
  it('should collapse when trigger is clicked', () => {
    // Test collapse functionality
  });

  it('should emit zCollapsedChange event', () => {
    // Test event emission
  });

  it('should support two-way binding', () => {
    // Test two-way binding
  });

  it('should apply correct theme classes', () => {
    // Test theme variants
  });

  it('should show custom trigger when provided', () => {
    // Test custom trigger
  });
});
```

---

## Integration Checklist

Use this checklist to ensure complete integration:

### Component Files
- [ ] `layout.component.ts` created
- [ ] `layout.variants.ts` created
- [ ] `header.component.ts` created
- [ ] `header.variants.ts` created
- [ ] `footer.component.ts` created
- [ ] `footer.variants.ts` created
- [ ] `content.component.ts` created
- [ ] `content.variants.ts` created
- [ ] `sider.component.ts` created
- [ ] `sider.variants.ts` created
- [ ] `layout.module.ts` created (optional)

### Demo Files
- [ ] `demo/layout.ts` created with examples array
- [ ] `demo/basic.ts` created
- [ ] `demo/collapsible.ts` created
- [ ] `demo/theme.ts` created
- [ ] `demo/custom-trigger.ts` created
- [ ] `demo/responsive.ts` created

### Documentation Files
- [ ] `doc/overview.md` written
- [ ] `doc/api.md` written with complete API reference

### Exports & Integration
- [ ] Components exported in `libs/zard/src/index.ts`
- [ ] Demo imported in `components.constant.ts`
- [ ] Added to `COMPONENTS` array (alphabetically)
- [ ] Route added in `routes.constant.ts` COMPONENTS_PATH.data
- [ ] Route marked as `available: true`

### Testing
- [ ] Unit tests written for all components
- [ ] Tests pass: `npx nx test zard`
- [ ] Manual testing in dev server: `npm start`
- [ ] All demos render correctly
- [ ] Collapse/expand works smoothly
- [ ] Responsive breakpoints work
- [ ] Theme variants display correctly
- [ ] Custom triggers work
- [ ] Keyboard navigation works
- [ ] ARIA attributes present

### Quality Checks
- [ ] TypeScript compilation: `npx nx build zard`
- [ ] No console errors
- [ ] Components follow naming conventions (no "Zard" prefix in class names)
- [ ] Selectors use `z-` prefix
- [ ] CVA variants properly typed
- [ ] All inputs use signal-based `input()`
- [ ] OnPush change detection used
- [ ] ViewEncapsulation.None used
- [ ] Accessibility attributes present

### File Watcher
- [ ] Start file watcher: `npm run watch:files` or `npm start`
- [ ] Verify demo/doc files sync to `apps/web/public/components/layout/`
- [ ] Changes to demos reflect in web app

---

## Testing Strategy

### Manual Testing Workflow

1. **Start Dev Server**:
   ```bash
   npm start
   ```

2. **Navigate to Component**:
   - Open browser to `http://localhost:4222`
   - Go to `/docs/components/layout`

3. **Test Each Demo**:
   - **Basic**: Verify all 4 layout patterns render
   - **Collapsible**: Click trigger, verify smooth collapse
   - **Theme**: Verify light/dark backgrounds
   - **Custom Trigger**: Verify custom template renders
   - **Responsive**: Resize window, verify breakpoint behavior

4. **Test Interactions**:
   - Click collapse trigger
   - Press Enter/Space on trigger
   - Verify smooth width transitions
   - Verify arrow direction changes
   - Verify zero-width trigger appears

5. **Test Accessibility**:
   - Tab through interactive elements
   - Verify focus styles
   - Use screen reader (VoiceOver/NVDA)
   - Verify ARIA labels

### Automated Testing

Run tests in watch mode during development:
```bash
npx nx test zard --watch
```

---

## Code Examples

### Full LayoutComponent Implementation

```typescript
import type { ClassValue } from 'clsx';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { SiderComponent } from './sider.component';
import { layoutVariants, LayoutVariants } from './layout.variants';

@Component({
  selector: 'z-layout',
  exportAs: 'zLayout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <ng-content></ng-content>
    </div>
  `,
})
export class LayoutComponent implements AfterContentInit {
  readonly class = input<ClassValue>('');
  readonly zDirection = input<LayoutVariants['zDirection']>('auto');

  readonly siders = contentChildren(SiderComponent);

  private readonly detectedDirection = computed(() => {
    if (this.zDirection() !== 'auto') {
      return this.zDirection();
    }

    // Auto-detection logic
    const siderCount = this.siders().length;
    if (siderCount === 0) {
      return 'vertical';
    }

    // If we have a sider, check if it's the first child
    // This would require ElementRef inspection
    // For now, default to horizontal when sider is present
    return 'horizontal';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      layoutVariants({
        zDirection: this.detectedDirection() as LayoutVariants['zDirection'],
      }),
      this.class()
    )
  );

  ngAfterContentInit(): void {
    // Additional setup if needed
  }
}
```

### Full SiderComponent Implementation

```typescript
import type { ClassValue } from 'clsx';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { siderVariants, siderTriggerVariants, SiderVariants } from './sider.variants';

@Component({
  selector: 'z-sider',
  exportAs: 'zSider',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside [class]="classes()" [style.width.px]="currentWidth()" [attr.data-collapsed]="zCollapsed()">
      <!-- Sider Content -->
      <div class="flex-1 overflow-auto">
        <ng-content></ng-content>
      </div>

      <!-- Default Trigger -->
      @if (zCollapsible() && !zTrigger()) {
        <div
          [class]="triggerClasses()"
          (click)="toggleCollapsed()"
          (keydown.enter)="toggleCollapsed(); $event.preventDefault()"
          (keydown.space)="toggleCollapsed(); $event.preventDefault()"
          tabindex="0"
          role="button"
          [attr.aria-label]="zCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!zCollapsed()">
          @if (shouldShowZeroTrigger()) {
            <!-- Zero Width Trigger -->
            @if (zZeroTrigger()) {
              <ng-container *zStringTemplateOutlet="zZeroTrigger()"></ng-container>
            } @else {
              <i class="icon-menu text-base"></i>
            }
          } @else {
            <!-- Normal Trigger -->
            <i [class]="chevronIcon()"></i>
          }
        </div>
      }

      <!-- Custom Trigger -->
      @if (zCollapsible() && zTrigger()) {
        <div (click)="toggleCollapsed()">
          <ng-container *zStringTemplateOutlet="zTrigger()"></ng-container>
        </div>
      }
    </aside>
  `,
})
export class SiderComponent {
  private platformId = inject(PLATFORM_ID);

  // Dimensions
  readonly zWidth = input<string | number>(200);
  readonly zCollapsedWidth = input<number>(64);

  // Behavior
  readonly zCollapsible = input(false, { transform: booleanAttribute });
  readonly zCollapsed = input(false, { transform: booleanAttribute });
  readonly zReverseArrow = input(false, { transform: booleanAttribute });

  // Appearance
  readonly zTheme = input<SiderVariants['zTheme']>('light');

  // Custom Templates
  readonly zTrigger = input<TemplateRef<void> | null>(null);
  readonly zZeroTrigger = input<TemplateRef<void> | null>(null);

  // Responsive
  readonly zBreakpoint = input<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();

  // Styling
  readonly class = input<ClassValue>('');

  // Output
  readonly zCollapsedChange = output<boolean>();

  // Internal state
  private readonly internalCollapsed = signal(false);

  constructor() {
    // Sync input with internal state
    effect(() => {
      this.internalCollapsed.set(this.zCollapsed());
    });

    // Setup responsive behavior
    if (isPlatformBrowser(this.platformId)) {
      this.setupResponsive();
    }
  }

  protected readonly currentWidth = computed(() => {
    const collapsed = this.zCollapsed();
    if (collapsed) {
      return this.zCollapsedWidth();
    }

    const width = this.zWidth();
    return typeof width === 'number' ? width : parseInt(width, 10);
  });

  protected readonly shouldShowZeroTrigger = computed(() => {
    return this.zCollapsedWidth() === 0 && this.zCollapsed();
  });

  protected readonly chevronIcon = computed(() => {
    const collapsed = this.zCollapsed();
    const reverse = this.zReverseArrow();

    if (reverse) {
      return collapsed ? 'icon-chevron-left text-base' : 'icon-chevron-right text-base';
    }
    return collapsed ? 'icon-chevron-right text-base' : 'icon-chevron-left text-base';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      siderVariants({
        zTheme: this.zTheme(),
        zCollapsed: this.zCollapsed(),
      }),
      this.class()
    )
  );

  protected readonly triggerClasses = computed(() => {
    return mergeClasses(
      siderTriggerVariants({
        zSize: this.shouldShowZeroTrigger() ? 'zero' : 'default',
      })
    );
  });

  toggleCollapsed(): void {
    const newState = !this.zCollapsed();
    this.internalCollapsed.set(newState);
    this.zCollapsedChange.emit(newState);
  }

  private setupResponsive(): void {
    const breakpoint = this.zBreakpoint();
    if (!breakpoint) return;

    const breakpoints: Record<string, number> = {
      xs: 480,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
    };

    const breakpointWidth = breakpoints[breakpoint];

    // Listen to window resize
    if (typeof window !== 'undefined') {
      const checkWidth = () => {
        const shouldCollapse = window.innerWidth < breakpointWidth;
        if (shouldCollapse !== this.internalCollapsed()) {
          this.internalCollapsed.set(shouldCollapse);
          this.zCollapsedChange.emit(shouldCollapse);
        }
      };

      window.addEventListener('resize', checkWidth);
      checkWidth(); // Initial check
    }
  }
}
```

---

## Common Patterns & Tips

### Pattern 1: Dashboard Layout
```html
<z-layout>
  <z-sider [zCollapsible]="true" zTheme="dark">
    <nav><!-- Navigation menu --></nav>
  </z-sider>
  <z-layout>
    <z-header>
      <h1>Dashboard</h1>
    </z-header>
    <z-content>
      <!-- Main content -->
    </z-content>
  </z-layout>
</z-layout>
```

### Pattern 2: Documentation Site
```html
<z-layout>
  <z-header>
    <div>Logo & Search</div>
  </z-header>
  <z-layout>
    <z-sider [zCollapsible]="true" zBreakpoint="md">
      <nav><!-- Docs sidebar --></nav>
    </z-sider>
    <z-content>
      <!-- Documentation content -->
    </z-content>
  </z-layout>
</z-layout>
```

### Pattern 3: Admin Panel with Fixed Header
```html
<z-layout>
  <z-header class="sticky top-0 z-10">
    <nav><!-- Top navigation --></nav>
  </z-header>
  <z-layout>
    <z-sider [zCollapsible]="true" [(zCollapsed)]="sidebarCollapsed">
      <!-- Admin sidebar -->
    </z-sider>
    <z-content>
      <!-- Admin content -->
    </z-content>
  </z-layout>
  <z-footer>
    <!-- Footer content -->
  </z-footer>
</z-layout>
```

---

## Troubleshooting

### Issue: Sider not collapsing smoothly
**Solution**: Ensure `transition-all duration-300` is in sider variants and width is controlled via inline style.

### Issue: Auto-detection not working
**Solution**: Verify `contentChildren(SiderComponent)` is querying correctly and `AfterContentInit` is implemented.

### Issue: Demos not showing in web app
**Solution**:
1. Check file watcher is running: `npm start`
2. Verify demo files in `apps/web/public/components/layout/`
3. Check import in `components.constant.ts`

### Issue: TypeScript errors with CVA variants
**Solution**: Ensure variant types are exported and imported correctly in component.

### Issue: Icons not displaying
**Solution**: Verify lucide-static is installed and icon classes are correct (e.g., `icon-chevron-left`).

---

## Next Steps After Implementation

1. **Test thoroughly** with all demo scenarios
2. **Get user feedback** on API ergonomics
3. **Consider additional features**:
   - Slide animation instead of width transition
   - Multiple siders in one layout
   - Sticky header/footer support
   - Resizable sider (drag to resize)
4. **Document edge cases** in docs
5. **Create video tutorial** showing usage
6. **Add to Figma** design system

---

## Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Core components (Layout, Header, Footer, Content) | 1-2 hours |
| 2 | Sider component with collapse | 2-3 hours |
| 3 | Layout auto-detection | 1 hour |
| 4 | Demo components | 2-3 hours |
| 5 | Documentation | 1-2 hours |
| 6 | Integration & exports | 30 min |
| 7 | Testing & refinement | 1 hour |
| **Total** | **Complete implementation** | **8-12 hours** |

---

## Success Criteria

✅ All 5 components created and functional
✅ Sider collapses smoothly with trigger
✅ Auto-detection works for layout direction
✅ All demos render without errors
✅ Documentation is complete and accurate
✅ Components integrated in docs site
✅ Tests pass
✅ TypeScript compiles without errors
✅ Accessibility features present
✅ Matches shadcn/ui design principles
✅ Developer experience matches ng-zorro quality

---

**Good luck with the implementation! 🚀**
