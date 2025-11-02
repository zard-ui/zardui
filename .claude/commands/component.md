Creates a new zard component named "$ARGUMENTS" following ZardUI patterns and conventions.

# Command Component

Usage: `/component [component-name]`
Example: `/component table` creates a table component

## Overview

This command creates a complete ZardUI component named "$ARGUMENTS" with proper file structure, TypeScript patterns, and documentation setup based on 20+ analyzed components.

**Component to create: $ARGUMENTS**

### Design Philosophy

ZardUI follows the **shadcn/ui visual style** with **Angular-first patterns**, inspired by ng-zorro's developer experience:

**Core Principles**:

1. **Simple cases should be simple** - Common usage in 1-3 lines, 5-7 props max
2. **Complex cases should be possible** - Use `string | TemplateRef<void>` for flexibility
3. **Angular-first** - Signals, content projection, no React patterns
4. **Single component preferred** - Avoid sub-components unless truly necessary
5. **Minimal API surface** - Only essential props, use native HTML attributes when possible
6. **Type-safe everything** - Full TypeScript support with CVA variants

**Standards**:

- **Intuitive API design** with clear, predictable prop names
- **Consistent component patterns** across the entire library
- **Excellent TypeScript support** with full type safety
- **Flexible styling system** that's easy to customize
- **Comprehensive documentation** with live examples
- **Accessibility-first** approach following ARIA standards

**When in doubt**: Look at Card, Empty, or Button components as reference!

## Component Architecture Requirements

### File Structure

Each component must follow this exact pattern:

```
libs/zard/src/lib/components/[component-name]/
├── [component-name].component.ts     # Main component
├── [component-name].variants.ts      # CVA styling variants
├── demo/                            # Demo components for docs
│   ├── [component-name].ts          # Main demo export
│   ├── default.ts                   # Default example
│   ├── basic.ts                     # Basic usage example
│   ├── [variant].ts                 # Variant examples (type, size, etc.)
│   └── [feature].ts                 # Feature demos (disabled, loading, etc.)
└── doc/                             # Documentation
    ├── overview.md                  # Component overview
    └── api.md                       # API reference
```

### Import Order Convention

All components follow this strict import order:

```typescript
// 1. External dependencies (alphabetical)
import type { ClassValue } from 'clsx';

// 2. Angular core imports (grouped logically)
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

// 3. Shared utilities
import { mergeClasses } from '../../shared/utils/utils';

// 4. Local component files
import { [name]Variants, Zard[Name]Variants } from './[name].variants';
```

### Component Templates by Type

#### Template 1: Simple Display Component

```typescript
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { [name]Variants, Zard[Name]Variants } from './[name].variants';

@Component({
  selector: 'z-[name]',
  exportAs: 'z[Name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class Zard[Name]Component {
  readonly zType = input<Zard[Name]Variants['zType']>('default');
  readonly zSize = input<Zard[Name]Variants['zSize']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses([name]Variants({
      zType: this.zType(),
      zSize: this.zSize()
    }), this.class())
  );
}
```

#### Template 2: Form Control with ControlValueAccessor

```typescript
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, inject, input, output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ClassValue } from 'clsx';

import { [name]Variants, Zard[Name]Variants } from './[name].variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

type OnTouchedType = () => void;
type OnChangeType = (value: any) => void;

@Component({
  selector: 'z-[name], [z-[name]]',
  exportAs: 'z[Name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- component template -->
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Zard[Name]Component),
      multi: true,
    },
  ],
  host: {
    '[class]': 'classes()',
  },
})
export class Zard[Name]Component implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly zType = input<Zard[Name]Variants['zType']>('default');
  readonly zSize = input<Zard[Name]Variants['zSize']>('default');
  readonly disabled = input(false, { transform });

  readonly class = input<ClassValue>('');

  readonly valueChange = output<any>();

  protected readonly classes = computed(() =>
    mergeClasses([name]Variants({
      zType: this.zType(),
      zSize: this.zSize()
    }), this.class())
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: OnChangeType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};

  checked = false;

  writeValue(val: any): void {
    this.checked = val;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implementation
    this.cdr.markForCheck();
  }
}
```

#### Template 3: Component with String/Template Projection

```typescript
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { [name]Variants, [name]HeaderVariants, [name]BodyVariants } from './[name].variants';

@Component({
  selector: 'z-[name]',
  exportAs: 'z[Name]',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zTitle()) {
      <div [class]="headerClasses()">
        <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
      </div>
    }

    <div [class]="bodyClasses()">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class Zard[Name]Component {
  readonly zTitle = input<string | TemplateRef<void>>();
  readonly zDescription = input<string | TemplateRef<void>>();

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses([name]Variants(), this.class()));
  protected readonly headerClasses = computed(() => [name]HeaderVariants());
  protected readonly bodyClasses = computed(() => [name]BodyVariants());
}
```

#### Template 4: Overlay/Popup Components (CDK Overlay)

```typescript
import { Overlay, OverlayModule, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import type { ClassValue } from 'clsx';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { [name]ContentVariants } from './[name].variants';

@Component({
  selector: 'z-[name]',
  exportAs: 'z[Name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule],
  template: `
    <div (click)="toggle()">
      <ng-content select="[trigger]"></ng-content>
    </div>

    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  host: {
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    class: 'relative inline-block',
  },
})
export class Zard[Name]Component implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });

  readonly openChange = output<boolean>();

  readonly isOpen = signal(false);

  protected readonly contentClasses = computed(() =>
    mergeClasses([name]ContentVariants(), this.class())
  );

  ngOnInit() {
    this.createOverlay();
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  toggle() {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (this.isOpen()) return;

    this.portal = new TemplatePortal(this.contentTemplate(), this.viewContainerRef);
    this.overlayRef?.attach(this.portal);
    this.isOpen.set(true);
    this.openChange.emit(true);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.openChange.emit(false);
  }

  private createOverlay() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 4,
          },
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
```

#### Template 5: Multi-component System (Parent-Child)

```typescript
// Parent Component
import { AfterContentInit, ChangeDetectionStrategy, Component, contentChildren, input, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';

import { Zard[Name]ItemComponent } from './[name]-item.component';

@Component({
  selector: 'z-[name]',
  exportAs: 'z[Name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="class()">
      <ng-content></ng-content>
    </div>
  `,
})
export class Zard[Name]Component implements AfterContentInit {
  readonly items = contentChildren(Zard[Name]ItemComponent);

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.items().forEach(item => {
        item.parent = this;
      });
    });
  }

  handleItemClick(selectedItem: Zard[Name]ItemComponent): void {
    // Parent logic for managing child items
  }
}
```

### Variants File Template (CVA)

```typescript
import { cva, VariantProps } from 'class-variance-authority';

export const [name]Variants = cva(
  'base-classes-here', // Base classes always applied
  {
    variants: {
      zType: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-white',
        outline: 'border bg-background',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      zSize: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
      zShape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);

export type Zard[Name]Variants = VariantProps<typeof [name]Variants>;

// For multi-part components (header, body, footer)
export const [name]HeaderVariants = cva('header-classes-here');
export const [name]BodyVariants = cva('body-classes-here');
```

### Required Patterns (Analyzed from 20+ Components)

**Core Architecture:**

- **Standalone components** with `standalone: true`
- **Signal-based inputs** using `input()` function for modern Angular patterns
- **Signal-based outputs** using `output<T>()` for type-safe event emission
- **CVA (Class Variance Authority)** for type-safe styling variants like shadcn/ui
- **OnPush change detection** for optimal performance
- **ViewEncapsulation.None** for global styling flexibility
- **exportAs** for template reference variables (ng-zorro pattern)
- **Host binding** for dynamic classes: `host: { '[class]': 'classes()' }`
- **ClassValue** type from 'clsx' for class input (shadcn/ui pattern)

**Naming Conventions:**

- **Component prefix**: All components start with `Zard` (e.g., `ZardButtonComponent`)
- **Selector prefix**: All selectors start with `z-` (e.g., `z-button`, `z-[name]`)
- **Attribute selectors**: For directives use `[z-[name]]` (e.g., `[z-button]`)
- **Input prefix**: Variant and config props use `z` prefix (e.g., `zType`, `zSize`, `zDisabled`)
- **Standard props**: Standard HTML attributes and utility props remain unprefixed (`class`, `disabled`, `value`)
- **Export name**: Use camelCase with `z` prefix (e.g., `exportAs: 'zButton'`)
- **Protected members**: Use `protected` for internal computed values and methods

**Input Patterns:**

- Use `input<Type>(defaultValue)` for regular inputs
- Use `input(false, { transform })` for boolean inputs accepting boolean | string
- Use `input.required<Type>()` for required inputs
- Use `linkedSignal()` when internal state needs to sync with input changes
- Type variant inputs with `Zard[Name]Variants['zType']` for CVA type safety
- Use `numberAttribute`, `booleanAttribute` transforms for HTML attribute coercion

**Output Patterns:**

- Use `output<Type>()` for type-safe event emission
- Name outputs descriptively: `valueChange`, `openChange`, `selectionChange`
- Emit from user interactions, not from programmatic changes

**Styling Patterns:**

- **TailwindCSS** with `mergeClasses` utility combining `twMerge` and `clsx`
- **Computed signals** for dynamic class generation (`protected readonly classes`)
- **CVA variants** with type exports for full TypeScript support
- **Consistent variant naming**: `default`, `secondary`, `destructive`, `outline`, `ghost`
- **Common size variants**: `default`, `sm`, `lg`, `icon` (for icon-only buttons)
- **Data attributes** for state: `[attr.data-state]`, `[attr.data-disabled]`

**Form Controls (CVA Pattern):**

- Implement `ControlValueAccessor` for form integration
- Inject `ChangeDetectorRef` for manual change detection
- Use `forwardRef(() => Component)` in providers
- Implement all CVA methods: `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`
- Call `this.cdr.markForCheck()` after state updates
- Use empty function placeholders with ESLint ignore comments

**Accessibility:**

- Use semantic HTML elements when possible
- Add ARIA attributes: `role`, `aria-label`, `aria-expanded`, `aria-selected`
- Support keyboard navigation with `@HostListener('keydown')`
- Use `tabindex` for focusable elements
- Include `sr-only` text for screen readers

**Advanced Patterns:**

- **Content Children**: Use `contentChildren(ChildComponent)` for parent-child relationships
- **View Children**: Use `viewChild.required<ElementRef>('ref')` for template references
- **String/Template Projection**: Accept `string | TemplateRef<void>` for flexible content
- **Platform Checks**: Use `isPlatformBrowser(PLATFORM_ID)` before DOM operations
- **Lifecycle Hooks**: Use `afterNextRender()` for SSR-safe DOM access
- **RxJS Integration**: Use `toObservable()` and `outputFromObservable()` for reactive patterns

### Demo Structure

Demo folder must contain:

- `[component].ts` - Main demo export with examples array
- `default.ts` - Default example component
- `basic.ts` - Basic usage example
- Additional variant demo components (e.g., `type.ts`, `size.ts`, `disabled.ts`)

Demo export structure:

```typescript
import { ZardDemo[Name]DefaultComponent } from './default';
import { ZardDemo[Name]BasicComponent } from './basic';
import { ZardDemo[Name]TypeComponent } from './type';
import { ZardDemo[Name]SizeComponent } from './size';

export const [COMPONENT_NAME] = {
  componentName: '[component-name]',
  componentType: '[component-name]',
  description: 'Brief component description',
  examples: [
    {
      name: 'default',
      component: ZardDemo[Name]DefaultComponent,
    },
    {
      name: 'basic',
      component: ZardDemo[Name]BasicComponent,
    },
    {
      name: 'type',
      component: ZardDemo[Name]TypeComponent,
    },
    {
      name: 'size',
      component: ZardDemo[Name]SizeComponent,
    },
  ],
};
```

Demo component structure:

```typescript
import { Component } from '@angular/core';

import { Zard[Name]Component } from '../[name].component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [Zard[Name]Component, ZardIconComponent],
  template: `
    <z-[name] zType="default">Content</z-[name]>
    <z-[name] zType="secondary">Secondary</z-[name]>
  `,
})
export class ZardDemo[Name]DefaultComponent {}
```

### Documentation Templates

**overview.md:**

```markdown
# [Component Name]

Brief description of what the component does and when to use it.
```

**api.md:**

```markdown
# API

## [z-[name]] <span class="api-type-label directive">Directive</span>

> z-[name] is a Component/Directive, it accepts all props which are supported by [native element](link).

To get a customized [name], just pass the following props to the component.

| Property | Description        | Type                                                      | Default   |
| -------- | ------------------ | --------------------------------------------------------- | --------- |
| `zType`  | component type     | `default \| secondary \| destructive \| outline \| ghost` | `default` |
| `zSize`  | component size     | `default \| sm \| lg`                                     | `default` |
| `class`  | custom CSS classes | `ClassValue`                                              | `''`      |

## Events

| Event Name    | Description                | Type                |
| ------------- | -------------------------- | ------------------- |
| `valueChange` | Emitted when value changes | `EventEmitter<any>` |
```

### Export Requirements

1. Export component in `libs/zard/src/lib/components/components.ts`
2. Create demo components following the structure above
3. Write documentation in `doc/overview.md` and `doc/api.md`
4. **Add to documentation system**:
   - Import demo in `apps/web/src/app/shared/constants/components.constant.ts`
   - Add to `COMPONENTS` array in alphabetical order
   - Add route entry in `COMPONENTS_PATH.data` in `routes.constant.ts`
5. File watcher automatically syncs demo/doc to web app

### Testing

- Co-located `.spec.ts` files next to components
- Use Jest with `@happy-dom/jest-environment`
- Angular testing utilities: TestBed, ComponentFixture
- Test all variants and edge cases

### Development Workflow

1. **Research component patterns** - Study shadcn/ui, ng-zorro, and existing components
2. Create component in `libs/zard/src/lib/components/[name]/`
3. Export in `libs/zard/src/lib/components/components.ts`
4. **Create comprehensive demos** showing all variants and use cases
5. **Write thorough documentation** in doc/ folder
6. **Register in documentation system**
7. **Test thoroughly** with `npx nx test zard --watch`
8. **Verify accessibility** and keyboard navigation
9. File watcher syncs automatically to web app

### Quality Checklist

- [ ] Component API is intuitive and predictable
- [ ] All variants work correctly and look polished
- [ ] TypeScript types are comprehensive and helpful
- [ ] Component is fully accessible (ARIA, keyboard navigation)
- [ ] Documentation includes all necessary examples
- [ ] Tests cover all major functionality
- [ ] Styling is consistent with design system
- [ ] Performance is optimized (OnPush, computed signals)
- [ ] Import order follows convention
- [ ] CVA variants are properly typed
- [ ] Demo exports follow structure
- [ ] Component is SSR-safe

### Common Utilities

```typescript
// From libs/zard/src/lib/shared/utils/utils.ts
mergeClasses(...inputs: ClassValue[]): string  // Merge Tailwind classes
transform(value: boolean | string): boolean     // Transform boolean attributes
generateId(prefix = ''): string                 // Generate unique IDs
```

### Icon patterns

- Use `lucide-angular` icons for consistency
- Import `ZardIconComponent` and use `<z-icon [zType]="iconName" />` in templates
- Icon type: `zType` input with `ZardIcon` type for icon inputs
- Common icons: `check`, `chevron-down`, `x`, `circle-alert`, `loader-circle`

### Documentation System Integration

```typescript
// In components.constant.ts
import { [COMPONENT_NAME] } from '@zard/components/[component-name]/demo/[component-name]';

export const COMPONENTS: ComponentData[] = [
  // ... other components in alphabetical order
  [COMPONENT_NAME],
  // ... remaining components
];
```

```typescript
// In routes.constant.ts COMPONENTS_PATH.data
{ name: '[Component Name]', path: '/docs/components/[component-name]', available: true },
```
