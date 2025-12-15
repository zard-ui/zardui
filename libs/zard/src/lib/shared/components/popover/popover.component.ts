import { type ConnectedPosition, Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  type TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, Subscription } from 'rxjs';

import { popoverVariants } from './popover.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

export type ZardPopoverTrigger = 'click' | 'hover' | null;
export type ZardPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

const POPOVER_POSITIONS_MAP: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetX: 0,
    offsetY: -8,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 8,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -8,
    offsetY: 0,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
    offsetY: 0,
  },
} as const;

@Directive({
  selector: '[zPopover]',
  standalone: true,
  exportAs: 'zPopover',
})
export class ZardPopoverDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private overlayRefSubscription?: Subscription;
  private listeners: (() => void)[] = [];

  readonly zTrigger = input<ZardPopoverTrigger>('click');
  readonly zContent = input.required<TemplateRef<unknown>>();
  readonly zPlacement = input<ZardPopoverPlacement>('bottom');
  readonly zOrigin = input<ElementRef>();
  readonly zVisible = input<boolean>(false);
  readonly zOverlayClickable = input<boolean>(true);
  readonly zVisibleChange = output<boolean>();

  private readonly isVisible = signal(false);

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

    const templatePortal = new TemplatePortal(this.zContent(), this.viewContainerRef);
    this.overlayRef?.attach(templatePortal);
    this.isVisible.set(true);
    this.zVisibleChange.emit(true);
  }

  hide() {
    if (!this.isVisible()) {
      return;
    }

    this.overlayRef?.detach();
    this.isVisible.set(false);
    this.zVisibleChange.emit(false);
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  private createOverlay() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.nativeElement)
        .withPositions(this.getPositions())
        .withPush(false)
        .withFlexibleDimensions(false)
        .withViewportMargin(8);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }
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
    const positions: ConnectedPosition[] = [];

    // Primary position
    const primaryConfig = POPOVER_POSITIONS_MAP[placement];
    positions.push({
      originX: primaryConfig.originX,
      originY: primaryConfig.originY,
      overlayX: primaryConfig.overlayX,
      overlayY: primaryConfig.overlayY,
      offsetX: primaryConfig.offsetX ?? 0,
      offsetY: primaryConfig.offsetY ?? 0,
    });

    // Fallback positions for better positioning when primary doesn't fit
    switch (placement) {
      case 'bottom':
        // Try top if bottom doesn't fit
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: -8,
        });
        // If neither top nor bottom work, try right
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
          offsetY: 0,
        });
        // Finally try left
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
          offsetY: 0,
        });
        break;
      case 'top':
        // Try bottom if top doesn't fit
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 8,
        });
        // If neither top nor bottom work, try right
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
          offsetY: 0,
        });
        // Finally try left
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
          offsetY: 0,
        });
        break;
      case 'right':
        // Try left if right doesn't fit
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
          offsetY: 0,
        });
        // If neither left nor right work, try bottom
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 8,
        });
        // Finally try top
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: -8,
        });
        break;
      case 'left':
        // Try right if left doesn't fit
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
          offsetY: 0,
        });
        // If neither left nor right work, try bottom
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 8,
        });
        // Finally try top
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: -8,
        });
        break;
    }

    return positions;
  }
}

@Component({
  selector: 'z-popover',
  imports: [],
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardPopoverComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() => mergeClasses(popoverVariants(), this.class()));
}
