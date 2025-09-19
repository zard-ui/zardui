

```angular-ts title="badge.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { badgeVariants, ZardBadgeVariants } from './badge.variants';

@Component({
  selector: 'z-badge',
  exportAs: 'zBadge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBadgeComponent {
  readonly zType = input<ZardBadgeVariants['zType']>('default');
  readonly zShape = input<ZardBadgeVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(badgeVariants({ zType: this.zType(), zShape: this.zShape() }), this.class()));
}

```



```angular-ts title="badge.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center border text-xs px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      zType: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        error: 'border-transparent bg-error text-error-foreground hover:bg-error/80',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/80',
        outline: 'text-foreground',
      },
      zShape: {
        default: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zShape: 'default',
    },
  },
);
export type ZardBadgeVariants = VariantProps<typeof badgeVariants>;

```

