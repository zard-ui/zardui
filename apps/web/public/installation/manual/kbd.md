

```angular-ts title="kbd.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { kbdVariants } from './kbd.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-kbd, [z-kbd]',
  exportAs: 'zKbd',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<kbd><ng-content></ng-content></kbd> `,
  host: {
    '[class]': 'classes()',
  },
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

export const kbdGroupVariants = cva(`inline-flex items-center gap-2`);

```



```angular-ts title="kbd-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue } from 'clsx';

import { kbdGroupVariants } from './kbd.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-kbd-group, [z-kbd-group]',
  exportAs: 'zKbdGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <ng-content></ng-content> `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardKbdGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdGroupVariants(), this.class()));
}

```

