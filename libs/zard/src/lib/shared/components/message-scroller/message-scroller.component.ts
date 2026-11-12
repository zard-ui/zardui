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
