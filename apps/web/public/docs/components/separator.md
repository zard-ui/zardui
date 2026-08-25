---
title: Separator
description: Visually or semantically separates content.
---

# Separator

Visually or semantically separates content.

## Installation

### CLI

```bash
npx zard-cli@latest add separator
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { separatorVariants, type ZardSeparatorVariants } from './separator.variants';

@Component({
  selector: 'z-separator',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'separator',
    '[attr.data-orientation]': 'zOrientation()',
    '[attr.role]': 'zDecorative() ? "none" : "separator"',
    '[attr.aria-orientation]': '!zDecorative() && zOrientation() === "vertical" ? "vertical" : null',
    '[class]': 'classes()',
  },
  exportAs: 'zSeparator',
})
export class ZardSeparatorComponent {
  readonly zOrientation = input<ZardSeparatorVariants['zOrientation']>('horizontal');
  readonly zDecorative = input(true, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  // shadcn/ui uses div through SeparatorPrimitive. We don't use div, so we need to add 'block' class
  // to make it match shadcn/ui styling
  protected readonly classes = computed(() => mergeClasses(separatorVariants(), 'block', this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const separatorVariants = cva(
  'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
  {
    variants: {
      zOrientation: {
        horizontal: '',
        vertical: '',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);

export type ZardSeparatorVariants = VariantProps<typeof separatorVariants>;
```

```angular-ts
export * from './separator.component';
export * from './separator.variants';
```

## Usage

```angular-ts
import { ZardSeparatorComponent } from '@/shared/components/separator/separator.component';
```

```angular-html
<z-separator></z-separator>
```

## Examples

### Vertical

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-vertical',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <z-separator zOrientation="vertical" />
      <div>Docs</div>
      <z-separator zOrientation="vertical" />
      <div>Source</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorVerticalComponent {}
```

### Menu

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-menu',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex items-center gap-2 text-sm md:gap-4">
      <div class="flex flex-col gap-1">
        <span class="font-medium">Settings</span>
        <span class="text-muted-foreground text-xs">Manage preferences</span>
      </div>
      <z-separator zOrientation="vertical" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Account</span>
        <span class="text-muted-foreground text-xs">Profile & security</span>
      </div>
      <z-separator zOrientation="vertical" class="hidden md:block" />
      <div class="hidden flex-col gap-1 md:flex">
        <span class="font-medium">Help</span>
        <span class="text-muted-foreground text-xs">Support & docs</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorMenuComponent {}
```

### List

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-list',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex w-full min-w-sm flex-col gap-2 text-sm">
      <dl class="flex items-center justify-between">
        <dt>Item 1</dt>
        <dd class="text-muted-foreground">Value 1</dd>
      </dl>
      <z-separator />
      <dl class="flex items-center justify-between">
        <dt>Item 2</dt>
        <dd class="text-muted-foreground">Value 2</dd>
      </dl>
      <z-separator />
      <dl class="flex items-center justify-between">
        <dt>Item 3</dt>
        <dd class="text-muted-foreground">Value 3</dd>
      </dl>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorListComponent {}
```

## API Reference

### z-separator

Visually or semantically separates content with a horizontal or vertical line.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zOrientation]` | The orientation of the separator. | `"horizontal" \| "vertical"` | `horizontal` |
| `[zDecorative]` | When true, indicates that the separator is purely decorative and removes it from the accessibility tree. | `boolean` | `true` |
| `[class]` | Override or extend the default classes (margin, color, etc). | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/separator)
