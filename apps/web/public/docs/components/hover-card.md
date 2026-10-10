---
title: Hover Card
description: For sighted users to preview content available behind the link.
---

# Hover Card

For sighted users to preview content available behind the link.

## Installation

### CLI

```bash
npx zard-cli@latest add hover-card
```

### Manual

```angular-ts
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
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

/** Base visual styles and placement-aware animations for hover card content. */
export const hoverCardVariants = cva(
  [
    'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
    'origin-(--z-hover-card-transform-origin)',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ].join(' '),
);

/** Variant properties accepted by the hover card style generator. */
export type ZardHoverCardVariants = VariantProps<typeof hoverCardVariants>;
```

```angular-ts
export * from './hover-card.component';
export * from './hover-card.variants';
```

## Usage

```angular-ts
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
```

```angular-html
<button [zHoverCard]="content">
  Hover Here
</button>

<ng-template #content>
  <z-hover-card>
    The React Framework - created and maintained by @vercel.
  </z-hover-card>
</ng-template>
```

## Composition

```text
trigger[zHoverCard]
└── ng-template
    └── z-hover-card
```

## Examples

### Sides

Set `zPlacement` to `top`, `bottom`, `left` or `right` to choose which side of the trigger the hover card opens on. The overlay flips to another side automatically when the preferred placement does not fit in the viewport.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '../hover-card.component';

/** Demonstrates every supported hover card placement. */
@Component({
  selector: 'z-demo-hover-card-sides',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="leftContent"
        zPlacement="left"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Left
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="topContent"
        zPlacement="top"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Top
      </button>

      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="bottomContent"
        zPlacement="bottom"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Bottom
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="rightContent"
        zPlacement="right"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Right
      </button>
    </div>

    <ng-template #leftContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the left side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #topContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the top side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #bottomContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the bottom side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #rightContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the right side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardSidesComponent {}
```

### Delay

Hover intent defaults to a 700ms open delay and a 300ms close delay — long enough to ignore a passing cursor, unlike a tooltip. Override either with the `zOpenDelay` and `zCloseDelay` inputs, in milliseconds.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '../hover-card.component';

/** Contrasts the default hover intent delay with an instant, tooltip-like open. */
@Component({
  selector: 'z-demo-hover-card-delay',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" z-button zType="outline" [zHoverCard]="instantContent" [zOpenDelay]="0" [zCloseDelay]="0">
        No delay
      </button>
      <button type="button" z-button zType="outline" [zHoverCard]="slowContent" [zOpenDelay]="1000" [zCloseDelay]="500">
        1s delay
      </button>
    </div>

    <ng-template #instantContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">No delay</h4>
          <p>Opens immediately, like a tooltip — a quick pass of the cursor is enough to trigger it.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #slowContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">1s delay</h4>
          <p>Opens after a full second and closes after 500ms, set with [zOpenDelay] and [zCloseDelay].</p>
        </div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardDelayComponent {}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  ZardHoverCardComponent,
  ZardHoverCardDirective,
  type ZardHoverCardSide,
} from '@/shared/components/hover-card/hover-card.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface HoverCardRtlValues {
  name: string;
  price: string;
  'inline-start': string;
  left: string;
  top: string;
  bottom: string;
  right: string;
  'inline-end': string;
}

const translations: ZardRtlTranslations<HoverCardRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      name: 'Wireless Headphones',
      price: '$99.99',
      'inline-start': 'Inline Start',
      left: 'Left',
      top: 'Top',
      bottom: 'Bottom',
      right: 'Right',
      'inline-end': 'Inline End',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      name: 'سماعات لاسلكية',
      price: '٩٩.٩٩ $',
      'inline-start': 'بداية السطر',
      left: 'يسار',
      top: 'أعلى',
      bottom: 'أسفل',
      right: 'يمين',
      'inline-end': 'نهاية السطر',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      name: 'אוזניות אלחוטיות',
      price: '99.99 $',
      'inline-start': 'תחילת השורה',
      left: 'שמאל',
      top: 'למעלה',
      bottom: 'למטה',
      right: 'ימין',
      'inline-end': 'סוף השורה',
    },
  },
};

@Component({
  selector: 'z-demo-hover-card-rtl',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <div class="grid gap-4">
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of physicalSides; track side) {
          <button
            type="button"
            z-button
            zType="outline"
            [zHoverCard]="content"
            [zPlacement]="side"
            [zOpenDelay]="100"
            [zCloseDelay]="100"
          >
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of logicalSides; track side) {
          <button
            type="button"
            z-button
            zType="outline"
            [zHoverCard]="content"
            [zPlacement]="side"
            [zOpenDelay]="100"
            [zCloseDelay]="100"
          >
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
    </div>

    <ng-template #content>
      <z-hover-card class="flex w-64 flex-col gap-1">
        <div class="font-semibold">{{ i18n.t().name }}</div>
        <div class="text-muted-foreground text-sm">{{ i18n.t().price }}</div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly physicalSides: ZardHoverCardSide[] = ['left', 'top', 'bottom', 'right'];
  protected readonly logicalSides: ZardHoverCardSide[] = ['inline-start', 'inline-end'];
}
```

## API Reference

### [zHoverCard]

The directive that opens rich content when its trigger is hovered or focused.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zContent]` | Required. Template rendered inside the hover card | `TemplateRef<void>` | `-` |
| `[zPlacement]` | Preferred position relative to the trigger. `left` and `right` are physical sides; `inline-start` and `inline-end` follow the direction of the trigger, so they flip in RTL. | `'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-start' \| 'inline-end'` | `'bottom'` |
| `[zOpenDelay]` | Delay in milliseconds before opening | `number` | `700` |
| `[zCloseDelay]` | Delay in milliseconds before closing | `number` | `300` |
| `[zVisible]` | Controls visibility programmatically | `boolean` | `false` |
| `(zVisibleChange)` | Emits when visibility changes | `EventEmitter<boolean>` | `-` |

### z-hover-card

The wrapper component that styles hover card content. Exposes `data-state` and `data-side` while mounted, driving the open and directional animations.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/hover-card)
