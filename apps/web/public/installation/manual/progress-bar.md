### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">progress-bar.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { containerProgressBarVariants, progressBarVariants, ZardContainerProgressBarVariants, ZardProgressBarVariants } from './progress-bar.variants';

@Component({
  selector: 'z-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
  host: {
    class: 'w-full',
  },
})
export class ZardProgressBarComponent {
  readonly zType = input<ZardProgressBarVariants['zType']>('default');
  readonly zSize = input<ZardContainerProgressBarVariants['zSize']>('default');
  readonly zShape = input<ZardProgressBarVariants['zShape']>('default');
  readonly zIndeterminate = input<ZardProgressBarVariants['zIndeterminate']>(undefined);
  readonly class = input<ClassValue>('');
  readonly barClass = input<ClassValue>('');
  readonly progress = input(0);

  readonly correctedProgress = computed(() => {
    if (this.progress() > 100) return 100;
    if (this.progress() < 0) return 0;
    return this.progress();
  });

  protected readonly classes = computed(() =>
    mergeClasses(containerProgressBarVariants({ zIndeterminate: this.zIndeterminate(), zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()),
  );

  protected readonly barClasses = computed(() =>
    mergeClasses(progressBarVariants({ zIndeterminate: this.zIndeterminate(), zType: this.zType(), zShape: this.zShape() }), this.barClass()),
  );
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">progress-bar.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const containerProgressBarVariants = cva('w-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary-foreground hover:bg-primary/10',
      destructive: 'bg-primary-foreground dark:text-secondary-foreground hover:bg-destructive/10',
      accent: 'bg-primary-foreground hover:bg-primary/10',
    },
    zSize: {
      default: 'h-2',
      sm: 'h-3',
      lg: 'h-5',
    },
    zShape: {
      default: 'rounded-sm',
      circle: 'rounded-full',
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
export type ZardContainerProgressBarVariants = VariantProps<typeof containerProgressBarVariants>;

export const progressBarVariants = cva('h-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      accent: 'bg-chart-1',
    },
    zShape: {
      default: 'rounded-sm',
      circle: 'rounded-full ',
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
export type ZardProgressBarVariants = VariantProps<typeof progressBarVariants>;

```

