import { FocusTrapFactory } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { DRAWER_STACK_PEEK, DRAWER_STACK_STEP, drawerDepth, popDrawerPanel, pushDrawerPanel } from './drawer-stack';
import {
  closingDirection,
  DRAWER_CLOSE_THRESHOLD,
  DRAWER_DURATION,
  DRAWER_VELOCITY_THRESHOLD,
  isInteractiveTarget,
  isScrollableAway,
  isVerticalPlacement,
  nearestSnapIndex,
  resolveSnapPoints,
  rubberband,
  type ZardDrawerSnapPoint,
} from './drawer.utils';
import { drawerBodyVariants, drawerHandleVariants, drawerVariants, type ZardDrawerPlacement } from './drawer.variants';

/** Movement (px) tolerated before a pointer press is treated as a swipe rather than a tap. */
const SWIPE_START_THRESHOLD = 3;

/**
 * The floating panel of a drawer: styling, the swipe handle, swipe physics, snap points,
 * nested stacking and the focus trap. Shared by the declarative `z-drawer` and by the
 * container the `ZardDrawerService` attaches, so both behave identically.
 *
 * @internal Compose `z-drawer` instead of using this directly.
 */
@Component({
  selector: 'z-drawer-panel',
  template: `
    @if (showHandle()) {
      <div data-slot="drawer-swipe-handle" aria-hidden="true" [class]="handleClasses()"></div>
    }

    <!-- A drawer with snap points is laid out at full height and translated, so the body is
         capped at the part that is actually on screen — otherwise its scroll area runs off it. -->
    <div #body data-slot="drawer-content" [class]="bodyClasses()" [style.max-height.px]="bodyHeight()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      --z-drawer-duration: 450ms;
      --z-drawer-ease: cubic-bezier(0.22, 1, 0.36, 1);
      /* Matches the m-2 inset in the variants: the panel has to travel that far extra to
         clear the screen, plus a couple of pixels so no edge peeks through mid-animation. */
      --z-drawer-inset: 0.5rem;
      --z-drawer-exit: calc(100% + var(--z-drawer-inset) + 2px);
      /* Fills the inset gap while the panel is dragged past its edge. Transparent by
         default, like shadcn — set it when the drawer should read as edge-to-edge. */
      --z-drawer-bleed: transparent;

      transition:
        translate var(--z-drawer-duration) var(--z-drawer-ease),
        transform var(--z-drawer-duration) var(--z-drawer-ease),
        filter var(--z-drawer-duration) var(--z-drawer-ease);
    }

    /* translate carries the enter/exit slide and transform the swipe offset and the nested
       stacking, so the inline styles never overwrite the animation (and vice versa). */
    @starting-style {
      :host([data-placement='top']) {
        translate: 0 calc(-1 * var(--z-drawer-exit));
      }
      :host([data-placement='bottom']) {
        translate: 0 var(--z-drawer-exit);
      }
      :host([data-placement='left']) {
        translate: calc(-1 * var(--z-drawer-exit)) 0;
      }
      :host([data-placement='right']) {
        translate: var(--z-drawer-exit) 0;
      }
    }

    :host([data-state='closed'][data-placement='top']) {
      translate: 0 calc(-1 * var(--z-drawer-exit));
    }
    :host([data-state='closed'][data-placement='bottom']) {
      translate: 0 var(--z-drawer-exit);
    }
    :host([data-state='closed'][data-placement='left']) {
      translate: calc(-1 * var(--z-drawer-exit)) 0;
    }
    :host([data-state='closed'][data-placement='right']) {
      translate: var(--z-drawer-exit) 0;
    }

    :host([data-swiping]) {
      transition: none;
    }

    /* A drawer stacked behind another one dims and stops scrolling. */
    :host([data-nested-open]) {
      overflow: hidden;
      filter: brightness(0.95);
    }

    /* The pill inside the grab strip. */
    [data-slot='drawer-swipe-handle']::after {
      content: '';
      border-radius: 9999px;
      background: var(--color-muted);
    }

    :host([data-axis='y']) [data-slot='drawer-swipe-handle']::after {
      width: 100px;
      height: 6px;
    }

    :host([data-axis='x']) [data-slot='drawer-swipe-handle']::after {
      width: 6px;
      height: 100px;
    }

    :host::after {
      content: '';
      position: absolute;
      pointer-events: none;
      background: var(--z-drawer-bleed);
    }

    :host([data-axis='y'])::after {
      inset-inline: 0;
      height: 3rem;
    }

    :host([data-axis='x'])::after {
      inset-block: 0;
      width: 3rem;
    }

    :host([data-placement='bottom'])::after {
      top: 100%;
    }
    :host([data-placement='top'])::after {
      bottom: 100%;
    }
    :host([data-placement='right'])::after {
      left: 100%;
    }
    :host([data-placement='left'])::after {
      right: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        transition-duration: 1ms;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-popup',
    role: 'dialog',
    tabindex: '-1',
    '[attr.data-placement]': 'zPlacement()',
    '[attr.data-axis]': 'axis()',
    '[attr.data-state]': 'zState()',
    '[attr.data-swiping]': 'isSwiping() ? "" : null',
    '[attr.data-snap-points]': 'hasSnapPoints() ? "" : null',
    '[attr.data-expanded]': 'isExpanded() ? "" : null',
    '[attr.data-nested-open]': 'depth() ? "" : null',
    '[attr.aria-modal]': 'zModal() ? "true" : null',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.transform]': 'transform()',
    '[style.touch-action]': 'swipeable() ? "none" : null',
    '[style.--z-drawer-duration.ms]': 'zDuration()',
    '[style.--z-drawer-visible-size.px]': 'visibleSize()',
    '(pointerdown)': 'onPointerDown($event)',
  },
  exportAs: 'zDrawerPanel',
})
export class ZardDrawerPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  readonly zPlacement = input<ZardDrawerPlacement>('bottom');
  readonly zSnapPoints = input<readonly ZardDrawerSnapPoint[] | undefined>(undefined);
  readonly zSnapPoint = model<ZardDrawerSnapPoint | undefined>(undefined);
  readonly zDismissible = input(true, { transform: booleanAttribute });
  readonly zHandle = input(false, { transform: booleanAttribute });
  readonly zModal = input(true, { transform: booleanAttribute });
  readonly zDuration = input(DRAWER_DURATION);
  /** Drives the enter/exit slide. The owner flips it to `closed` before disposing the overlay. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  /** Emitted when a gesture asks for the drawer to close. */
  readonly closeRequested = output<void>();

  protected readonly isSwiping = signal(false);

  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');

  private readonly viewportWidth = signal(0);
  private readonly viewportHeight = signal(0);
  private readonly measuredSize = signal(0);
  private readonly bodyOffset = signal(0);
  private readonly rootFontSize = signal(16);
  private readonly swipeOffset = signal<number | null>(null);

  /** How many drawers are stacked on top of this one. */
  protected readonly depth = drawerDepth(this);

  protected readonly axis = computed(() => (isVerticalPlacement(this.zPlacement()) ? 'y' : 'x'));

  protected readonly hasSnapPoints = computed(() => (this.zSnapPoints()?.length ?? 0) > 0);

  protected readonly swipeable = computed(() => this.zDismissible() || this.hasSnapPoints());

  protected readonly showHandle = computed(() => this.zHandle());

  protected readonly classes = computed(() =>
    mergeClasses(drawerVariants({ zPlacement: this.zPlacement(), zSnapping: this.hasSnapPoints() }), this.class()),
  );

  protected readonly handleClasses = computed(() => drawerHandleVariants({ zPlacement: this.zPlacement() }));
  protected readonly bodyClasses = computed(() => drawerBodyVariants());

  private readonly viewportSize = computed(() =>
    isVerticalPlacement(this.zPlacement()) ? this.viewportHeight() : this.viewportWidth(),
  );

  /**
   * Size of the panel along the swipe axis. Before the first measurement it falls back to
   * the viewport, which is exactly right for a snapping drawer (laid out at full size) and
   * irrelevant for the others, whose resting offset is 0 either way.
   */
  private readonly panelSize = computed(() => this.measuredSize() || this.viewportSize());

  private readonly resolvedSnapPoints = computed(() => {
    const points = this.zSnapPoints();
    if (!points?.length) {
      return [];
    }
    return resolveSnapPoints(points, this.viewportSize(), this.rootFontSize());
  });

  /** Index of the active snap point, or -1 when the drawer has none. */
  private readonly activeIndex = computed(() => {
    const points = this.zSnapPoints();
    if (!points?.length) {
      return -1;
    }

    const index = points.indexOf(this.zSnapPoint() as ZardDrawerSnapPoint);
    return index >= 0 ? index : 0;
  });

  /** True at the largest snap point, mirroring shadcn's `data-expanded`. */
  protected readonly isExpanded = computed(() => {
    const points = this.zSnapPoints();
    return !!points?.length && this.activeIndex() === points.length - 1;
  });

  /** Offset the panel rests at when it is not being swiped. */
  private readonly restOffset = computed(() => {
    const index = this.activeIndex();
    const size = this.panelSize();
    if (index < 0 || !size) {
      return 0;
    }

    return Math.max(0, size - this.resolvedSnapPoints()[index]);
  });

  private readonly offset = computed(() => this.swipeOffset() ?? this.restOffset());

  /**
   * How much of the panel is on screen right now, published as `--z-drawer-visible-size`.
   * A snapping drawer is laid out at full size and translated, so content that has to stay
   * reachable at every stop sizes itself against this instead of against the panel.
   */
  protected readonly visibleSize = computed(() =>
    this.hasSnapPoints() ? Math.max(0, this.panelSize() - this.offset()) : null,
  );

  /** Visible size minus whatever sits above the body — today, the handle. */
  protected readonly bodyHeight = computed(() => {
    const visible = this.visibleSize();
    return visible === null ? null : Math.max(0, visible - this.bodyOffset());
  });

  /**
   * Swipe offset and nested stacking share the same transform: a drawer behind another one
   * shrinks and slides a little further under it, the way shadcn stacks its drawers.
   */
  protected readonly transform = computed(() => {
    const depth = this.depth();
    const offset = this.offset();
    if (!depth && !offset) {
      return null;
    }

    const scale = Math.max(0, 1 - depth * DRAWER_STACK_STEP);
    // The panel scales towards its own edge, so a stacked one has to travel the width it
    // lost as well as the peek — otherwise it hides completely behind the drawer in front.
    const stack = depth * DRAWER_STACK_PEEK + (1 - scale) * this.panelSize();
    // Positive moves towards the closing edge; the stack offset pulls it back inwards.
    const axis = closingDirection(this.zPlacement()) * (offset - stack);
    const translate = isVerticalPlacement(this.zPlacement())
      ? `translate3d(0, ${axis}px, 0)`
      : `translate3d(${axis}px, 0, 0)`;

    return `${translate} scale(${scale})`;
  });

  private pointerId: number | null = null;
  private startTarget: EventTarget | null = null;
  private startPosition = 0;
  private startOffset = 0;
  private startTime = 0;
  private lastPosition = 0;
  private gestureCancelled = false;

  constructor() {
    // Seeded before the first render so a snapping drawer opens straight at its snap point
    // instead of rendering fully open for a frame and then sliding down to it.
    if (isPlatformBrowser(this.platformId)) {
      this.readViewport();
    }

    pushDrawerPanel(this);

    // Leave the stack as soon as the exit animation starts, so the drawer behind this one
    // un-stacks while both are still moving — and re-join it if the drawer is re-opened
    // mid-exit, which reuses this same panel.
    effect(() => {
      const closing = this.zState() === 'closed';
      untracked(() => (closing ? popDrawerPanel(this) : pushDrawerPanel(this)));
    });

    afterNextRender(() => {
      this.measure();
      this.observeResize();
      this.trapFocus();
    });

    this.destroyRef.onDestroy(() => {
      popDrawerPanel(this);
      this.endGesture();
    });
  }

  private readViewport(): void {
    this.viewportWidth.set(window.innerWidth);
    this.viewportHeight.set(window.innerHeight);

    const fontSize = Number.parseFloat(getComputedStyle(this.document.documentElement).fontSize);
    if (!Number.isNaN(fontSize)) {
      this.rootFontSize.set(fontSize);
    }
  }

  private measure(): void {
    // offsetWidth/Height, not getBoundingClientRect: the panel is scaled while stacked, and
    // the swipe maths needs its layout size, not the size it happens to be painted at.
    const element = this.host.nativeElement;

    this.measuredSize.set(isVerticalPlacement(this.zPlacement()) ? element.offsetHeight : element.offsetWidth);
    // The panel is `position: fixed`, so it is the offsetParent of its own children.
    this.bodyOffset.set(this.body().nativeElement.offsetTop);
    this.readViewport();
  }

  private observeResize(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => this.measure());
    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  /**
   * Only a modal drawer traps focus. A non-modal one deliberately leaves the page usable,
   * so tabbing out of it has to reach that page.
   */
  private trapFocus(): void {
    const trap = this.focusTrapFactory.create(this.host.nativeElement, !this.zModal());
    void trap.focusInitialElementWhenReady();
    this.destroyRef.onDestroy(() => trap.destroy());
  }

  protected onPointerDown(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.swipeable() || this.pointerId !== null) {
      return;
    }
    if (event.button !== 0 || isInteractiveTarget(event.target)) {
      return;
    }

    this.measure();

    this.pointerId = event.pointerId;
    this.startTarget = event.target;
    this.gestureCancelled = false;
    this.startPosition = this.axisPosition(event);
    this.lastPosition = this.startPosition;
    this.startOffset = this.offset();
    this.startTime = event.timeStamp;

    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId || this.gestureCancelled) {
      return;
    }

    const position = this.axisPosition(event);
    const delta = (position - this.startPosition) * closingDirection(this.zPlacement());

    if (!this.isSwiping()) {
      if (Math.abs(delta) < SWIPE_START_THRESHOLD) {
        return;
      }

      // A gesture that starts inside a scrollable area belongs to that area first.
      if (isScrollableAway(this.startTarget, this.host.nativeElement, this.zPlacement(), delta)) {
        this.gestureCancelled = true;
        this.endGesture();
        return;
      }

      this.isSwiping.set(true);
      this.host.nativeElement.setPointerCapture(event.pointerId);
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    this.lastPosition = position;
    this.swipeOffset.set(this.clampOffset(this.startOffset + delta));
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }

    const wasSwiping = this.isSwiping();
    const elapsed = Math.max(1, event.timeStamp - this.startTime);
    const velocity = ((this.lastPosition - this.startPosition) * closingDirection(this.zPlacement())) / elapsed;

    this.endGesture();
    if (!wasSwiping) {
      return;
    }

    if (this.hasSnapPoints()) {
      this.settleOnSnapPoint(velocity);
    } else {
      this.settle(velocity);
    }
  };

  private endGesture(): void {
    if (this.pointerId !== null && this.host.nativeElement.hasPointerCapture(this.pointerId)) {
      this.host.nativeElement.releasePointerCapture(this.pointerId);
    }

    this.pointerId = null;
    this.isSwiping.set(false);

    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }

  /** Swiping past the fully open edge — and past the last stop of a locked drawer — resists. */
  private clampOffset(offset: number): number {
    const size = this.panelSize();

    if (offset < 0) {
      return -rubberband(-offset, size);
    }

    if (!this.zDismissible()) {
      const points = this.resolvedSnapPoints();
      const maxOffset = points.length ? Math.max(0, size - Math.min(...points)) : 0;
      if (offset > maxOffset) {
        return maxOffset + rubberband(offset - maxOffset, size);
      }
    }

    return offset;
  }

  /** No snap points: a flick or a long enough swipe dismisses, anything else springs back. */
  private settle(velocity: number): void {
    const dismiss =
      this.zDismissible() &&
      (velocity > DRAWER_VELOCITY_THRESHOLD ||
        (velocity > -DRAWER_VELOCITY_THRESHOLD && this.offset() > this.panelSize() * DRAWER_CLOSE_THRESHOLD));

    this.swipeOffset.set(null);
    if (dismiss) {
      this.closeRequested.emit();
    }
  }

  /** With snap points: a flick moves one stop, a slow release lands on the closest one. */
  private settleOnSnapPoint(velocity: number): void {
    const points = this.zSnapPoints() ?? [];
    const resolved = this.resolvedSnapPoints();
    const visible = this.panelSize() - this.offset();

    let index = nearestSnapIndex(visible, resolved);

    if (velocity > DRAWER_VELOCITY_THRESHOLD) {
      index -= 1;
    } else if (velocity < -DRAWER_VELOCITY_THRESHOLD) {
      index = Math.min(resolved.length - 1, index + 1);
    }

    this.swipeOffset.set(null);

    if (index < 0) {
      if (this.zDismissible()) {
        this.closeRequested.emit();
        return;
      }
      index = 0;
    }

    // Released well below the smallest stop: treat it as a dismissal.
    if (this.zDismissible() && visible < resolved[0] * (1 - DRAWER_CLOSE_THRESHOLD)) {
      this.closeRequested.emit();
      return;
    }

    this.zSnapPoint.set(points[index]);
  }

  private axisPosition(event: PointerEvent): number {
    return isVerticalPlacement(this.zPlacement()) ? event.clientY : event.clientX;
  }
}
