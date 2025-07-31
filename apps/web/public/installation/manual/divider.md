### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">divider.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { dividerVariants, ZardDividerVariants } from './divider.variants';
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

  protected readonly classes = computed(() => mergeClasses(dividerVariants({ zOrientation: this.zOrientation() }), this.class()));
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">divider.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border', {
  variants: {
    zOrientation: {
      horizontal: 'h-px w-full my-4',
      vertical: 'w-px h-full mx-4',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;

```

