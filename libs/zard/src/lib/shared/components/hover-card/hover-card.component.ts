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
  Directive,
  ElementRef,
  effect,
  inject,
  input,
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

import type { ClassValue } from 'clsx';
import type { Subscription } from 'rxjs';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { hoverCardVariants } from './hover-card.variants';

export type ZardHoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

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

const HOVER_CARD_FALLBACKS: Record<ZardHoverCardPlacement, readonly ZardHoverCardPlacement[]> = {
  top: ['top', 'bottom', 'right', 'left'],
  bottom: ['bottom', 'top', 'right', 'left'],
  left: ['left', 'right', 'bottom', 'top'],
  right: ['right', 'left', 'bottom', 'top'],
};

let nextHoverCardId = 0;

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
  readonly zContent = input.required<TemplateRef<void>>({
    alias: 'zHoverCard',
  });

  readonly zPlacement = input<ZardHoverCardPlacement>('bottom');

  readonly zOpenDelay = input(700, { transform: numberAttribute });

  readonly zCloseDelay = input(300, { transform: numberAttribute });

  readonly zVisible = input(false, { transform: booleanAttribute });

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

  private overlayRef?: OverlayRef;
  private positionChangesSubscription?: Subscription;
  private openTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private overlayListeners: Array<() => void> = [];

  private pointerOverTrigger = false;
  private pointerOverOverlay = false;
  private focusWithinTrigger = false;
  private focusWithinOverlay = false;
  private hasObservedInitialVisible = false;

  constructor() {
    effect(() => {
      const placement = this.zPlacement();

      if (!this.overlayReady() || !this.positionStrategy) {
        return;
      }

      this.positionStrategy.withPositions(
        HOVER_CARD_FALLBACKS[placement].map(fallback => HOVER_CARD_POSITIONS[fallback]),
      );

      if (this.overlayRef?.hasAttached()) {
        this.overlayRef.updatePosition();
      }
    });

    effect(() => {
      const visible = this.zVisible();

      if (!this.hasObservedInitialVisible) {
        this.hasObservedInitialVisible = true;
        return;
      }

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

  ngOnInit(): void {
    this.createOverlay();

    if (this.zVisible()) {
      this.openNow();
    }
  }

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

        if (
          nextTarget instanceof Node &&
          (overlayElement.contains(nextTarget) || this.elementRef.nativeElement.contains(nextTarget))
        ) {
          return;
        }

        this.focusWithinOverlay = false;
        this.scheduleClose();
      }),
      this.renderer.listen(overlayElement, 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeNow();
        }
      }),
      this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeNow();
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
    this.closeNow();
  }

  private getPositions(): ConnectedPosition[] {
    return HOVER_CARD_FALLBACKS[this.zPlacement()].map(placement => HOVER_CARD_POSITIONS[placement]);
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
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.overlayRef.overlayElement.id = this.contentId;
    this.positionChangesSubscription = this.positionStrategy.positionChanges.subscribe(change => {
      this.updateContentSide(this.getSideFromPosition(change.connectionPair));
    });
    this.overlayReady.set(true);
  }

  private openNow(): void {
    this.cancelOpen();
    this.cancelClose();

    if (this.isOpen() || !this.overlayRef) {
      return;
    }

    const portal = new TemplatePortal(this.zContent(), this.viewContainerRef);

    this.overlayRef.attach(portal);
    this.setupOverlayListeners();
    this.updateContentSide(this.zPlacement());
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

    if (position.originX === 'end' && position.overlayX === 'start') {
      return 'right';
    }

    return 'left';
  }

  private updateContentSide(side: ZardHoverCardPlacement): void {
    const content = this.overlayRef?.overlayElement.querySelector<HTMLElement>('z-hover-card');

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

@Component({
  selector: 'z-hover-card',
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
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(hoverCardVariants(), this.class()));
}
