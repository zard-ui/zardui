---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
---

# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Installation

### CLI

```bash
npx zard-cli@latest add tooltip
```

### Manual

```angular-ts
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  DestroyRef,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  numberAttribute,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  runInInjectionContext,
  signal,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, map, of, Subject, switchMap, tap, timer } from 'rxjs';

import { TOOLTIP_POSITIONS_MAP } from '@/shared/components/tooltip/tooltip-positions';
import {
  tooltipPositionVariants,
  tooltipVariants,
  type ZardTooltipPositionVariants,
} from '@/shared/components/tooltip/tooltip.variants';
import { ZardIdDirective } from '@/shared/core';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

export type ZardTooltipTriggers = 'click' | 'hover';
export type ZardTooltipType = string | TemplateRef<void> | null;

interface DelayConfig {
  isShow: boolean;
  delay: number;
}

/** Matches the `animate-out` duration applied by `tooltipVariants`. */
const TOOLTIP_EXIT_DURATION = 150;

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

  private ariaEffectRef?: ReturnType<typeof effect>;
  private componentRef?: ComponentRef<ZardTooltipComponent>;
  private delaySubject?: Subject<DelayConfig>;
  private detachTimeoutId?: ReturnType<typeof setTimeout>;
  private listenersRefs: (() => void)[] = [];
  private overlayRef?: OverlayRef;

  readonly zHideDelay = input(100, { transform: numberAttribute });
  readonly zPosition = input<ZardTooltipPositionVariants>('top');
  readonly zPositionOffset = input(4);
  readonly zShowDelay = input(150, { transform: numberAttribute });
  readonly zTrigger = input<ZardTooltipTriggers>('hover');
  readonly zTooltip = input<ZardTooltipType>(null);

  readonly zHide = output<void>();
  readonly zShow = output<void>();

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
      const position = TOOLTIP_POSITIONS_MAP[this.zPosition()];
      const positionOffset = this.zPositionOffset();
      if (this.zPosition() === 'top' || this.zPosition() === 'bottom') {
        position.offsetY = this.zPosition() === 'top' ? -positionOffset : positionOffset;
      } else {
        position.offsetX = this.zPosition() === 'left' ? -positionOffset : positionOffset;
      }
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([position]);
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
    // Clean up any pending effect
    if (this.ariaEffectRef) {
      this.ariaEffectRef.destroy();
      this.ariaEffectRef = undefined;
    }

    if (this.detachTimeoutId !== undefined) {
      clearTimeout(this.detachTimeoutId);
      this.detachTimeoutId = undefined;
    }

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
    if (!this.tooltipText()) {
      return;
    }

    // Re-entering the trigger while the exit animation is running: keep the
    // same overlay and animate it back in instead of detaching it.
    if (this.componentRef) {
      if (this.detachTimeoutId !== undefined) {
        clearTimeout(this.detachTimeoutId);
        this.detachTimeoutId = undefined;
        this.componentRef.instance.state.set('open');
      }
      return;
    }

    const tooltipPortal = new ComponentPortal(ZardTooltipComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    this.componentRef?.onDestroy(() => {
      this.componentRef = undefined;
    });
    this.componentRef?.instance.state.set('open');
    this.componentRef?.instance.setProps(this.tooltipText(), this.zPosition());
    runInInjectionContext(this.injector, () => {
      this.ariaEffectRef = effect(() => {
        const tooltipId = this.componentRef?.instance.uniqueId()?.id();
        if (tooltipId) {
          this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', tooltipId);
          this.ariaEffectRef?.destroy();
          this.ariaEffectRef = undefined;
        }
      });
    });
    this.zShow.emit();
  }

  private hide() {
    if (!this.componentRef || this.detachTimeoutId !== undefined) {
      return;
    }

    // Clean up any pending effect
    if (this.ariaEffectRef) {
      this.ariaEffectRef.destroy();
      this.ariaEffectRef = undefined;
    }

    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
    this.componentRef.instance.state.set('closed');
    this.zHide.emit();

    // Detach only once the exit animation has played out.
    this.detachTimeoutId = setTimeout(() => {
      this.detachTimeoutId = undefined;
      this.overlayRef?.detach();
    }, TOOLTIP_EXIT_DURATION);
  }
}

@Component({
  selector: 'z-tooltip',
  imports: [ZardStringTemplateOutletDirective, ZardIdDirective],
  template: `
    <ng-container *zStringTemplateOutlet="tooltipText()" zardId="tooltip" #z="zardId">{{ tooltipText() }}</ng-container>

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
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.id]': 'tooltipId()',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
    'data-slot': 'tooltip-content',
    role: 'tooltip',
  },
  exportAs: 'zTooltip',
})
export class ZardTooltipComponent {
  protected readonly arrowClasses = computed(() =>
    mergeClasses(tooltipPositionVariants({ position: this.position() })),
  );

  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));
  protected readonly position = signal<ZardTooltipPositionVariants>('top');
  readonly state = signal<'closed' | 'open'>('closed');
  readonly uniqueId = viewChild<ZardIdDirective>('z');
  protected readonly tooltipText = signal<ZardTooltipType>(null);
  protected readonly tooltipId = computed(() => this.uniqueId()?.id() ?? 'tooltip');

  setProps(tooltipText: ZardTooltipType, position: ZardTooltipPositionVariants) {
    if (tooltipText) {
      this.tooltipText.set(tooltipText);
    }
    this.position.set(position);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva(
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-lg data-[state=opened]:animate-in data-[state=opened]:fade-in-0 data-[state=opened]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
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

```angular-ts
export * from './tooltip';
export * from './tooltip.variants';
export * from './tooltip-positions';
export * from './tooltip.imports';
```

```angular-ts
import type { ConnectedPosition } from '@angular/cdk/overlay';

export const TOOLTIP_POSITIONS_MAP: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -4,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 4,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -4,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 4,
  },
};
```

```angular-ts
import { OverlayModule } from '@angular/cdk/overlay';

import { ZardTooltipComponent, ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

export const ZardTooltipImports = [ZardTooltipComponent, ZardTooltipDirective, OverlayModule] as const;
```

## Usage

```angular-ts
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
```

```angular-html
<button z-button zType="outline" zTooltip="Add to library">Hover</button>
```

## Examples

### Hover

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-hover',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipHoverComponent {}
```

### Click

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-click',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipClickComponent {}
```

### Position

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-position',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <div class="flex flex-col space-y-2">
      <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="top">Top</button>

      <div class="flex space-x-2">
        <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="left">Left</button>
        <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="right">Right</button>
      </div>

      <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="bottom">Bottom</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipPositionComponent {}
```

### With Keyboard Shortcut

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardKbdComponent } from '@/shared/components/kbd';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'z-demo-tooltip-with-kbd',
  imports: [NgIcon, ZardButtonComponent, ZardTooltipDirective, ZardKbdComponent],
  template: `
    <button type="button" z-button [zTooltip]="shortcutTip" zType="outline" zSize="icon-sm">
      <ng-icon name="lucideSave" />
    </button>

    <ng-template #shortcutTip>
      Save changes
      <z-kbd>S</z-kbd>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSave })],
})
export class ZardDemoTooltipWithKbdComponent {}
```

### Disabled Button

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-disabled-button',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <span zTooltip="This feature is currently unavailable" class="block" tabindex="0">
      <button type="button" z-button zType="outline" [zDisabled]="true">Disabled</button>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipDisabledButtonComponent {}
```

### Events

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-events',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <div class="flex w-25 flex-col gap-4">
      <button type="button" z-button zType="outline" zTooltip="Tooltip content" (zShow)="onShow()" (zHide)="onHide()">
        Events
      </button>

      <span class="text-sm">Event: {{ event }}</span>
    </div>
  `,
})
export class ZardDemoTooltipEventsComponent {
  protected event = 'none';

  protected onShow() {
    this.event = '(zShow)';
  }

  protected onHide() {
    this.event = '(zHide)';
  }
}
```

## API Reference

### [z-tooltip]

A directive that shows a tooltip popup on hover or click.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTooltip]` | The text content of tooltip | `string` | `-` |
| `[zPosition]` | The position of the tooltip | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `[zPositionOffset]` | The position of the tooltip offset | `number` | `4` |
| `[zTrigger]` | The tooltip trigger mode | `'hover' \| 'click'` | `'hover'` |
| `[zShowDelay]` | Delay showing the tooltip after trigger in milliseconds | `number` | `150` |
| `[zHideDelay]` | Delay hiding the tooltip after trigger in milliseconds | `number` | `100` |
| `(zShow)` | Emitted when the tooltip is shown | `output<void>` | `-` |
| `(zHide)` | Emitted when the tooltip is hidden | `output<void>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/tooltip)
