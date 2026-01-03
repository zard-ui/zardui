

```angular-ts title="scroll-to-top.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { scrollToTopVariants, type ScrollToTopVariants } from './scroll-to-top.variants';

@Component({
  selector: 'z-scroll-to-top, [z-scroll-to-top]',
  imports: [CommonModule],
  standalone: true,
  template: `
    @if (visible()) {
      <button type="button" aria-label="Scroll to top" (click)="scrollToTop()" [class]="buttonClasses()">
        <ng-content />
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
})
export class ZardScrollToTopComponent {
  readonly variant = input<ScrollToTopVariants['variant']>('default');
  readonly size = input<ScrollToTopVariants['size']>('md');
  readonly class = input<string>('');

  private readonly _visible = signal(false);
  readonly visible = this._visible.asReadonly();

  protected readonly classes = computed(() =>
    mergeClasses(
      scrollToTopVariants({
        variant: this.variant(),
        size: this.size(),
      }),
      this.class(),
    ),
  );

  protected readonly buttonClasses = computed(() => 'fixed bottom-6 right-6 z-50 transition-opacity ' + this.classes());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  private onScroll = () => {
    this._visible.set(window.scrollY > 200);
  };

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

```



```angular-ts title="scroll-to-top.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const scrollToTopVariants = cva(
  [
    'inline-flex items-center justify-center rounded-full',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        subtle: 'bg-muted text-muted-foreground hover:bg-muted/80',
      },
      size: {
        sm: 'h-8 w-8 text-base',
        md: 'h-10 w-10 text-lg',
        lg: 'h-12 w-12 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type ScrollToTopVariants = VariantProps<typeof scrollToTopVariants>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './scroll-to-top.component';
export * from './scroll-to-top.variants';

```

