import {
  afterNextRender,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Renders content only while its host is near the viewport, keeping the host's height meanwhile, so a page with many
 * maps does not run out of WebGL contexts. Always visible when disabled or without IntersectionObserver.
 */
@Directive({
  selector: '[lazyRender]',
  exportAs: 'lazyRender',
})
export class LazyRenderDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly lazyRender = input(true, { transform: booleanAttribute });
  /** How early the content appears, and how long it stays, as an IntersectionObserver root margin. */
  readonly lazyRenderMargin = input('500px 0px');
  /** Keep the content once it has appeared. */
  readonly lazyRenderKeep = input(false, { transform: booleanAttribute });

  private readonly shown = signal(false);
  private readonly height = signal<number | null>(null);

  /** Whether the content should exist right now. */
  readonly visible = () => !this.lazyRender() || this.shown();
  /** Height to hold open while the content is gone. */
  readonly reservedHeight = this.height.asReadonly();

  constructor() {
    afterNextRender(() => {
      if (!this.lazyRender() || typeof IntersectionObserver === 'undefined') {
        this.shown.set(true);
        return;
      }

      const element = this.host.nativeElement;
      const observer = new IntersectionObserver(
        entries => {
          const entry = entries[entries.length - 1];
          if (!entry) {
            return;
          }

          if (!entry.isIntersecting && this.lazyRenderKeep()) {
            return;
          }

          if (!entry.isIntersecting && this.shown()) {
            // Remember how tall the content was, so the placeholder takes exactly its place.
            this.height.set(Math.round(element.getBoundingClientRect().height));
          }
          this.shown.set(entry.isIntersecting);
        },
        { rootMargin: this.lazyRenderMargin() },
      );

      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
