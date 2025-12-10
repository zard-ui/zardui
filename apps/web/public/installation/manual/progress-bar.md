

```angular-ts title="progress-bar.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  containerProgressBarVariants,
  progressBarVariants,
  type ZardProgressBarShapeVariants,
  type ZardProgressBarSizeVariants,
  type ZardProgressBarTypeVariants,
} from './progress-bar.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-progress-bar',
  template: `
    @if (zIndeterminate()) {
      <div [class]="classes()">
        <div [class]="barClasses()"></div>
      </div>
    } @else {
      <div [class]="classes()">
        <div [style.width.%]="correctedProgress()" [class]="barClasses()" id="bar"></div>
      </div>
    }
  `,
  styles: `
    @keyframes indeterminate {
      0% {
        left: -0%;
        width: 30%;
      }
      50% {
        left: 50%;
        width: 30%;
      }
      100% {
        left: 100%;
        width: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'w-full',
  },
})
export class ZardProgressBarComponent {
  readonly zType = input<ZardProgressBarTypeVariants>('default');
  readonly zSize = input<ZardProgressBarSizeVariants>('default');
  readonly zShape = input<ZardProgressBarShapeVariants>('default');
  readonly zIndeterminate = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');
  readonly barClass = input<ClassValue>('');
  readonly progress = input(0);

  readonly correctedProgress = computed(() => {
    if (this.progress() > 100) {
      return 100;
    } else if (this.progress() < 0) {
      return 0;
    }
    return this.progress();
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      containerProgressBarVariants({
        zIndeterminate: this.zIndeterminate(),
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
      }),
      this.class(),
    ),
  );

  protected readonly barClasses = computed(() =>
    mergeClasses(
      progressBarVariants({ zIndeterminate: this.zIndeterminate(), zType: this.zType(), zShape: this.zShape() }),
      this.barClass(),
    ),
  );
}

```



```angular-ts title="progress-bar.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const containerProgressBarVariants = cva('w-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary/20',
      destructive: 'bg-destructive/20',
      accent: 'bg-chart-1/20',
    },
    zSize: {
      default: 'h-2',
      sm: 'h-3',
      lg: 'h-5',
    },
    zShape: {
      default: 'rounded-full',
      square: 'rounded-none',
    },
    zIndeterminate: {
      true: 'relative',
    },
  },

  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});
export type ZardProgressBarSizeVariants = NonNullable<VariantProps<typeof containerProgressBarVariants>['zSize']>;

export const progressBarVariants = cva('h-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      accent: 'bg-chart-1',
    },
    zShape: {
      default: 'rounded-full',
      square: 'rounded-none',
    },
    zIndeterminate: {
      true: 'absolute animate-[indeterminate_1.5s_infinite_ease-out]',
    },
  },
  defaultVariants: {
    zType: 'default',
    zShape: 'default',
  },
});
export type ZardProgressBarTypeVariants = NonNullable<VariantProps<typeof progressBarVariants>['zType']>;
export type ZardProgressBarShapeVariants = NonNullable<VariantProps<typeof progressBarVariants>['zShape']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './progress-bar.component';
export * from './progress-bar.variants';

```

