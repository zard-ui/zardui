

```angular-ts title="tooltip.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  Injector,
  input,
  NgModule,
  OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  runInInjectionContext,
  signal,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { EMPTY, exhaustMap, map, of, Subject, switchMap, tap, timer } from 'rxjs';

import { TOOLTIP_POSITIONS_MAP } from './tooltip-positions';
import { tooltipPositionVariants, tooltipVariants, ZardTooltipPositionVariants } from './tooltip.variants';
import { generateId, mergeClasses } from '../../shared/utils/utils';

export type ZardTooltipTriggers = 'click' | 'hover';
export type ZardTooltipType = string | TemplateRef<void> | null;

interface DelayConfig {
  isShow: boolean;
  delay: number;
  isClosingClick: boolean;
}

@Directive({
  selector: '[zTooltip]',
  exportAs: 'zTooltip',
})
export class ZardTooltipDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  private delaySubject!: Subject<DelayConfig> | undefined;
  private componentRef!: ComponentRef<ZardTooltipComponent> | undefined;
  private isClosingClick = false;
  private listenersRefs: (() => void)[] = [];
  private overlayRef!: OverlayRef;
  private readonly tooltipId = `${generateId('z-tooltip')}`;
  readonly zPosition = input<ZardTooltipPositionVariants>('top');
  readonly zTrigger = input<ZardTooltipTriggers>('hover');
  readonly zTooltip = input<ZardTooltipType>(null);
  readonly zShowDelay = input(150);
  readonly zHideDelay = input(100);

  readonly zShow = output<void>();
  readonly zHide = output<void>();

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([TOOLTIP_POSITIONS_MAP[this.zPosition()]]);
      this.overlayRef = this.overlay.create({ positionStrategy });

      runInInjectionContext(this.injector, () => {
        toObservable(this.zTrigger)
          .pipe(
            tap(trigger => {
              this.setupDelayMechanism();
              this.cleanupTriggerEvents();
              this.initTriggers(trigger === 'click' ? 'click' : 'mouseenter');
            }),
            switchMap(trigger =>
              trigger === 'click' ? this.overlayRef.outsidePointerEvents().pipe(map(() => trigger)) : EMPTY,
            ),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => this.delay(false, this.zHideDelay()));
      });
    }
  }

  ngOnDestroy(): void {
    this.delaySubject?.complete();
    this.cleanupTriggerEvents();
    this.overlayRef?.dispose();
  }

  private show() {
    if (this.componentRef) {
      return;
    }

    let tooltipText = this.zTooltip();
    if (typeof tooltipText === 'string') {
      tooltipText = tooltipText.trim();
    }

    if (!tooltipText) {
      this.isClosingClick = false;
      return;
    }

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    this.componentRef.onDestroy(() => {
      this.isClosingClick = false;
      this.componentRef = undefined;
    });
    this.componentRef.instance.setProps(tooltipText, this.zPosition(), this.tooltipId);
    this.componentRef.instance.state.set('opened');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', this.tooltipId);
    this.zShow.emit();
  }

  private hide() {
    if (!this.componentRef) return;

    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
    this.componentRef?.instance.state.set('closed');
    this.zHide.emit();

    this.overlayRef?.detach();
    this.componentRef?.destroy();
  }

  private delay(isShow: boolean, delay = -1, isClosingClick = false): void {
    this.delaySubject?.next({ isShow, delay, isClosingClick });
  }

  private setupDelayMechanism(): void {
    this.delaySubject?.complete();
    this.delaySubject = new Subject<DelayConfig>();

    const delayOperator = this.zTrigger() === 'click' ? exhaustMap : switchMap;
    this.delaySubject
      .pipe(
        delayOperator(config => (config.delay < 0 ? of(config) : timer(config.delay).pipe(map(() => config)))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(config => {
        this.isClosingClick = config.isClosingClick;
        if (config.isShow) {
          this.show();
        } else {
          this.hide();
        }
      });
  }

  private initTriggers(showTriggerEvent: string) {
    this.listenersRefs = [
      this.renderer.listen(this.elementRef.nativeElement, showTriggerEvent, () => {
        if (showTriggerEvent !== 'click' || !this.isClosingClick) {
          this.delay(true, this.zShowDelay(), showTriggerEvent === 'click');
        }
      }),
      this.renderer.listen(this.document.defaultView, 'scroll', () => this.delay(false, 0)),
    ];

    if (this.zTrigger() === 'hover') {
      this.listenersRefs = [
        ...this.listenersRefs,
        this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => this.delay(false, this.zHideDelay())),
        this.renderer.listen(this.elementRef.nativeElement, 'focus', () => this.delay(true, this.zShowDelay())),
        this.renderer.listen(this.elementRef.nativeElement, 'blur', () => this.delay(false, this.zHideDelay())),
      ];
    }
  }

  private cleanupTriggerEvents(): void {
    for (const eventRef of this.listenersRefs) {
      eventRef();
    }
    this.listenersRefs = [];
  }
}

@Component({
  selector: 'z-tooltip',
  imports: [NgTemplateOutlet],
  template: `
    @if (templateContent()) {
      <ng-container *ngTemplateOutlet="templateContent()" />
    } @else if (stringContent()) {
      {{ stringContent() }}
    }
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
  host: {
    '[class]': 'classes()',
    '[attr.id]': 'tooltipId()',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
    role: 'tooltip',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardTooltipComponent {
  protected position = signal<ZardTooltipPositionVariants>('top');
  protected tooltipText = signal<ZardTooltipType>(null);
  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));
  protected readonly arrowClasses = computed(() =>
    mergeClasses(tooltipPositionVariants({ position: this.position() })),
  );

  protected tooltipId = signal('');

  state = signal<'closed' | 'opened'>('closed');

  setProps(tooltipText: ZardTooltipType, position: ZardTooltipPositionVariants, tooltipId = '') {
    if (tooltipText) {
      this.tooltipText.set(tooltipText);
    }
    this.position.set(position);
    this.tooltipId.set(tooltipId);
  }

  protected readonly templateContent = computed(() =>
    this.tooltipText() instanceof TemplateRef ? (this.tooltipText() as TemplateRef<void>) : null,
  );

  protected readonly stringContent = computed(() =>
    typeof this.tooltipText() === 'string' ? this.tooltipText() : null,
  );
}

@NgModule({
  imports: [OverlayModule, ZardTooltipComponent, ZardTooltipDirective],
  exports: [ZardTooltipComponent, ZardTooltipDirective],
})
export class ZardTooltipModule {}

```



```angular-ts title="tooltip.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva(
  'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
);
export type ZardTooltipVariants = VariantProps<typeof tooltipVariants>;

export const tooltipPositionVariants = cva('absolute', {
  variants: {
    position: {
      top: 'bottom-0 translate-y-full left-[calc(50%-5px)]',
      bottom: '-top-2.5 translate-y-0 rotate-180 left-[calc(50%-5px)]',
      left: 'top-[calc(50%-5px)] rotate-270 translate-y-0 -right-2.5',
      right: 'top-[calc(50%-5px)] translate-y-0 rotate-90 -left-2.5',
    },
  },
});

export type ZardTooltipPositionVariants = NonNullable<VariantProps<typeof tooltipPositionVariants>['position']>;

```



```angular-ts title="tooltip-positions.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ConnectedPosition } from '@angular/cdk/overlay';

export const TOOLTIP_POSITIONS_MAP: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -8,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 8,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -8,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
  },
};

```

