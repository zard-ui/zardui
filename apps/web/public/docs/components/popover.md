---
title: Popover
description: Displays rich content in a portal, triggered by a button.
---

# Popover

Displays rich content in a portal, triggered by a button.

## Installation

### CLI

```bash
npx zard-cli@latest add popover
```

### Manual

```angular-ts
import { type ConnectedPosition, Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  type TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, type Subscription } from 'rxjs';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { popoverVariants } from './popover.variants';

export type ZardPopoverTrigger = 'click' | 'hover' | null;
export type ZardPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

const POPOVER_POSITIONS_MAP: { [key: string]: ConnectedPosition } = {
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
  exportAs: 'zPopover',
})
export class ZardPopoverDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private overlayRefSubscription?: Subscription;
  private listeners: (() => void)[] = [];

  readonly zTrigger = input<ZardPopoverTrigger>('click');
  readonly zContent = input.required<TemplateRef<unknown>>();
  readonly zPlacement = input<ZardPopoverPlacement>('bottom');
  readonly zOrigin = input<ElementRef>();
  readonly zVisible = input<boolean>(false);
  readonly zOverlayClickable = input<boolean>(true);
  readonly zVisibleChange = output<boolean>();

  private readonly isVisible = signal(false);

  get nativeElement() {
    return this.zOrigin()?.nativeElement ?? this.elementRef.nativeElement;
  }

  constructor() {
    toObservable(this.zVisible)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(visible => {
        const currentlyVisible = this.isVisible();
        if (visible && !currentlyVisible) {
          this.show();
        } else if (!visible && currentlyVisible) {
          this.hide();
        }
      });

    toObservable(this.zTrigger)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(trigger => {
        if (this.listeners.length) {
          this.unlistenAll();
        }
        this.setupTriggers();
        this.overlayRefSubscription?.unsubscribe();
        this.overlayRefSubscription = undefined;
        if (trigger === 'click') {
          this.subscribeToOverlayRef();
        }
      });
  }

  ngOnInit() {
    this.createOverlay();
  }

  ngOnDestroy() {
    this.unlistenAll();
    this.overlayRefSubscription?.unsubscribe();
    this.overlayRef?.dispose();
  }

  show() {
    if (this.isVisible()) {
      return;
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    const templatePortal = new TemplatePortal(this.zContent(), this.viewContainerRef);
    this.overlayRef?.attach(templatePortal);
    this.isVisible.set(true);
    this.zVisibleChange.emit(true);
  }

  hide() {
    if (!this.isVisible()) {
      return;
    }

    this.overlayRef?.detach();
    this.isVisible.set(false);
    this.zVisibleChange.emit(false);
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  private createOverlay() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.nativeElement)
        .withPositions(this.getPositions())
        .withPush(false)
        .withFlexibleDimensions(false)
        .withViewportMargin(8);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }
  }

  private subscribeToOverlayRef(): void {
    if (
      this.zOverlayClickable() &&
      this.zTrigger() === 'click' &&
      isPlatformBrowser(this.platformId) &&
      this.overlayRef
    ) {
      this.overlayRefSubscription = this.overlayRef
        .outsidePointerEvents()
        .pipe(filter(event => !this.nativeElement.contains(event.target)))
        .subscribe(() => this.hide());
    }
  }

  private setupTriggers() {
    const trigger = this.zTrigger();
    if (!trigger) {
      return;
    }

    if (trigger === 'click') {
      this.listeners.push(this.renderer.listen(this.nativeElement, 'click.stop', () => this.toggle()));
    } else if (trigger === 'hover') {
      this.listeners.push(this.renderer.listen(this.nativeElement, 'mouseenter', () => this.show()));

      this.listeners.push(this.renderer.listen(this.nativeElement, 'mouseleave', () => this.hide()));
    }
  }

  private unlistenAll(): void {
    for (const listener of this.listeners) {
      listener();
    }
    this.listeners = [];
  }

  private getPositions(): ConnectedPosition[] {
    const placement = this.zPlacement();
    const positions: ConnectedPosition[] = [];

    // Primary position
    const primaryConfig = POPOVER_POSITIONS_MAP[placement];
    positions.push({
      originX: primaryConfig.originX,
      originY: primaryConfig.originY,
      overlayX: primaryConfig.overlayX,
      overlayY: primaryConfig.overlayY,
      offsetX: primaryConfig.offsetX ?? 0,
      offsetY: primaryConfig.offsetY ?? 0,
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
}

@Component({
  selector: 'z-popover',
  imports: [],
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardPopoverComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() => mergeClasses(popoverVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva(
  'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export type ZardPopoverVariants = VariantProps<typeof popoverVariants>;
```

```angular-ts
export * from './popover.component';
export * from './popover.variants';
```

## Usage

```angular-ts
import { ZardPopoverDirective } from '@/shared/components/popover/popover.component';
```

```angular-html
<button z-button [zPopover]="popoverContent">Open popover</button>
<ng-template #popoverContent>
  <p>Place content for the popover here.</p>
</ng-template>
```

## Examples

### Default

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-default-demo',
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  standalone: true,
  template: `
    <button type="button" z-button zPopover [zContent]="popoverContent" zType="outline">Open popover</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="leading-none font-medium">Dimensions</h4>
          <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverDefaultComponent {}
```

### Hover

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-hover-demo',
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  standalone: true,
  template: `
    <button z-button zPopover [zContent]="popoverContent" zTrigger="hover" zType="outline">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="leading-none font-medium">Hover content</h4>
          <p class="text-muted-foreground text-sm">This popover appears when you hover over the button.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverHoverComponent {}
```

### Placement

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-placement-demo',
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  standalone: true,
  template: `
    <div class="flex flex-col space-y-2">
      <button z-button zPopover [zContent]="popoverContent" zPlacement="top" zType="outline">Top</button>

      <div class="flex space-x-2">
        <button z-button zPopover [zContent]="popoverContent" zPlacement="left" zType="outline">Left</button>
        <button z-button zPopover [zContent]="popoverContent" zPlacement="right" zType="outline">Right</button>
      </div>

      <button z-button zPopover [zContent]="popoverContent" zPlacement="bottom" zType="outline">Bottom</button>
    </div>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="leading-none font-medium">Popover content</h4>
          <p class="text-muted-foreground text-sm">This is the popover content.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPlacementComponent {}
```

### Interactive

```angular-ts
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputComponent } from '../../input/input.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-interactive-demo',
  imports: [FormsModule, ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective, ZardInputComponent],
  standalone: true,
  template: `
    <button z-button zPopover [zContent]="interactiveContent" zType="outline" #popoverTrigger>Settings</button>

    <ng-template #interactiveContent>
      <z-popover>
        <div class="space-y-4">
          <div class="space-y-2">
            <h4 class="leading-none font-medium">Settings</h4>
            <p class="text-muted-foreground text-sm">Manage your account settings.</p>
          </div>
          <div class="space-y-2">
            <label for="width" class="text-sm font-medium">Width</label>
            <input id="width" z-input type="text" placeholder="100%" class="w-full" [(ngModel)]="width" />
          </div>
          <div class="space-y-2">
            <label for="height" class="text-sm font-medium">Height</label>
            <input id="height" z-input type="text" placeholder="25px" class="w-full" [(ngModel)]="height" />
          </div>
          <button z-button class="w-full" zSize="sm" (click)="saveChanges()">Save changes</button>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverInteractiveComponent {
  readonly popoverDirective = viewChild.required('popoverTrigger', { read: ZardPopoverDirective });

  readonly width = signal('100%');
  readonly height = signal('25px');

  saveChanges() {
    console.log('Settings saved:', { width: this.width(), height: this.height() });
    this.popoverDirective().hide();
  }
}
```

## API Reference

### [zPopover]

The directive that creates a popover when applied to a trigger element.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zTrigger` | How the popover is triggered | `'click' \| 'hover' \| null` | `'click'` |
| `zContent` | Required. Template to display in the popover | `TemplateRef<unknown>` | `-` |
| `zPlacement` | Position relative to trigger | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `zOrigin` | Custom anchor element | `ElementRef` | `-` |
| `zVisible` | Control visibility programmatically | `boolean` | `false` |
| `zOverlayClickable` | Close on outside click | `boolean` | `true` |
| `zVisibleChange` | Emits when visibility changes | `EventEmitter<boolean>` |  |

### z-popover

The wrapper component for popover content styling.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/popover)
