

```angular-ts title="input.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { computed, Directive, ElementRef, inject, input } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { inputVariants, type ZardInputVariants } from './input.variants';

@Directive({
  selector: 'input[z-input], textarea[z-input]',
  exportAs: 'zInput',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardInputDirective {
  readonly elementRef = inject(ElementRef);
  private readonly isTextarea = this.elementRef.nativeElement.tagName.toLowerCase() === 'textarea';

  readonly zBorderless = input(false, { transform });
  readonly zSize = input<ZardInputVariants['zSize']>('default');
  readonly zStatus = input<ZardInputVariants['zStatus']>();

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(inputVariants({ zType: !this.isTextarea ? 'default' : 'textarea', zSize: this.zSize(), zStatus: this.zStatus(), zBorderless: this.zBorderless() }), this.class()),
  );
}

```



```angular-ts title="input.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva('w-full', {
  variants: {
    zType: {
      default:
        'flex rounded-md border px-4 font-normal border-input bg-transparent text-base md:text-sm ring-offset-background file:border-0 file:text-foreground file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      textarea:
        'flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    },
    zSize: {
      default: 'h-10 py-2 file:max-md:py-0',
      sm: 'h-9 file:md:py-2 file:max-md:py-1.5',
      lg: 'h-11 py-1 file:md:py-3 file:max-md:py-2.5',
    },
    zStatus: {
      error: 'border-destructive focus-visible:ring-destructive',
      warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      success: 'border-green-500 focus-visible:ring-green-500',
    },
    zBorderless: {
      true: 'flex-1 bg-transparent border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
});

export type ZardInputVariants = VariantProps<typeof inputVariants>;

```

