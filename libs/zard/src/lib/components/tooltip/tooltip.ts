import { filter, fromEvent, Subject, take } from 'rxjs';

import { Overlay, OverlayModule, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  NgModule,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { mergeClasses } from '../../shared/utils/utils';
import { TOOLTIP_POSITIONS_MAP, ZardTooltipPositions } from './tooltip-positions';
import { tooltipVariants } from './tooltip.variants';

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

@Component({
  selector: 'z-tooltip',
  template: `{{ text() }}`,
  host: {
    '[class]': 'classes()',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardTooltipComponent implements OnInit, OnDestroy {
  readonly elementRef = inject(ElementRef);

  private position = signal<ZardTooltipPositions>('top');
  private trigger = signal<ZardTooltipTriggers>('hover');
  protected text = signal<string>('');

  state = signal<'closed' | 'opened'>('closed');

  private onLoadSubject$ = new Subject<void>();
  onLoad$ = this.onLoadSubject$.asObservable();

  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));

  ngOnInit(): void {
    this.onLoadSubject$.next();
  }

  ngOnDestroy() {
    this.onLoadSubject$.complete();
  }

  overlayClickOutside() {
    return fromEvent<MouseEvent>(document, 'click').pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        return !this.elementRef.nativeElement.contains(clickTarget);
      }),
      takeUntilDestroyed(),
    );
  }

  setProps(text: string, position: ZardTooltipPositions, trigger: ZardTooltipTriggers) {
    this.text.set(text);
    this.position.set(position);
    this.trigger.set(trigger);
  }
}

@NgModule({
  imports: [CommonModule, OverlayModule, ZardTooltipComponent, ZardTooltipDirective],
  exports: [ZardTooltipComponent, ZardTooltipDirective],
})
export class ZardTooltipModule {}
