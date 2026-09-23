import {
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  numberAttribute,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  RendererStyleFlags2,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import type { ClassValue } from 'clsx';
import { filter, type Subscription } from 'rxjs';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  popoverDescriptionVariants,
  popoverHeaderVariants,
  popoverTitleVariants,
  popoverVariants,
} from './popover.variants';

export type ZardPopoverTrigger = 'click' | 'hover' | null;
export type ZardPopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
export type ZardPopoverAlign = 'start' | 'center' | 'end';

/**
 * Kept in sync with the `duration-100` utility of `popoverVariants`. The exit animation runs for this long
 * before the overlay is detached, so tests must advance timers by this exact amount.
 */
export const ZARD_POPOVER_ANIMATION_DURATION = 100;

const CONTENT_SELECTOR = '[data-slot="popover-content"]';

const FALLBACK_PLACEMENTS: Record<ZardPopoverPlacement, ZardPopoverPlacement[]> = {
  top: ['bottom', 'right', 'left'],
  bottom: ['top', 'right', 'left'],
  left: ['right', 'bottom', 'top'],
  right: ['left', 'bottom', 'top'],
  'inline-start': ['inline-end', 'bottom', 'top'],
  'inline-end': ['inline-start', 'bottom', 'top'],
};

const ALIGN_TO_VERTICAL = { start: 'top', center: 'center', end: 'bottom' } as const;
const ALIGN_TO_ORIGIN_X = { start: 'left', center: 'center', end: 'right' } as const;
const ALIGN_TO_ORIGIN_Y = { start: 'top', center: 'center', end: 'bottom' } as const;

function isVerticalPlacement(placement: ZardPopoverPlacement): boolean {
  return placement === 'top' || placement === 'bottom';
}

function isInlinePlacement(placement: ZardPopoverPlacement): boolean {
  return placement === 'inline-start' || placement === 'inline-end';
}

function buildPosition(
  placement: ZardPopoverPlacement,
  align: ZardPopoverAlign,
  sideOffset: number,
  alignOffset: number,
): ConnectedPosition {
  if (isVerticalPlacement(placement)) {
    const isTop = placement === 'top';
    return {
      originX: align,
      originY: isTop ? 'top' : 'bottom',
      overlayX: align,
      overlayY: isTop ? 'bottom' : 'top',
      offsetX: alignOffset,
      offsetY: isTop ? -sideOffset : sideOffset,
    };
  }

  const isStart = placement === 'left' || placement === 'inline-start';
  const verticalAlign = ALIGN_TO_VERTICAL[align];
  return {
    originX: isStart ? 'start' : 'end',
    originY: verticalAlign,
    overlayX: isStart ? 'end' : 'start',
    overlayY: verticalAlign,
    offsetX: isStart ? -sideOffset : sideOffset,
    offsetY: alignOffset,
  };
}

function transformOriginFor(side: ZardPopoverPlacement, align: ZardPopoverAlign): string {
  switch (side) {
    case 'top':
      return `${ALIGN_TO_ORIGIN_X[align]} bottom`;
    case 'bottom':
      return `${ALIGN_TO_ORIGIN_X[align]} top`;
    case 'left':
    case 'inline-start':
      return `right ${ALIGN_TO_ORIGIN_Y[align]}`;
    default:
      return `left ${ALIGN_TO_ORIGIN_Y[align]}`;
  }
}

@Directive({
  selector: '[zPopover]',
  host: {
    'data-slot': 'popover-trigger',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'isVisible()',
    '[attr.aria-controls]': 'contentId()',
  },
  exportAs: 'zPopover',
})
export class ZardPopoverDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private positionStrategy?: FlexibleConnectedPositionStrategy;
  private overlayRefSubscription?: Subscription;
  private listeners: (() => void)[] = [];
  private animationListener?: () => void;
  private detachTimer?: ReturnType<typeof setTimeout>;

  readonly zTrigger = input<ZardPopoverTrigger>('click');
  readonly zContent = input.required<TemplateRef<unknown>>();
  readonly zPlacement = input<ZardPopoverPlacement>('bottom');
  readonly zAlign = input<ZardPopoverAlign>('center');
  readonly zSideOffset = input(4, { transform: numberAttribute });
  readonly zAlignOffset = input(0, { transform: numberAttribute });
  readonly zOrigin = input<ElementRef>();
  readonly zVisible = input<boolean>(false);
  readonly zOverlayClickable = input<boolean>(true);
  readonly zVisibleChange = output<boolean>();

  protected readonly isVisible = signal(false);
  protected readonly contentId = signal<string | null>(null);

  get nativeElement() {
    return this.zOrigin()?.nativeElement ?? this.elementRef.nativeElement;
  }

  constructor() {
    toObservable(this.zVisible)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(visible => {
        const currentlyVisible = this.isVisible();
        if (visible && !currentlyVisible) {
          this.show();
        } else if (!visible && currentlyVisible) {
          this.hide();
        }
      });

    toObservable(this.zTrigger)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(trigger => {
        if (this.listeners.length) {
          this.unlistenAll();
        }
        this.setupTriggers();
        this.overlayRefSubscription?.unsubscribe();
        this.overlayRefSubscription = undefined;
        if (trigger === 'click') {
          this.subscribeToOverlayRef();
        }
      });
  }

  ngOnInit() {
    this.createOverlay();
  }

  ngOnDestroy() {
    this.unlistenAll();
    this.cancelPendingDetach();
    this.overlayRefSubscription?.unsubscribe();
    this.overlayRef?.dispose();
  }

  show() {
    if (this.isVisible()) {
      return;
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    const reopening = this.overlayRef?.hasAttached() ?? false;
    if (reopening) {
      // The exit animation is still running: reuse the attached portal instead of creating a second one.
      this.cancelPendingDetach();
    }

    this.positionStrategy?.withPositions(this.getPositions());

    if (reopening) {
      this.overlayRef?.updatePosition();
    } else {
      this.overlayRef?.attach(new TemplatePortal(this.zContent(), this.viewContainerRef));
    }

    this.isVisible.set(true);
    this.applyOpenState();
    this.zVisibleChange.emit(true);
  }

  hide() {
    this.close(this.isFocusWithinOverlay());
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  private close(restoreFocus: boolean) {
    if (!this.isVisible()) {
      return;
    }

    const content = this.contentElement();
    if (content) {
      this.renderer.removeAttribute(content, 'data-open');
      this.renderer.setAttribute(content, 'data-closed', '');
    }

    this.isVisible.set(false);
    this.contentId.set(null);

    if (restoreFocus) {
      this.nativeElement?.focus?.();
    }

    this.scheduleDetach(content);
    this.zVisibleChange.emit(false);
  }

  private createOverlay() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.nativeElement)
      .withPositions(this.getPositions())
      .withPush(false)
      .withFlexibleDimensions(false)
      .withViewportMargin(8);

    this.positionStrategy = positionStrategy;

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    // Mirrors the `isolate z-50` the shadcn positioner puts on its own wrapper.
    this.overlayRef.addPanelClass(['isolate', 'z-50']);

    positionStrategy.positionChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(change => this.applyPosition(change.connectionPair));

    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === 'Escape' && this.isVisible()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => {
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
      });
  }

  private subscribeToOverlayRef(): void {
    if (
      this.zOverlayClickable() &&
      this.zTrigger() === 'click' &&
      isPlatformBrowser(this.platformId) &&
      this.overlayRef
    ) {
      this.overlayRefSubscription = this.overlayRef
        .outsidePointerEvents()
        .pipe(filter(event => !this.nativeElement.contains(event.target)))
        .subscribe(() => this.hide());
    }
  }

  private setupTriggers() {
    const trigger = this.zTrigger();
    if (!trigger) {
      return;
    }

    if (trigger === 'click') {
      this.listeners.push(this.renderer.listen(this.nativeElement, 'click.stop', () => this.toggle()));
    } else if (trigger === 'hover') {
      this.listeners.push(this.renderer.listen(this.nativeElement, 'mouseenter', () => this.show()));

      this.listeners.push(this.renderer.listen(this.nativeElement, 'mouseleave', () => this.hide()));
    }
  }

  private unlistenAll(): void {
    for (const listener of this.listeners) {
      listener();
    }
    this.listeners = [];
  }

  private getPositions(): ConnectedPosition[] {
    const placement = this.zPlacement();
    const align = this.zAlign();
    const sideOffset = this.zSideOffset();
    const alignOffset = this.zAlignOffset();

    return [placement, ...FALLBACK_PLACEMENTS[placement]].map(fallback =>
      buildPosition(fallback, align, sideOffset, alignOffset),
    );
  }

  /**
   * The template portal is attached straight into the overlay pane, so the styled content element is looked up by
   * its slot. Falls back to the pane itself when the consumer does not use `z-popover`.
   */
  private contentElement(): HTMLElement | null {
    const pane = this.overlayRef?.overlayElement;
    if (!pane) {
      return null;
    }
    return pane.querySelector<HTMLElement>(CONTENT_SELECTOR) ?? pane;
  }

  private applyOpenState(): void {
    const content = this.contentElement();
    if (!content) {
      return;
    }

    this.renderer.removeAttribute(content, 'data-closed');
    this.renderer.setAttribute(content, 'data-open', '');

    if (!content.hasAttribute('data-side')) {
      const [primary] = this.getPositions();
      this.applyPosition(primary);
    }

    this.contentId.set(content.getAttribute('id'));
  }

  private applyPosition(position: ConnectedPosition): void {
    const content = this.contentElement();
    if (!content) {
      return;
    }

    const side = this.resolveSide(position);
    const align = this.resolveAlign(position, side);

    this.renderer.setAttribute(content, 'data-side', side);
    this.renderer.setAttribute(content, 'data-align', align);
    this.renderer.setStyle(
      content,
      '--transform-origin',
      transformOriginFor(side, align),
      RendererStyleFlags2.DashCase,
    );
  }

  private resolveSide(position: ConnectedPosition): ZardPopoverPlacement {
    const inline = isInlinePlacement(this.zPlacement());

    if (position.originY === 'top' && position.overlayY === 'bottom') {
      return 'top';
    }
    if (position.originY === 'bottom' && position.overlayY === 'top') {
      return 'bottom';
    }
    if (position.originX === 'start' && position.overlayX === 'end') {
      return inline ? 'inline-start' : 'left';
    }
    return inline ? 'inline-end' : 'right';
  }

  private resolveAlign(position: ConnectedPosition, side: ZardPopoverPlacement): ZardPopoverAlign {
    if (isVerticalPlacement(side)) {
      return position.overlayX;
    }
    if (position.overlayY === 'top') {
      return 'start';
    }
    if (position.overlayY === 'bottom') {
      return 'end';
    }
    return 'center';
  }

  private isFocusWithinOverlay(): boolean {
    const pane = this.overlayRef?.overlayElement;
    const active = this.document.activeElement;
    return !!pane && !!active && pane.contains(active);
  }

  private scheduleDetach(content: HTMLElement | null): void {
    this.cancelPendingDetach();

    if (!this.overlayRef?.hasAttached()) {
      return;
    }

    if (!content || this.prefersReducedMotion()) {
      this.overlayRef.detach();
      return;
    }

    this.animationListener = this.renderer.listen(content, 'animationend', (event: AnimationEvent) => {
      if (event.target === content) {
        this.detachNow();
      }
    });

    // happy-dom never fires `animationend`, so the timer is the only guaranteed path in tests.
    this.detachTimer = setTimeout(() => this.detachNow(), ZARD_POPOVER_ANIMATION_DURATION);
  }

  private detachNow(): void {
    this.cancelPendingDetach();
    this.overlayRef?.detach();
  }

  private cancelPendingDetach(): void {
    if (this.detachTimer !== undefined) {
      clearTimeout(this.detachTimer);
      this.detachTimer = undefined;
    }
    this.animationListener?.();
    this.animationListener = undefined;
  }

  private prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    return this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}

@Component({
  selector: 'z-popover-title, [z-popover-title]',
  imports: [ZardIdDirective],
  template: `
    <ng-container zardId="popover-title" #uniqueId="zardId" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-title',
    '[attr.id]': 'id()',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverTitle',
})
export class ZardPopoverTitleComponent {
  readonly class = input<ClassValue>('');

  private readonly uniqueId = viewChild<ZardIdDirective>('uniqueId');

  readonly id = computed(() => this.uniqueId()?.id() ?? null);

  protected readonly classes = computed(() => mergeClasses(popoverTitleVariants(), this.class()));
}

@Component({
  selector: 'z-popover-description, [z-popover-description]',
  imports: [ZardIdDirective],
  template: `
    <ng-container zardId="popover-description" #uniqueId="zardId" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-description',
    '[attr.id]': 'id()',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverDescription',
})
export class ZardPopoverDescriptionComponent {
  readonly class = input<ClassValue>('');

  private readonly uniqueId = viewChild<ZardIdDirective>('uniqueId');

  readonly id = computed(() => this.uniqueId()?.id() ?? null);

  protected readonly classes = computed(() => mergeClasses(popoverDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-popover-header, [z-popover-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-header',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverHeader',
})
export class ZardPopoverHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(popoverHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-popover, [z-popover]',
  imports: [ZardIdDirective],
  template: `
    <ng-container zardId="popover" #uniqueId="zardId" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-content',
    role: 'dialog',
    '[attr.id]': 'id()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverContent',
})
export class ZardPopoverComponent {
  readonly class = input<ClassValue>('');

  private readonly uniqueId = viewChild<ZardIdDirective>('uniqueId');
  private readonly title = contentChild(ZardPopoverTitleComponent);
  private readonly description = contentChild(ZardPopoverDescriptionComponent);

  readonly id = computed(() => this.uniqueId()?.id() ?? null);

  protected readonly labelledBy = computed(() => this.title()?.id() ?? null);
  protected readonly describedBy = computed(() => this.description()?.id() ?? null);

  protected readonly classes = computed(() => mergeClasses(popoverVariants(), this.class()));
}
