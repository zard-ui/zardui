---
title: Aspect Ratio
description: Displays content within a desired ratio.
---

# Aspect Ratio

Displays content within a desired ratio.

## Installation

### CLI

```bash
npx zard-cli@latest add aspect-ratio
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { aspectRatioVariants } from './aspect-ratio.variants';

@Component({
  selector: 'z-aspect-ratio, [z-aspect-ratio]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'aspect-ratio',
    '[style.aspectRatio]': 'zRatio()',
    '[class]': 'classes()',
  },
  exportAs: 'zAspectRatio',
})
export class ZardAspectRatioComponent {
  readonly zRatio = input<number | string>(1);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(aspectRatioVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const aspectRatioVariants = cva('relative block');
export type ZardAspectRatioVariants = VariantProps<typeof aspectRatioVariants>;
```

```angular-ts
export * from './aspect-ratio.component';
export * from './aspect-ratio.variants';
```

## Usage

```angular-ts
import { ZardAspectRatioComponent } from '@/shared/components/aspect-ratio/aspect-ratio.component';
```

```angular-html
<z-aspect-ratio [zRatio]="16 / 9"></z-aspect-ratio>
```

## Examples

### Square

A square aspect ratio component using `[zRatio]="1 / 1"`. This is useful for displaying images in a square format.

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-square',
  imports: [ZardAspectRatioComponent, NgOptimizedImage],
  template: `
    <z-aspect-ratio [zRatio]="1 / 1" class="bg-muted w-full max-w-48 rounded-lg">
      <img
        ngSrc="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        fill
        class="rounded-lg object-cover grayscale dark:brightness-20"
      />
    </z-aspect-ratio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoAspectRatioSquareComponent {}
```

### Portrait

A portrait aspect ratio component using `[zRatio]="9 / 16"`. This is useful for displaying images in a portrait format.

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-portrait',
  imports: [ZardAspectRatioComponent, NgOptimizedImage],
  template: `
    <z-aspect-ratio [zRatio]="9 / 16" class="bg-muted w-full max-w-40 rounded-lg">
      <img
        ngSrc="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        fill
        class="rounded-lg object-cover grayscale dark:brightness-20"
      />
    </z-aspect-ratio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoAspectRatioPortraitComponent {}
```

### Rtl

The box keeps its ratio in a right-to-left layout; only the surrounding content mirrors.

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-rtl',
  imports: [ZardAspectRatioComponent, NgOptimizedImage],
  template: `
    <figure class="w-full max-w-sm" dir="rtl">
      <z-aspect-ratio [zRatio]="16 / 9" class="bg-muted rounded-lg">
        <img
          ngSrc="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          class="rounded-lg object-cover grayscale dark:brightness-20"
        />
      </z-aspect-ratio>
      <figcaption class="text-muted-foreground mt-2 text-center text-sm">منظر طبيعي جميل</figcaption>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoAspectRatioRtlComponent {}
```

## API Reference

### z-aspect-ratio

Displays content within a desired ratio.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zRatio` | Desired ratio: 16 / 9 or '16 / 9'. Default 1 (square) | `number \| string` | `1` |
| `class` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/aspect-ratio)
