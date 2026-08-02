---
title: Skeleton
description: Use to show a placeholder while content is loading.
---

# Skeleton

Use to show a placeholder while content is loading.

## Installation

### CLI

```bash
npx zard-cli@latest add skeleton
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { skeletonVariants } from './skeleton.variants';

@Component({
  selector: 'z-skeleton',
  template: `
    <div data-slot="skeleton" [class]="classes()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
  exportAs: 'zSkeleton',
})
export class ZardSkeletonComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(skeletonVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('bg-muted animate-pulse rounded-md');
export type ZardSkeletonVariants = VariantProps<typeof skeletonVariants>;
```

```angular-ts
export * from './skeleton.component';
export * from './skeleton.variants';
```

## Usage

```angular-ts
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';
```

```angular-html
<z-skeleton class="h-4 w-[250px]"></z-skeleton>
```

## Examples

### Avatar

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-avatar',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-fit items-center gap-4">
      <z-skeleton class="size-10 shrink-0 rounded-full" />
      <div class="grid gap-2">
        <z-skeleton class="h-4 w-[150px]" />
        <z-skeleton class="h-4 w-[100px]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonAvatarComponent {}
```

### Card

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-card',
  imports: [ZardCardImports, ZardSkeletonComponent],
  template: `
    <z-card class="w-full min-w-xs">
      <z-card-header>
        <z-card-title [zTitle]="titleSkeleton" />
        <z-card-description [zDescription]="descriptionSkeleton" />
      </z-card-header>
      <z-card-content>
        <z-skeleton class="aspect-video w-full" />
      </z-card-content>
    </z-card>

    <ng-template #titleSkeleton>
      <z-skeleton class="h-4 w-2/3" />
    </ng-template>

    <ng-template #descriptionSkeleton>
      <z-skeleton class="h-4 w-1/2" />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonCardComponent {}
```

### Text

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-text',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-full min-w-xs flex-col gap-2">
      <z-skeleton class="h-4 w-full" />
      <z-skeleton class="h-4 w-full" />
      <z-skeleton class="h-4 w-3/4" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonTextComponent {}
```

### Form

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-form',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-full min-w-xs flex-col gap-7">
      <div class="flex flex-col gap-3">
        <z-skeleton class="h-4 w-20" />
        <z-skeleton class="h-8 w-full" />
      </div>
      <div class="flex flex-col gap-3">
        <z-skeleton class="h-4 w-24" />
        <z-skeleton class="h-8 w-full" />
      </div>
      <z-skeleton class="h-8 w-24" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonFormComponent {}
```

### Table

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-table',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-full min-w-sm flex-col gap-2">
      @for (row of rows; track row) {
        <div class="flex gap-4">
          <z-skeleton class="h-4 flex-1" />
          <z-skeleton class="h-4 w-24" />
          <z-skeleton class="h-4 w-20" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonTableComponent {
  protected readonly rows = [0, 1, 2, 3, 4];
}
```

## API Reference

### [z-skeleton]

Renders a customizable placeholder during data loading to improve perceived performance and prevent layout shifts.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/skeleton)
