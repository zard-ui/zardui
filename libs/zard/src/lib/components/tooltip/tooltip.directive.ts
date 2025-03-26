import { take } from 'rxjs';

import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, inject, input, OnInit, output, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TOOLTIP_POSITIONS_MAP, ZardTooltipPositions } from './tooltip-positions';
import { ZardTooltipComponent } from './tooltip.component';

export type ZardTooltipTriggers = 'click' | 'hover';

@Directive({
  selector: '[zTooltip]',
  host: {
    style: 'cursor: pointer',
  },
})
export class ZardTooltipDirective implements OnInit {
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private renderer = inject(Renderer2);

  private overlayRef?: OverlayRef;
  private componentRef?: ComponentRef<ZardTooltipComponent>;
  private scrollListenerRef?: () => void;

  readonly zTooltip = input<string>('');
  readonly zPosition = input<ZardTooltipPositions>('top');
  readonly zTrigger = input<ZardTooltipTriggers>('hover');

  readonly zOnShow = output<void>();
  readonly zOnHide = output<void>();

  get nativeElement() {
    return this.elementRef.nativeElement;
  }

  get overlayElement() {
    return this.componentRef?.instance.elementRef.nativeElement;
  }

  ngOnInit() {
    this.setTriggers();

    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef).withPositions([TOOLTIP_POSITIONS_MAP[this.zPosition()]]);
    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  show() {
    if (this.componentRef) return;

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    if (!this.componentRef) return;

    this.componentRef.instance.setProps(this.zTooltip(), this.zPosition(), this.zTrigger());
    this.componentRef.instance.state.set('opened');

    this.componentRef.instance.onLoad$.pipe(take(1)).subscribe(() => {
      this.zOnShow.emit();

      switch (this.zTrigger()) {
        case 'click':
          this.componentRef?.instance
            .overlayClickOutside()
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.hide());
          break;
        case 'hover':
          this.renderer.listen(
            this.elementRef.nativeElement,
            'mouseleave',
            (event: Event) => {
              event.preventDefault();
              this.hide();
            },
            { once: true },
          );
          break;
      }
    });

    this.scrollListenerRef = this.renderer.listen(window, 'scroll', () => {
      this.hide(0);
    });
  }

  hide(animationDuration = 150) {
    if (!this.componentRef) return;

    this.componentRef.instance.state.set('closed');

    setTimeout(() => {
      this.zOnHide.emit();

      this.overlayRef?.detach();
      this.componentRef?.destroy();
      this.componentRef = undefined;

      if (this.scrollListenerRef) this.scrollListenerRef();
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
