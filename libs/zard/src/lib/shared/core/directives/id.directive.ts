import { computed, Directive, inject, Injectable, input } from '@angular/core';

@Injectable({ providedIn: 'root' })
class ZardIdInternalService {
  private counter = 0;

  /** The next sequence number. Unique for the lifetime of the injector. */
  next(): number {
    return ++this.counter;
  }
}

/**
 * Gives an element a unique id, so `for`/`aria-labelledby` pairs can be wired up
 * inside a component without asking the consumer for one.
 *
 * ```html
 * <span zardId="checkbox" #z="zardId"></span>
 * <input [id]="z.id()" />
 * <label [for]="z.id()">…</label>
 * ```
 */
@Directive({
  selector: '[zardId]',
  exportAs: 'zardId',
})
export class ZardIdDirective {
  /**
   * Claimed once, when the directive is constructed.
   *
   * The id used to be produced by a `computed()` that incremented the counter in
   * its body — a side effect inside a primitive Angular is free to re-evaluate.
   * Each re-evaluation handed back a different id while the rendered DOM still
   * carried the old one, silently breaking the `for`/`id` pair.
   */
  private readonly sequence = inject(ZardIdInternalService).next();

  /** Prefix for the generated id, so ids read as `checkbox-3` rather than `3`. */
  readonly zardId = input('ssr');

  /** `<prefix>-<n>`, with `n` fixed for the life of the directive. */
  readonly id = computed(() => `${this.zardId()}-${this.sequence}`);
}
