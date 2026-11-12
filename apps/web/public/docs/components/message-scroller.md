---
title: Message Scroller
description: A chat scroll container that opens at the right place, follows a streaming answer, keeps your place as history loads, and jumps to any message.
---

# Message Scroller

A chat scroll container that opens at the right place, follows a streaming answer, keeps your place as history loads, and jumps to any message.

## Installation

### CLI

```bash
npx zard-cli@latest add message-scroller
```

### Manual

```angular-ts
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostAttributeToken,
  inject,
  input,
  numberAttribute,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  ZardMessageScrollerService,
  type ZardMessageScrollerConfig,
  type ZardMessageScrollerPosition,
} from './message-scroller.service';
import {
  messageScrollerButtonVariants,
  messageScrollerContentVariants,
  messageScrollerItemVariants,
  messageScrollerVariants,
  messageScrollerViewportVariants,
  type ZardMessageScrollerDirectionVariants,
} from './message-scroller.variants';

/**
 * Scroll container for a chat transcript. Project `z-message-scroller-item` rows (and optionally a
 * `[z-message-scroller-button]`); the scroller follows the live edge, keeps the reader's place and
 * exposes its state through `ZardMessageScrollerService`.
 *
 * The viewport is a labelled `region` named "Messages". Set `aria-label` on the host to rename it.
 */
@Component({
  selector: 'z-message-scroller, [z-message-scroller]',
  template: `
    <div
      #viewport
      data-slot="message-scroller-viewport"
      role="region"
      tabindex="0"
      [attr.aria-label]="label"
      [attr.data-scrollable]="scrollableAttr()"
      [attr.data-autoscrolling]="autoscrollingAttr()"
      [attr.data-pending-scroll]="pendingAttr()"
      [class]="viewportClasses()"
    >
      <div
        #content
        data-slot="message-scroller-content"
        role="log"
        aria-relevant="additions"
        [class]="contentClasses()"
      >
        <ng-content />
      </div>
      <div #spacer data-slot="message-scroller-spacer" aria-hidden="true"></div>
    </div>
    <ng-content select="[z-message-scroller-button]" />
  `,
  providers: [ZardMessageScrollerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-scroller',
    '[attr.data-scrollable]': 'scrollableAttr()',
    '[attr.data-autoscrolling]': 'autoscrollingAttr()',
    '[attr.data-pending-scroll]': 'pendingAttr()',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageScroller',
})
export class ZardMessageScrollerComponent {
  /** Follow new content while the reader is at the live edge; any manual scroll releases it. */
  readonly zAutoScroll = input(false, { transform: booleanAttribute });
  /** Opening position on the first non-empty render. */
  readonly zDefaultPosition = input<ZardMessageScrollerPosition>('end');
  /** Keep the visible row stable when older messages are prepended. */
  readonly zPreserveScrollOnPrepend = input(true, { transform: booleanAttribute });
  /** Distance in px from an edge that still counts as being at the edge. */
  readonly zEdgeThreshold = input(8, { transform: numberAttribute });
  /** Margin applied to the aligned edge when scrolling to a message. */
  readonly zScrollMargin = input(0, { transform: numberAttribute });
  readonly class = input<ClassValue>('');

  /** The state and commands of this scroller: the instance `inject(ZardMessageScrollerService)` returns inside it. */
  readonly service = inject(ZardMessageScrollerService);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly label = inject(new HostAttributeToken('aria-label'), { optional: true }) ?? 'Messages';

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly spacer = viewChild.required<ElementRef<HTMLElement>>('spacer');

  private readonly config = computed<ZardMessageScrollerConfig>(() => ({
    autoScroll: this.zAutoScroll(),
    defaultPosition: this.zDefaultPosition(),
    preserveScrollOnPrepend: this.zPreserveScrollOnPrepend(),
    edgeThreshold: this.zEdgeThreshold(),
    scrollMargin: this.zScrollMargin(),
  }));

  protected readonly classes = computed(() => mergeClasses(messageScrollerVariants(), this.class()));
  protected readonly viewportClasses = computed(() => messageScrollerViewportVariants());
  protected readonly contentClasses = computed(() => messageScrollerContentVariants());

  /** `start`, `end`, `start end`, or absent when the transcript fits. */
  protected readonly scrollableAttr = computed(() => {
    const { start, end } = this.service.scrollable();
    return [start && 'start', end && 'end'].filter(Boolean).join(' ') || null;
  });

  protected readonly autoscrollingAttr = computed(() => (this.service.autoscrolling() ? '' : null));
  protected readonly pendingAttr = computed(() =>
    this.service.pendingScroll() && this.zDefaultPosition() !== 'start' ? '' : null,
  );

  constructor() {
    // The label lives on the viewport; a leftover `aria-label` on the role-less host would be an axe violation.
    this.host.nativeElement.removeAttribute('aria-label');

    afterNextRender(() => {
      this.service.attach(
        {
          viewport: this.viewport().nativeElement,
          content: this.content().nativeElement,
          spacer: this.spacer().nativeElement,
        },
        () => this.config(),
      );
    });
  }
}

/** One transcript row: a message, marker, typing row, or a "load earlier" row. Direct child of `z-message-scroller`. */
@Component({
  selector: 'z-message-scroller-item, [z-message-scroller-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-scroller-item',
    '[attr.data-message-id]': 'zMessageId() || null',
    '[attr.data-scroll-anchor]': 'zAnchor() ? "true" : "false"',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageScrollerItem',
})
export class ZardMessageScrollerItemComponent {
  /** Stable row id used by `scrollToMessage`, `visibleMessageIds` and prepend preservation. */
  readonly zMessageId = input<string>();
  /** Marks the row as a turn boundary that anchors newly appended turns. */
  readonly zAnchor = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(messageScrollerItemVariants(), this.class()));
}

/** Scrolls to an edge. Inert and out of the tab order when there is nothing to scroll toward. */
@Component({
  selector: '[z-message-scroller-button]',
  imports: [NgIcon],
  template: `
    <ng-icon name="lucideArrowDown" aria-hidden="true" />
    <ng-content />
    @if (!hasLabel) {
      <span class="sr-only">{{ zDirection() === 'end' ? 'Scroll to end' : 'Scroll to start' }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideArrowDown })],
  host: {
    type: 'button',
    'data-slot': 'message-scroller-button',
    '[attr.data-direction]': 'zDirection()',
    '[attr.data-active]': 'active() ? "true" : "false"',
    '[attr.inert]': 'active() ? null : ""',
    '[attr.tabindex]': 'active() ? null : -1',
    '[class]': 'classes()',
    '(click)': 'onClick()',
  },
  exportAs: 'zMessageScrollerButton',
})
export class ZardMessageScrollerButtonComponent {
  private readonly scroller = inject(ZardMessageScrollerService);

  readonly zDirection = input<ZardMessageScrollerDirectionVariants>('end');
  readonly class = input<ClassValue>('');

  protected readonly hasLabel =
    !!inject(new HostAttributeToken('aria-label'), { optional: true }) ||
    !!inject(new HostAttributeToken('aria-labelledby'), { optional: true });

  protected readonly active = computed(() => this.scroller.scrollable()[this.zDirection()]);
  protected readonly classes = computed(() =>
    mergeClasses(messageScrollerButtonVariants({ zDirection: this.zDirection() }), this.class()),
  );

  protected onClick(): void {
    const options = { behavior: 'smooth' } as const;
    if (this.zDirection() === 'end') {
      this.scroller.scrollToEnd(options);
    } else {
      this.scroller.scrollToStart(options);
    }
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { buttonVariants } from '@/shared/components/button/button.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** The frame. It fills its parent, so give it (or the parent) a height. */
export const messageScrollerVariants = cva(
  'group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden',
);

/**
 * `overflow-anchor: none` is deliberate: the scroller keeps the visible row stable itself (see
 * `zPreserveScrollOnPrepend`), and the browser's own scroll anchoring would compensate a second time.
 * `scroll-fade-b` (from `utilities.css`) fades the bottom edge while there is more content below.
 */
export const messageScrollerViewportVariants = cva(
  mergeClasses(
    'size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin overflow-y-auto overscroll-contain [overflow-anchor:none] [scrollbar-gutter:stable]',
    'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset',
    'data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent',
    'data-pending-scroll:invisible',
  ),
);

export const messageScrollerContentVariants = cva('flex h-max min-h-full flex-col gap-6 p-4');

export const messageScrollerItemVariants = cva('min-w-0 shrink-0');

export const messageScrollerButtonVariants = cva(
  mergeClasses(
    buttonVariants({ zType: 'secondary', zSize: 'icon-sm' }),
    'absolute start-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground rtl:translate-x-1/2',
    'data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)]',
    'data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)]',
  ),
  {
    variants: {
      zDirection: {
        end: 'bottom-4 data-[active=false]:translate-y-full',
        start: 'top-4 data-[active=false]:-translate-y-full [&_svg]:rotate-180',
      },
    },
    defaultVariants: {
      zDirection: 'end',
    },
  },
);

export type ZardMessageScrollerDirectionVariants = NonNullable<
  VariantProps<typeof messageScrollerButtonVariants>['zDirection']
>;
```

```angular-ts
export * from './message-scroller.component';
export * from './message-scroller.imports';
export * from './message-scroller.service';
export * from './message-scroller.variants';
```

```angular-ts
export {
  ZardMessageScrollerButtonComponent,
  ZardMessageScrollerComponent,
  ZardMessageScrollerItemComponent,
} from './message-scroller.component';

import {
  ZardMessageScrollerButtonComponent,
  ZardMessageScrollerComponent,
  ZardMessageScrollerItemComponent,
} from './message-scroller.component';

export const ZardMessageScrollerImports = [
  ZardMessageScrollerComponent,
  ZardMessageScrollerItemComponent,
  ZardMessageScrollerButtonComponent,
] as const;
```

```angular-ts
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
  /** A touch is in progress: do not scroll under the reader's finger. */
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
    if (this.els && wasProgrammatic) {
      this.updateState();
      // The content may have grown while a smooth scroll was in flight.
      if (this.shouldFollow() && !this.isAtEnd()) {
        this.scrollTo(this.maxScrollTop(), 'auto', true);
      }
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

  private listen(target: HTMLElement, type: string, listener: EventListener): void {
    target.addEventListener(type, listener, { passive: true });
    this.cleanups.push(() => target.removeEventListener(type, listener));
  }
}
```

## Usage

```angular-ts
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
```

```angular-html
<z-message-scroller zAutoScroll class="h-96 rounded-lg border">
  @for (message of messages(); track message.id) {
    <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
      <z-message [zAlign]="message.role === 'user' ? 'end' : 'start'">{{ message.text }}</z-message>
    </z-message-scroller-item>
  }

  <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
</z-message-scroller>
```

## Examples

### Streaming

Set `zAutoScroll` to follow a streaming answer while the reader is at the live edge. Scroll up and it lets go; `[z-message-scroller-button]` appears, and clicking it scrolls back and resumes following. Mark the reader's own messages with `zAnchor` so each new turn settles near the top and the answer streams in below it.

```angular-ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const REPLY =
  'Streaming works best when the scroller only follows you while you are at the live edge. Scroll up while this answer is arriving and it stops; the jump button appears, and one click brings you back and resumes following. Nothing moves unless you asked it to.';

@Component({
  selector: 'z-demo-message-scroller-streaming',
  imports: [ZardButtonComponent, ...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3">
      <z-message-scroller zAutoScroll class="h-96 rounded-lg border">
        @for (turn of turns(); track turn.id) {
          <z-message-scroller-item [zMessageId]="turn.id" [zAnchor]="turn.role === 'user'">
            <z-message
              [zAlign]="turn.role === 'user' ? 'end' : 'start'"
              [zVariant]="turn.role === 'user' ? 'default' : 'muted'"
            >
              {{ turn.text || '…' }}
            </z-message>
          </z-message-scroller-item>
        }

        <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
      </z-message-scroller>

      <button z-button zType="outline" type="button" [disabled]="streaming()" (click)="send()">
        {{ streaming() ? 'Streaming…' : 'Send a message' }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerStreamingComponent {
  private timer: ReturnType<typeof setInterval> | undefined;
  private count = 1;

  protected readonly streaming = signal(false);
  protected readonly turns = signal<Turn[]>([
    { id: 'u0', role: 'user', text: 'How should a chat scroll while an answer streams in?' },
    { id: 'a0', role: 'assistant', text: 'It should follow the answer only while you are reading the latest line.' },
  ]);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected send(): void {
    const n = this.count++;
    const assistantId = `a${n}`;
    this.turns.update(turns => [
      ...turns,
      { id: `u${n}`, role: 'user', text: 'Tell me more about following the live edge.' },
      { id: assistantId, role: 'assistant', text: '' },
    ]);
    this.streaming.set(true);

    // Stands in for a model streaming tokens.
    const words = REPLY.split(' ');
    let sent = 0;
    this.timer = setInterval(() => {
      sent++;
      const text = words.slice(0, sent).join(' ');
      this.turns.update(turns => turns.map(turn => (turn.id === assistantId ? { ...turn, text } : turn)));
      if (sent >= words.length) {
        clearInterval(this.timer);
        this.streaming.set(false);
      }
    }, 70);
  }
}
```

### Load Earlier

Prepending older rows does not move what the reader is looking at. `zPreserveScrollOnPrepend` is on by default; the "load earlier" row is just another `z-message-scroller-item`.

```angular-ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: number;
  mine: boolean;
}

const PAGE = 6;
const TOTAL = 30;

const page = (from: number, to: number): Turn[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ id: from + i, mine: (from + i) % 2 === 0 }));

@Component({
  selector: 'z-demo-message-scroller-load-earlier',
  imports: [ZardButtonComponent, ...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller class="h-96 w-full max-w-md rounded-lg border">
      <z-message-scroller-item zMessageId="load-earlier" class="flex justify-center">
        <button z-button zType="outline" zSize="sm" type="button" [disabled]="loading() || !hasMore()" (click)="load()">
          {{ loading() ? 'Loading…' : hasMore() ? 'Load earlier messages' : 'Start of the conversation' }}
        </button>
      </z-message-scroller-item>

      @for (turn of turns(); track turn.id) {
        <z-message-scroller-item [zMessageId]="'m' + turn.id">
          <z-message [zAlign]="turn.mine ? 'end' : 'start'" [zVariant]="turn.mine ? 'default' : 'muted'">
            Message {{ turn.id }} of {{ total }}
          </z-message>
        </z-message-scroller-item>
      }
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerLoadEarlierComponent {
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly total = TOTAL;
  protected readonly loading = signal(false);
  protected readonly turns = signal<Turn[]>(page(TOTAL - 11, TOTAL));

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected hasMore(): boolean {
    return this.turns()[0].id > 1;
  }

  protected load(): void {
    this.loading.set(true);
    // Stands in for a network request; the older rows land above the ones being read.
    this.timer = setTimeout(() => {
      const first = this.turns()[0].id;
      this.turns.update(turns => [...page(Math.max(1, first - PAGE), first - 1), ...turns]);
      this.loading.set(false);
    }, 400);
  }
}
```

### Last Anchor

Use `zDefaultPosition="last-anchor"` to reopen a saved thread at the last `zAnchor` row, with its reply right below, instead of at the very bottom. It falls back to `end` when that turn fits the viewport.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'z-demo-message-scroller-last-anchor',
  imports: [...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller zDefaultPosition="last-anchor" class="h-96 w-full max-w-md rounded-lg border">
      @for (turn of turns; track turn.id) {
        <z-message-scroller-item [zMessageId]="turn.id" [zAnchor]="turn.role === 'user'">
          <z-message
            [zAlign]="turn.role === 'user' ? 'end' : 'start'"
            [zVariant]="turn.role === 'user' ? 'default' : 'muted'"
          >
            {{ turn.text }}
          </z-message>
        </z-message-scroller-item>
      }

      <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerLastAnchorComponent {
  protected readonly turns: Turn[] = [
    { id: 't1', role: 'user', text: 'What does a saved thread need to reopen well?' },
    { id: 't2', role: 'assistant', text: 'The last turn the reader was in, not the very bottom of the transcript.' },
    { id: 't3', role: 'user', text: 'Walk me through how to choose where it opens.' },
    {
      id: 't4',
      role: 'assistant',
      text: 'Start from the last message that begins a turn, usually the one the reader sent. Everything after it is the reply they have not finished reading.',
    },
    {
      id: 't5',
      role: 'assistant',
      text: 'If that whole turn fits on screen, there is nothing to choose: the end of the transcript already shows it, so the scroller opens there.',
    },
    {
      id: 't6',
      role: 'assistant',
      text: 'When the reply is longer than the viewport, opening at the very end drops the reader in the middle of an answer with no sign of the question it belongs to.',
    },
    {
      id: 't7',
      role: 'assistant',
      text: 'Opening at the last anchor puts the question at the top and the answer right below it, so the reader can simply start reading.',
    },
    {
      id: 't8',
      role: 'assistant',
      text: 'The position is applied once, on the first non-empty render. After that the reader is in control, and new content never moves them on its own.',
    },
  ];
}
```

### Jump To Message

Controls outside the transcript, such as search results or an outline, drive it through `ZardMessageScrollerService`. Read it from the scroller with `viewChild(ZardMessageScrollerComponent, { read: ZardMessageScrollerService })`, then call `scrollToMessage`. `visibleMessageIds` and `currentAnchorId` are signals.

```angular-ts
import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerComponent } from '@/shared/components/message-scroller/message-scroller.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardMessageScrollerService } from '@/shared/components/message-scroller/message-scroller.service';

@Component({
  selector: 'z-demo-message-scroller-jump-to-message',
  imports: [ZardButtonComponent, ...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        @for (id of targets; track id) {
          <button z-button zType="outline" zSize="sm" type="button" [attr.data-target]="id" (click)="jump(id)">
            Message {{ id }}
          </button>
        }
      </div>

      <z-message-scroller class="h-80 rounded-lg border">
        @for (id of ids; track id) {
          <z-message-scroller-item [zMessageId]="'m' + id">
            <z-message [zAlign]="id % 2 === 0 ? 'end' : 'start'" [zVariant]="id % 2 === 0 ? 'default' : 'muted'">
              Message {{ id }}
            </z-message>
          </z-message-scroller-item>
        }

        <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
      </z-message-scroller>

      <p class="text-muted-foreground text-xs" data-testid="visible-ids">Visible: {{ visible() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerJumpToMessageComponent {
  // The service is provided by the scroller, so a control outside it reads it from the component.
  private readonly scroller = viewChild.required(ZardMessageScrollerComponent, { read: ZardMessageScrollerService });

  protected readonly ids = Array.from({ length: 40 }, (_, i) => i + 1);
  protected readonly targets = [3, 20, 38];

  protected visible(): string {
    return this.scroller().visibleMessageIds().join(', ') || '-';
  }

  protected jump(id: number): void {
    this.scroller().scrollToMessage(`m${id}`, { align: 'center', behavior: 'smooth' });
  }
}
```

### Virtualization

Virtualization is a recipe, not an input. `z-message-scroller` renders real rows, which is what anchoring, prepend preservation and jump-to-message measure, and it stays fast well into the thousands of rows. When a transcript needs more, put the rows in a `cdk-virtual-scroll-viewport` with a fixed `itemSize` and let it own the scrolling, `scrollToIndex` standing in for `scrollToMessage`. You trade the scroller live-edge and anchoring behavior for it, so reach for it only when you have measured the need.

```angular-ts
import { ScrollingModule, type CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { afterNextRender, ChangeDetectionStrategy, Component, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

const TOTAL = 5000;

@Component({
  selector: 'z-demo-message-scroller-virtualization',
  imports: [ScrollingModule, ZardButtonComponent, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3">
      <cdk-virtual-scroll-viewport
        #viewport
        itemSize="56"
        role="region"
        aria-label="Messages"
        class="h-96 rounded-lg border"
      >
        <div *cdkVirtualFor="let id of ids" class="flex h-14 items-center px-4" [attr.data-message-id]="'m' + id">
          <z-message
            class="w-full"
            [zAlign]="id % 2 === 0 ? 'end' : 'start'"
            [zVariant]="id % 2 === 0 ? 'default' : 'muted'"
          >
            Message {{ id }} of {{ total }}
          </z-message>
        </div>
      </cdk-virtual-scroll-viewport>

      <button z-button zType="outline" type="button" (click)="scrollToLatest()">Jump to latest</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerVirtualizationComponent {
  private readonly viewport = viewChild.required<CdkVirtualScrollViewport>('viewport');

  protected readonly total = TOTAL;
  protected readonly ids = Array.from({ length: TOTAL }, (_, i) => i + 1);

  constructor() {
    // Wait a frame: the viewport measures itself once the rows are rendered.
    afterNextRender(() => requestAnimationFrame(() => this.scrollToLatest()));
  }

  protected scrollToLatest(): void {
    this.viewport().scrollToIndex(TOTAL - 1);
  }
}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). The scroll button stays centered and the rows mirror.

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface Strings {
  messages: string[];
  jump: string;
}

const translations: ZardRtlTranslations<Strings> = {
  en: {
    dir: 'ltr',
    values: {
      jump: 'Jump to latest',
      messages: [
        'Is the release still on for Friday?',
        'Yes, both branches are frozen.',
        'Did QA finish the checkout flow?',
        'They are on the last scenario.',
        'Great, ping me when it is green.',
        'Will do.',
        'Anything blocking the migration?',
        'Nothing. It ships a release ahead.',
        'Perfect, thanks.',
        'Anytime.',
      ],
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      jump: 'الانتقال إلى الأحدث',
      messages: [
        'هل الإصدار ما زال مقررا يوم الجمعة؟',
        'نعم، تم تجميد الفرعين.',
        'هل أنهى فريق الجودة مسار الدفع؟',
        'هم في آخر سيناريو.',
        'ممتاز، أخبرني عندما ينجح كل شيء.',
        'سأفعل.',
        'هل هناك ما يعيق الترحيل؟',
        'لا شيء. سيصدر قبل الإصدار بنسخة.',
        'رائع، شكرا.',
        'على الرحب والسعة.',
      ],
    },
  },
  he: {
    dir: 'rtl',
    values: {
      jump: 'קפיצה לאחרונה',
      messages: [
        'האם הגרסה עדיין מתוכננת ליום שישי?',
        'כן, שני הענפים הוקפאו.',
        'האם ה-QA סיימו את תהליך התשלום?',
        'הם בתרחיש האחרון.',
        'מעולה, תעדכן אותי כשהכול ירוק.',
        'אעשה זאת.',
        'האם משהו חוסם את המיגרציה?',
        'שום דבר. היא יוצאת גרסה לפני.',
        'מושלם, תודה.',
        'בכל עת.',
      ],
    },
  },
};

@Component({
  selector: 'z-demo-message-scroller-rtl',
  imports: [...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller class="h-80 w-full max-w-md rounded-lg border">
      @for (text of i18n.t().messages; track $index) {
        <z-message-scroller-item [zMessageId]="'m' + $index">
          <z-message [zAlign]="$index % 2 === 0 ? 'end' : 'start'" [zVariant]="$index % 2 === 0 ? 'default' : 'muted'">
            {{ text }}
          </z-message>
        </z-message-scroller-item>
      }

      <button z-message-scroller-button zDirection="end" [attr.aria-label]="i18n.t().jump"></button>
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## API Reference

### z-message-scroller

Scroll container for a chat transcript. It fills its parent, so give it a height. Its viewport is a labelled `region` named "Messages"; set `aria-label` on the element to rename it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zAutoScroll]` | Follow new content while the reader is at the live edge. Any manual scroll releases it | `boolean` | `false` |
| `[zDefaultPosition]` | Opening position on the first non-empty render, applied once. `last-anchor` opens at the last `zAnchor` row, and falls back to `end` when that turn fits | `'start' \| 'end' \| 'last-anchor'` | `'end'` |
| `[zPreserveScrollOnPrepend]` | Keep the visible row stable when older messages are prepended | `boolean` | `true` |
| `[zEdgeThreshold]` | Distance in px that still counts as being at an edge | `number` | `8` |
| `[zScrollMargin]` | Margin applied to the aligned edge when scrolling to a message | `number` | `0` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-message-scroller-item

One transcript row: a message, marker, typing row or "load earlier" row. Wrap every direct child of the transcript in one.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zMessageId]` | Stable row id used by `scrollToMessage`, `visibleMessageIds` and prepend preservation | `string` | `-` |
| `[zAnchor]` | Marks the row as a turn boundary that anchors newly appended turns | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### [z-message-scroller-button]

Scrolls to an edge. It is inert and out of the tab order when there is nothing to scroll toward. Give it an `aria-label`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDirection]` | Edge of the transcript the button scrolls toward | `'start' \| 'end'` | `'end'` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### ZardMessageScrollerService

Scroll state and commands of one scroller. Provided by `z-message-scroller`: inject it inside the scroller, or read it from outside with `viewChild(ZardMessageScrollerComponent, { read: ZardMessageScrollerService })`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `scrollToEnd(options?)` | Scroll to the latest message and resume following. Returns `false` when it cannot be applied | `(options?: ZardScrollOptions) => boolean` | `-` |
| `scrollToStart(options?)` | Scroll to the top. Returns `false` when it cannot be applied | `(options?: ZardScrollOptions) => boolean` | `-` |
| `scrollToMessage(messageId, options?)` | Scroll to a mounted message id and release the live edge. Returns `false` when the id is not mounted | `(messageId: string, options?: ZardScrollOptions) => boolean` | `-` |
| `scrollable` | Which edges can still be scrolled toward. `end` stays `false` while following the live edge | `Signal<{ start: boolean; end: boolean }>` | `-` |
| `visibleMessageIds` | Ids of the rows intersecting the viewport, in document order | `Signal<string[]>` | `-` |
| `currentAnchorId` | The anchored turn at or above the reading line | `Signal<string \| null>` | `-` |

### ZardScrollOptions

Options of the scroll commands.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `align` | How a message target aligns in the viewport | `'start' \| 'center' \| 'end' \| 'nearest'` | `'start'` |
| `behavior` | Native scroll behavior. `smooth` falls back to `auto` under `prefers-reduced-motion` | `ScrollBehavior` | `'auto'` |
| `scrollMargin` | Margin applied to the aligned edge for this command | `number` | `zScrollMargin` |

---

[Open in browser](https://zardui.com/docs/components/message-scroller)
