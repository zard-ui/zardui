import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, NgZone, PLATFORM_ID, signal, type Signal } from '@angular/core';

export type ZardScrollAlign = 'start' | 'center' | 'end' | 'nearest';

export type ZardMessageScrollerPosition = 'start' | 'end' | 'last-anchor';

/** Options of the imperative scroll commands. */
export interface ZardScrollOptions {
  /** How a message target aligns in the viewport. Defaults to `'start'`. */
  align?: ZardScrollAlign;
  /** Native scroll behavior. Defaults to `'auto'`; `'smooth'` falls back to `'auto'` under `prefers-reduced-motion`. */
  behavior?: ScrollBehavior;
  /** Margin applied to the aligned edge. Defaults to the scroller's `zScrollMargin`. */
  scrollMargin?: number;
}

/** Which edges of the transcript can still be scrolled toward. */
export interface ZardScrollableEdges {
  start: boolean;
  end: boolean;
}

/** The inputs of `z-message-scroller` the engine reads. Read lazily, so a change applies from the next event on. */
export interface ZardMessageScrollerConfig {
  autoScroll: boolean;
  defaultPosition: ZardMessageScrollerPosition;
  preserveScrollOnPrepend: boolean;
  edgeThreshold: number;
  scrollMargin: number;
}

/** The elements the scroller component hands to the engine. */
export interface ZardMessageScrollerElements {
  viewport: HTMLElement;
  content: HTMLElement;
  spacer: HTMLElement;
}

const ITEM_SLOT = 'message-scroller-item';
/** How much of the previous row stays visible above a freshly anchored turn. */
const PREVIOUS_ITEM_PEEK = 64;
/** A programmatic scroll counts as finished this long after the last scroll event. */
const SETTLE_MS = 120;
const REVEAL_KEYS = new Set(['ArrowUp', 'PageUp', 'Home']);

const sameEdges = (a: ZardScrollableEdges, b: ZardScrollableEdges) => a.start === b.start && a.end === b.end;
const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((id, i) => id === b[i]);

/**
 * Owns the scroll state of one `z-message-scroller` and exposes it as signals next to imperative commands.
 *
 * It is provided by the scroller component, so inject it inside the scroller's subtree, or read it from
 * outside with `viewChild(ZardMessageScrollerComponent, { read: ZardMessageScrollerService })`.
 *
 * The engine keeps the scroll hot path out of Angular: listeners and observers run outside the zone and
 * only write signals whose value actually changed.
 */
@Injectable()
export class ZardMessageScrollerService {
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly scrollableState = signal<ZardScrollableEdges>({ start: false, end: false }, { equal: sameEdges });
  private readonly visibleIdsState = signal<string[]>([], { equal: sameIds });
  private readonly currentAnchorState = signal<string | null>(null);
  private readonly autoscrollingState = signal(false);
  private readonly pendingScrollState = signal(true);

  /** Which edges can still be scrolled toward. `end` stays `false` while the live edge is being followed. */
  readonly scrollable: Signal<ZardScrollableEdges> = this.scrollableState.asReadonly();
  /** Ids of the messages intersecting the viewport, in document order. */
  readonly visibleMessageIds: Signal<string[]> = this.visibleIdsState.asReadonly();
  /** The anchored turn at or above the reading line (the viewport top plus the scroll margin). */
  readonly currentAnchorId: Signal<string | null> = this.currentAnchorState.asReadonly();
  /** @internal True while the viewport scrolls programmatically toward the latest message. */
  readonly autoscrolling: Signal<boolean> = this.autoscrollingState.asReadonly();
  /** @internal True until the opening position is applied (or skipped for an empty transcript). */
  readonly pendingScroll: Signal<boolean> = this.pendingScrollState.asReadonly();

  private els: ZardMessageScrollerElements | null = null;
  private config: (() => ZardMessageScrollerConfig) | null = null;
  private cleanups: (() => void)[] = [];

  private items: HTMLElement[] = [];
  private readonly visibleElements = new Set<Element>();
  private intersectionObserver: IntersectionObserver | null = null;

  private defaultDone = false;
  /** The reader is at the live edge and has not scrolled away since. Follow-output and anchoring depend on it. */
  private atLiveEdge = false;
  /** A touch or a scrollbar drag is in progress: do not scroll under the reader's hand. */
  private touching = false;
  private programmatic: { target: number } | null = null;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private frame = 0;

  private reference: { element: HTMLElement; offset: number } | null = null;
  private spacerAnchor: HTMLElement | null = null;
  private spacerHeight = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detach());
  }

  /** Scrolls to the latest message. Returns `false` when the scroller is not mounted. */
  scrollToEnd(options: ZardScrollOptions = {}): boolean {
    const els = this.els;
    if (!els) {
      return false;
    }
    this.atLiveEdge = true;
    this.scrollTo(this.maxScrollTop(), options.behavior, true);
    this.updateState();
    return true;
  }

  /** Scrolls to the top. Returns `false` when the scroller is not mounted. */
  scrollToStart(options: ZardScrollOptions = {}): boolean {
    if (!this.els) {
      return false;
    }
    this.releaseLiveEdge();
    this.scrollTo(0, options.behavior, false);
    this.updateState();
    return true;
  }

  /** Scrolls to a mounted message. Returns `false` when the scroller is not mounted or the id is not in the DOM. */
  scrollToMessage(messageId: string, options: ZardScrollOptions = {}): boolean {
    const els = this.els;
    const item = els && this.readItems().find(el => el.getAttribute('data-message-id') === messageId);
    if (!els || !item) {
      return false;
    }

    const { viewport } = els;
    const margin = options.scrollMargin ?? this.cfg().scrollMargin;
    const top = this.contentY(item);
    const height = item.getBoundingClientRect().height;
    const alignStart = top - margin;
    const alignEnd = top + height - viewport.clientHeight + margin;

    let target: number;
    switch (options.align ?? 'start') {
      case 'end':
        target = alignEnd;
        break;
      case 'center':
        target = top + height / 2 - viewport.clientHeight / 2;
        break;
      case 'nearest':
        if (alignStart < viewport.scrollTop) {
          target = alignStart;
        } else if (alignEnd > viewport.scrollTop) {
          target = alignEnd;
        } else {
          target = viewport.scrollTop;
        }
        break;
      default:
        target = alignStart;
    }

    this.releaseLiveEdge();
    this.scrollTo(target, options.behavior, false);
    this.updateState();
    return true;
  }

  /** @internal Called by the scroller component once its view exists in the browser. */
  attach(elements: ZardMessageScrollerElements, config: () => ZardMessageScrollerConfig): void {
    if (!this.isBrowser) {
      return;
    }
    this.detach();
    this.els = elements;
    this.config = config;

    const { viewport, content } = elements;
    this.ngZone.runOutsideAngular(() => {
      this.listen(viewport, 'scroll', this.onScroll);
      this.listen(viewport, 'wheel', this.onWheel as EventListener);
      this.listen(viewport, 'keydown', this.onKeydown as EventListener);
      this.listen(viewport, 'touchstart', this.onTouchStart);
      this.listen(viewport, 'touchend', this.onTouchEnd);
      this.listen(viewport, 'touchcancel', this.onTouchEnd);
      this.listen(viewport, 'pointerdown', this.onPointerDown as EventListener);
      this.listen(document, 'pointerup', this.onTouchEnd);
      this.listen(document, 'pointercancel', this.onTouchEnd);

      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => this.reconcile());
        resizeObserver.observe(viewport);
        resizeObserver.observe(content);
        this.cleanups.push(() => resizeObserver.disconnect());
      }
      if (typeof MutationObserver !== 'undefined') {
        const mutationObserver = new MutationObserver(() => this.reconcile());
        mutationObserver.observe(content, { childList: true });
        this.cleanups.push(() => mutationObserver.disconnect());
      }
      if (typeof IntersectionObserver !== 'undefined') {
        this.intersectionObserver = new IntersectionObserver(entries => this.onIntersection(entries), {
          root: viewport,
        });
        this.cleanups.push(() => this.intersectionObserver?.disconnect());
      }
    });

    this.reconcile();
    if (!this.defaultDone && this.items.length === 0) {
      // Nothing to position yet: do not keep the viewport hidden. The position still applies on the first rows.
      this.pendingScrollState.set(false);
    }
  }

  /** @internal Releases listeners and observers. Safe to call more than once. */
  detach(): void {
    for (const cleanup of this.cleanups.splice(0)) {
      cleanup();
    }
    this.intersectionObserver = null;
    this.visibleElements.clear();
    this.clearSettleTimer();
    if (this.frame && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.frame);
    }
    this.frame = 0;
    this.els = null;
    this.config = null;
    this.items = [];
    this.reference = null;
    this.spacerAnchor = null;
    this.programmatic = null;
    this.defaultDone = false;
    this.atLiveEdge = false;
  }

  // ---------------------------------------------------------------------------------------------
  // Reader intent
  // ---------------------------------------------------------------------------------------------

  private readonly onScroll = () => {
    if (!this.els) {
      return;
    }
    if (this.programmatic) {
      const reached = Math.abs(this.els.viewport.scrollTop - this.programmatic.target) < 1;
      if (reached) {
        this.finishProgrammatic();
      } else {
        this.armSettle();
      }
    } else if (this.defaultDone) {
      this.atLiveEdge = this.isAtEnd();
    }
    this.updateState();
    this.scheduleFrame();
  };

  private readonly onWheel = (event: WheelEvent) => {
    if (event.deltaY < 0) {
      this.userReleased();
    } else {
      this.cancelProgrammatic();
    }
  };

  private readonly onKeydown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
      return;
    }
    if (REVEAL_KEYS.has(event.key) || (event.key === ' ' && event.shiftKey)) {
      this.userReleased();
    } else if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) {
      this.cancelProgrammatic();
    }
  };

  private readonly onTouchStart = () => {
    this.touching = true;
    this.cancelProgrammatic();
  };

  /** A press on the viewport itself is a press on its scrollbar (rows are children): the reader is dragging it. */
  private readonly onPointerDown = (event: PointerEvent) => {
    if (event.target === this.els?.viewport) {
      this.onTouchStart();
    }
  };

  private readonly onTouchEnd = () => {
    this.touching = false;
  };

  /** A manual scroll away from the edge: stop following immediately, before the scroll event lands. */
  private userReleased(): void {
    this.cancelProgrammatic();
    if (this.atLiveEdge) {
      this.atLiveEdge = false;
      this.updateState();
    }
  }

  /** An explicit jump away from the live edge releases it, unless the whole transcript already fits. */
  private releaseLiveEdge(): void {
    this.atLiveEdge = this.maxScrollTop() <= this.cfg().edgeThreshold;
  }

  // ---------------------------------------------------------------------------------------------
  // Reconciliation: runs when rows are added or removed, or when anything resizes
  // ---------------------------------------------------------------------------------------------

  private reconcile(): void {
    const els = this.els;
    if (!els) {
      return;
    }

    const appended = this.syncItems();

    if (!this.defaultDone) {
      this.applyDefaultPosition();
    } else {
      this.updateSpacer();
      const anchor = [...appended].reverse().find(el => el.getAttribute('data-scroll-anchor') === 'true');
      if (anchor && this.atLiveEdge) {
        this.anchorTurn(anchor);
      } else if (this.shouldFollow()) {
        this.scrollTo(this.maxScrollTop(), 'auto', true);
      } else if (this.cfg().preserveScrollOnPrepend && !this.programmatic) {
        this.preserveReference();
      }
    }

    this.updateState();
    this.captureReference();
    this.updateCurrentAnchor();
  }

  /** Diffs the rows against the previous pass, keeps the intersection observer in sync, returns the appended rows. */
  private syncItems(): HTMLElement[] {
    const next = this.readItems();
    const previous = new Set(this.items);
    const current = new Set(next);

    const added = next.filter(el => !previous.has(el));
    const lastSurvivor = next.reduce((last, el, i) => (previous.has(el) ? i : last), -1);
    const appended = added.filter(el => next.indexOf(el) > lastSurvivor);

    const removed = this.items.filter(el => !current.has(el));
    for (const el of removed) {
      this.intersectionObserver?.unobserve(el);
      this.visibleElements.delete(el);
    }
    for (const el of added) {
      this.intersectionObserver?.observe(el);
    }

    this.items = next;
    if (added.length || removed.length) {
      this.publishVisibleIds();
    }
    return appended;
  }

  private applyDefaultPosition(): void {
    const { viewport } = this.elements;
    if (this.items.length === 0 || viewport.clientHeight === 0) {
      return;
    }

    const position = this.cfg().defaultPosition;
    let top = 0;
    if (position === 'end') {
      top = this.maxScrollTop();
    } else if (position === 'last-anchor') {
      top = this.lastAnchorTop() ?? this.maxScrollTop();
    }

    this.defaultDone = true;
    this.writeScrollTop(top);
    this.atLiveEdge = this.isAtEnd();
    this.pendingScrollState.set(false);
    this.updateSpacer();
  }

  /** The scrollTop of the last anchor row, or `null` when there is none or its turn fits the viewport. */
  private lastAnchorTop(): number | null {
    const { viewport } = this.elements;
    const anchors = this.items.filter(el => el.getAttribute('data-scroll-anchor') === 'true');
    const anchor = anchors[anchors.length - 1];
    if (!anchor) {
      return null;
    }
    const last = this.items[this.items.length - 1];
    const top = this.contentY(anchor);
    const turnHeight = this.contentY(last) + last.getBoundingClientRect().height - top;
    return turnHeight <= viewport.clientHeight ? null : top - this.cfg().scrollMargin;
  }

  /** Places a freshly appended turn near the top and leaves a peek of the previous row above it. */
  private anchorTurn(anchor: HTMLElement): void {
    this.spacerAnchor = anchor;
    this.updateSpacer();
    this.scrollTo(this.anchorTop(anchor), 'auto', true);
    this.atLiveEdge = true;
  }

  private anchorTop(anchor: HTMLElement): number {
    const hasPrevious = this.items.indexOf(anchor) > 0;
    return this.contentY(anchor) - (hasPrevious ? PREVIOUS_ITEM_PEEK : 0) - this.cfg().scrollMargin;
  }

  /**
   * Room below the content so the anchored row can actually reach the top of a transcript that is still short.
   * It shrinks as the reply grows, and is gone once the reply fills the viewport.
   */
  private updateSpacer(): void {
    const { viewport, content, spacer } = this.elements;
    const anchor = this.spacerAnchor;
    let height = 0;
    if (anchor?.isConnected && anchor.parentElement === content) {
      height = Math.max(0, Math.ceil(this.anchorTop(anchor) + viewport.clientHeight - content.offsetHeight));
    }
    if (height !== this.spacerHeight) {
      this.spacerHeight = height;
      spacer.style.height = `${height}px`;
    }
  }

  private shouldFollow(): boolean {
    return this.cfg().autoScroll && this.atLiveEdge && !this.touching && !this.programmaticAwayFromEnd();
  }

  /** A smooth jump to somewhere other than the end is under way: follow-output must not hijack it. */
  private programmaticAwayFromEnd(): boolean {
    return !!this.programmatic && Math.abs(this.programmatic.target - this.maxScrollTop()) > this.cfg().edgeThreshold;
  }

  // ---------------------------------------------------------------------------------------------
  // Keeping the visible row stable
  // ---------------------------------------------------------------------------------------------

  /** Remembers the first row that is at least partly visible and where it sits in the content. */
  private captureReference(): void {
    const els = this.els;
    if (!els || !this.defaultDone || this.items.length === 0) {
      this.reference = null;
      return;
    }
    const index = this.firstItemBelow(els.viewport.getBoundingClientRect().top);
    const element = this.items[Math.min(index, this.items.length - 1)];
    this.reference = { element, offset: this.contentY(element) };
  }

  /** When rows appeared or resized above the remembered row, moves the scroll position by the same amount. */
  private preserveReference(): void {
    const reference = this.reference;
    if (!reference || !reference.element.isConnected || !this.items.includes(reference.element)) {
      return;
    }
    const delta = this.contentY(reference.element) - reference.offset;
    if (Math.abs(delta) >= 1) {
      this.writeScrollTop(this.elements.viewport.scrollTop + delta);
    }
  }

  private firstItemBelow(y: number): number {
    let low = 0;
    let high = this.items.length - 1;
    let found = this.items.length;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (this.items[mid].getBoundingClientRect().bottom > y) {
        found = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return found;
  }

  // ---------------------------------------------------------------------------------------------
  // Published state
  // ---------------------------------------------------------------------------------------------

  private updateState(): void {
    const els = this.els;
    if (!els) {
      return;
    }
    const { viewport } = els;
    const threshold = this.cfg().edgeThreshold;
    const following = this.cfg().autoScroll && this.atLiveEdge;
    this.scrollableState.set({
      start: viewport.scrollTop > threshold,
      end: !following && this.maxScrollTop() - viewport.scrollTop > threshold,
    });
  }

  private scheduleFrame(): void {
    if (this.frame || typeof requestAnimationFrame === 'undefined') {
      return;
    }
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      if (!this.els) {
        return;
      }
      this.captureReference();
      this.updateCurrentAnchor();
    });
  }

  private updateCurrentAnchor(): void {
    const els = this.els;
    if (!els) {
      return;
    }
    const line = els.viewport.getBoundingClientRect().top + this.cfg().scrollMargin + 1;
    const anchors = this.items.filter(el => el.getAttribute('data-scroll-anchor') === 'true');
    let low = 0;
    let high = anchors.length - 1;
    let found: HTMLElement | null = null;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (anchors[mid].getBoundingClientRect().top <= line) {
        found = anchors[mid];
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    this.currentAnchorState.set(found?.getAttribute('data-message-id') ?? null);
  }

  private onIntersection(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.visibleElements.add(entry.target);
      } else {
        this.visibleElements.delete(entry.target);
      }
    }
    this.publishVisibleIds();
  }

  private publishVisibleIds(): void {
    const ids = this.items
      .filter(el => this.visibleElements.has(el))
      .map(el => el.getAttribute('data-message-id'))
      .filter((id): id is string => !!id);
    this.visibleIdsState.set(ids);
  }

  // ---------------------------------------------------------------------------------------------
  // Scrolling primitives
  // ---------------------------------------------------------------------------------------------

  /** Scrolls programmatically; the resulting scroll events do not count as the reader's. */
  private scrollTo(top: number, behavior: ScrollBehavior | undefined, towardEnd: boolean): void {
    const { viewport } = this.elements;
    const target = Math.min(Math.max(top, 0), this.maxScrollTop());
    if (Math.abs(target - viewport.scrollTop) < 1) {
      this.finishProgrammatic();
      return;
    }

    this.programmatic = { target };
    this.autoscrollingState.set(towardEnd);
    if (this.resolveBehavior(behavior) === 'smooth' && typeof viewport.scrollTo === 'function') {
      viewport.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      viewport.scrollTop = target;
    }
    this.armSettle();
  }

  /** An instant move that is not the reader's (default position, prepend compensation); it is not tracked as a jump. */
  private writeScrollTop(top: number): void {
    const { viewport } = this.elements;
    const target = Math.min(Math.max(top, 0), this.maxScrollTop());
    if (Math.abs(target - viewport.scrollTop) < 1) {
      return;
    }
    viewport.scrollTop = target;
  }

  private armSettle(): void {
    this.clearSettleTimer();
    this.ngZone.runOutsideAngular(() => {
      this.settleTimer = setTimeout(() => this.finishProgrammatic(), SETTLE_MS);
    });
  }

  private clearSettleTimer(): void {
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
  }

  private finishProgrammatic(): void {
    this.clearSettleTimer();
    const wasProgrammatic = !!this.programmatic;
    this.programmatic = null;
    this.autoscrollingState.set(false);
    if (!this.els) {
      return;
    }
    // A jump that lands on the bottom leaves the reader at the live edge, wherever it started from.
    if (this.defaultDone && this.isAtEnd()) {
      this.atLiveEdge = true;
    }
    this.updateState();
    // The content may have grown while a smooth scroll was in flight.
    if (wasProgrammatic && this.shouldFollow() && !this.isAtEnd()) {
      this.scrollTo(this.maxScrollTop(), 'auto', true);
    }
  }

  /** The reader took over: abandon the programmatic scroll without waiting for it to settle. */
  private cancelProgrammatic(): void {
    if (this.programmatic) {
      this.clearSettleTimer();
      this.programmatic = null;
      this.autoscrollingState.set(false);
    }
  }

  private resolveBehavior(behavior: ScrollBehavior | undefined): ScrollBehavior {
    const resolved = behavior ?? 'auto';
    if (
      resolved === 'smooth' &&
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'auto';
    }
    return resolved;
  }

  // ---------------------------------------------------------------------------------------------
  // Measurements
  // ---------------------------------------------------------------------------------------------

  private get elements(): ZardMessageScrollerElements {
    if (!this.els) {
      throw new Error('ZardMessageScrollerService is not attached to a scroller.');
    }
    return this.els;
  }

  private cfg(): ZardMessageScrollerConfig {
    if (!this.config) {
      throw new Error('ZardMessageScrollerService is not attached to a scroller.');
    }
    return this.config();
  }

  private maxScrollTop(): number {
    const { viewport } = this.elements;
    return Math.max(0, viewport.scrollHeight - viewport.clientHeight);
  }

  private isAtEnd(): boolean {
    return this.maxScrollTop() - this.elements.viewport.scrollTop <= this.cfg().edgeThreshold;
  }

  /** Top of an element inside the scrolled content, independent of the current scroll position. */
  private contentY(element: HTMLElement): number {
    return element.getBoundingClientRect().top - this.elements.content.getBoundingClientRect().top;
  }

  private readItems(): HTMLElement[] {
    const { content } = this.elements;
    return Array.from(content.children).filter(
      (child): child is HTMLElement => child.getAttribute('data-slot') === ITEM_SLOT,
    );
  }

  private listen(target: HTMLElement | Document, type: string, listener: EventListener): void {
    target.addEventListener(type, listener, { passive: true });
    this.cleanups.push(() => target.removeEventListener(type, listener));
  }
}
