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

A vertical `z-separator` relies on `self-stretch` to fill the cross axis of its flex container — give the row `items-center` (or an explicit height) so it has something to stretch to, or it collapses to zero height. This one is decorative (the `zDecorative` default), so it renders `role="none"` and is not announced.

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

These separators mark real boundaries between menu sections, so `[zDecorative]="false"` gives them `role="separator"` and `aria-orientation="vertical"` instead of the default decorative `role="none"`.

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
      <z-separator zOrientation="vertical" [zDecorative]="false" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Account</span>
        <span class="text-muted-foreground text-xs">Profile & security</span>
      </div>
      <z-separator zOrientation="vertical" [zDecorative]="false" class="hidden md:block" />
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

Horizontal separators between list rows are meaningful dividers here too, not decoration, so `[zDecorative]="false"` exposes `role="separator"` to assistive tech.

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
      <z-separator [zDecorative]="false" />
      <dl class="flex items-center justify-between">
        <dt>Item 2</dt>
        <dd class="text-muted-foreground">Value 2</dd>
      </dl>
      <z-separator [zDecorative]="false" />
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

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardSeparatorComponent } from '../separator.component';

const translations: ZardRtlTranslations<{
  title: string;
  subtitle: string;
  body: string;
  docs: string;
  source: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Zard/ui',
      subtitle: 'The Next Level for Your Angular Projects',
      body: 'A set of beautifully designed components that you can customize, extend, and build on.',
      docs: 'Docs',
      source: 'Source',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'Zard/ui',
      subtitle: 'المستوى التالي لمشاريع Angular الخاصة بك',
      body: 'مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء عليها.',
      docs: 'التوثيق',
      source: 'المصدر',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'Zard/ui',
      subtitle: 'הרמה הבאה לפרויקטי Angular שלך',
      body: 'סט של רכיבים מעוצבים להפליא שאפשר להתאים אישית, להרחיב ולבנות עליהם.',
      docs: 'תיעוד',
      source: 'קוד מקור',
    },
  },
};

@Component({
  selector: 'z-demo-separator-rtl',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex max-w-sm flex-col gap-4 text-sm">
      <div class="flex flex-col gap-1.5">
        <div class="leading-none font-medium">{{ i18n.t().title }}</div>
        <div class="text-muted-foreground">{{ i18n.t().subtitle }}</div>
      </div>
      <z-separator />
      <div>{{ i18n.t().body }}</div>
      <div class="flex h-5 items-center gap-4">
        <span>{{ i18n.t().docs }}</span>
        <z-separator zOrientation="vertical" />
        <span>{{ i18n.t().source }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
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
