### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">skeleton.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

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

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">skeleton.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('bg-accent animate-pulse rounded-md');
export type ZardSkeletonVariants = VariantProps<typeof skeletonVariants>;

```
