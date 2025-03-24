import { Subject, takeUntil } from 'rxjs';

import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, inject, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { TOOLTIP_POSITIONS_MAP, ZardTooltipPositions } from './tooltip-positions';
import { ZardTooltipComponent } from './tooltip.component';

export type ZardTooltipTriggers = 'click' | 'hover';

@Directive({
  selector: '[zTooltip]',
  host: {
    style: 'cursor: pointer',
  },
})
export class ZardTooltipDirective implements OnInit, OnDestroy {
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private renderer = inject(Renderer2);

  private readonly destroy$ = new Subject<void>();
  private overlayRef?: OverlayRef;
  private componentRef?: ComponentRef<ZardTooltipComponent>;

  readonly zTooltip = input<string>('');
  readonly zPosition = input<ZardTooltipPositions>('top');
  readonly zTrigger = input<ZardTooltipTriggers>('hover');

  ngOnInit() {
    this.setTriggers();
    this.renderer.listen(window, 'scroll', () => {
      this.hide(0);
    });

    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef).withPositions([TOOLTIP_POSITIONS_MAP[this.zPosition()]]);
    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  show() {
    if (this.componentRef) return;

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    if (!this.componentRef) return;

    this.componentRef.instance.setProps(this.zTooltip(), this.zPosition(), this.zTrigger());
    this.componentRef.instance.state.set('opened');

    this.componentRef.instance.elementRef.nativeElement.addEventListener(
      'animationend',
      () => {
        switch (this.zTrigger()) {
          case 'click':
            this.componentRef?.instance
              .overlayClickOutside()
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => this.hide());
            break;
          case 'hover':
            this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', (event: Event) => {
              event.preventDefault();
              this.hide();
            });
            break;
        }
      },
      { once: true },
    );
  }

  hide(animationDuration = 150) {
    this.componentRef?.instance.state.set('closed');

    setTimeout(() => {
      this.overlayRef?.detach();
      this.componentRef?.destroy();
      this.componentRef = undefined;
    }, animationDuration);
  }

  private setTriggers() {
    const showTrigger = this.zTrigger() === 'click' ? 'click' : 'mouseenter';
    this.renderer.listen(this.elementRef.nativeElement, showTrigger, (event: Event) => {
      event.preventDefault();
      this.show();
    });
  }
}
