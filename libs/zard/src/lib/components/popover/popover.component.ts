import { Subject } from 'rxjs';

import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
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
  private scrollListenerRef?: () => void;
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

  ngOnInit() {
    this.setupTriggers();
    this.createOverlay();

    if (this.zVisible()) {
      this.show();
    }
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

    this.scrollListenerRef = this.renderer.listen(window, 'scroll', () => {
      this.updatePosition();
    });
  }

  hide() {
    if (!this.isVisible()) return;

    this.overlayRef?.detach();
    this.isVisible.set(false);
    this.zVisibleChange.emit(false);

    if (this.scrollListenerRef) {
      this.scrollListenerRef();
      this.scrollListenerRef = undefined;
    }

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
    const positionConfig = POPOVER_POSITIONS_MAP[this.zPlacement()];
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.nativeElement)
      .withPositions([
        {
          originX: positionConfig.originX,
          originY: positionConfig.originY,
          overlayX: positionConfig.overlayX,
          overlayY: positionConfig.overlayY,
          offsetX: positionConfig.offsetX || 0,
          offsetY: positionConfig.offsetY || 0,
        },
      ])
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  private updatePosition() {
    this.overlayRef?.updatePosition();
  }

  private setupOutsideClickListener() {
    setTimeout(() => {
      this.documentClickListenerRef = this.renderer.listen(document, 'click', (event: MouseEvent) => {
        const clickTarget = event.target as HTMLElement;
        const overlayElement = this.overlayRef?.overlayElement;

        if (!this.nativeElement.contains(clickTarget) && overlayElement && !overlayElement.contains(clickTarget)) {
          this.hide();
        }
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
