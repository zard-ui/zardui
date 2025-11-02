import { type ConnectedPosition, Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
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

import { merge, Subject, takeUntil } from 'rxjs';

import { popoverVariants } from './popover.variants';
import { mergeClasses } from '../../shared/utils/utils';

export type ZardPopoverTrigger = 'click' | 'hover' | null;
export type ZardPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

const POPOVER_POSITIONS_MAP = {
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
  exportAs: 'zPopover',
  standalone: true,
})
export class ZardPopoverDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly hidePopover$ = new Subject<void>();
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;

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
    // Watch for changes to zVisible input
    // Using untracked for isVisible to avoid circular dependencies
    effect(() => {
      const visible = this.zVisible();

      // Defer DOM manipulation to avoid change detection issues
      setTimeout(() => {
        const currentlyVisible = this.isVisible();
        if (visible && !currentlyVisible) {
          this.show();
        } else if (!visible && currentlyVisible) {
          this.hide();
        }
      });
    });
  }

  ngOnInit() {
    this.setupTriggers();
    this.createOverlay();
  }

  ngOnDestroy() {
    this.hide();
    this.hidePopover$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  show() {
    if (this.isVisible()) return;

    if (!this.overlayRef) {
      this.createOverlay();
    }

    const templatePortal = new TemplatePortal(this.zContent(), this.viewContainerRef);
    this.overlayRef?.attach(templatePortal);
    this.isVisible.set(true);
    this.zVisibleChange.emit(true);

    if (this.zOverlayClickable() && this.zTrigger() === 'click' && isPlatformBrowser(this.platformId)) {
      this.setupOutsideClickListener();
    }
  }

  hide() {
    if (!this.isVisible()) return;

    this.hidePopover$.next();
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

  private setupTriggers() {
    const trigger = this.zTrigger();
    if (!trigger) return;

    if (trigger === 'click') {
      this.renderer.listen(this.nativeElement, 'click', (event: Event) => {
        event.stopPropagation();
        this.toggle();
      });
    } else if (trigger === 'hover') {
      this.renderer.listen(this.nativeElement, 'mouseenter', () => {
        this.show();
      });

      this.renderer.listen(this.nativeElement, 'mouseleave', () => {
        this.hide();
      });
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

  private getPositions(): ConnectedPosition[] {
    const placement = this.zPlacement();
    const positions: ConnectedPosition[] = [];

    // Primary position
    const primaryConfig = POPOVER_POSITIONS_MAP[placement];
    positions.push({
      originX: primaryConfig.originX as any,
      originY: primaryConfig.originY as any,
      overlayX: primaryConfig.overlayX as any,
      overlayY: primaryConfig.overlayY as any,
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

  private setupOutsideClickListener() {
    if (!this.overlayRef) return;

    this.overlayRef
      .outsidePointerEvents()
      .pipe(takeUntil(merge(this.hidePopover$, this.destroy$)))
      .subscribe(event => {
        const clickTarget = event.target as HTMLElement;

        if (this.nativeElement.contains(clickTarget)) {
          return;
        }

        this.hide();
      });
  }
}

@Component({
  selector: 'z-popover',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardPopoverComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() => mergeClasses(popoverVariants(), this.class()));
}
