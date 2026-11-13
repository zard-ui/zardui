---
title: Message Scroller
description: A chat scroll container that anchors turns, opens saved transcripts, follows streamed responses, loads history without jumping, and jumps to any message.
---

# Message Scroller

A chat scroll container that anchors turns, opens saved transcripts, follows streamed responses, loads history without jumping, and jumps to any message.

## What Makes a Great Streaming Chat Experience

Building a chat interface used to be simple. You create an inverted list with an input. Type a message, it appends at the bottom. When a reply comes in, the list grows and scrolls. Done.

Streaming breaks that model. Messages arrive in chunks while you may still be reading, scrolling, or looking somewhere else entirely.

Now the challenge is preserving the reader’s place while the conversation keeps changing. Get that wrong and the experience feels jumpy: people are pulled to the bottom, lose context, and have to find their way back.

In practice, this comes down to scroll: when to follow, when to hold, and when to let the reader decide. A great streaming chat should:
1. **Move only when the reader asked to move.** If someone is reading, don’t pull them somewhere else. Auto-scroll should never be the default.
2. **Follow only while they’re following.** If they’re at the live edge, keep the stream in view. If they scroll away, leave them there.
3. **Every interaction is a signal.** Scrolling is not the only one. Selecting text, using the keyboard, opening a link, or searching should all stop the interface from moving.
4. **Start a new turn near the top of the viewport.** This gives the new turn somewhere it can be read from the beginning.
5. **Then stream in the answer.** The answer should grow into the screen, not immediately push everything away.
6. **Keep part of the previous conversation in context.** The prompt and reply should stay visually connected, and enough of the previous turn should remain visible so the reader knows where they are.
7. **Let new content arrive offscreen.** The conversation can keep streaming without changing what the reader is looking at.
8. **Show what’s happening out of view.** Make it clear when a response is still streaming or when new messages have arrived.
9. **Make it easy to return to the latest reply.** A “Jump to latest” action should bring the reader back and resume following.
10. **Let people jump anywhere in the conversation.** Long threads need message links, search, unread markers, and direct navigation.
11. **Reopen where the reader left off.** A saved conversation should open at the last meaningful turn. Often this is the last user message. Not the absolute bottom.
12. **Keep the reader’s place when layout changes.** Images load. Markdown expands. Code blocks render. Older messages appear above. None of that should make the reader lose their place.
13. **Handle interruptions without stealing position.** Stopping, retrying, regenerating, branching, or errors should not unexpectedly move the conversation.
14. **Stay responsive in long threads.** Streaming text, markdown, code, images, and long history should still feel responsive.
15. **Be accessible without the noise.** Keep the transcript navigable, preserve keyboard focus, and announce important events at a comfortable pace.

**Never move the reader against their intent.**

## Message Scroller

`z-message-scroller` is a chat transcript scroller built for these behaviors. It owns the scroll state and the transcript-row behavior: opening position, streamed output, new-turn anchoring, prepended history, visibility, and scroll controls.

It is scoped to the scroll viewport. It does not own messages, AI state, transport, persistence, branching, or model state. Your product code stays focused on composing messages, markers, tools, attachments, and prompt inputs.

It gives you the scroll behavior that chat needs, without taking over the rest of the chat UI. And it stays fast, even in long conversations with rich markdown.

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
        [attr.aria-busy]="zBusy() || null"
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
  /** How much of the previous row, in px, stays visible above a newly anchored turn. */
  readonly zPreviousItemPeek = input(64, { transform: numberAttribute });
  /** Sets `aria-busy` on the transcript while a turn streams, so announcements wait for the finished row. */
  readonly zBusy = input(false, { transform: booleanAttribute });
  /** Classes for the transcript content (the `role="log"` element), such as its padding or gap. */
  readonly zContentClass = input<ClassValue>('');
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
    previousItemPeek: this.zPreviousItemPeek(),
  }));

  protected readonly classes = computed(() => mergeClasses(messageScrollerVariants(), this.class()));
  protected readonly viewportClasses = computed(() => messageScrollerViewportVariants());
  protected readonly contentClasses = computed(() =>
    mergeClasses(messageScrollerContentVariants(), this.zContentClass()),
  );

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

export const messageScrollerContentVariants = cva('flex h-max min-h-full flex-col gap-6');

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
  previousItemPeek: number;
}

/** The elements the scroller component hands to the engine. */
export interface ZardMessageScrollerElements {
  viewport: HTMLElement;
  content: HTMLElement;
  spacer: HTMLElement;
}

const ITEM_SLOT = 'message-scroller-item';
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
    return this.contentY(anchor) - (hasPrevious ? this.cfg().previousItemPeek : 0) - this.cfg().scrollMargin;
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
```

## Usage

```angular-ts
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
```

```angular-html
<z-message-scroller>
  @for (message of messages(); track message.id) {
    <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
      <z-message [zAlign]="message.role === 'user' ? 'end' : 'start'">
        <z-message-content>
          <z-bubble><z-bubble-content>{{ message.text }}</z-bubble-content></z-bubble>
        </z-message-content>
      </z-message>
    </z-message-scroller-item>
  }
  <button type="button" z-message-scroller-button></button>
</z-message-scroller>
```

`z-message-scroller` fills its parent, so place it inside a height-constrained container.

```angular-html
<div class="flex h-screen flex-col">
  <z-message-scroller class="flex-1"><!-- transcript --></z-message-scroller>
</div>
```

## Composition

```angular-html
<z-message-scroller>
  <z-message-scroller-item>
    <!-- a message, marker, or row -->
  </z-message-scroller-item>
  <z-message-scroller-item />
  <z-message-scroller-item />
  <button type="button" z-message-scroller-button></button>
</z-message-scroller>
```

- **`z-message-scroller`** — the frame, the scrollable viewport and the transcript in one. It owns the scroll state and the behavior inputs for opening position, auto-scroll, anchoring and the previous-turn peek. The viewport is a labelled, focusable region; the transcript is a `role="log"` live region.
- **`z-message-scroller-item`** — the transcript row boundary. Wrap every row so the scroller can measure, anchor, preserve position, track visibility, and jump to it. A row can be a message, marker, typing indicator, separator, join/leave event, or "load earlier" row.
- **`[z-message-scroller-button]`** — the scroll control. Scrolls to the start or end of the transcript and is inert until there is content in its direction.
- **`ZardMessageScrollerService`** — the commands and signals of one scroller (`scrollToMessage`, `scrollToEnd`, `scrollable`, `currentAnchorId`...), for controls outside the transcript.

### Anchoring Turns

A turn is the part of the conversation that starts a new exchange. In a simple AI chat, that is usually the user’s message and the assistant reply that follows.

An anchor is the row the viewport should treat as the start of that turn. Mark that row with `zAnchor`. When a new anchor is appended, the viewport moves it near the top and keeps a peek of the previous item above it, so the new turn does not feel detached from its context.

Scroll anchors are not tied to message role. You can turn any row into an anchor: a user message, a system marker, a handoff event, or anything else that starts a meaningful turn. `z-message-scroller` only needs to know which row should anchor the viewport.

In the following example, the user’s message is anchored. When you send a new message, the viewport anchors it near the top and appends the assistant reply below it. Toggle the anchor to the assistant’s message to see the difference.

```angular-html
<!-- This tells the scroller to anchor the user's message for the next turn. -->
<z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'" />
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import {
  type ChatMessage,
  type ChatRole,
  messageAnimationClass,
  ZardDemoChatRowComponent,
} from '@/shared/demo-utils/scripted-chat';

const SCRIPT: ChatMessage[] = [
  {
    id: 'anchor-1-user',
    role: 'user',
    text: 'Can you show me how anchoring behaves when a new prompt starts the turn?',
  },
  {
    id: 'anchor-1-assistant',
    role: 'assistant',
    text: 'Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it.',
  },
  { id: 'anchor-2-user', role: 'user', text: 'What changes when assistant messages are the anchor?' },
  {
    id: 'anchor-2-assistant',
    role: 'assistant',
    text: 'Now each assistant response is the row `z-message-scroller` keeps in view. This is useful when the reply is the moment you want readers to land on after each turn.',
  },
  { id: 'anchor-3-user', role: 'user', text: 'Can I switch roles and keep adding turns?' },
  {
    id: 'anchor-3-assistant',
    role: 'assistant',
    text: 'Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo.',
  },
];

@Component({
  selector: 'z-demo-message-scroller-anchoring',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ZardToggleGroupComponent,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="border-b">
          <z-card-title zTitle="Anchoring Turns" />
          <z-card-description zDescription="Choose which role settles near the top edge." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset anchored turns"
              [disabled]="messages().length === 0"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="No anchored messages yet"
              zDescription="Send the first message to see the selected role anchor."
            />
          } @else {
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (message of messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === anchorRole()"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer>
          <z-toggle-group
            zMode="single"
            zType="outline"
            aria-label="Select scroll anchor role"
            [zItems]="roles"
            [zValue]="anchorRole()"
            (valueChange)="selectRole($event)"
          />
          <button type="button" z-button zSize="icon" class="ms-auto" [disabled]="!nextMessage()" (click)="send()">
            <ng-icon name="lucideArrowUp" />
            <span class="sr-only">Send Message</span>
          </button>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-xs px-0.5 text-center text-xs">
        Toggle the anchor role, then send messages to compare where turns settle.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerAnchoringComponent {
  protected readonly roles: ZardToggleGroupItem[] = [
    { value: 'user', label: 'User', ariaLabel: 'Anchor user messages' },
    { value: 'assistant', label: 'Assistant', ariaLabel: 'Anchor assistant messages' },
  ];

  protected readonly entrance = messageAnimationClass('slide-up');
  protected readonly anchorRole = signal<ChatRole>('user');
  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly nextMessage = computed(() => SCRIPT[this.messages().length]);

  protected send(): void {
    const next = this.nextMessage();
    if (next) {
      this.messages.update(messages => [...messages, next]);
    }
  }

  protected selectRole(value: string | string[]): void {
    const role = Array.isArray(value) ? value[0] : value;
    if (role === 'user' || role === 'assistant') {
      this.anchorRole.set(role);
      this.reset();
    }
  }

  protected reset(): void {
    this.messages.set([]);
  }
}
```

### Group Chat

In a group chat, the turn boundary is more specific than “the user message”. It is often the message that asks the model to respond, or a marker like “Marcus joined the chat”. Typing indicators and history controls usually should not anchor.

Because anchoring is role-independent, you can anchor a marker just as easily as a message.

```angular-html
<z-message-scroller-item zMessageId="marcus-joined" zAnchor>
  <z-marker zVariant="separator">
    <z-marker-content>Marcus joined the chat</z-marker-content>
  </z-marker>
</z-message-scroller-item>
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCw } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

type GroupChatItem =
  | { id: string; type: 'event'; text: string; anchor?: boolean }
  | { id: string; type: 'message'; sender: string; role: 'assistant' | 'participant'; text: string; anchor?: boolean };

const CURRENT_USER = 'Grace';

const INITIAL_ITEMS: GroupChatItem[] = [
  {
    id: 'group-1',
    type: 'message',
    sender: 'Grace',
    role: 'participant',
    text: '@mary, the astrophage line keeps matching Venus energy output. Can you check my math?',
  },
  {
    id: 'group-2',
    type: 'message',
    sender: 'Mary (Agent)',
    role: 'assistant',
    text: 'Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need.',
  },
  { id: 'group-3', type: 'message', sender: 'Grace', role: 'participant', text: 'ping @rocky', anchor: true },
];

const ROCKY_MARKER: GroupChatItem = { id: 'group-4', type: 'event', text: 'Rocky has joined the chat', anchor: true };

const ROCKY_MESSAGE: GroupChatItem = {
  id: 'group-5',
  type: 'message',
  sender: 'Rocky',
  role: 'participant',
  text: 'Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart.',
};

@Component({
  selector: 'z-demo-message-scroller-group-chat',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCardImports,
    ...ZardMarkerImports,
    ...ZardMessageImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Group Chat" />
          <z-card-description
            zDescription="A group chat with several participants and an assistant. The Marker is marked as a turn."
          />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset conversation"
              zTooltip="Reset"
              [disabled]="turn() === 'idle'"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 p-0">
          @for (run of runs(); track run) {
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (item of items(); track item.id) {
                @if (item.type === 'message') {
                  @let isCurrentUser = item.sender === currentUser;
                  <z-message-scroller-item [zMessageId]="item.id" [zAnchor]="!!item.anchor">
                    <z-message [zAlign]="isCurrentUser ? 'end' : 'start'">
                      <z-message-content>
                        @if (!isCurrentUser) {
                          <z-message-header>{{ item.sender }}</z-message-header>
                        }
                        <z-bubble
                          [zAlign]="isCurrentUser ? 'end' : 'start'"
                          [zVariant]="isCurrentUser ? 'muted' : item.role === 'assistant' ? 'ghost' : 'tinted'"
                        >
                          <z-bubble-content>{{ item.text }}</z-bubble-content>
                        </z-bubble>
                      </z-message-content>
                    </z-message>
                  </z-message-scroller-item>
                } @else {
                  <z-message-scroller-item [zMessageId]="item.id" [zAnchor]="!!item.anchor">
                    <z-marker zVariant="separator">
                      <z-marker-content>{{ item.text }}</z-marker-content>
                    </z-marker>
                  </z-message-scroller-item>
                }
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex flex-col items-center gap-2 border-t">
          <button
            type="button"
            z-button
            zType="secondary"
            class="w-full"
            [disabled]="turn() === 'message'"
            (click)="advance()"
          >
            {{ turn() === 'idle' ? 'Add Rocky' : 'Send Message as Rocky' }}
          </button>
          <p class="text-muted-foreground text-xs">
            {{
              turn() === 'idle'
                ? 'This will create a marker and make it the anchor'
                : "Now send Rocky's reply into the conversation"
            }}
          </p>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        When a user joins, a marker is created. zAnchor on the marker marks it as the next turn
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerGroupChatComponent {
  protected readonly currentUser = CURRENT_USER;
  protected readonly turn = signal<'idle' | 'marker' | 'message'>('idle');
  /** Bumped on reset so the scroller starts over at its opening position. */
  protected readonly runs = signal([0]);

  protected readonly items = computed(() => {
    switch (this.turn()) {
      case 'message':
        return [...INITIAL_ITEMS, ROCKY_MARKER, ROCKY_MESSAGE];
      case 'marker':
        return [...INITIAL_ITEMS, ROCKY_MARKER];
      default:
        return INITIAL_ITEMS;
    }
  });

  protected advance(): void {
    this.turn.update(turn => (turn === 'idle' ? 'marker' : 'message'));
  }

  protected reset(): void {
    this.turn.set('idle');
    this.runs.update(([run]) => [run + 1]);
  }
}
```

### Keeping Context Visible

When a new turn starts, it should still feel like part of the same continuous thread. `zPreviousItemPeek` keeps a slice of the previous item visible above the anchor, so the reader keeps their context instead of feeling like the conversation restarted on a blank page.

Adjust the peek amount in the example below to see how it affects the conversation.

```angular-html
<!-- Keep 64px of the previous turn visible above the newly anchored row. -->
<z-message-scroller [zPreviousItemPeek]="64"><!-- anchored turns --></z-message-scroller>
```

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePlus, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { SCROLL_BEHAVIOR_SCRIPT } from '@/shared/demo-utils/chat-scripts';
import { injectScriptedChat, messageAnimationClass, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const DEFAULT_PEEK = 64;

@Component({
  selector: 'z-demo-message-scroller-previous-context',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardSliderComponent,
    ...ZardCardImports,
    ...ZardInputGroupImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Keeping Context Visible" />
          <z-card-description zDescription="New turns keep part of the previous reply in view." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset context example"
              zTooltip="Reset"
              [disabled]="chat.busy()"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @for (run of runs(); track run) {
            <z-message-scroller
              zContentClass="p-(--card-spacing)"
              [zScrollMargin]="24"
              [zPreviousItemPeek]="peek()"
              [zBusy]="chat.busy()"
            >
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex-col gap-2">
          <form class="w-full" (submit)="$event.preventDefault(); chat.send()">
            <z-input-group>
              <div class="h-14 w-full px-3 py-2.5 text-sm">
                <span class="line-clamp-2" [class.opacity-60]="chat.busy()">
                  @if (chat.next(); as next) {
                    {{ next.text }}
                  } @else {
                    <span class="text-muted-foreground">No messages queued. Reset the context.</span>
                  }
                </span>
              </div>
              <z-input-group-addon zAlign="block-end" class="pt-1">
                <button type="button" z-input-group-button zVariant="outline" zSize="icon-sm" aria-label="Add files">
                  <ng-icon name="lucidePlus" />
                </button>
                <div class="flex w-28 items-center gap-2">
                  <span class="text-muted-foreground text-xs tabular-nums">{{ peek() }}px</span>
                  <z-slider
                    class="flex-1"
                    aria-label="Previous context peek"
                    [zMin]="64"
                    [zMax]="128"
                    [zValue]="[peek()]"
                    [zDisabled]="chat.busy()"
                    (zSlideIndexChange)="peek.set($event[0] ?? defaultPeek)"
                  />
                </div>
                <button
                  type="submit"
                  z-input-group-button
                  zVariant="default"
                  zSize="icon-sm"
                  class="ms-auto"
                  [disabled]="!chat.next() || chat.busy()"
                >
                  <ng-icon name="lucideArrowUp" />
                  <span class="sr-only">Send</span>
                </button>
              </z-input-group-addon>
            </z-input-group>
          </form>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground px-0.5 text-center text-xs">
        Adjust the slider and send. Observe the previous message peek.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucidePlus, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerPreviousContextComponent {
  protected readonly defaultPeek = DEFAULT_PEEK;
  protected readonly chat = injectScriptedChat(SCROLL_BEHAVIOR_SCRIPT, { initial: 2, delayMs: 35 });
  protected readonly entrance = messageAnimationClass('slide-up');
  protected readonly peek = signal(DEFAULT_PEEK);
  /** Bumped on reset so the scroller starts over at its opening position. */
  protected readonly runs = signal([0]);

  protected reset(): void {
    this.chat.reset();
    this.peek.set(DEFAULT_PEEK);
    this.runs.update(([run]) => [run + 1]);
  }
}
```

### Following the Live Edge

When the reader is at the live edge, either because they stayed there or returned there, `zAutoScroll` keeps streamed replies in view as they grow. Scrolling away from the live edge releases the view, whether by wheel, touch, keyboard scroll keys, or dragging the scrollbar. An explicit message jump releases it too. New chunks can then arrive without moving the reader.

`zAutoScroll` composes with turn anchoring. When a new turn anchors near the top, the view stays put while the reply streams into the room below it. Once the reply fills the viewport, the reader is back at the live edge and follow-output takes over from the anchor.

```angular-html
<z-message-scroller zAutoScroll><!-- streamed turns --></z-message-scroller>
```

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucidePlus, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { SCROLL_BEHAVIOR_SCRIPT } from '@/shared/demo-utils/chat-scripts';
import { injectScriptedChat, messageAnimationClass, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

@Component({
  selector: 'z-demo-message-scroller-streaming',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ...ZardCardImports,
    ...ZardInputGroupImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Streaming Messages" />
          <z-card-description zDescription="Auto-scroll follows the live edge of the conversation." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset stream"
              zTooltip="Reset"
              [disabled]="chat.messages().length === 0 || chat.busy()"
              (click)="chat.reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (chat.messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="Ready to Stream"
              zDescription="Press send to stream a scripted conversation."
            />
          } @else {
            <z-message-scroller zAutoScroll zContentClass="p-(--card-spacing)" [zBusy]="chat.busy()">
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex-col gap-2">
          <form class="w-full" (submit)="$event.preventDefault(); chat.send()">
            <z-input-group>
              <div class="h-14 w-full px-3 py-2.5 text-sm">
                <span class="line-clamp-2" [class.opacity-60]="chat.busy()">
                  @if (chat.next(); as next) {
                    {{ next.text }}
                  } @else {
                    <span class="text-muted-foreground">No messages queued. Reset the stream.</span>
                  }
                </span>
              </div>
              <z-input-group-addon zAlign="block-end" class="pt-1">
                <button type="button" z-input-group-button zVariant="outline" zSize="icon-sm" aria-label="Add files">
                  <ng-icon name="lucidePlus" />
                </button>
                <button
                  type="submit"
                  z-input-group-button
                  zVariant="default"
                  zSize="icon-sm"
                  class="ms-auto"
                  [disabled]="!chat.next() || chat.busy()"
                >
                  <ng-icon name="lucideArrowUp" />
                  <span class="sr-only">Send</span>
                </button>
              </z-input-group-addon>
            </z-input-group>
          </form>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground px-0.5 text-center text-xs">Streaming is simulated. zAutoScroll is enabled.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucidePlus, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerStreamingComponent {
  protected readonly chat = injectScriptedChat(SCROLL_BEHAVIOR_SCRIPT, { delayMs: 20 });
  protected readonly entrance = messageAnimationClass('slide-up');
}
```

Calling `scrollToEnd`, or pressing the `z-message-scroller-button`, re-engages follow-output when `zAutoScroll` is enabled, so a reader who scrolled away can return to the live edge and keep following. The scroller and its viewport expose `data-autoscrolling` while that programmatic scroll to the latest message runs, so you can conditionally apply styles during the transition.

### Opening Saved Threads

It can seem reasonable to reopen a saved thread at the absolute end of the transcript, but that often drops the reader into the conversation without enough context. A better default is `"last-anchor"`: show the last meaningful turn, like the user’s latest message, with the reply below it.

That gives the reader an immediate place in the thread. They can see what they asked, where the answer starts, and continue from there without reconstructing the conversation from the bottom edge.

```angular-html
<z-message-scroller zDefaultPosition="last-anchor"><!-- transcript --></z-message-scroller>
```

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import type { ZardMessageScrollerPosition } from '@/shared/components/message-scroller/message-scroller.service';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { type ChatMessage, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES: ChatMessage[] = [
  { id: 'open-1', role: 'user', text: 'This is the first message the user sent in the conversation.' },
  {
    id: 'open-2',
    role: 'assistant',
    text: 'Workspace creation rose 8%, but first invite completion only rose 2%.',
  },
  { id: 'open-3', role: 'user', text: 'This is the last message the user sent in the conversation.' },
  {
    id: 'open-4',
    role: 'assistant',
    text: 'Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.',
  },
];

@Component({
  selector: 'z-demo-message-scroller-opening-position',
  imports: [ZardDemoChatRowComponent, ZardToggleGroupComponent, ...ZardCardImports, ...ZardMessageScrollerImports],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Opening Position" />
          <z-card-description zDescription="Choose where a saved transcript opens." />
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          <!-- A new scroller per choice, so each one opens fresh at its default position. -->
          @for (current of [position()]; track current) {
            <z-message-scroller zContentClass="p-(--card-spacing)" [zDefaultPosition]="current" [zScrollMargin]="64">
              @for (message of messages; track message.id) {
                <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex items-center justify-center border-t">
          <z-toggle-group
            class="w-full"
            zItemClass="flex-1"
            zMode="single"
            zType="outline"
            aria-label="Opening position"
            [zItems]="positions"
            [zValue]="position()"
            (valueChange)="select($event)"
          />
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs">
        Toggle zDefaultPosition to see where the transcript starts when you open the thread
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerOpeningPositionComponent {
  protected readonly messages = MESSAGES;
  protected readonly positions: ZardToggleGroupItem[] = [
    { value: 'start', label: 'start' },
    { value: 'end', label: 'end' },
    { value: 'last-anchor', label: 'last-anchor' },
  ];

  protected readonly position = signal<ZardMessageScrollerPosition>('last-anchor');

  protected select(value: string | string[]): void {
    const next = Array.isArray(value) ? value[0] : value;
    if (next === 'start' || next === 'end' || next === 'last-anchor') {
      this.position.set(next);
    }
  }
}
```

`"last-anchor"` is keyed on `zAnchor`, not message role. If no anchor exists, or the last anchored turn already fits in the viewport, it falls back to `"end"`.

Use `"start"` when you want to resume at the beginning of a conversation, or `"end"` when the absolute latest message is the right place to land.

### Avoiding a Flash on Reload

A scroll container always opens at the top. HTML has no way to set `scrollTop`, so a server-rendered transcript shows the oldest messages first. Once the app hydrates, `zDefaultPosition` moves the view, and you would see a jump.

When `zDefaultPosition` is `"end"` or `"last-anchor"`, the viewport has `data-pending-scroll` until that position is applied. The viewport stays hidden while the attribute is present, so you see the frame instead of the jump. `"start"` does not need this.

### Loading Earlier Messages

Loading earlier messages should not move the conversation the reader is already looking at. When older rows are prepended above the current transcript, the scroller preserves the visible row so the reader stays in the same place while history loads above them.

This is enabled by default through `zPreserveScrollOnPrepend`.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { type ChatScriptStep, scriptMessages, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const HISTORY = scriptMessages([
  { role: 'user', text: 'Can you summarize the incident channel?' },
  {
    role: 'assistant',
    text: 'The first alert was a delayed export job. It started backing up around 09:42 UTC and triggered the warning once the retry queue crossed the threshold.\n\nNo customer-facing checkout paths were affected, but exports for larger workspaces were running about 12 minutes behind.',
  },
  { role: 'user', text: 'Was checkout affected?' },
  {
    role: 'assistant',
    text: 'No checkout errors were reported. Payment authorization, order creation, and confirmation emails stayed inside their normal latency bands.\n\nThe only elevated metric was export queue depth, which maps to analytics downloads instead of checkout.',
  },
  { role: 'user', text: 'What changed in the last deploy?' },
  {
    role: 'assistant',
    text: 'Only the export queue worker changed. The deploy moved large CSV jobs onto the shared retry policy, which made each failed attempt hold a worker slot longer than before.\n\nThe app deploy did not include checkout, pricing, or billing API changes.',
  },
  { role: 'user', text: 'Do we need to roll back?' },
  {
    role: 'assistant',
    text: 'Not yet. Queue depth is recovering after we reduced retry concurrency, and the oldest pending job is now under five minutes old.\n\nKeep rollback ready if the queue starts climbing again, but the current trend points toward recovery.',
  },
  { role: 'user', text: 'Keep watching for customer-visible issues.' },
  {
    role: 'assistant',
    text: 'I will watch the queue and support tags for another 15 minutes. I am tracking export failures, delayed download requests, and any support thread that mentions missing reports.\n\nIf those stay quiet through the next batch window, we can close this as an internal degradation.',
  },
] satisfies ChatScriptStep[]);

const INITIAL_VISIBLE_COUNT = 5;

@Component({
  selector: 'z-demo-message-scroller-load-history',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ...ZardCardImports,
    ...ZardMarkerImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Load History" />
          <z-card-description zDescription="Prepended messages keep your place." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset loaded messages"
              zTooltip="Reset"
              [disabled]="visibleCount() === initialCount"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @for (run of runs(); track run) {
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (message of visibleMessages(); track message.id) {
                <z-message-scroller-item [zMessageId]="message.id">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <z-message-scroller-item>
                <z-marker zVariant="separator">
                  <z-marker-content>End of Conversation</z-marker-content>
                </z-marker>
              </z-message-scroller-item>
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex flex-col items-center gap-2 border-t">
          <button type="button" z-button zType="secondary" class="w-full" [disabled]="!canLoad()" (click)="load()">
            {{ canLoad() ? 'Load History' : 'History Loaded' }}
          </button>
          <p class="text-muted-foreground text-xs">Restore earlier messages while keeping your place.</p>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        Click Load History to load the entire conversation
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerLoadHistoryComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly initialCount = INITIAL_VISIBLE_COUNT;
  protected readonly visibleCount = signal(INITIAL_VISIBLE_COUNT);
  /** Bumped on reset so the scroller starts over at its opening position. */
  protected readonly runs = signal([0]);

  protected readonly visibleMessages = computed(() => HISTORY.slice(-this.visibleCount()));
  protected readonly canLoad = computed(() => this.visibleCount() < HISTORY.length);

  protected load(): void {
    // The older rows are prepended above the ones on screen; the scroller keeps the visible row in place.
    this.visibleCount.set(HISTORY.length);
    this.sonner.show('History loaded', { description: 'Scroll up to see earlier messages.' });
  }

  protected reset(): void {
    this.visibleCount.set(INITIAL_VISIBLE_COUNT);
    this.runs.update(([run]) => [run + 1]);
  }
}
```

Use stable `zMessageId` values for message rows. That gives the scroller a specific row to preserve instead of guessing from whichever pixel happens to sit at the viewport edge.

### Animating New Messages

`z-message-scroller-item` can be animated directly. Keep `zMessageId` and `zAnchor` on it, and use transform and opacity for the entrance.

A common chat pattern is to animate the user’s message when it is sent, then let the assistant reply stream into a regular row below it. Start the user row below its final position so it feels like it rises from the live edge of the viewport.

```angular-html
<!-- Transform and opacity only: the row keeps a stable height while it animates in. -->
<z-message-scroller-item
  [zMessageId]="message.id"
  zAnchor
  class="animate-in fade-in-0 slide-in-from-bottom-2.5 duration-300 motion-reduce:animate-none"
/>
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import {
  type ChatScriptStep,
  injectScriptedChat,
  MESSAGE_ANIMATIONS,
  messageAnimationClass,
  type MessageAnimationId,
  ZardDemoChatRowComponent,
} from '@/shared/demo-utils/scripted-chat';

const SCRIPT: ChatScriptStep[] = [
  { role: 'user', text: 'Can user messages pop in like iMessage without breaking anchoring?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'Yes. Animate the user row with transform and opacity, and let the assistant response stream normally below it.\n\nThat keeps the row measurement predictable while still giving the newly sent bubble a more tactile entrance.',
  },
  { role: 'user', text: 'What makes the animation feel more like iMessage?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'Use a quick spring from the trailing edge: a little scale, a small upward move, and no layout animation.\n\nThe bubble feels tactile, but the measured row stays predictable, so anchoring and auto-scroll do not have to fight a changing layout.',
  },
  { role: 'user', text: 'Can I switch between presets while testing the same thread?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'Yes. Keep the conversation in place while you change the preset, then send the next message to compare the new entrance against the same context.\n\nThat makes it easier to judge the difference between a subtle fade, a snappy pop, and a more dramatic blur without rebuilding the scenario each time.',
  },
];

@Component({
  selector: 'z-demo-message-scroller-animation',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
    ...ZardSelectImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="border-b">
          <z-card-title zTitle="Animation" />
          <z-card-description
            zDescription="Choose how user messages are animated when they are added to the conversation."
          />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset animated messages"
              [disabled]="chat.messages().length === 0 || chat.busy()"
              (click)="chat.reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (chat.messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="No Messages Yet"
              zDescription="Click the button below to send the first message."
            />
          } @else {
            <z-message-scroller zContentClass="p-(--card-spacing)" [zBusy]="chat.busy()">
              @for (message of chat.messages(); track message.id) {
                <!-- Only the sent message animates; the reply streams into a plain row. -->
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance() : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="border-t">
          <z-select class="w-40" aria-label="Animation preset" [(zValue)]="preset">
            @for (animation of animations; track animation.id) {
              <z-select-item [zValue]="animation.id">{{ animation.name }}</z-select-item>
            }
          </z-select>
          <button
            type="button"
            z-button
            zSize="icon"
            class="ms-auto"
            [disabled]="!chat.next() || chat.busy()"
            (click)="chat.send()"
          >
            <ng-icon name="lucideArrowUp" />
            <span class="sr-only">Send Message</span>
          </button>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        Select an animation then click send to see it in action.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerAnimationComponent {
  protected readonly animations = MESSAGE_ANIMATIONS;
  protected readonly chat = injectScriptedChat(SCRIPT, { delayMs: 15 });
  protected readonly preset = signal<string>('fade');
  protected readonly entrance = computed(() => messageAnimationClass(this.preset() as MessageAnimationId));
}
```

Avoid animating height, margin, or padding for row entrances; those changes can fight the scroller’s positioning work. If the reader prefers reduced motion, skip the entrance animation and keep the scroll behavior the same.

### Jumping to Messages

Search results, permalinks, outline items, and toolbar buttons often need to drive the transcript from outside the message list. Use the scroller’s `ZardMessageScrollerService` for those controls: it is provided by the scroller, so read it from the component, or from a template reference, anywhere in the same view, including controls rendered outside the transcript.

```angular-ts
// The service is provided by the scroller: read it from the component, or from a template
// reference (`#scroller="zMessageScroller"` then `scroller.service`).
private readonly scroller = viewChild.required(ZardMessageScrollerComponent, { read: ZardMessageScrollerService });

this.scroller().scrollToMessage(id, { align: 'start', behavior: 'smooth' });
this.scroller().scrollToEnd();
this.scroller().scrollToStart();
```

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { type ChatScriptStep, scriptMessages, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES = scriptMessages([
  {
    id: 'command-activation',
    role: 'user',
    text: "We're seeing activation dip after workspace creation. Can you help me find the likely step?",
  },
  {
    role: 'assistant',
    text: 'The sharpest drop is between creating the workspace and inviting the first teammate.\n\nWorkspace creation is still healthy, but the invite step is where users pause. That suggests the product is asking for collaboration before the user has enough confidence in the workspace.',
  },
  { id: 'command-compare', role: 'user', text: 'What should I compare before we change the onboarding flow?' },
  {
    role: 'assistant',
    text: 'Compare three cohorts:\n\n1. Users who choose a template before inviting teammates.\n2. Users who start from a blank workspace.\n3. Users who skip invites and return within 24 hours.\n\nIf template users invite faster, the fix is probably better first-run guidance rather than a louder invite prompt.',
  },
  { id: 'command-experiment', role: 'user', text: 'Can you turn that into an experiment?' },
  {
    role: 'assistant',
    text: 'Yes. Create a variant that shows a short checklist after workspace creation:\n\n- Pick a template.\n- Add one project detail.\n- Invite a teammate when the workspace has context.\n\nMeasure first invite completion, 24-hour return rate, and whether teams create a second project.',
  },
  { id: 'command-risk', role: 'user', text: "What's the risk if we delay the invite prompt?" },
  {
    role: 'assistant',
    text: 'The main risk is reducing team creation for accounts that already know who they want to invite.\n\nTo protect that path, keep the invite action visible in the header and only change the primary empty-state guidance. That gives confident teams a direct route without forcing uncertain users through the invite step too early.',
  },
] satisfies ChatScriptStep[]);

@Component({
  selector: 'z-demo-message-scroller-commands',
  imports: [
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ...ZardCardImports,
    ...ZardDropdownImports,
    ...ZardMessageScrollerImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Commands" />
          <z-card-description zDescription="Drive the transcript from outside." />
          <z-card-action>
            <button type="button" z-button zType="secondary" z-dropdown [zDropdownMenu]="jumpMenu">Jump to...</button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          <z-message-scroller #scroller="zMessageScroller" zContentClass="p-(--card-spacing)">
            @for (message of messages; track message.id) {
              <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                <z-demo-chat-row [zMessage]="message" />
              </z-message-scroller-item>
            }
            <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
          </z-message-scroller>
        </z-card-content>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        Use the controls to jump to any message in the conversation.
      </p>
    </div>

    <z-dropdown-menu-content #jumpMenu="zDropdownMenuContent" zAlign="end" class="w-64">
      <z-dropdown-menu-label>Conversations</z-dropdown-menu-label>
      @for (message of questions; track message.id) {
        <!-- The commands live on the scroller's service, so any control can drive it. -->
        <z-dropdown-menu-item
          (click)="scroller.service.scrollToMessage(message.id, { align: 'start', behavior: 'smooth' })"
        >
          <span class="line-clamp-1 min-w-0">{{ trim(message.text) }}</span>
        </z-dropdown-menu-item>
      }
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerCommandsComponent {
  protected readonly messages = MESSAGES;
  protected readonly questions = MESSAGES.filter(message => message.role === 'user');

  protected trim(text: string): string {
    return text.length > 42 ? `${text.slice(0, 39)}...` : text;
  }
}
```

`scrollToMessage` targets the `zMessageId` on `z-message-scroller-item`, so rows that need to be addressable should have stable ids. It returns `false` when the scroller is not mounted or the target row is not in the DOM.

A `true` result means the scroll ran, not that the row is already in view: a smooth scroll is still on its way.

### Tracking the Reader’s Position

Use the `currentAnchorId` and `visibleMessageIds` signals to track the reader’s position in the conversation. A common example is a table of contents or a jump menu that highlights the current anchored turn.

```angular-ts
// Signals: the anchored turn being read, and the rows on screen in document order.
const current = this.scroller().currentAnchorId();
const visible = this.scroller().visibleMessageIds();
```

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { type ChatScriptStep, scriptMessages, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES = scriptMessages([
  { id: 'vis-brief', role: 'user', text: 'Review the incident handoff and tell me what to read first.' },
  {
    role: 'assistant',
    text: 'Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job.',
  },
  { id: 'vis-impact', role: 'user', text: 'What was the customer impact?' },
  {
    role: 'assistant',
    text: 'Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors.',
  },
  { id: 'vis-actions', role: 'user', text: 'What actions are open?' },
  {
    role: 'assistant',
    text: 'Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.',
  },
  { id: 'vis-checklist', role: 'user', text: 'Give me the follow-up checklist.' },
  {
    role: 'assistant',
    text: 'After that, compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline. That makes it easier for support and engineering to answer the same customer questions without re-reading the whole incident thread.\n\nI would also add a short owner note beside each follow-up item. The checklist is small, but ownership keeps the retry-window decision, alert tuning, and support macro from drifting into separate follow-up conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.',
  },
] satisfies ChatScriptStep[]);

@Component({
  selector: 'z-demo-message-scroller-visibility',
  imports: [
    ZardDemoChatRowComponent,
    ZardHoverCardComponent,
    ZardHoverCardDirective,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <div class="relative mx-auto w-full max-w-sm">
        <z-card class="h-140 w-full gap-0">
          <z-card-header class="gap-1 border-b">
            <z-card-title zTitle="Transcript Outline" />
            <z-card-description zDescription="Track the current anchored turn." />
          </z-card-header>
          <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
            <z-message-scroller #scroller="zMessageScroller" zContentClass="p-(--card-spacing)" [zScrollMargin]="12">
              @for (message of messages; track message.id) {
                <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          </z-card-content>
        </z-card>

        <!-- currentAnchorId follows the turn being read, even after its question scrolled above the viewport. -->
        @let current = scroller.service.currentAnchorId();
        <div class="absolute top-1/2 -right-12 -translate-y-1/2">
          <button
            type="button"
            aria-label="Open transcript outline"
            class="focus-visible:ring-ring/50 flex size-9 flex-col items-center justify-center gap-1 rounded-md outline-none focus-visible:ring-3"
            zPlacement="left"
            [zHoverCard]="outline"
            [zOpenDelay]="100"
          >
            @for (message of questions; track message.id) {
              <span
                class="bg-muted-foreground/40 data-[current=true]:bg-foreground h-0.5 w-4 rounded-full"
                [attr.data-current]="message.id === current"
              ></span>
            }
          </button>
        </div>

        <ng-template #outline>
          <z-hover-card class="flex w-64 flex-col gap-1 rounded-2xl p-1">
            @for (message of questions; track message.id) {
              <button
                type="button"
                class="hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent aria-current:bg-accent aria-current:text-accent-foreground flex min-h-7 items-center rounded-xl px-2 py-1.5 text-start text-sm transition-colors outline-none"
                [attr.aria-current]="message.id === current ? 'location' : null"
                (click)="scroller.service.scrollToMessage(message.id, { align: 'start', behavior: 'smooth' })"
              >
                <span class="line-clamp-1 min-w-0">{{ trim(message.text) }}</span>
              </button>
            }
          </z-hover-card>
        </ng-template>
      </div>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs">
        Open the outline to jump between anchored turns as you read.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerVisibilityComponent {
  protected readonly messages = MESSAGES;
  protected readonly questions = MESSAGES.filter(message => message.role === 'user');

  protected trim(text: string): string {
    return text.length > 42 ? `${text.slice(0, 39)}...` : text;
  }
}
```

`currentAnchorId` answers “where am I” by reporting the current anchored turn, and it stays set after that anchor scrolls above the viewport. `visibleMessageIds` answers “what is on screen”, in document order.

Rows need a `zMessageId` to take part.

### Reading Scroll State

Use the `scrollable` signal when you need scroll state in code, such as a status indicator or a custom “jump to latest” control. It reports which edges the viewport can still scroll toward; “at the start/end” is the negation (`!start` / `!end`), and “scrollable at all” is `start || end`. For styling the scroller itself, prefer the `data-scrollable` attribute.

```angular-ts
// Which edges the viewport can still scroll toward.
const { start, end } = this.scroller().scrollable();
```

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import type { ZardScrollableEdges } from '@/shared/components/message-scroller/message-scroller.service';
import { type ChatMessage, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES: ChatMessage[] = Array.from({ length: 12 }, (_, index) => ({
  id: `scrollable-${index + 1}`,
  role: index % 2 === 0 ? 'user' : 'assistant',
  text:
    index % 2 === 0
      ? `Review scroll checkpoint ${index + 1}.`
      : `Checkpoint ${index + 1} is synced. The scrollable signal updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`,
}));

@Component({
  selector: 'z-demo-message-scroller-scrollable',
  imports: [ZardDemoChatRowComponent, ...ZardCardImports, ...ZardMessageScrollerImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4">
      <z-card class="h-140 w-full gap-0 overflow-hidden">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Scroll Status" />
          <z-card-description zDescription="Where the reader can scroll to, based on the current scroll position." />
        </z-card-header>
        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          <z-message-scroller
            #scroller="zMessageScroller"
            zDefaultPosition="start"
            zContentClass="gap-4 p-(--card-spacing)"
          >
            @for (message of messages; track message.id) {
              <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                <z-demo-chat-row [zMessage]="message" />
              </z-message-scroller-item>
            }
            <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
          </z-message-scroller>
        </z-card-content>
        <z-card-footer class="text-muted-foreground justify-center border-t text-center text-sm">
          {{ status(scroller.service.scrollable()) }}
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground px-0.5 text-center text-xs">Scroll the transcript to see the footer update.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerScrollableComponent {
  protected readonly messages = MESSAGES;

  /** `start` / `end` say which edges the viewport can still scroll toward. */
  protected status({ start, end }: ZardScrollableEdges): string {
    if (start && end) return 'You can scroll both ways.';
    if (end) return 'You are at the top. You can only scroll down.';
    if (start) return 'You are at the bottom. You can only scroll up.';
    return 'All messages fit in the viewport.';
  }
}
```

## Performance

`z-message-scroller` is built to stay fast with large transcripts made of markdown and composed message rows.

The scroll hot path stays outside change detection: scroll position, anchoring, and follow-output are tracked imperatively by the service and mirrored onto the scroller through `data-*` attributes, so scrolling and streaming do not re-render transcript rows. Only the few signals you read (`scrollable`, `visibleMessageIds`, `currentAnchorId`) change, and only when their value does.

Visibility tracking only reports rows that have a `zMessageId`, and a jump menu or active turn indicator costs nothing until something reads those signals.

This is comfortable for the expected range of a chat transcript: hundreds to low thousands of turns, including messages with markdown and composed components.

## Virtualization

Virtualization is intentionally left outside the component. `z-message-scroller` renders real DOM rows, which is what anchoring, prepend preservation and jumping measure, and it stays fast well into the thousands of turns (see [Performance](/docs/components/message-scroller#performance)), so most transcripts never need it.

When a transcript does, put the rows in a `cdk-virtual-scroll-viewport` with a fixed `itemSize` and let it own the scrolling, with `scrollToIndex` standing in for `scrollToMessage`. You give up the live-edge and anchoring behavior, so reach for it only once you have measured the need.

```angular-ts
import { ScrollingModule, type CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { afterNextRender, Component, viewChild } from '@angular/core';

@Component({
  selector: 'app-virtual-transcript',
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport
      #viewport
      itemSize="56"
      role="region"
      aria-label="Messages"
      class="h-96 rounded-lg border"
    >
      <div *cdkVirtualFor="let message of messages" class="flex h-14 items-center px-4">{{ message.text }}</div>
    </cdk-virtual-scroll-viewport>
  `,
})
export class VirtualTranscript {
  private readonly viewport = viewChild.required<CdkVirtualScrollViewport>('viewport');
  protected readonly messages = Array.from({ length: 5000 }, (_, i) => ({ id: i, text: `Message ${i + 1}` }));

  constructor() {
    // Open at the latest message once the viewport has measured itself.
    afterNextRender(() => requestAnimationFrame(() => this.viewport().scrollToIndex(this.messages.length - 1)));
  }
}
```

## RTL

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
    <z-message-scroller class="h-80 w-full max-w-sm rounded-xl border" zContentClass="p-4">
      @for (text of i18n.t().messages; track $index) {
        <z-message-scroller-item [zMessageId]="'m' + $index">
          <z-message [zAlign]="$index % 2 === 0 ? 'end' : 'start'" [zVariant]="$index % 2 === 0 ? 'muted' : 'ghost'">
            {{ text }}
          </z-message>
        </z-message-scroller-item>
      }

      <button type="button" z-message-scroller-button zDirection="end" [attr.aria-label]="i18n.t().jump"></button>
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## Accessibility

`z-message-scroller` keeps the scroll container keyboard reachable and the transcript announceable without forcing a specific message UI.

Its viewport is a labelled, keyboard-focusable scroll region by default. It uses `role="region"`, `aria-label="Messages"` (set `aria-label` on the scroller to rename it), and `tabindex="0"`, so keyboard users can focus the transcript and scroll it directly.

The transcript is a live region with `role="log"` and `aria-relevant="additions"`. New rows can be announced, but streamed text mutations do not have to be announced token by token.

Set `zBusy` while a turn streams if announcements should wait for the completed message row; it sets `aria-busy` on the transcript.

`[z-message-scroller-button]` is a real button. When there is nothing to scroll toward, it sets `inert`, uses `tabindex="-1"`, and exposes `data-active="false"` so inactive scroll controls do not create extra focus stops.

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
| `[zPreviousItemPeek]` | How much of the previous row, in px, stays visible above a newly anchored turn | `number` | `64` |
| `[zBusy]` | Sets `aria-busy` on the transcript while a turn streams | `boolean` | `false` |
| `[zContentClass]` | Classes for the transcript content, such as its padding or gap | `ClassValue` | `''` |
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
| `scrollToMessage(messageId, options?)` | Scroll to a mounted message id and release the live edge, unless it lands on the bottom. Returns `false` when the id is not mounted | `(messageId: string, options?: ZardScrollOptions) => boolean` | `-` |
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
