---
title: Progress
description: Displays an indicator showing the completion progress of a task.
---

# Progress

Displays an indicator showing the completion progress of a task.

## Installation

### CLI

```bash
npx zard-cli@latest add progress
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { progressVariants } from './progress.variants';

@Component({
  selector: 'z-progress',
  template: `
    <div
      data-slot="progress-indicator"
      class="bg-primary size-full flex-1 transition-all"
      [style.transform]="indicatorTransform()"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'clampedValue()',
    '[class]': 'classes()',
  },
  exportAs: 'zProgress',
})
export class ZardProgressComponent {
  readonly value = input(0);
  readonly class = input<ClassValue>('');

  protected readonly clampedValue = computed(() => {
    const v = this.value();
    if (v > 100) {
      return 100;
    }
    if (v < 0) {
      return 0;
    }
    return v;
  });

  protected readonly indicatorTransform = computed(() => `translateX(-${100 - this.clampedValue()}%)`);

  protected readonly classes = computed(() => mergeClasses(progressVariants(), this.class()));
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const progressVariants = cva('bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full');
```

```angular-ts
export * from './progress.component';
export * from './progress.variants';
```

## Usage

```angular-ts
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
```

```angular-html
<z-progress [value]="60"></z-progress>
```

## Examples

### Label

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

@Component({
  selector: 'z-demo-progress-label',
  imports: [ZardProgressComponent, ...ZardFieldImports],
  template: `
    <z-field class="w-full min-w-sm">
      <z-field-label for="progress-upload">
        <span>Upload progress</span>
        <span class="ml-auto">66%</span>
      </z-field-label>
      <z-progress id="progress-upload" [value]="66" />
    </z-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressLabelComponent {}
```

### Controlled

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

@Component({
  selector: 'z-demo-progress-controlled',
  imports: [ZardProgressComponent, ZardSliderComponent],
  template: `
    <div class="flex w-full min-w-sm flex-col gap-4">
      <z-progress [value]="value()[0]" />
      <z-slider [zDefault]="value()" zMin="0" zMax="100" zStep="1" (zSlideIndexChange)="value.set($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressControlledComponent {
  protected readonly value = signal([50]);
}
```

## API Reference

### z-progress

Displays an indicator showing the completion progress of a task.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[value]` | Current progress value between 0 and 100. Values outside this range are clamped. | `number` | `0` |
| `[class]` | Override or extend the default classes (height, color, etc). | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/progress)
