

```angular-ts title="skeleton.component.ts" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { mergeClasses } from '../../shared/utils/utils';
import { skeletonVariants } from './skeleton.variants';

@Component({
  selector: 'z-skeleton',
  exportAs: 'zSkeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div data-slot="skeleton" [class]="classes()"></div>`,
  host: {
    class: 'block',
  },
})
export class ZardSkeletonComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(skeletonVariants(), this.class()));
}

```



```angular-ts title="skeleton.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('bg-accent animate-pulse rounded-md');
export type ZardSkeletonVariants = VariantProps<typeof skeletonVariants>;

```

