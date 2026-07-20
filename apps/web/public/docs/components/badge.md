---
title: Badge
description: Displays a badge or a component that looks like a badge.
---

# Badge

Displays a badge or a component that looks like a badge.

## Installation

### CLI

```bash
npx zard-cli@latest add badge
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { badgeVariants, type ZardBadgeTypeVariants } from './badge.variants';

@Component({
  selector: 'z-badge, a[z-badge]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-variant]': 'zType()',
    'data-slot': 'badge',
  },
  exportAs: 'zBadge',
})
export class ZardBadgeComponent {
  readonly zType = input<ZardBadgeTypeVariants>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(badgeVariants({ zType: this.zType() }), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      zType: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline: 'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardBadgeTypeVariants = NonNullable<VariantProps<typeof badgeVariants>['zType']>;
```

```angular-ts
export * from './badge.component';
export * from './badge.variants';
```

## Usage

```angular-ts
import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
```

```angular-html
<z-badge>Badge</z-badge>
```

## Examples

### Default

```angular-ts
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-default',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
        <z-badge zType="ghost">Ghost</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeDefaultComponent {}
```

### With Icons

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBookmark } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-with-icons',
  imports: [ZardBadgeComponent, NgIcon],
  template: `
    <div class="flex w-full flex-wrap gap-2">
      <z-badge zType="secondary">
        <ng-icon name="lucideBadgeCheck" />
        Verified
      </z-badge>
      <z-badge zType="outline">
        Bookmark
        <ng-icon name="lucideBookmark" />
      </z-badge>
    </div>
  `,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideBookmark })],
})
export class ZardDemoBadgeWithIconsComponent {}
```

### Link

```angular-ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-link',
  imports: [ZardBadgeComponent, NgIcon, RouterLink],
  template: `
    <div class="flex w-full flex-wrap gap-2">
      <a z-badge [routerLink]="[]" fragment="link">
        <span class="flex items-center">
          Open Link
          <ng-icon name="lucideArrowUpRight" />
        </span>
      </a>
    </div>
  `,
  viewProviders: [provideIcons({ lucideArrowUpRight })],
})
export class ZardDemoBadgeLinkComponent {}
```

### Custom Colors

```angular-ts
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-custom-colors',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</z-badge>
        <z-badge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</z-badge>
        <z-badge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</z-badge>
        <z-badge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</z-badge>
        <z-badge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeCustomColorsComponent {}
```

## API Reference

### z-badge

Displays a badge or a component that looks like a badge.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zType` | Badge type | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` |
| `class` | Additional CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/badge)
