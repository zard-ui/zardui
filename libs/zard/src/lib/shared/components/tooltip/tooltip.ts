import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  NgModule,
  numberAttribute,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  runInInjectionContext,
  signal,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, map, of, Subject, switchMap, tap, timer } from 'rxjs';

import { TOOLTIP_POSITIONS_MAP } from '@/shared/components/tooltip/tooltip-positions';
import {
  tooltipPositionVariants,
  tooltipVariants,
  type ZardTooltipPositionVariants,
} from '@/shared/components/tooltip/tooltip.variants';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { generateId, mergeClasses } from '@/shared/utils/merge-classes';

export type ZardTooltipTriggers = 'click' | 'hover';
export type ZardTooltipType = string | TemplateRef<void> | null;

interface DelayConfig {
  isShow: boolean;
  delay: number;
}

const throttle = (callback: () => void, wait: number) => {
  let time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      callback();
      time = Date.now();
    }
  };
};

@Directive({
  selector: '[zTooltip]',
  host: {
    style: 'cursor: pointer',
  },
  exportAs: 'zTooltip',
})
export class ZardTooltipDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  private delaySubject?: Subject<DelayConfig>;
  private componentRef?: ComponentRef<ZardTooltipComponent>;
  private listenersRefs: (() => void)[] = [];
  private overlayRef?: OverlayRef;
  private readonly tooltipId = `${generateId('z-tooltip')}`;

  readonly zPosition = input<ZardTooltipPositionVariants>('top');
  readonly zTrigger = input<ZardTooltipTriggers>('hover');
  readonly zTooltip = input<ZardTooltipType>(null);
  readonly zShowDelay = input(150, { transform: numberAttribute });
  readonly zHideDelay = input(100, { transform: numberAttribute });

  readonly zShow = output<void>();
  readonly zHide = output<void>();

  private readonly tooltipText = computed<string | TemplateRef<void>>(() => {
    let tooltipText = this.zTooltip();
    if (!tooltipText) {
      return '';
    } else if (typeof tooltipText === 'string') {
      tooltipText = tooltipText.trim();
    }
    return tooltipText;
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([TOOLTIP_POSITIONS_MAP[this.zPosition()]]);
      this.overlayRef = this.overlay.create({ positionStrategy });

      runInInjectionContext(this.injector, () => {
        toObservable(this.zTrigger)
          .pipe(
            tap(() => {
              this.setupDelayMechanism();
              this.cleanupTriggerEvents();
              this.initTriggers();
            }),
            filter(() => !!this.overlayRef),
            switchMap(() => (this.overlayRef as OverlayRef).outsidePointerEvents()),
            filter(event => !this.elementRef.nativeElement.contains(event.target)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => this.delay(false, 0));
      });
    }
  }

  ngOnDestroy(): void {
    this.delaySubject?.complete();
    this.cleanupTriggerEvents();
    this.overlayRef?.dispose();
  }

  private initTriggers() {
    this.initScrollListener();
    this.initClickListeners();
    this.initHoverListeners();
  }

  private initClickListeners(): void {
    if (this.zTrigger() !== 'click') {
      return;
    }

    this.listenersRefs = [
      ...this.listenersRefs,
      this.renderer.listen(this.elementRef.nativeElement, 'click', () => {
        const shouldShowTooltip = !this.overlayRef?.hasAttached();
        const delay = shouldShowTooltip ? this.zShowDelay() : this.zHideDelay();
        this.delay(shouldShowTooltip, delay);
      }),
    ];
  }

  private initHoverListeners(): void {
    if (this.zTrigger() !== 'hover') {
      return;
    }

    this.listenersRefs = [
      ...this.listenersRefs,
      this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', () => this.delay(true, this.zShowDelay())),
      this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => this.delay(false, this.zHideDelay())),
      this.renderer.listen(this.elementRef.nativeElement, 'focus', () => this.delay(true, this.zShowDelay())),
      this.renderer.listen(this.elementRef.nativeElement, 'blur', () => this.delay(false, this.zHideDelay())),
    ];
  }

  private initScrollListener(): void {
    this.listenersRefs = [
      ...this.listenersRefs,
      this.renderer.listen(
        this.document.defaultView,
        'scroll',
        throttle(() => this.delay(false, 0), 100),
      ),
    ];
  }

  private cleanupTriggerEvents(): void {
    for (const eventRef of this.listenersRefs) {
      eventRef();
    }
    this.listenersRefs = [];
  }

  private delay(isShow: boolean, delay = -1): void {
    this.delaySubject?.next({ isShow, delay });
  }

  private setupDelayMechanism(): void {
    this.delaySubject?.complete();
    this.delaySubject = new Subject<DelayConfig>();

    this.delaySubject
      .pipe(
        switchMap(config => (config.delay < 0 ? of(config) : timer(config.delay).pipe(map(() => config)))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(config => {
        if (config.isShow) {
          this.show();
        } else {
          this.hide();
        }
      });
  }

  private show() {
    if (this.componentRef || !this.tooltipText()) {
      return;
    }

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    this.componentRef?.onDestroy(() => {
      this.componentRef = undefined;
    });
    this.componentRef?.instance.setProps(this.tooltipText(), this.zPosition(), this.tooltipId);
    this.componentRef?.instance.state.set('opened');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', this.tooltipId);
    this.zShow.emit();
  }

  private hide() {
    if (!this.componentRef) {
      return;
    }

    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
    this.componentRef.instance.state.set('closed');
    this.zHide.emit();
    this.overlayRef?.detach();
  }
}

@Component({
  selector: 'z-tooltip',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    <ng-container *zStringTemplateOutlet="tooltipText()">{{ tooltipText() }}</ng-container>

    <span [class]="arrowClasses()">
      <svg
        class="bg-foreground fill-foreground z-50 block size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]"
        width="10"
        height="5"
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 30,0 15,10" />
      </svg>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.id]': 'tooltipId()',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
    role: 'tooltip',
  },
})
export class ZardTooltipComponent {
  protected readonly position = signal<ZardTooltipPositionVariants>('top');
  protected readonly tooltipText = signal<ZardTooltipType>(null);
  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));
  protected readonly arrowClasses = computed(() =>
    mergeClasses(tooltipPositionVariants({ position: this.position() })),
  );

  protected readonly tooltipId = signal('');

  readonly state = signal<'closed' | 'opened'>('closed');

  setProps(tooltipText: ZardTooltipType, position: ZardTooltipPositionVariants, tooltipId = '') {
    if (tooltipText) {
      this.tooltipText.set(tooltipText);
    }
    this.position.set(position);
    this.tooltipId.set(tooltipId);
  }
}

@NgModule({
  imports: [OverlayModule, ZardTooltipComponent, ZardTooltipDirective],
  exports: [ZardTooltipComponent, ZardTooltipDirective],
})
export class ZardTooltipModule {}
