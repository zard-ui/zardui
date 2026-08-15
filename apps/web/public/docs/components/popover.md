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
import {
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  RendererStyleFlags2,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import type { ClassValue } from 'clsx';
import { filter, type Subscription } from 'rxjs';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  popoverDescriptionVariants,
  popoverHeaderVariants,
  popoverTitleVariants,
  popoverVariants,
} from './popover.variants';

export type ZardPopoverTrigger = 'click' | 'hover' | null;
export type ZardPopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
export type ZardPopoverAlign = 'start' | 'center' | 'end';

/**
 * Kept in sync with the `duration-100` utility of `popoverVariants`. The exit animation runs for this long
 * before the overlay is detached, so tests must advance timers by this exact amount.
 */
export const ZARD_POPOVER_ANIMATION_DURATION = 100;

const CONTENT_SELECTOR = '[data-slot="popover-content"]';

const FALLBACK_PLACEMENTS: Record<ZardPopoverPlacement, ZardPopoverPlacement[]> = {
  top: ['bottom', 'right', 'left'],
  bottom: ['top', 'right', 'left'],
  left: ['right', 'bottom', 'top'],
  right: ['left', 'bottom', 'top'],
  'inline-start': ['inline-end', 'bottom', 'top'],
  'inline-end': ['inline-start', 'bottom', 'top'],
};

const ALIGN_TO_VERTICAL = { start: 'top', center: 'center', end: 'bottom' } as const;
const ALIGN_TO_ORIGIN_X = { start: 'left', center: 'center', end: 'right' } as const;
const ALIGN_TO_ORIGIN_Y = { start: 'top', center: 'center', end: 'bottom' } as const;

function isVerticalPlacement(placement: ZardPopoverPlacement): boolean {
  return placement === 'top' || placement === 'bottom';
}

function isInlinePlacement(placement: ZardPopoverPlacement): boolean {
  return placement === 'inline-start' || placement === 'inline-end';
}

function buildPosition(
  placement: ZardPopoverPlacement,
  align: ZardPopoverAlign,
  sideOffset: number,
  alignOffset: number,
): ConnectedPosition {
  if (isVerticalPlacement(placement)) {
    const isTop = placement === 'top';
    return {
      originX: align,
      originY: isTop ? 'top' : 'bottom',
      overlayX: align,
      overlayY: isTop ? 'bottom' : 'top',
      offsetX: alignOffset,
      offsetY: isTop ? -sideOffset : sideOffset,
    };
  }

  const isStart = placement === 'left' || placement === 'inline-start';
  const verticalAlign = ALIGN_TO_VERTICAL[align];
  return {
    originX: isStart ? 'start' : 'end',
    originY: verticalAlign,
    overlayX: isStart ? 'end' : 'start',
    overlayY: verticalAlign,
    offsetX: isStart ? -sideOffset : sideOffset,
    offsetY: alignOffset,
  };
}

function transformOriginFor(side: ZardPopoverPlacement, align: ZardPopoverAlign): string {
  switch (side) {
    case 'top':
      return `${ALIGN_TO_ORIGIN_X[align]} bottom`;
    case 'bottom':
      return `${ALIGN_TO_ORIGIN_X[align]} top`;
    case 'left':
    case 'inline-start':
      return `right ${ALIGN_TO_ORIGIN_Y[align]}`;
    default:
      return `left ${ALIGN_TO_ORIGIN_Y[align]}`;
  }
}

@Directive({
  selector: '[zPopover]',
  standalone: true,
  host: {
    'data-slot': 'popover-trigger',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'isVisible()',
    '[attr.aria-controls]': 'contentId()',
  },
  exportAs: 'zPopover',
})
export class ZardPopoverDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private positionStrategy?: FlexibleConnectedPositionStrategy;
  private overlayRefSubscription?: Subscription;
  private listeners: (() => void)[] = [];
  private animationListener?: () => void;
  private detachTimer?: ReturnType<typeof setTimeout>;

  readonly zTrigger = input<ZardPopoverTrigger>('click');
  readonly zContent = input.required<TemplateRef<unknown>>();
  readonly zPlacement = input<ZardPopoverPlacement>('bottom');
  readonly zAlign = input<ZardPopoverAlign>('center');
  readonly zSideOffset = input(4, { transform: numberAttribute });
  readonly zAlignOffset = input(0, { transform: numberAttribute });
  readonly zOrigin = input<ElementRef>();
  readonly zVisible = input<boolean>(false);
  readonly zOverlayClickable = input<boolean>(true);
  readonly zVisibleChange = output<boolean>();

  protected readonly isVisible = signal(false);
  protected readonly contentId = signal<string | null>(null);

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
    this.cancelPendingDetach();
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

    const reopening = this.overlayRef?.hasAttached() ?? false;
    if (reopening) {
      // The exit animation is still running: reuse the attached portal instead of creating a second one.
      this.cancelPendingDetach();
    }

    this.positionStrategy?.withPositions(this.getPositions());

    if (reopening) {
      this.overlayRef?.updatePosition();
    } else {
      this.overlayRef?.attach(new TemplatePortal(this.zContent(), this.viewContainerRef));
    }

    this.isVisible.set(true);
    this.applyOpenState();
    this.zVisibleChange.emit(true);
  }

  hide() {
    this.close(this.isFocusWithinOverlay());
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  private close(restoreFocus: boolean) {
    if (!this.isVisible()) {
      return;
    }

    const content = this.contentElement();
    if (content) {
      this.renderer.removeAttribute(content, 'data-open');
      this.renderer.setAttribute(content, 'data-closed', '');
    }

    this.isVisible.set(false);
    this.contentId.set(null);

    if (restoreFocus) {
      this.nativeElement?.focus?.();
    }

    this.scheduleDetach(content);
    this.zVisibleChange.emit(false);
  }

  private createOverlay() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.nativeElement)
      .withPositions(this.getPositions())
      .withPush(false)
      .withFlexibleDimensions(false)
      .withViewportMargin(8);

    this.positionStrategy = positionStrategy;

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    // Mirrors the `isolate z-50` the shadcn positioner puts on its own wrapper.
    this.overlayRef.addPanelClass(['isolate', 'z-50']);

    positionStrategy.positionChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(change => this.applyPosition(change.connectionPair));

    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === 'Escape' && this.isVisible()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => {
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
      });
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
    const align = this.zAlign();
    const sideOffset = this.zSideOffset();
    const alignOffset = this.zAlignOffset();

    return [placement, ...FALLBACK_PLACEMENTS[placement]].map(fallback =>
      buildPosition(fallback, align, sideOffset, alignOffset),
    );
  }

  /**
   * The template portal is attached straight into the overlay pane, so the styled content element is looked up by
   * its slot. Falls back to the pane itself when the consumer does not use `z-popover`.
   */
  private contentElement(): HTMLElement | null {
    const pane = this.overlayRef?.overlayElement;
    if (!pane) {
      return null;
    }
    return pane.querySelector<HTMLElement>(CONTENT_SELECTOR) ?? pane;
  }

  private applyOpenState(): void {
    const content = this.contentElement();
    if (!content) {
      return;
    }

    this.renderer.removeAttribute(content, 'data-closed');
    this.renderer.setAttribute(content, 'data-open', '');

    if (!content.hasAttribute('data-side')) {
      const [primary] = this.getPositions();
      this.applyPosition(primary);
    }

    this.contentId.set(content.getAttribute('id'));
  }

  private applyPosition(position: ConnectedPosition): void {
    const content = this.contentElement();
    if (!content) {
      return;
    }

    const side = this.resolveSide(position);
    const align = this.resolveAlign(position, side);

    this.renderer.setAttribute(content, 'data-side', side);
    this.renderer.setAttribute(content, 'data-align', align);
    this.renderer.setStyle(
      content,
      '--transform-origin',
      transformOriginFor(side, align),
      RendererStyleFlags2.DashCase,
    );
  }

  private resolveSide(position: ConnectedPosition): ZardPopoverPlacement {
    const inline = isInlinePlacement(this.zPlacement());

    if (position.originY === 'top' && position.overlayY === 'bottom') {
      return 'top';
    }
    if (position.originY === 'bottom' && position.overlayY === 'top') {
      return 'bottom';
    }
    if (position.originX === 'start' && position.overlayX === 'end') {
      return inline ? 'inline-start' : 'left';
    }
    return inline ? 'inline-end' : 'right';
  }

  private resolveAlign(position: ConnectedPosition, side: ZardPopoverPlacement): ZardPopoverAlign {
    if (isVerticalPlacement(side)) {
      return position.overlayX;
    }
    if (position.overlayY === 'top') {
      return 'start';
    }
    if (position.overlayY === 'bottom') {
      return 'end';
    }
    return 'center';
  }

  private isFocusWithinOverlay(): boolean {
    const pane = this.overlayRef?.overlayElement;
    const active = this.document.activeElement;
    return !!pane && !!active && pane.contains(active);
  }

  private scheduleDetach(content: HTMLElement | null): void {
    this.cancelPendingDetach();

    if (!this.overlayRef?.hasAttached()) {
      return;
    }

    if (!content || this.prefersReducedMotion()) {
      this.overlayRef.detach();
      return;
    }

    this.animationListener = this.renderer.listen(content, 'animationend', (event: AnimationEvent) => {
      if (event.target === content) {
        this.detachNow();
      }
    });

    // happy-dom never fires `animationend`, so the timer is the only guaranteed path in tests.
    this.detachTimer = setTimeout(() => this.detachNow(), ZARD_POPOVER_ANIMATION_DURATION);
  }

  private detachNow(): void {
    this.cancelPendingDetach();
    this.overlayRef?.detach();
  }

  private cancelPendingDetach(): void {
    if (this.detachTimer !== undefined) {
      clearTimeout(this.detachTimer);
      this.detachTimer = undefined;
    }
    this.animationListener?.();
    this.animationListener = undefined;
  }

  private prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    return this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}

@Component({
  selector: 'z-popover-title, [z-popover-title]',
  imports: [ZardIdDirective],
  standalone: true,
  template: `
    <ng-container zardId="popover-title" #uniqueId="zardId" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-title',
    '[attr.id]': 'id()',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverTitle',
})
export class ZardPopoverTitleComponent {
  readonly class = input<ClassValue>('');

  private readonly uniqueId = viewChild<ZardIdDirective>('uniqueId');

  readonly id = computed(() => this.uniqueId()?.id() ?? null);

  protected readonly classes = computed(() => mergeClasses(popoverTitleVariants(), this.class()));
}

@Component({
  selector: 'z-popover-description, [z-popover-description]',
  imports: [ZardIdDirective],
  standalone: true,
  template: `
    <ng-container zardId="popover-description" #uniqueId="zardId" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-description',
    '[attr.id]': 'id()',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverDescription',
})
export class ZardPopoverDescriptionComponent {
  readonly class = input<ClassValue>('');

  private readonly uniqueId = viewChild<ZardIdDirective>('uniqueId');

  readonly id = computed(() => this.uniqueId()?.id() ?? null);

  protected readonly classes = computed(() => mergeClasses(popoverDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-popover-header, [z-popover-header]',
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-header',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverHeader',
})
export class ZardPopoverHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(popoverHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-popover, [z-popover]',
  imports: [ZardIdDirective],
  standalone: true,
  template: `
    <ng-container zardId="popover" #uniqueId="zardId" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'popover-content',
    role: 'dialog',
    '[attr.id]': 'id()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()',
    '[class]': 'classes()',
  },
  exportAs: 'zPopoverContent',
})
export class ZardPopoverComponent {
  readonly class = input<ClassValue>('');

  private readonly uniqueId = viewChild<ZardIdDirective>('uniqueId');
  private readonly title = contentChild(ZardPopoverTitleComponent);
  private readonly description = contentChild(ZardPopoverDescriptionComponent);

  readonly id = computed(() => this.uniqueId()?.id() ?? null);

  protected readonly labelledBy = computed(() => this.title()?.id() ?? null);
  protected readonly describedBy = computed(() => this.description()?.id() ?? null);

  protected readonly classes = computed(() => mergeClasses(popoverVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva(
  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
);

export const popoverHeaderVariants = cva('flex flex-col gap-0.5 text-sm');

export const popoverTitleVariants = cva('font-medium');

export const popoverDescriptionVariants = cva('text-muted-foreground');

export type ZardPopoverVariants = VariantProps<typeof popoverVariants>;
```

```angular-ts
export * from './popover.component';
export * from './popover.imports';
export * from './popover.variants';
```

```angular-ts
export {
  ZardPopoverComponent,
  ZardPopoverDescriptionComponent,
  ZardPopoverDirective,
  ZardPopoverHeaderComponent,
  ZardPopoverTitleComponent,
} from '@/shared/components/popover/popover.component';

import {
  ZardPopoverComponent,
  ZardPopoverDescriptionComponent,
  ZardPopoverDirective,
  ZardPopoverHeaderComponent,
  ZardPopoverTitleComponent,
} from '@/shared/components/popover/popover.component';

export const ZardPopoverImports = [
  ZardPopoverDirective,
  ZardPopoverComponent,
  ZardPopoverHeaderComponent,
  ZardPopoverTitleComponent,
  ZardPopoverDescriptionComponent,
] as const;
```

## Usage

```angular-ts
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';
```

```angular-html
<button z-button zType="outline" zPopover [zContent]="popoverContent">Open popover</button>
<ng-template #popoverContent>
  <z-popover>
    <div z-popover-header>
      <h4 z-popover-title>Title</h4>
      <p z-popover-description>Description text here.</p>
    </div>
  </z-popover>
</ng-template>
```

## Composition

```text
button[zPopover]
└── ng-template
    └── z-popover
        └── div[z-popover-header]
            ├── h4[z-popover-title]
            └── p[z-popover-description]
```

## Examples

### Basic

A popover with a header, a title and a description, aligned to the start of the trigger.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-basic-demo',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zAlign="start" zType="outline" class="w-fit" [zContent]="popoverContent">
      Open Popover
    </button>

    <ng-template #popoverContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverBasicComponent {}
```

### Align

Use `zAlign` to align the popover against the trigger.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-align-demo',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <div class="flex gap-6">
      @for (alignment of alignments; track alignment.align) {
        <button
          type="button"
          z-button
          zPopover
          zSize="sm"
          zType="outline"
          [zAlign]="alignment.align"
          [zContent]="popoverContent"
        >
          {{ alignment.label }}
        </button>

        <ng-template #popoverContent>
          <z-popover class="w-40">{{ alignment.content }}</z-popover>
        </ng-template>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverAlignComponent {
  readonly alignments = [
    { align: 'start', label: 'Start', content: 'Aligned to start' },
    { align: 'center', label: 'Center', content: 'Aligned to center' },
    { align: 'end', label: 'End', content: 'Aligned to end' },
  ] as const;
}
```

### Form

A popover holding a form built with the `z-field` components.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-form-demo',
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardFieldImports, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zAlign="start" zType="outline" [zContent]="popoverContent">
      Open Popover
    </button>

    <ng-template #popoverContent>
      <z-popover class="w-64">
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>

        <div z-field-group class="gap-4">
          <div z-field zOrientation="horizontal">
            <label z-field-label for="form-width" class="w-1/2">Width</label>
            <input z-input type="text" id="form-width" value="100%" />
          </div>

          <div z-field zOrientation="horizontal">
            <label z-field-label for="form-height" class="w-1/2">Height</label>
            <input z-input type="text" id="form-height" value="25px" />
          </div>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverFormComponent {}
```

### Placement

Use `zPlacement` to choose the side the popover opens on.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-placement-demo',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <div class="flex flex-col space-y-2">
      <button type="button" z-button zPopover zPlacement="top" zType="outline" [zContent]="popoverContent">Top</button>

      <div class="flex space-x-2">
        <button type="button" z-button zPopover zPlacement="left" zType="outline" [zContent]="popoverContent">
          Left
        </button>
        <button type="button" z-button zPopover zPlacement="right" zType="outline" [zContent]="popoverContent">
          Right
        </button>
      </div>

      <button type="button" z-button zPopover zPlacement="bottom" zType="outline" [zContent]="popoverContent">
        Bottom
      </button>
    </div>

    <ng-template #popoverContent>
      <z-popover class="w-64">
        <div z-popover-header>
          <h4 z-popover-title>Placement</h4>
          <p z-popover-description>The popover flips automatically when it does not fit.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPlacementComponent {}
```

### Hover

Set `zTrigger="hover"` to open the popover on pointer enter.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-hover-demo',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zTrigger="hover" zType="outline" [zContent]="popoverContent">
      Hover me
    </button>

    <ng-template #popoverContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Hover content</h4>
          <p z-popover-description>This popover appears when you hover over the button.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverHoverComponent {}
```

### Interactive

Control the popover programmatically through `show()`, `hide()` and `toggle()`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverDirective } from '@/shared/components/popover/popover.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-interactive-demo',
  imports: [FormsModule, ZardButtonComponent, ZardInputComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="interactiveContent" #popoverTrigger>
      Settings
    </button>

    <ng-template #interactiveContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Settings</h4>
          <p z-popover-description>Manage your account settings.</p>
        </div>

        <div class="space-y-2">
          <label for="interactive-width" class="text-sm font-medium">Width</label>
          <input id="interactive-width" z-input type="text" placeholder="100%" class="w-full" [(ngModel)]="width" />
        </div>

        <div class="space-y-2">
          <label for="interactive-height" class="text-sm font-medium">Height</label>
          <input id="interactive-height" z-input type="text" placeholder="25px" class="w-full" [(ngModel)]="height" />
        </div>

        <button type="button" z-button class="w-full" zSize="sm" (click)="saveChanges()">Save changes</button>
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
| `zPlacement` | Side of the trigger the popover opens on. `inline-start` and `inline-end` follow the text direction | `'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-start' \| 'inline-end'` | `'bottom'` |
| `zAlign` | Alignment of the popover along the side of the trigger | `'start' \| 'center' \| 'end'` | `'center'` |
| `zSideOffset` | Distance in pixels between the popover and the trigger | `number` | `4` |
| `zAlignOffset` | Offset in pixels along the alignment axis | `number` | `0` |
| `zOrigin` | Custom anchor element | `ElementRef` | `-` |
| `zVisible` | Control visibility programmatically | `boolean` | `false` |
| `zOverlayClickable` | Close on outside click | `boolean` | `true` |
| `zVisibleChange` | Emits when visibility changes. Fires immediately, before the exit animation ends | `EventEmitter<boolean>` |  |

### z-popover

The popover content. Exposes `data-side`, `data-align` and `data-open`/`data-closed` while it is mounted.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |

### z-popover-header

Groups the title and the description at the top of the popover.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |

### z-popover-title

The popover title. Wired to the content through `aria-labelledby`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |

### z-popover-description

The popover description. Wired to the content through `aria-describedby`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/popover)
