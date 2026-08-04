import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input, output } from '@angular/core';

/**
 * Emits once when the host element gets close to the viewport, so work can start
 * slightly before the user reaches it. Browser-only: on the server nothing is
 * observed and the output never fires.
 */
@Directive({
  selector: '[viewportEnter]',
})
export class ViewportEnterDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** How early to fire, expressed as an IntersectionObserver root margin. */
  readonly viewportEnterMargin = input('600px');
  readonly viewportEnter = output<void>();

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        this.viewportEnter.emit();
        return;
      }

      const observer = new IntersectionObserver(
        entries => {
          if (!entries.some(entry => entry.isIntersecting)) return;
          observer.disconnect();
          this.viewportEnter.emit();
        },
        { rootMargin: this.viewportEnterMargin() },
      );

      observer.observe(this.elementRef.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
