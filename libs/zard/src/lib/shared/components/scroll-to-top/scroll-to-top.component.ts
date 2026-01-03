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
