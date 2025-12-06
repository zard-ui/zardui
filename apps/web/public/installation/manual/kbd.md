

```angular-ts title="kbd.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { kbdVariants } from './kbd.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-kbd, [z-kbd]',
  standalone: true,
  template: `<kbd><ng-content /></kbd> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zKbd',
})
export class ZardKbdComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdVariants(), this.class()));
}

```



```angular-ts title="kbd.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva } from 'class-variance-authority';

export const kbdVariants = cva(
  `min-w-5 w-fit h-5 inline-flex items-center justify-center gap-1 text-xs font-medium font-mono bg-muted text-muted-foreground pointer-events-none rounded-sm px-1 select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10`,
);

export const kbdGroupVariants = cva(`inline-flex items-center gap-1`);

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './kbd.component';
export * from './kbd-group.component';
export * from './kbd.variants';

```



```angular-ts title="kbd-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue } from 'clsx';

import { kbdGroupVariants } from './kbd.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-kbd-group, [z-kbd-group]',
  standalone: true,
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zKbdGroup',
})
export class ZardKbdGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdGroupVariants(), this.class()));
}

```

