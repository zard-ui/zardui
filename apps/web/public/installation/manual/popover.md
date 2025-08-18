

```angular-ts title="popover.component.ts" copyButton showLineNumbers
import { Subject } from 'rxjs';

import { ConnectedPosition, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { popoverVariants } from './popover.variants';

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
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private documentClickListenerRef?: () => void;

  readonly zTrigger = input<ZardPopoverTrigger>('click');
  readonly zContent = input.required<TemplateRef<unknown>>();
  readonly zPlacement = input<ZardPopoverPlacement>('bottom');
  readonly zOrigin = input<ElementRef>();
  readonly zVisible = input<boolean>(false);
  readonly zOverlayClickable = input<boolean>(true);
  readonly zVisibleChange = output<boolean>();

  private isVisible = signal(false);

  get nativeElement() {
    return this.zOrigin()?.nativeElement || this.elementRef.nativeElement;
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

    if (this.zOverlayClickable() && this.zTrigger() === 'click') {
      this.setupOutsideClickListener();
    }
  }

  hide() {
    if (!this.isVisible()) return;

    this.overlayRef?.detach();
    this.isVisible.set(false);
    this.zVisibleChange.emit(false);

    if (this.documentClickListenerRef) {
      this.documentClickListenerRef();
      this.documentClickListenerRef = undefined;
    }
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
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.nativeElement)
      .withPositions(this.getPositions())
      .withPush(true)
      .withFlexibleDimensions(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
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
      offsetX: primaryConfig.offsetX || 0,
      offsetY: primaryConfig.offsetY || 0,
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
    setTimeout(() => {
      this.documentClickListenerRef = this.renderer.listen(document, 'click', (event: MouseEvent) => {
        const clickTarget = event.target as HTMLElement;
        const overlayElement = this.overlayRef?.overlayElement;

        // Check if click is on the trigger element
        if (this.nativeElement.contains(clickTarget)) {
          return;
        }

        // Check if click is within the popover overlay
        if (overlayElement && overlayElement.contains(clickTarget)) {
          return;
        }

        // Check if click is within any CDK overlay (for select dropdowns, etc.)
        const isInCdkOverlay = clickTarget.closest('.cdk-overlay-container') !== null;
        if (isInCdkOverlay) {
          return;
        }

        // If none of the above, it's truly an outside click - hide the popover
        this.hide();
      });
    });
  }
}

@Component({
  selector: 'z-popover',
  standalone: true,
  imports: [CommonModule],
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

```



```angular-ts title="popover.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const popoverVariants = cva(
  'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export type ZardPopoverVariants = VariantProps<typeof popoverVariants>;

```

