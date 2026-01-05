

```angular-ts title="scroll-to-top.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  signal,
  ElementRef,
  inject,
  type OnDestroy,
} from '@angular/core';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { scrollToTopVariants, scrollToTopIconVariants, type ScrollToTopVariants } from './scroll-to-top.variants';

@Component({
  selector: 'z-scroll-to-top, [z-scroll-to-top]',
  imports: [CommonModule],
  standalone: true,
  template: `
    @if (visible()) {
      <button type="button" aria-label="Scroll to top" (click)="scrollToTop()" [class]="classes()">
        <ng-content>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" [class]="iconClasses()">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </ng-content>
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardScrollToTopComponent implements OnDestroy {
  private readonly elementRef = inject(ElementRef);
  readonly variant = input<ScrollToTopVariants['variant']>('default');
  readonly size = input<ScrollToTopVariants['size']>('md');
  readonly class = input<string>('');
  readonly target = input<'window' | 'parent'>('window');

  private readonly _visible = signal(false);
  readonly visible = this._visible.asReadonly();
  private scrollElement: HTMLElement | Window | null = null;

  protected readonly classes = computed(() =>
    mergeClasses(
      scrollToTopVariants({
        variant: this.variant(),
        size: this.size(),
      }),
      this.class(),
    ),
  );

  protected readonly iconClasses = computed(() =>
    scrollToTopIconVariants({
      size: this.size(),
    }),
  );

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (this.target() === 'parent') {
          this.scrollElement = this.elementRef.nativeElement.parentElement;
          if (this.scrollElement) {
            this.scrollElement.addEventListener('scroll', this.onScroll, { passive: true });
          }
        } else {
          this.scrollElement = window;
          window.addEventListener('scroll', this.onScroll, { passive: true });
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.onScroll);
    }
  }

  private onScroll = () => {
    if (this.target() === 'parent' && this.scrollElement && this.scrollElement !== window) {
      this._visible.set((this.scrollElement as HTMLElement).scrollTop > 200);
    } else if (this.scrollElement === window) {
      this._visible.set(window.scrollY > 200);
    }
  };

  scrollToTop() {
    if (this.target() === 'parent' && this.scrollElement && this.scrollElement !== window) {
      (this.scrollElement as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

```



```angular-ts title="scroll-to-top.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const scrollToTopVariants = cva(
  [
    'fixed bottom-6 right-6 z-50',
    'inline-flex items-center justify-center rounded-full',
    'cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'transition-opacity transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        subtle: 'bg-muted text-muted-foreground hover:bg-muted/80',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export const scrollToTopIconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ScrollToTopVariants = VariantProps<typeof scrollToTopVariants>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './scroll-to-top.component';
export * from './scroll-to-top.variants';

```

