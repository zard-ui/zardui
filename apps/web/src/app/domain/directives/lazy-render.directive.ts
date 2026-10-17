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
 * Tells a template when its host is on (or near) the screen: `visible` turns on as the host gets close to the
 * viewport and off again once it is far away, and `reservedHeight` keeps the host's height while the content is
 * gone, so scrolling never jumps.
 *
 * It exists for content that holds a scarce resource, such as the WebGL context of a map: a page with dozens of maps
 * would otherwise run out of contexts. With `lazyRenderKeep` it only ever turns on. Not enabled, or without an
 * IntersectionObserver, it is always visible. On the server a lazy host starts hidden, so the markup the server sent is
 * the placeholder.
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
  /**
   * Keep the content once it has appeared, and never take it away again. The host is then a latch: it holds the
   * content until it is destroyed itself. The scarce resource is still held, so use it only where the host's
   * lifetime is bounded, such as a page that is left as a whole.
   */
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
