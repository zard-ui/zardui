import { Directionality, type Direction } from '@angular/cdk/bidi';
import {
  type FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  type ConnectedPosition,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  type InputSignal,
  numberAttribute,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  type TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { ClassValue } from 'clsx';
import type { Subscription } from 'rxjs';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { hoverCardVariants } from './hover-card.variants';

/** Supported positions for a hover card relative to its trigger. */
export type ZardHoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Physical placements plus the logical ones, which follow the direction of the trigger. */
export type ZardHoverCardSide = ZardHoverCardPlacement | 'inline-start' | 'inline-end';

function resolveSide(side: ZardHoverCardSide, rtl: boolean): ZardHoverCardPlacement {
  if (side === 'inline-start') {
    return rtl ? 'right' : 'left';
  }
  if (side === 'inline-end') {
    return rtl ? 'left' : 'right';
  }
  return side;
}

const HOVER_CARD_POSITIONS: Record<ZardHoverCardPlacement, ConnectedPosition> = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -8,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 8,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -8,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
  },
};

/**
 * `left`/`right` are physical sides, while CDK `start`/`end` follow the overlay direction: in RTL the physical
 * left is `end`. The signed offset is physical and keeps pointing away from the trigger.
 */
function positionFor(placement: ZardHoverCardPlacement, rtl: boolean): ConnectedPosition {
  const position = HOVER_CARD_POSITIONS[placement];
  if (!rtl || (placement !== 'left' && placement !== 'right')) {
    return position;
  }
  const onLeft = placement === 'left';
  return {
    ...position,
    originX: onLeft ? 'end' : 'start',
    overlayX: onLeft ? 'start' : 'end',
  };
}

const HOVER_CARD_FALLBACKS: Record<ZardHoverCardPlacement, readonly ZardHoverCardPlacement[]> = {
  top: ['top', 'bottom', 'right', 'left'],
  bottom: ['bottom', 'top', 'right', 'left'],
  left: ['left', 'right', 'bottom', 'top'],
  right: ['right', 'left', 'bottom', 'top'],
};

let nextHoverCardId = 0;

/**
 * Attaches a delayed, focus-accessible hover card overlay to a trigger element.
 *
 * The supplied template remains open while the pointer or focus moves between
 * the trigger and its overlay content.
 */
@Directive({
  selector: '[zHoverCard]',
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'isOpen() ? contentId : null',
    '(mouseenter)': 'onTriggerMouseEnter()',
    '(mouseleave)': 'onTriggerMouseLeave()',
    '(focusin)': 'onTriggerFocusIn()',
    '(focusout)': 'onTriggerFocusOut($event)',
    '(keydown.escape)': 'onEscape()',
  },
  exportAs: 'zHoverCard',
})
export class ZardHoverCardDirective implements OnInit, OnDestroy {
  /** Template rendered inside the hover card overlay. */
  readonly zContent = input.required<TemplateRef<void>>({
    alias: 'zHoverCard',
  });

  /** Preferred placement relative to the trigger. */
  readonly zPlacement = input<ZardHoverCardSide>('bottom');

  /** Delay in milliseconds before the hover card opens. */
  readonly zOpenDelay = input(700, { transform: numberAttribute });

  /** Delay in milliseconds before the hover card closes. */
  readonly zCloseDelay = input(300, { transform: numberAttribute });

  /** Controls the hover card visibility programmatically. */
  readonly zVisible = input(false, { transform: booleanAttribute });

  /** Emits whenever the effective hover card visibility changes. */
  readonly zVisibleChange = output<boolean>();

  protected readonly isOpen = signal(false);
  protected readonly contentId = `z-hover-card-${nextHoverCardId++}`;

  private readonly overlayReady = signal(false);
  private positionStrategy?: FlexibleConnectedPositionStrategy;
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  // Optional: the direction of the trigger, which is where the overlay content takes its `dir` from.
  private readonly directionality = inject(Directionality, { optional: true });

  private overlayRef?: OverlayRef;
  private positionChangesSubscription?: Subscription;
  private openTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private overlayListeners: Array<() => void> = [];

  private pointerOverTrigger = false;
  private pointerOverOverlay = false;
  private focusWithinTrigger = false;
  private focusWithinOverlay = false;
  private lastVisible = false;

  constructor() {
    effect(() => {
      const placement = this.zPlacement();

      if (!this.overlayReady() || !this.positionStrategy) {
        return;
      }

      this.positionStrategy.withPositions(this.getPositions(placement));

      if (this.overlayRef?.hasAttached()) {
        this.overlayRef.updatePosition();
      }
    });

    effect(() => {
      const visible = this.zVisible();

      if (visible === this.lastVisible) {
        return;
      }

      this.lastVisible = visible;

      if (!this.overlayReady()) {
        return;
      }

      if (visible) {
        this.openNow();
      } else {
        this.closeNow();
      }
    });
  }

  /** Creates the browser overlay and applies the initial controlled visibility. */
  ngOnInit(): void {
    this.createOverlay();

    if (this.zVisible()) {
      this.openNow();
    }
  }

  /** Clears timers, event listeners, subscriptions, and the overlay. */
  ngOnDestroy(): void {
    this.cancelOpen();
    this.cancelClose();
    this.removeOverlayListeners();
    this.positionChangesSubscription?.unsubscribe();
    this.overlayRef?.dispose();
  }

  private setupOverlayListeners(): void {
    if (!this.overlayRef || this.overlayListeners.length > 0) {
      return;
    }

    const { overlayElement } = this.overlayRef;

    this.overlayListeners.push(
      this.renderer.listen(overlayElement, 'mouseenter', () => {
        this.pointerOverOverlay = true;
        this.cancelClose();
      }),
      this.renderer.listen(overlayElement, 'mouseleave', () => {
        this.pointerOverOverlay = false;
        this.scheduleClose();
      }),
      this.renderer.listen(overlayElement, 'focusin', () => {
        this.focusWithinOverlay = true;
        this.cancelClose();
      }),
      this.renderer.listen(overlayElement, 'focusout', (event: FocusEvent) => {
        const nextTarget = event.relatedTarget;

        if (nextTarget instanceof Node && overlayElement.contains(nextTarget)) {
          return;
        }

        this.focusWithinOverlay = false;

        if (nextTarget instanceof Node && this.elementRef.nativeElement.contains(nextTarget)) {
          return;
        }

        this.scheduleClose();
      }),
      this.renderer.listen(overlayElement, 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.onEscape();
        }
      }),
    );
  }

  private removeOverlayListeners(): void {
    for (const removeListener of this.overlayListeners) {
      removeListener();
    }

    this.overlayListeners = [];
    this.pointerOverOverlay = false;
    this.focusWithinOverlay = false;
  }

  protected onTriggerMouseEnter(): void {
    this.pointerOverTrigger = true;
    this.cancelClose();
    this.scheduleOpen();
  }

  protected onTriggerMouseLeave(): void {
    this.pointerOverTrigger = false;
    this.scheduleClose();
  }

  protected onTriggerFocusIn(): void {
    this.focusWithinTrigger = true;
    this.cancelClose();
    this.scheduleOpen();
  }

  protected onTriggerFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && this.overlayRef?.overlayElement.contains(nextTarget)) {
      this.focusWithinTrigger = false;
      return;
    }

    this.focusWithinTrigger = false;
    this.scheduleClose();
  }

  protected onEscape(): void {
    const restoreFocus = this.isOpen() && this.overlayRef?.overlayElement.contains(document.activeElement);
    this.closeNow();
    if (restoreFocus) {
      this.elementRef.nativeElement.focus();
    }
  }

  private direction(): Direction {
    return this.directionality?.value ?? 'ltr';
  }

  private getPositions(placement: ZardHoverCardSide = this.zPlacement()): ConnectedPosition[] {
    const rtl = this.direction() === 'rtl';
    return HOVER_CARD_FALLBACKS[resolveSide(placement, rtl)].map(fallback => positionFor(fallback, rtl));
  }

  private createOverlay(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.getPositions())
      .withPush(false)
      .withFlexibleDimensions(false)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      direction: this.direction(),
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.overlayElement.id = this.contentId;
    this.positionChangesSubscription = this.positionStrategy.positionChanges.subscribe(change => {
      this.updateContentSide(this.getSideFromPosition(change.connectionPair));
    });
    this.overlayReady.set(true);

    // The direction changed (a `[dir]` switch): close the card, it reopens with the new direction.
    this.directionality?.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.overlayRef?.setDirection(this.direction());
      this.positionStrategy?.withPositions(this.getPositions());
      this.closeNow();
    });
  }

  private openNow(): void {
    this.cancelOpen();
    this.cancelClose();

    if (this.isOpen() || !this.overlayRef) {
      return;
    }

    const portal = new TemplatePortal(this.zContent(), this.viewContainerRef);

    this.overlayRef.setDirection(this.direction());
    this.positionStrategy?.withPositions(this.getPositions());

    this.overlayRef.attach(portal);
    this.setupOverlayListeners();
    this.updateContentSide(resolveSide(this.zPlacement(), this.direction() === 'rtl'));
    this.isOpen.set(true);
    this.zVisibleChange.emit(true);
  }

  private closeNow(): void {
    this.cancelOpen();
    this.cancelClose();

    if (!this.isOpen()) {
      return;
    }

    this.overlayRef?.detach();
    this.pointerOverOverlay = false;
    this.focusWithinOverlay = false;
    this.isOpen.set(false);
    this.zVisibleChange.emit(false);
  }

  private scheduleOpen(): void {
    this.cancelOpen();
    this.cancelClose();

    this.openTimer = setTimeout(() => {
      this.openTimer = undefined;
      this.openNow();
    }, this.zOpenDelay());
  }

  private scheduleClose(): void {
    if (this.zVisible()) {
      this.cancelClose();
      return;
    }

    if (this.pointerOverTrigger || this.pointerOverOverlay || this.focusWithinTrigger || this.focusWithinOverlay) {
      this.cancelClose();
      return;
    }
    this.cancelOpen();
    this.cancelClose();

    this.closeTimer = setTimeout(() => {
      this.closeTimer = undefined;

      if (this.pointerOverTrigger || this.pointerOverOverlay || this.focusWithinTrigger || this.focusWithinOverlay) {
        return;
      }

      this.closeNow();
    }, this.zCloseDelay());
  }

  private cancelOpen(): void {
    if (this.openTimer !== undefined) {
      clearTimeout(this.openTimer);
      this.openTimer = undefined;
    }
  }

  private cancelClose(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }

  private getSideFromPosition(position: ConnectedPosition): ZardHoverCardPlacement {
    if (position.originY === 'bottom' && position.overlayY === 'top') {
      return 'bottom';
    }

    if (position.originY === 'top' && position.overlayY === 'bottom') {
      return 'top';
    }

    // CDK start/end follow the overlay direction; `left`/`right` are physical.
    const cdkEnd = position.originX === 'end' && position.overlayX === 'start';
    return cdkEnd !== (this.direction() === 'rtl') ? 'right' : 'left';
  }

  private updateContentSide(side: ZardHoverCardPlacement): void {
    const content = this.overlayRef?.overlayElement.querySelector<HTMLElement>('[data-slot="hover-card-content"]');

    if (!content) {
      return;
    }

    const transformOrigins: Record<ZardHoverCardPlacement, string> = {
      top: 'bottom center',
      bottom: 'top center',
      left: 'right center',
      right: 'left center',
    };

    content.dataset['state'] = 'open';
    content.dataset['side'] = side;
    content.style.setProperty('--z-hover-card-transform-origin', transformOrigins[side]);
  }
}

/** Styled content container rendered inside a hover card overlay. */
@Component({
  selector: 'z-hover-card, [z-hover-card]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'hover-card-content',
    '[class]': 'classes()',
  },
  exportAs: 'zHoverCard',
})
export class ZardHoverCardComponent {
  /** Additional CSS classes merged with the default hover card styles. */
  readonly class: InputSignal<ClassValue> = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(hoverCardVariants(), this.class()));
}
