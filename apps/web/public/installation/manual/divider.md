

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
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      dividerVariants({
        zOrientation: this.zOrientation(),
      }),
      this.class(),
    ),
  );
}

```



```angular-ts title="divider.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border shrink-0', {
  variants: {
    zOrientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;

```

