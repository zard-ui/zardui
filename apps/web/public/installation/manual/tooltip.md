

```angular-ts title="tooltip.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  NgModule,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  TemplateRef,
} from '@angular/core';

import { merge, Subject, take, takeUntil } from 'rxjs';

import { TOOLTIP_POSITIONS_MAP, type ZardTooltipPositions } from './tooltip-positions';
import { tooltipVariants } from './tooltip.variants';
import { mergeClasses } from '../../shared/utils/utils';

export type ZardTooltipTriggers = 'click' | 'hover';

@Directive({
  selector: '[zTooltip]',
  host: {
    style: 'cursor: pointer',
  },
  exportAs: 'zTooltip',
})
export class ZardTooltipDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private componentRef?: ComponentRef<ZardTooltipComponent>;
  private scrollListenerRef?: () => void;

  readonly zTooltip = input<string | TemplateRef<void> | null>(null);
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

    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([TOOLTIP_POSITIONS_MAP[this.zPosition()]]);
      this.overlayRef = this.overlay.create({ positionStrategy });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  show() {
    if (this.componentRef) return;

    const tooltipText = this.zTooltip();
    if (!tooltipText) return;

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    if (!this.componentRef) return;

    this.componentRef.instance.setProps(tooltipText, this.zPosition(), this.zTrigger());
    this.componentRef.instance.state.set('opened');

    this.componentRef.instance.onLoad$.pipe(take(1)).subscribe(() => {
      this.zOnShow.emit();

      switch (this.zTrigger()) {
        case 'click':
          if (!this.overlayRef) return;

          this.overlayRef
            .outsidePointerEvents()
            .pipe(takeUntil(merge(this.destroy$, this.overlayRef.detachments())))
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
  imports: [NgTemplateOutlet],
  template: `
    @if (templateContent) {
      <ng-container *ngTemplateOutlet="templateContent" />
    } @else if (stringContent) {
      {{ stringContent }}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
  },
})
export class ZardTooltipComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly elementRef = inject(ElementRef);

  protected readonly position = signal<ZardTooltipPositions>('top');
  private readonly trigger = signal<ZardTooltipTriggers>('hover');
  protected text: string | TemplateRef<void> | null = null;

  readonly state = signal<'closed' | 'opened'>('closed');

  private onLoadSubject$ = new Subject<void>();
  onLoad$ = this.onLoadSubject$.asObservable();

  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));

  ngOnInit(): void {
    this.onLoadSubject$.next();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.onLoadSubject$.complete();
  }

  setProps(text: string | TemplateRef<void> | null, position: ZardTooltipPositions, trigger: ZardTooltipTriggers) {
    if (text) this.text = text;
    this.position.set(position);
    this.trigger.set(trigger);
  }

  get templateContent(): TemplateRef<void> | null {
    return this.text instanceof TemplateRef ? this.text : null;
  }

  get stringContent(): string | null {
    return typeof this.text === 'string' ? this.text : null;
  }
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
  'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]',
);
export type ZardTooltipVariants = VariantProps<typeof tooltipVariants>;

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

export type ZardTooltipPositions = 'top' | 'bottom' | 'left' | 'right';

```

