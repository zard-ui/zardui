---
title: Button
description: Displays a button or a component that looks like a button.
---

# Button

Displays a button or a component that looks like a button.

## Installation

### CLI

```bash
npx zard-cli@latest add button
```

### Manual

```angular-ts
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  type OnDestroy,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  buttonVariants,
  type ZardButtonShapeVariants,
  type ZardButtonSizeVariants,
  type ZardButtonTypeVariants,
} from './button.variants';

@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  imports: [NgIcon],
  template: `
    @if (zLoading()) {
      <ng-icon name="lucideLoaderCircle" class="animate-spin duration-2000" />
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    'data-slot': 'button',
    '[class]': 'classes()',
    '[attr.data-disabled]': 'isNotInsideOfButtonOrLink() && zDisabled() || null',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.data-size]': 'zSize()',
    '[attr.data-variant]': 'zType()',
    '[attr.aria-disabled]': 'isNotInsideOfButtonOrLink() && zDisabled() || null',
    '[attr.disabled]': 'isNotInsideOfButtonOrLink() && zDisabled() ? "" : null',
    '[attr.role]': 'isNotInsideOfButtonOrLink() ? "button" : null',
    '[attr.tabindex]': 'isNotInsideOfButtonOrLink() ? "0" : null',
  },
  exportAs: 'zButton',
})
export class ZardButtonComponent implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly zType = input<ZardButtonTypeVariants>('default');
  readonly zSize = input<ZardButtonSizeVariants>('default');
  readonly zShape = input<ZardButtonShapeVariants>('default');
  readonly class = input<ClassValue>('');
  readonly zLoading = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  private readonly iconOnlyState = signal(false);
  readonly iconOnly = this.iconOnlyState.asReadonly();

  private _mutationObserver: MutationObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
        return;
      }

      const check = () => {
        const el = this.elementRef.nativeElement;
        const hasIcon = el.querySelector('ng-icon') !== null;
        const children = Array.from<Node>(el.childNodes);
        const hasText = children.some(node => {
          if (node.nodeType === 3) {
            return node.textContent?.trim() !== '';
          }
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (element.matches('ng-icon')) {
              return false;
            }
            return element.textContent?.trim() !== '';
          }
          return false;
        });

        this.iconOnlyState.set(hasIcon && !hasText);
      };

      check();
      this._mutationObserver = new MutationObserver(check);
      this._mutationObserver.observe(this.elementRef.nativeElement, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
  }

  ngOnDestroy(): void {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
  }

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zLoading: this.zLoading(),
        zDisabled: this.zDisabled(),
      }),
      this.class(),
    ),
  );

  protected readonly isNotInsideOfButtonOrLink = computed(() => {
    // Evaluated once; assumes component parent doesn't change after mount
    const zardButtonElement = this.elementRef.nativeElement;
    if (zardButtonElement.parentElement) {
      const { tagName } = zardButtonElement.parentElement;
      return tagName !== 'BUTTON' && tagName !== 'A';
    }
    return true;
  });
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const buttonVariants = cva(
  mergeClasses(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      zType: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      zSize: {
        default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
      zShape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
      zLoading: {
        true: 'pointer-events-none opacity-50',
      },
      zDisabled: {
        true: 'pointer-events-none opacity-50',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);
export type ZardButtonShapeVariants = NonNullable<VariantProps<typeof buttonVariants>['zShape']>;
export type ZardButtonSizeVariants = NonNullable<VariantProps<typeof buttonVariants>['zSize']>;
export type ZardButtonTypeVariants = NonNullable<VariantProps<typeof buttonVariants>['zType']>;
```

```angular-ts
export * from './button.component';
export * from './button.variants';
```

## Usage

```angular-ts
import { ZardButtonComponent } from '@/shared/components/button/button.component';
```

```angular-html
<button type="button" z-button>Button</button>
```

## Examples

### Size

Use the `zSize` prop to change the size of the button.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-size',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-col items-start gap-8 sm:flex-row">
      <div class="flex items-start gap-2">
        <button z-button zSize="xs" zType="outline">Extra Small</button>
        <button z-button zSize="icon-xs" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
      <div class="flex items-start gap-2">
        <button z-button zSize="sm" zType="outline">Small</button>
        <button z-button zSize="icon-sm" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
      <div class="flex items-start gap-2">
        <button z-button zType="outline">Default</button>
        <button z-button zSize="icon" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
      <div class="flex items-start gap-2">
        <button z-button zType="outline" zSize="lg">Large</button>
        <button z-button zSize="icon-lg" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight })],
})
export class ZardDemoButtonSizeComponent {}
```

### Default

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent],
  template: `
    <button z-button>Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonDefaultComponent {}
```

### Outline

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-outline',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline">Outline</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonOutlineComponent {}
```

### Secondary

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-secondary',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="secondary">Secondary</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonSecondaryComponent {}
```

### Ghost

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-ghost',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="ghost">Ghost</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonGhostComponent {}
```

### Destructive

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-destructive',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="destructive">Destructive</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonDestructiveComponent {}
```

### Link

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-link',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="link">Link</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonLinkComponent {}
```

### Icon

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-icon',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline" zSize="icon" aria-label="Submit">
      <ng-icon name="lucideCircleFadingArrowUp" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingArrowUp })],
})
export class ZardDemoButtonIconComponent {}
```

### With Icon

Project an `<ng-icon>` before or after the label to render an icon next to the button text.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-with-icon',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline" zSize="sm">
      <ng-icon name="lucideGitBranch" />
      New Branch
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch })],
})
export class ZardDemoButtonWithIconComponent {}
```

### Rounded

Use the `rounded-full` class to make the button rounded.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-rounded',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-col gap-8">
      <button z-button zType="outline" zSize="icon" class="rounded-full" aria-label="Submit">
        <ng-icon name="lucideArrowUp" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp })],
})
export class ZardDemoButtonRoundedComponent {}
```

### Spinner

Use the `[zLoading]` prop to show a loading spinner before the label, or project an `<ng-icon name="lucideLoaderCircle" class="animate-spin" />` manually to control its position.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-spinner',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex gap-2">
      <button z-button zType="outline" [zLoading]="true" [zDisabled]="true">Generating</button>
      <button z-button zType="secondary" [zDisabled]="true">
        Downloading
        <ng-icon name="lucideLoaderCircle" class="animate-spin" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
})
export class ZardDemoButtonSpinnerComponent {}
```

### Button Group

To create a button group, use the `<z-button-group>` component. See the Button Group documentation for more details.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideArrowLeft,
  lucideCalendarPlus,
  lucideChevronRight,
  lucideClock,
  lucideEllipsis,
  lucideListFilter,
  lucideMailCheck,
  lucideTag,
  lucideTrash2,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator';

@Component({
  selector: 'z-demo-button-button-group',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardMenuImports, ZardSeparatorComponent],
  template: `
    <z-button-group>
      <z-button-group class="hidden sm:flex">
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Go Back">
          <ng-icon name="lucideArrowLeft" />
        </button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Archive</button>
        <button type="button" z-button zType="outline">Report</button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zType="outline">Snooze</button>
        <button
          type="button"
          z-button
          zType="outline"
          zSize="icon"
          aria-label="More Options"
          z-menu
          [zMenuTriggerFor]="menu"
        >
          <ng-icon name="lucideEllipsis" />

          <ng-template #menu>
            <div z-menu-content class="w-40">
              <button type="button" z-menu-item>
                <ng-icon name="lucideMailCheck" />
                Mark as Read
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="lucideArchive" />
                Archive
              </button>

              <z-separator class="my-2" />

              <button type="button" z-menu-item>
                <ng-icon name="lucideClock" />
                Snooze
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="lucideCalendarPlus" />
                Add to Calendar
              </button>
              <button type="button" z-menu-item>
                <ng-icon name="lucideListFilter" />
                Add to List
              </button>
              <button
                type="button"
                z-menu-item
                z-menu
                [zMenuTriggerFor]="labelMenu"
                zPlacement="rightTop"
                class="justify-between"
              >
                <div class="flex items-center gap-2">
                  <ng-icon name="lucideTag" />
                  Label As...
                </div>
                <ng-icon name="lucideChevronRight" />

                <ng-template #labelMenu>
                  <div z-menu-content class="w-40">
                    <button type="button" z-menu-item>Personal</button>
                    <button type="button" z-menu-item>Work</button>
                    <button type="button" z-menu-item>Other</button>
                  </div>
                </ng-template>
              </button>

              <z-separator class="my-2" />

              <button type="button" z-menu-item class="text-destructive">
                <ng-icon name="lucideTrash2" />
                Trash
              </button>
            </div>
          </ng-template>
        </button>
      </z-button-group>
    </z-button-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideEllipsis,
      lucideMailCheck,
      lucideArchive,
      lucideClock,
      lucideCalendarPlus,
      lucideListFilter,
      lucideTag,
      lucideChevronRight,
      lucideTrash2,
    }),
  ],
})
export class ZardDemoButtonButtonGroupComponent {}
```

### As Child

Apply the `z-button` attribute selector to a different element (like `<a>`) to give it the button appearance. Here's an example of a link that looks like a button.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-as-child',
  imports: [ZardButtonComponent],
  template: `
    <a z-button href="/login">Login</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonAsChildComponent {}
```

## API Reference

### z-button

Displays a button or a component that looks like a button.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zDisabled` | Button disabled state | `boolean` | `false` |
| `zLoading` | Button loading state | `boolean` | `false` |
| `zShape` | Button shape | `'default' \| 'circle' \| 'square'` | `'default'` |
| `zSize` | Button size | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` |
| `zType` | Button type | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` |

---

[Open in browser](https://zardui.com/docs/components/button)
