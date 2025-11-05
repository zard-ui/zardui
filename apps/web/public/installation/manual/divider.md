

```angular-ts title="divider.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { dividerVariants, type ZardDividerVariants } from './divider.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-divider',
  standalone: true,
  exportAs: 'zDivider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  host: {
    '[attr.role]': `'separator'`,
    '[attr.aria-orientation]': 'zOrientation()',
    '[class]': 'classes()',
  },
})
export class ZardDividerComponent {
  readonly zOrientation = input<ZardDividerVariants['zOrientation']>('horizontal');
  readonly zSpacing = input<ZardDividerVariants['zSpacing']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      dividerVariants({
        zOrientation: this.zOrientation(),
        zSpacing: this.zSpacing(),
      }),
      this.class(),
    ),
  );
}

```



```angular-ts title="divider.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border block', {
  variants: {
    zOrientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full inline-block',
    },
    zSpacing: {
      none: '',
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
    zSpacing: 'default',
  },
  compoundVariants: [
    {
      zOrientation: 'horizontal',
      zSpacing: 'sm',
      class: 'my-2',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'default',
      class: 'my-4',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'lg',
      class: 'my-8',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'sm',
      class: 'mx-2',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'default',
      class: 'mx-4',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'lg',
      class: 'mx-8',
    },
  ],
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;

```

