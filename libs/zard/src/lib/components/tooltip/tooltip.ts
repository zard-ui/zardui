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
  input,
  NgModule,
  OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { TOOLTIP_POSITIONS_MAP } from './tooltip-positions';
import { tooltipPositionVariants, tooltipVariants, ZardTooltipPositionVariants } from './tooltip.variants';
import { mergeClasses } from '../../shared/utils/utils';

export type ZardTooltipTriggers = 'click' | 'hover';
export type ZardTooltipType = string | TemplateRef<void> | null;

@Directive({
  selector: '[zTooltip]',
  exportAs: 'zTooltip',
})
export class ZardTooltipDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  private overlayRef!: OverlayRef;
  private componentRef!: ComponentRef<ZardTooltipComponent> | undefined;
  private listenersRefs: (() => void)[] = [];

  readonly zPosition = input<ZardTooltipPositionVariants>('top');
  readonly zTrigger = input<ZardTooltipTriggers>('hover');
  readonly zTooltip = input<ZardTooltipType>(null);
  readonly zShowDelay = input(150);
  readonly zHideDelay = input(100);

  private delayTimer?: ReturnType<typeof setTimeout>;
  private isClosingClick = false;

  readonly zShow = output<void>();
  readonly zHide = output<void>();

  constructor() {
    toObservable(this.zTrigger)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cleanupTriggerEvents(); // in case input changes previous events need to be cleaned
        this.initTriggers(this.zTrigger() === 'click' ? 'click' : 'mouseenter');
      });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([TOOLTIP_POSITIONS_MAP[this.zPosition()]]);
      this.overlayRef = this.overlay.create({ positionStrategy });

      if (this.zTrigger() === 'click') {
        this.overlayRef
          .outsidePointerEvents()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.delay(false, this.zHideDelay()));
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupTriggerEvents();
  }

  private show() {
    let tooltipText = this.zTooltip();
    if (typeof tooltipText === 'string') {
      tooltipText = tooltipText.trim();
    }

    if (!tooltipText || this.componentRef) {
      return;
    }

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    this.componentRef.onDestroy(() => {
      this.isClosingClick = false;
      this.componentRef = undefined;
    });
    this.componentRef.instance.setProps(tooltipText, this.zPosition());
    this.componentRef.instance.state.set('opened');
    this.zShow.emit();
  }

  private hide() {
    if (!this.componentRef) return;

    this.componentRef?.instance.state.set('closed');
    this.zHide.emit();

    this.overlayRef?.detach();
    this.componentRef?.destroy();
  }

  private delay(isShow: boolean, delay = -1, isClosingClick = false): void {
    if (this.delayTimer) {
      this.clearTogglingTimer();
    } else if (delay >= 0) {
      this.delayTimer = setTimeout(() => {
        this.delayTimer = undefined;
        this.isClosingClick = isClosingClick;
        if (isShow) {
          this.show();
        } else {
          this.hide();
        }
      }, delay);
    }
  }

  private clearTogglingTimer(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = undefined;
    }
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
        class="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]"
        width="10"
        height="5"
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
        style="display: block;"
      >
        <polygon points="0,0 30,0 15,10" />
      </svg>
    </span>
  `,
  host: {
    '[class]': 'classes()',
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

  state = signal<'closed' | 'opened'>('closed');

  setProps(tooltipText: ZardTooltipType, position: ZardTooltipPositionVariants) {
    if (tooltipText) {
      this.tooltipText.set(tooltipText);
    }
    this.position.set(position);
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
