---
title: Drawer
description: A draggable panel that slides in from an edge of the screen.
---

# Drawer

A draggable panel that slides in from an edge of the screen.

## Installation

### CLI

```bash
npx zard-cli@latest add drawer
```

### Manual

```angular-ts
import { Overlay, OverlayConfig, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  untracked,
  ViewContainerRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import { ZardStringTemplateOutletDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { nextDrawerId, ZardDrawerHost } from './drawer-host';
import { ZardDrawerPanelComponent } from './drawer-panel.component';
import { hasOpenDrawer } from './drawer-stack';
import { DRAWER_DURATION, type ZardDrawerSnapPoint } from './drawer.utils';
import {
  DRAWER_BACKDROP_CLASSES,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerTitleVariants,
  type ZardDrawerPlacement,
} from './drawer.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A floating panel that slides in from an edge of the screen and can be swiped — flick it
 * away to dismiss, or drag it between snap points to peek and expand.
 *
 * Content is composed in the template, the same vocabulary the dialog uses:
 *
 * ```html
 * <z-drawer [(zVisible)]="visible">
 *   <z-drawer-header>
 *     <z-drawer-title>Title</z-drawer-title>
 *     <z-drawer-description>Description</z-drawer-description>
 *   </z-drawer-header>
 *   <z-drawer-footer>
 *     <button type="button" z-button z-drawer-close>Cancel</button>
 *   </z-drawer-footer>
 * </z-drawer>
 * ```
 */
@Component({
  selector: 'z-drawer',
  imports: [ZardDrawerPanelComponent],
  template: `
    <ng-template #panel>
      <z-drawer-panel
        [zPlacement]="zPlacement()"
        [zSnapPoints]="zSnapPoints()"
        [zSnapPoint]="zSnapPoint()"
        (zSnapPointChange)="zSnapPoint.set($event)"
        [zDismissible]="zDismissible()"
        [zHandle]="zHandle()"
        [zModal]="zModal()"
        [zState]="state()"
        [zDuration]="duration"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
        (closeRequested)="requestClose()"
      >
        <ng-content />
      </z-drawer-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDrawerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDrawerHost, useExisting: forwardRef(() => ZardDrawerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zDrawer',
})
export class ZardDrawerComponent extends ZardDrawerHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Edge of the screen the drawer slides from. */
  readonly zPlacement = input<ZardDrawerPlacement>('bottom');
  /** Snap sizes: `0–1` is a viewport fraction, above that pixels, strings keep their unit. */
  readonly zSnapPoints = input<readonly ZardDrawerSnapPoint[] | undefined>(undefined);
  /** Active snap point, two-way bound. Defaults to the first one. */
  readonly zSnapPoint = model<ZardDrawerSnapPoint | undefined>(undefined);
  /** Whether swiping, the mask and Escape can close the drawer. */
  readonly zDismissible = input(true, { transform: booleanAttribute });
  /** Renders the swipe handle. */
  readonly zHandle = input(false, { transform: booleanAttribute });
  /** Renders the mask and blocks the page behind. Set false for a non-modal drawer. */
  readonly zModal = input(true, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  /** Emitted once the drawer has finished its exit animation and is gone. */
  readonly zAfterClose = output<void>();
  /** Emitted once the drawer is attached to the DOM. */
  readonly zAfterOpen = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = DRAWER_DURATION;

  private overlayRef: OverlayRef | null = null;
  private disposeTimer: ReturnType<typeof setTimeout> | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private destroyed = false;

  constructor() {
    super();

    effect(() => {
      const visible = this.zVisible();
      untracked(() => (visible ? this.open() : this.startClose()));
    });

    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.dispose();
    });
  }

  requestClose(): void {
    if (!this.zDismissible()) {
      return;
    }
    this.zVisible.set(false);
  }

  private open(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Re-opening mid-exit: keep the same overlay and reverse the animation.
    if (this.overlayRef) {
      this.clearDisposeTimer();
      this.state.set('open');
      return;
    }

    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.state.set('open');

    const modal = this.zModal();
    // A drawer opening on top of another one gets a see-through mask: the drawer
    // underneath dims itself instead, so masks never stack up into a black screen.
    const nested = hasOpenDrawer();

    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: modal,
        backdropClass: nested ? ['bg-transparent'] : DRAWER_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: modal ? this.overlay.scrollStrategies.block() : this.overlay.scrollStrategies.noop(),
        disposeOnNavigation: true,
      }),
    );
    this.overlayRef = overlayRef;

    overlayRef.attach(new TemplatePortal(this.panel(), this.viewContainerRef));

    overlayRef.backdropClick().subscribe(() => this.requestClose());
    overlayRef
      .keydownEvents()
      .pipe(filter(event => ESCAPE_KEYS.includes(event.key)))
      .subscribe(event => {
        event.preventDefault();
        this.requestClose();
      });

    this.zAfterOpen.emit();
  }

  private startClose(): void {
    if (!this.overlayRef || this.disposeTimer !== null) {
      return;
    }

    this.state.set('closed');
    this.overlayRef.detachBackdrop();
    this.disposeTimer = setTimeout(() => this.dispose(), this.duration);
  }

  private dispose(): void {
    this.clearDisposeTimer();
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.dispose();
    this.overlayRef = null;

    if (this.previouslyFocused?.isConnected) {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;

    // Teardown disposes the overlay too, but the output is already gone by then.
    if (!this.destroyed) {
      this.zAfterClose.emit();
    }
  }

  private clearDisposeTimer(): void {
    if (this.disposeTimer === null) {
      return;
    }

    clearTimeout(this.disposeTimer);
    this.disposeTimer = null;
  }
}

@Component({
  selector: 'z-drawer-header, [z-drawer-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-header',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerHeader',
})
export class ZardDrawerHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(drawerHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-drawer-title, [z-drawer-title]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let title = zTitle();
    <ng-container *zStringTemplateOutlet="title">
      {{ title }}
      <ng-content />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-title',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerTitle',
})
export class ZardDrawerTitleComponent {
  private readonly drawer = inject(ZardDrawerHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextDrawerId('title');
  protected readonly classes = computed(() => mergeClasses(drawerTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.drawer?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.drawer?.titleId() === this.id) {
        this.drawer.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-drawer-description, [z-drawer-description]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let description = zDescription();
    <ng-container *zStringTemplateOutlet="description">
      {{ description }}
      <ng-content />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerDescription',
})
export class ZardDrawerDescriptionComponent {
  private readonly drawer = inject(ZardDrawerHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextDrawerId('description');
  protected readonly classes = computed(() => mergeClasses(drawerDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.drawer?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.drawer?.descriptionId() === this.id) {
        this.drawer.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-drawer-footer, [z-drawer-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerFooter',
})
export class ZardDrawerFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(drawerFooterVariants(), this.class()));
}

/** Closes the drawer it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-drawer-close]',
  host: {
    'data-slot': 'drawer-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zDrawerClose',
})
export class ZardDrawerCloseDirective {
  private readonly drawer = inject(ZardDrawerHost, { optional: true });

  protected onClick(): void {
    this.drawer?.requestClose();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The panel floats: it is inset from the viewport on every edge and fully rounded,
 * so the page stays visible around it. `m-2` is that inset — the enter/exit
 * transform in the component adds it back so the drawer still leaves the screen.
 */
export const drawerVariants = cva(
  [
    'group/drawer pointer-events-auto fixed z-50 m-2 flex min-h-0 flex-col',
    'rounded-3xl border border-popover bg-popover text-sm text-popover-foreground shadow-xl dark:border-border',
    'outline-none select-none will-change-transform',
  ],
  {
    variants: {
      zPlacement: {
        top: 'inset-x-0 top-0 origin-top',
        right: 'inset-y-0 right-0 w-3/4 origin-right flex-row sm:w-96',
        bottom: 'inset-x-0 bottom-0 origin-bottom',
        left: 'inset-y-0 left-0 w-3/4 origin-left flex-row sm:w-96',
      },
      /**
       * A drawer with snap points is laid out at full height and only translated, so
       * the content-driven height that caps a plain vertical drawer has to go.
       */
      zSnapping: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { zPlacement: ['top', 'bottom'], zSnapping: false, class: 'max-h-[calc(100dvh-6rem)]' },
      { zPlacement: ['top', 'bottom'], zSnapping: true, class: 'h-dvh' },
    ],
    defaultVariants: {
      zPlacement: 'bottom',
      zSnapping: false,
    },
  },
);

/**
 * The grab strip. It only reserves space — the pill itself is an `::after` drawn by
 * the panel's stylesheet, so the slot stays a single element in the DOM.
 */
export const drawerHandleVariants = cva('relative z-10 flex shrink-0 cursor-grab active:cursor-grabbing', {
  variants: {
    zPlacement: {
      top: 'order-last h-3 w-full items-start justify-center',
      right: 'h-full w-3 items-center justify-start',
      bottom: 'h-3 w-full items-end justify-center',
      left: 'order-last h-full w-3 items-center justify-end',
    },
  },
  defaultVariants: {
    zPlacement: 'bottom',
  },
});

/** Everything the consumer projects, kept scrollable and clipped by the panel radius. */
export const drawerBodyVariants = cva(
  'flex min-h-0 w-full flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] select-text',
);

export const drawerHeaderVariants = cva(
  'flex shrink-0 flex-col gap-0.5 p-4 pb-0 group-data-[axis=y]/drawer:text-center md:gap-1.5 md:text-left',
);

export const drawerTitleVariants = cva('text-base font-medium text-foreground');

export const drawerDescriptionVariants = cva('text-sm text-balance text-muted-foreground');

export const drawerFooterVariants = cva('mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0');

/** Mask classes handed to the CDK overlay backdrop. */
export const DRAWER_BACKDROP_CLASSES = [
  'bg-black/30',
  'supports-backdrop-filter:backdrop-blur-sm',
  'transition-opacity',
  'duration-450',
  'ease-[cubic-bezier(0.32,0.72,0,1)]',
];

export type ZardDrawerVariants = VariantProps<typeof drawerVariants>;
export type ZardDrawerPlacement = NonNullable<ZardDrawerVariants['zPlacement']>;
```

```angular-ts
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  type ComponentPortal,
  PortalModule,
  type TemplatePortal,
} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  ElementRef,
  type EmbeddedViewRef,
  type EventEmitter,
  forwardRef,
  inject,
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button';
import { noopFn } from '@/shared/utils/noop';

import { ZardDrawerHost } from './drawer-host';
import { ZardDrawerPanelComponent } from './drawer-panel.component';
import {
  ZardDrawerDescriptionComponent,
  ZardDrawerFooterComponent,
  ZardDrawerHeaderComponent,
  ZardDrawerTitleComponent,
} from './drawer.component';
import { DRAWER_DURATION, type ZardDrawerSnapPoint } from './drawer.utils';
import type { ZardDrawerPlacement } from './drawer.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;

/** Configuration accepted by {@link ZardDrawerService.create}. */
export class ZardDrawerOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  /** Whether to show the close button in the corner. */
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string | TemplateRef<void>;
  /** Whether swipe, mask and Escape can close the drawer. */
  zDismissible?: boolean;
  /** Animation duration (ms) used when closing. Defaults to 450 (matches the CSS transition). */
  zDuration?: number;
  /** Renders the swipe handle. */
  zHandle?: boolean;
  zHideFooter?: boolean;
  /** Renders the backdrop and traps the page behind the drawer. Set false for a non-modal drawer. */
  zMask?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zPlacement?: ZardDrawerPlacement = 'bottom';
  zSnapPoint?: ZardDrawerSnapPoint;
  zSnapPoints?: readonly ZardDrawerSnapPoint[];
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
}

/**
 * Container the {@link ZardDrawerService} attaches to the overlay. It renders the
 * configured header, footer and content around the shared drawer panel.
 *
 * @internal
 */
@Component({
  selector: 'z-drawer-container',
  imports: [
    NgIcon,
    PortalModule,
    ZardButtonComponent,
    ZardDrawerDescriptionComponent,
    ZardDrawerFooterComponent,
    ZardDrawerHeaderComponent,
    ZardDrawerPanelComponent,
    ZardDrawerTitleComponent,
  ],
  template: `
    <z-drawer-panel
      [zPlacement]="placement()"
      [zSnapPoints]="config.zSnapPoints"
      [zSnapPoint]="snapPoint()"
      (zSnapPointChange)="snapPoint.set($event)"
      [zDismissible]="dismissible()"
      [zHandle]="config.zHandle"
      [zModal]="config.zMask ?? true"
      [zState]="state()"
      [zDuration]="duration()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
      (closeRequested)="requestClose()"
    >
      <div class="relative flex min-h-0 w-full flex-1 flex-col">
        @if (config.zClosable ?? true) {
          <button
            type="button"
            data-testid="z-close-header-button"
            z-button
            zType="ghost"
            zSize="icon-sm"
            class="absolute top-3 right-3"
            (click)="cancelTriggered.emit()"
          >
            <ng-icon name="lucideX" class="size-4!" />
            <span class="sr-only">Close</span>
          </button>
        }

        @if (config.zTitle || config.zDescription) {
          <z-drawer-header>
            @if (config.zTitle) {
              <z-drawer-title data-testid="z-title" [zTitle]="config.zTitle" />
            }
            @if (config.zDescription) {
              <p z-drawer-description data-testid="z-description" [zDescription]="config.zDescription"></p>
            }
          </z-drawer-header>
        }

        <!-- min-h-0 lets the content area shrink below its intrinsic height, so scrollable
           content stays inside the drawer instead of pushing the footer past the viewport. -->
        <main [class]="contentClasses">
          <ng-template cdkPortalOutlet />

          @if (isStringContent()) {
            <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
            <div data-testid="z-content" [innerHTML]="config.zContent"></div>
          }
        </main>

        @if (!config.zHideFooter) {
          <z-drawer-footer>
            @if (config.zOkText !== null) {
              <button
                type="button"
                data-testid="z-ok-button"
                z-button
                [zType]="config.zOkDestructive ? 'destructive' : 'default'"
                [zDisabled]="config.zOkDisabled"
                (click)="okTriggered.emit()"
              >
                @if (config.zOkIcon) {
                  @if (isSvgString(config.zOkIcon)) {
                    <ng-icon [svg]="config.zOkIcon" class="size-4!" />
                  } @else {
                    <ng-icon [name]="config.zOkIcon" class="size-4!" />
                  }
                }

                {{ config.zOkText ?? 'OK' }}
              </button>
            }

            @if (config.zCancelText !== null) {
              <button
                type="button"
                data-testid="z-cancel-button"
                z-button
                zType="outline"
                (click)="cancelTriggered.emit()"
              >
                @if (config.zCancelIcon) {
                  @if (isSvgString(config.zCancelIcon)) {
                    <ng-icon [svg]="config.zCancelIcon" class="size-4!" />
                  } @else {
                    <ng-icon [name]="config.zCancelIcon" class="size-4!" />
                  }
                }

                {{ config.zCancelText ?? 'Cancel' }}
              </button>
            }
          </z-drawer-footer>
        }
      </div>
    </z-drawer-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDrawerContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDrawerHost, useExisting: forwardRef(() => ZardDrawerContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideX })],
  host: { style: 'display: contents' },
  exportAs: 'zDrawerContainer',
})
export class ZardDrawerContainerComponent<T, U> extends BasePortalOutlet implements ZardDrawerHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardDrawerOptions<T, U>);

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly snapPoint = signal<ZardDrawerSnapPoint | undefined>(this.config.zSnapPoint);

  protected readonly placement = computed(() => this.config.zPlacement ?? 'bottom');
  protected readonly dismissible = computed(() => this.config.zDismissible ?? true);
  protected readonly duration = computed(() => this.config.zDuration ?? DRAWER_DURATION);
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');
  /** The scroll region sits between the header and the footer, as shadcn's demos compose it. */
  protected readonly contentClasses = 'flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto p-4';

  protected isSvgString(icon: string): boolean {
    return /^\s*<svg/i.test(icon);
  }

  requestClose(): void {
    if (!this.dismissible()) {
      return;
    }
    this.cancelTriggered.emit();
  }

  /** Plays the exit animation. The ref disposes the overlay once it finishes. */
  leave(): void {
    this.state.set('closed');
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<C>(portal: ComponentPortal<C>): ComponentRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach drawer content after content is already attached');
    }
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach drawer content after content is already attached');
    }
    return this.portalOutlet().attachTemplatePortal(portal);
  }
}
```

```angular-ts
import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description a drawer points its ARIA attributes at. */
export function nextDrawerId(suffix: string): string {
  return `z-drawer-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-drawer` and the container the service opens,
 * so projected content (`z-drawer-title`, `[z-drawer-close]`, …) works the same in both.
 */
export abstract class ZardDrawerHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the drawer to close. Dismissible drawers close, the others stay put. */
  abstract requestClose(): void;
}
```

```angular-ts
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { DRAWER_STACK_PEEK, DRAWER_STACK_STEP, drawerDepth, popDrawerPanel, pushDrawerPanel } from './drawer-stack';
import {
  closingDirection,
  DRAWER_CLOSE_THRESHOLD,
  DRAWER_DURATION,
  DRAWER_VELOCITY_THRESHOLD,
  isInteractiveTarget,
  isScrollableAway,
  isVerticalPlacement,
  nearestSnapIndex,
  resolveSnapPoints,
  rubberband,
  type ZardDrawerSnapPoint,
} from './drawer.utils';
import { drawerBodyVariants, drawerHandleVariants, drawerVariants, type ZardDrawerPlacement } from './drawer.variants';

/** Movement (px) tolerated before a pointer press is treated as a swipe rather than a tap. */
const SWIPE_START_THRESHOLD = 3;

/**
 * The floating panel of a drawer: styling, the swipe handle, swipe physics, snap points,
 * nested stacking and the focus trap. Shared by the declarative `z-drawer` and by the
 * container the `ZardDrawerService` attaches, so both behave identically.
 *
 * @internal Compose `z-drawer` instead of using this directly.
 */
@Component({
  selector: 'z-drawer-panel',
  template: `
    @if (showHandle()) {
      <div data-slot="drawer-swipe-handle" aria-hidden="true" [class]="handleClasses()"></div>
    }

    <!-- A drawer with snap points is laid out at full height and translated, so the body is
         capped at the part that is actually on screen — otherwise its scroll area runs off it. -->
    <div #body data-slot="drawer-content" [class]="bodyClasses()" [style.max-height.px]="bodyHeight()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      --z-drawer-duration: 450ms;
      --z-drawer-ease: cubic-bezier(0.22, 1, 0.36, 1);
      /* Matches the m-2 inset in the variants: the panel has to travel that far extra to
         clear the screen, plus a couple of pixels so no edge peeks through mid-animation. */
      --z-drawer-inset: 0.5rem;
      --z-drawer-exit: calc(100% + var(--z-drawer-inset) + 2px);
      /* Fills the inset gap while the panel is dragged past its edge. Transparent by
         default, like shadcn — set it when the drawer should read as edge-to-edge. */
      --z-drawer-bleed: transparent;

      transition:
        translate var(--z-drawer-duration) var(--z-drawer-ease),
        transform var(--z-drawer-duration) var(--z-drawer-ease),
        filter var(--z-drawer-duration) var(--z-drawer-ease);
    }

    /* translate carries the enter/exit slide and transform the swipe offset and the nested
       stacking, so the inline styles never overwrite the animation (and vice versa). */
    @starting-style {
      :host([data-placement='top']) {
        translate: 0 calc(-1 * var(--z-drawer-exit));
      }
      :host([data-placement='bottom']) {
        translate: 0 var(--z-drawer-exit);
      }
      :host([data-placement='left']) {
        translate: calc(-1 * var(--z-drawer-exit)) 0;
      }
      :host([data-placement='right']) {
        translate: var(--z-drawer-exit) 0;
      }
    }

    :host([data-state='closed'][data-placement='top']) {
      translate: 0 calc(-1 * var(--z-drawer-exit));
    }
    :host([data-state='closed'][data-placement='bottom']) {
      translate: 0 var(--z-drawer-exit);
    }
    :host([data-state='closed'][data-placement='left']) {
      translate: calc(-1 * var(--z-drawer-exit)) 0;
    }
    :host([data-state='closed'][data-placement='right']) {
      translate: var(--z-drawer-exit) 0;
    }

    :host([data-swiping]) {
      transition: none;
    }

    /* A drawer stacked behind another one dims and stops scrolling. */
    :host([data-nested-open]) {
      overflow: hidden;
      filter: brightness(0.95);
    }

    /* The pill inside the grab strip. */
    [data-slot='drawer-swipe-handle']::after {
      content: '';
      border-radius: 9999px;
      background: var(--color-muted);
    }

    :host([data-axis='y']) [data-slot='drawer-swipe-handle']::after {
      width: 100px;
      height: 6px;
    }

    :host([data-axis='x']) [data-slot='drawer-swipe-handle']::after {
      width: 6px;
      height: 100px;
    }

    :host::after {
      content: '';
      position: absolute;
      pointer-events: none;
      background: var(--z-drawer-bleed);
    }

    :host([data-axis='y'])::after {
      inset-inline: 0;
      height: 3rem;
    }

    :host([data-axis='x'])::after {
      inset-block: 0;
      width: 3rem;
    }

    :host([data-placement='bottom'])::after {
      top: 100%;
    }
    :host([data-placement='top'])::after {
      bottom: 100%;
    }
    :host([data-placement='right'])::after {
      left: 100%;
    }
    :host([data-placement='left'])::after {
      right: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        transition-duration: 1ms;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-popup',
    role: 'dialog',
    tabindex: '-1',
    '[attr.data-placement]': 'zPlacement()',
    '[attr.data-axis]': 'axis()',
    '[attr.data-state]': 'zState()',
    '[attr.data-swiping]': 'isSwiping() ? "" : null',
    '[attr.data-snap-points]': 'hasSnapPoints() ? "" : null',
    '[attr.data-expanded]': 'isExpanded() ? "" : null',
    '[attr.data-nested-open]': 'depth() ? "" : null',
    '[attr.aria-modal]': 'zModal() ? "true" : null',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.transform]': 'transform()',
    '[style.touch-action]': 'swipeable() ? "none" : null',
    '[style.--z-drawer-duration.ms]': 'zDuration()',
    '[style.--z-drawer-visible-size.px]': 'visibleSize()',
    '(pointerdown)': 'onPointerDown($event)',
  },
  exportAs: 'zDrawerPanel',
})
export class ZardDrawerPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  readonly zPlacement = input<ZardDrawerPlacement>('bottom');
  readonly zSnapPoints = input<readonly ZardDrawerSnapPoint[] | undefined>(undefined);
  readonly zSnapPoint = model<ZardDrawerSnapPoint | undefined>(undefined);
  readonly zDismissible = input(true, { transform: booleanAttribute });
  readonly zHandle = input(false, { transform: booleanAttribute });
  readonly zModal = input(true, { transform: booleanAttribute });
  readonly zDuration = input(DRAWER_DURATION);
  /** Drives the enter/exit slide. The owner flips it to `closed` before disposing the overlay. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  /** Emitted when a gesture asks for the drawer to close. */
  readonly closeRequested = output<void>();

  protected readonly isSwiping = signal(false);

  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');

  private readonly viewportWidth = signal(0);
  private readonly viewportHeight = signal(0);
  private readonly measuredSize = signal(0);
  private readonly bodyOffset = signal(0);
  private readonly rootFontSize = signal(16);
  private readonly swipeOffset = signal<number | null>(null);

  /** How many drawers are stacked on top of this one. */
  protected readonly depth = drawerDepth(this);

  protected readonly axis = computed(() => (isVerticalPlacement(this.zPlacement()) ? 'y' : 'x'));

  protected readonly hasSnapPoints = computed(() => (this.zSnapPoints()?.length ?? 0) > 0);

  protected readonly swipeable = computed(() => this.zDismissible() || this.hasSnapPoints());

  protected readonly showHandle = computed(() => this.zHandle());

  protected readonly classes = computed(() =>
    mergeClasses(drawerVariants({ zPlacement: this.zPlacement(), zSnapping: this.hasSnapPoints() }), this.class()),
  );

  protected readonly handleClasses = computed(() => drawerHandleVariants({ zPlacement: this.zPlacement() }));
  protected readonly bodyClasses = computed(() => drawerBodyVariants());

  private readonly viewportSize = computed(() =>
    isVerticalPlacement(this.zPlacement()) ? this.viewportHeight() : this.viewportWidth(),
  );

  /**
   * Size of the panel along the swipe axis. Before the first measurement it falls back to
   * the viewport, which is exactly right for a snapping drawer (laid out at full size) and
   * irrelevant for the others, whose resting offset is 0 either way.
   */
  private readonly panelSize = computed(() => this.measuredSize() || this.viewportSize());

  private readonly resolvedSnapPoints = computed(() => {
    const points = this.zSnapPoints();
    if (!points?.length) {
      return [];
    }
    return resolveSnapPoints(points, this.viewportSize(), this.rootFontSize());
  });

  /** Index of the active snap point, or -1 when the drawer has none. */
  private readonly activeIndex = computed(() => {
    const points = this.zSnapPoints();
    if (!points?.length) {
      return -1;
    }

    const index = points.indexOf(this.zSnapPoint() as ZardDrawerSnapPoint);
    return index >= 0 ? index : 0;
  });

  /** True at the largest snap point, mirroring shadcn's `data-expanded`. */
  protected readonly isExpanded = computed(() => {
    const points = this.zSnapPoints();
    return !!points?.length && this.activeIndex() === points.length - 1;
  });

  /** Offset the panel rests at when it is not being swiped. */
  private readonly restOffset = computed(() => {
    const index = this.activeIndex();
    const size = this.panelSize();
    if (index < 0 || !size) {
      return 0;
    }

    return Math.max(0, size - this.resolvedSnapPoints()[index]);
  });

  private readonly offset = computed(() => this.swipeOffset() ?? this.restOffset());

  /**
   * How much of the panel is on screen right now, published as `--z-drawer-visible-size`.
   * A snapping drawer is laid out at full size and translated, so content that has to stay
   * reachable at every stop sizes itself against this instead of against the panel.
   */
  protected readonly visibleSize = computed(() =>
    this.hasSnapPoints() ? Math.max(0, this.panelSize() - this.offset()) : null,
  );

  /** Visible size minus whatever sits above the body — today, the handle. */
  protected readonly bodyHeight = computed(() => {
    const visible = this.visibleSize();
    return visible === null ? null : Math.max(0, visible - this.bodyOffset());
  });

  /**
   * Swipe offset and nested stacking share the same transform: a drawer behind another one
   * shrinks and slides a little further under it, the way shadcn stacks its drawers.
   */
  protected readonly transform = computed(() => {
    const depth = this.depth();
    const offset = this.offset();
    if (!depth && !offset) {
      return null;
    }

    const scale = Math.max(0, 1 - depth * DRAWER_STACK_STEP);
    // The panel scales towards its own edge, so a stacked one has to travel the width it
    // lost as well as the peek — otherwise it hides completely behind the drawer in front.
    const stack = depth * DRAWER_STACK_PEEK + (1 - scale) * this.panelSize();
    // Positive moves towards the closing edge; the stack offset pulls it back inwards.
    const axis = closingDirection(this.zPlacement()) * (offset - stack);
    const translate = isVerticalPlacement(this.zPlacement())
      ? `translate3d(0, ${axis}px, 0)`
      : `translate3d(${axis}px, 0, 0)`;

    return `${translate} scale(${scale})`;
  });

  private pointerId: number | null = null;
  private startTarget: EventTarget | null = null;
  private startPosition = 0;
  private startOffset = 0;
  private startTime = 0;
  private lastPosition = 0;
  private gestureCancelled = false;

  constructor() {
    // Seeded before the first render so a snapping drawer opens straight at its snap point
    // instead of rendering fully open for a frame and then sliding down to it.
    if (isPlatformBrowser(this.platformId)) {
      this.readViewport();
    }

    pushDrawerPanel(this);

    // Leave the stack as soon as the exit animation starts, so the drawer behind this one
    // un-stacks while both are still moving — and re-join it if the drawer is re-opened
    // mid-exit, which reuses this same panel.
    effect(() => {
      const closing = this.zState() === 'closed';
      untracked(() => (closing ? popDrawerPanel(this) : pushDrawerPanel(this)));
    });

    afterNextRender(() => {
      this.measure();
      this.observeResize();
      this.trapFocus();
    });

    this.destroyRef.onDestroy(() => {
      popDrawerPanel(this);
      this.endGesture();
    });
  }

  private readViewport(): void {
    this.viewportWidth.set(window.innerWidth);
    this.viewportHeight.set(window.innerHeight);

    const fontSize = Number.parseFloat(getComputedStyle(this.document.documentElement).fontSize);
    if (!Number.isNaN(fontSize)) {
      this.rootFontSize.set(fontSize);
    }
  }

  private measure(): void {
    // offsetWidth/Height, not getBoundingClientRect: the panel is scaled while stacked, and
    // the swipe maths needs its layout size, not the size it happens to be painted at.
    const element = this.host.nativeElement;

    this.measuredSize.set(isVerticalPlacement(this.zPlacement()) ? element.offsetHeight : element.offsetWidth);
    // The panel is `position: fixed`, so it is the offsetParent of its own children.
    this.bodyOffset.set(this.body().nativeElement.offsetTop);
    this.readViewport();
  }

  private observeResize(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => this.measure());
    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  /**
   * Only a modal drawer traps focus. A non-modal one deliberately leaves the page usable,
   * so tabbing out of it has to reach that page.
   */
  private trapFocus(): void {
    const trap = this.focusTrapFactory.create(this.host.nativeElement, !this.zModal());
    void trap.focusInitialElementWhenReady();
    this.destroyRef.onDestroy(() => trap.destroy());
  }

  protected onPointerDown(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.swipeable() || this.pointerId !== null) {
      return;
    }
    if (event.button !== 0 || isInteractiveTarget(event.target)) {
      return;
    }

    this.measure();

    this.pointerId = event.pointerId;
    this.startTarget = event.target;
    this.gestureCancelled = false;
    this.startPosition = this.axisPosition(event);
    this.lastPosition = this.startPosition;
    this.startOffset = this.offset();
    this.startTime = event.timeStamp;

    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId || this.gestureCancelled) {
      return;
    }

    const position = this.axisPosition(event);
    const delta = (position - this.startPosition) * closingDirection(this.zPlacement());

    if (!this.isSwiping()) {
      if (Math.abs(delta) < SWIPE_START_THRESHOLD) {
        return;
      }

      // A gesture that starts inside a scrollable area belongs to that area first.
      if (isScrollableAway(this.startTarget, this.host.nativeElement, this.zPlacement(), delta)) {
        this.gestureCancelled = true;
        this.endGesture();
        return;
      }

      this.isSwiping.set(true);
      this.host.nativeElement.setPointerCapture(event.pointerId);
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    this.lastPosition = position;
    this.swipeOffset.set(this.clampOffset(this.startOffset + delta));
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }

    const wasSwiping = this.isSwiping();
    const elapsed = Math.max(1, event.timeStamp - this.startTime);
    const velocity = ((this.lastPosition - this.startPosition) * closingDirection(this.zPlacement())) / elapsed;

    this.endGesture();
    if (!wasSwiping) {
      return;
    }

    if (this.hasSnapPoints()) {
      this.settleOnSnapPoint(velocity);
    } else {
      this.settle(velocity);
    }
  };

  private endGesture(): void {
    if (this.pointerId !== null && this.host.nativeElement.hasPointerCapture(this.pointerId)) {
      this.host.nativeElement.releasePointerCapture(this.pointerId);
    }

    this.pointerId = null;
    this.isSwiping.set(false);

    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }

  /** Swiping past the fully open edge — and past the last stop of a locked drawer — resists. */
  private clampOffset(offset: number): number {
    const size = this.panelSize();

    if (offset < 0) {
      return -rubberband(-offset, size);
    }

    if (!this.zDismissible()) {
      const points = this.resolvedSnapPoints();
      const maxOffset = points.length ? Math.max(0, size - Math.min(...points)) : 0;
      if (offset > maxOffset) {
        return maxOffset + rubberband(offset - maxOffset, size);
      }
    }

    return offset;
  }

  /** No snap points: a flick or a long enough swipe dismisses, anything else springs back. */
  private settle(velocity: number): void {
    const dismiss =
      this.zDismissible() &&
      (velocity > DRAWER_VELOCITY_THRESHOLD ||
        (velocity > -DRAWER_VELOCITY_THRESHOLD && this.offset() > this.panelSize() * DRAWER_CLOSE_THRESHOLD));

    this.swipeOffset.set(null);
    if (dismiss) {
      this.closeRequested.emit();
    }
  }

  /** With snap points: a flick moves one stop, a slow release lands on the closest one. */
  private settleOnSnapPoint(velocity: number): void {
    const points = this.zSnapPoints() ?? [];
    const resolved = this.resolvedSnapPoints();
    const visible = this.panelSize() - this.offset();

    let index = nearestSnapIndex(visible, resolved);

    if (velocity > DRAWER_VELOCITY_THRESHOLD) {
      index -= 1;
    } else if (velocity < -DRAWER_VELOCITY_THRESHOLD) {
      index = Math.min(resolved.length - 1, index + 1);
    }

    this.swipeOffset.set(null);

    if (index < 0) {
      if (this.zDismissible()) {
        this.closeRequested.emit();
        return;
      }
      index = 0;
    }

    // Released well below the smallest stop: treat it as a dismissal.
    if (this.zDismissible() && visible < resolved[0] * (1 - DRAWER_CLOSE_THRESHOLD)) {
      this.closeRequested.emit();
      return;
    }

    this.zSnapPoint.set(points[index]);
  }

  private axisPosition(event: PointerEvent): number {
    return isVerticalPlacement(this.zPlacement()) ? event.clientY : event.clientX;
  }
}
```

```angular-ts
import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardDrawerContainerComponent, ZardDrawerOptions } from './drawer-container.component';
import { DRAWER_DURATION } from './drawer.utils';

/**
 * Reference to a drawer opened via {@link ZardDrawerService}.
 *
 * The lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog, sheet
 * and alert-dialog — which is what makes Escape close the topmost overlay and
 * nothing else. Before that, two stacked drawers both closed on one press.
 */
export class ZardDrawerRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardDrawerOptions<T, U>,
    private readonly containerInstance: ZardDrawerContainerComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardDrawerRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return DRAWER_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.leave();
    this.overlayRef?.detachBackdrop();
  }

  /**
   * A non-modal drawer has no mask, so a press outside it is a press on the page
   * the drawer deliberately left usable — it must not dismiss.
   */
  protected override closesOnOutsidePointer(): boolean {
    return (this.config.zMask ?? true) && (this.config.zMaskClosable ?? true) && (this.config.zDismissible ?? true);
  }

  protected override closesOnEscape(): boolean {
    return this.config.zDismissible ?? true;
  }
}
```

```angular-ts
import { computed, signal, type Signal } from '@angular/core';

/** Panels currently on screen, oldest first. */
const panels = signal<readonly object[]>([]);

/** Scale removed from a panel for each drawer stacked on top of it. */
export const DRAWER_STACK_STEP = 0.05;

/** How far a stacked panel peeks out from under the one in front of it. */
export const DRAWER_STACK_PEEK = 16;

export function pushDrawerPanel(panel: object): void {
  panels.update(current => (current.includes(panel) ? current : [...current, panel]));
}

export function popDrawerPanel(panel: object): void {
  panels.update(current => current.filter(entry => entry !== panel));
}

/** True while any drawer is already on screen — a new one opening on top is nested. */
export function hasOpenDrawer(): boolean {
  return panels().length > 0;
}

/** How many drawers are stacked on top of `panel`. 0 means it is the frontmost one. */
export function drawerDepth(panel: object): Signal<number> {
  return computed(() => {
    const current = panels();
    const index = current.indexOf(panel);
    return index === -1 ? 0 : current.length - 1 - index;
  });
}
```

```angular-ts
import {
  ZardDrawerCloseDirective,
  ZardDrawerComponent,
  ZardDrawerDescriptionComponent,
  ZardDrawerFooterComponent,
  ZardDrawerHeaderComponent,
  ZardDrawerTitleComponent,
} from '@/shared/components/drawer/drawer.component';

export const ZardDrawerImports = [
  ZardDrawerComponent,
  ZardDrawerHeaderComponent,
  ZardDrawerTitleComponent,
  ZardDrawerDescriptionComponent,
  ZardDrawerFooterComponent,
  ZardDrawerCloseDirective,
] as const;
```

```angular-ts
import { type ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  InjectionToken,
  Injector,
  PLATFORM_ID,
  TemplateRef,
  type ViewContainerRef,
} from '@angular/core';

import { ZardDrawerContainerComponent, ZardDrawerOptions } from './drawer-container.component';
import { ZardDrawerHost } from './drawer-host';
import { ZardDrawerRef } from './drawer-ref';
import { hasOpenDrawer } from './drawer-stack';
import { DRAWER_BACKDROP_CLASSES } from './drawer.variants';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;

export const Z_DRAWER_DATA = new InjectionToken<unknown>('Z_DRAWER_DATA');

/**
 * Type-safe accessor for the data passed to a drawer via {@link ZardDrawerOptions.zData}.
 *
 * Must be called from an injection context (component constructor / field initializer).
 *
 * @example
 * private readonly data = injectDrawerData<MyData>();
 */
export function injectDrawerData<T>(): T {
  return inject(Z_DRAWER_DATA) as T;
}

@Injectable({
  providedIn: 'root',
})
export class ZardDrawerService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Opens a drawer with the given configuration.
   *
   * On non-browser platforms (SSR / build) the returned `ZardDrawerRef` is a
   * no-op that resolves cleanly when calling `close()`.
   */
  create<T, U = unknown>(config: ZardDrawerOptions<T, U>): ZardDrawerRef<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return new ZardDrawerRef<T>(null, config, null, this.platformId);
    }

    const overlayRef = this.createOverlay(config);
    const container = this.attachContainer<T, U>(overlayRef, config);
    const drawerRef = this.attachContent<T, U>(config.zContent as ContentType<T>, container, overlayRef, config);

    return drawerRef;
  }

  private createOverlay<T, U>(config: ZardDrawerOptions<T, U>): OverlayRef {
    const modal = config.zMask ?? true;
    // A drawer opening on top of another one gets a see-through mask: the drawer
    // underneath dims itself instead, so masks never stack up into a black screen.
    const nested = hasOpenDrawer();

    return this.overlay.create(
      new OverlayConfig({
        hasBackdrop: modal,
        backdropClass: nested ? ['bg-transparent'] : DRAWER_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: modal ? this.overlay.scrollStrategies.block() : this.overlay.scrollStrategies.noop(),
        disposeOnNavigation: true,
      }),
    );
  }

  private attachContainer<T, U>(overlayRef: OverlayRef, config: ZardDrawerOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardDrawerOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardDrawerContainerComponent<T, U>>(
      ZardDrawerContainerComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach<ZardDrawerContainerComponent<T, U>>(containerPortal).instance;
  }

  private attachContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    container: ZardDrawerContainerComponent<T, U>,
    overlayRef: OverlayRef,
    config: ZardDrawerOptions<T, U>,
  ): ZardDrawerRef<T> {
    const drawerRef = new ZardDrawerRef<T>(overlayRef, config, container, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      // CDK's TemplatePortal type requires a ViewContainerRef even though it tolerates null at runtime,
      // and types the template context as T (the template's data shape) — we expose `drawerRef` instead.
      const vcr = (config.zViewContainerRef ?? null) as unknown as ViewContainerRef;
      const ctx = { drawerRef } as unknown as T;
      container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, vcr, ctx));
    } else if (componentOrTemplateRef != null && typeof componentOrTemplateRef !== 'string') {
      // Guard against a missing `zContent`: without it, `undefined` reaches ComponentPortal and
      // Angular throws NG0919 (DEF_TYPE_UNDEFINED) while creating the component.
      const injector = this.createInjector<T, U>(drawerRef, container, config);
      const contentRef = container.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      drawerRef.setComponentInstance(contentRef.instance);
    }

    return drawerRef;
  }

  private createInjector<T, U>(
    drawerRef: ZardDrawerRef<T>,
    container: ZardDrawerContainerComponent<T, U>,
    config: ZardDrawerOptions<T, U>,
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardDrawerRef, useValue: drawerRef },
        { provide: ZardDrawerHost, useValue: container },
        { provide: Z_DRAWER_DATA, useValue: config.zData },
      ],
    });
  }
}
```

```angular-ts
import type { ZardDrawerPlacement } from './drawer.variants';

/** Pointer speed (px/ms) past which a flick dismisses the drawer regardless of distance. */
export const DRAWER_VELOCITY_THRESHOLD = 0.4;

/** Fraction of the panel that has to be dragged away before a slow drag dismisses it. */
export const DRAWER_CLOSE_THRESHOLD = 0.35;

/** Exit/snap animation duration (ms). Mirrors the CSS transition on the panel. */
export const DRAWER_DURATION = 450;

export type ZardDrawerSnapPoint = number | string;

export function isVerticalPlacement(placement: ZardDrawerPlacement): boolean {
  return placement === 'top' || placement === 'bottom';
}

/**
 * Sign of the axis the drawer is dragged along, expressed as the direction that
 * *closes* it: a bottom drawer closes downwards (+1 on Y), a left one leftwards (-1 on X).
 */
export function closingDirection(placement: ZardDrawerPlacement): 1 | -1 {
  return placement === 'bottom' || placement === 'right' ? 1 : -1;
}

/**
 * Resolves a snap point to the number of pixels of the panel that stay visible.
 *
 * `0–1` is read as a fraction of the viewport, anything above as pixels, and a
 * string keeps its CSS unit (`px`, `rem`, `em`, `%`, `vh`, `vw`).
 */
export function resolveSnapPoint(point: ZardDrawerSnapPoint, viewportSize: number, rootFontSize = 16): number {
  if (typeof point === 'number') {
    return point <= 1 ? point * viewportSize : point;
  }

  const value = Number.parseFloat(point);
  if (Number.isNaN(value)) {
    return 0;
  }

  if (point.endsWith('rem') || point.endsWith('em')) {
    return value * rootFontSize;
  }
  if (point.endsWith('%') || point.endsWith('vh') || point.endsWith('vw')) {
    return (value / 100) * viewportSize;
  }

  return value;
}

/**
 * Resolves every snap point, keeping the author's order so an index still maps back
 * to the value handed to `[(zSnapPoint)]`. Points are expected in ascending order.
 */
export function resolveSnapPoints(
  points: readonly ZardDrawerSnapPoint[],
  viewportSize: number,
  rootFontSize = 16,
): number[] {
  return points.map(point => resolveSnapPoint(point, viewportSize, rootFontSize));
}

/** Index of the snap point closest to `size`. Returns -1 for an empty list. */
export function nearestSnapIndex(size: number, resolvedPoints: readonly number[]): number {
  if (!resolvedPoints.length) {
    return -1;
  }

  let best = 0;
  for (let i = 1; i < resolvedPoints.length; i++) {
    if (Math.abs(resolvedPoints[i] - size) < Math.abs(resolvedPoints[best] - size)) {
      best = i;
    }
  }
  return best;
}

/**
 * iOS-style rubber band: past the fully open position the panel keeps moving but
 * with progressively more resistance, so it never detaches from the edge.
 */
export function rubberband(distance: number, dimension: number): number {
  if (dimension <= 0) {
    return 0;
  }
  return (1 - 1 / ((distance * 0.55) / dimension + 1)) * dimension;
}

/**
 * True when the gesture started inside something that scrolls in the drag axis and
 * is not already at the edge — dragging the drawer would steal that scroll.
 */
export function isScrollableAway(
  target: EventTarget | null,
  panel: HTMLElement,
  placement: ZardDrawerPlacement,
  delta: number,
): boolean {
  const vertical = isVerticalPlacement(placement);
  let node = target instanceof HTMLElement ? target : null;

  while (node && node !== panel) {
    const style = getComputedStyle(node);
    const overflow = vertical ? style.overflowY : style.overflowX;

    if (overflow === 'auto' || overflow === 'scroll') {
      const position = vertical ? node.scrollTop : node.scrollLeft;
      const max = vertical ? node.scrollHeight - node.clientHeight : node.scrollWidth - node.clientWidth;

      if (max > 0 && ((delta > 0 && position > 0) || (delta < 0 && position < max))) {
        return true;
      }
    }

    node = node.parentElement;
  }

  return false;
}

/**
 * Controls that own the pointer themselves — dragging one must not swipe the drawer.
 * Buttons are deliberately absent: a press on one still starts a swipe, and a tap that
 * never crosses the threshold still fires its click.
 */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return !!target.closest(
    'input, textarea, select, a[href], [role="slider"], [contenteditable=""], [contenteditable="true"], [data-no-drag]',
  );
}
```

```angular-ts
export { type OnClickCallback as DrawerOnClickCallback } from './drawer-container.component';
export { ZardDrawerOptions } from './drawer-container.component';
export * from './drawer-host';
export * from './drawer-panel.component';
export * from './drawer-ref';
export * from './drawer.component';
export * from './drawer.imports';
export * from './drawer.service';
export * from './drawer.utils';
export * from './drawer.variants';
```

## Usage

```angular-ts
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
```

```angular-html
<button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

<z-drawer [(zVisible)]="visible">
  <z-drawer-header>
    <z-drawer-title>Are you absolutely sure?</z-drawer-title>
    <z-drawer-description>This action cannot be undone.</z-drawer-description>
  </z-drawer-header>

  <div class="p-4"><!-- Content here --></div>

  <z-drawer-footer>
    <button type="button" z-button>Submit</button>
    <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
  </z-drawer-footer>
</z-drawer>
```

## Composition

```text
z-drawer
├── z-drawer-header
│   ├── z-drawer-title
│   └── z-drawer-description
├── (your content)
└── z-drawer-footer
    └── [z-drawer-close]
```

## Examples

### Custom Sizes

A vertical drawer sizes itself to its content and is capped at `calc(100dvh - 6rem)`. A side drawer spans 75% of the viewport width, or `24rem` on larger screens. Override either with `class`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" z-button zType="secondary" (click)="halfHeight.set(true)">Half height</button>
      <button type="button" z-button zType="secondary" (click)="wideSide.set(true)">Wide side</button>
    </div>

    <z-drawer [(zVisible)]="halfHeight" class="h-[50vh]">
      <z-drawer-header>
        <z-drawer-title>Half height</z-drawer-title>
        <z-drawer-description>The drawer keeps the height you give it.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="bg-muted h-96 w-full rounded-2xl"></div>
      </div>
    </z-drawer>

    <z-drawer [(zVisible)]="wideSide" zPlacement="right" class="sm:w-lg">
      <z-drawer-header>
        <z-drawer-title>Wide side</z-drawer-title>
        <z-drawer-description>A side drawer is 24rem wide until you widen it.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full rounded-2xl"></div>
      </div>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerCustomSizesComponent {
  readonly halfHeight = signal(false);
  readonly wideSide = signal(false);
}
```

### Position

Use `zPlacement` to set the side of the drawer. Values are `top`, `right`, `bottom` and `left`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (option of placements; track option) {
        <button type="button" z-button zType="secondary" class="capitalize" (click)="open(option)">
          {{ option }}
        </button>
      }
    </div>

    <z-drawer [(zVisible)]="visible" [zPlacement]="placement()">
      <z-drawer-header>
        <z-drawer-title>Move Goal</z-drawer-title>
        <z-drawer-description>Set your daily activity goal.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-40 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerPositionComponent {
  readonly placements: ZardDrawerPlacement[] = ['top', 'right', 'bottom', 'left'];

  readonly visible = signal(false);
  readonly placement = signal<ZardDrawerPlacement>('bottom');

  open(placement: ZardDrawerPlacement) {
    this.placement.set(placement);
    this.visible.set(true);
  }
}
```

### Swipe Handle

Use `zHandle` to render a swipe handle.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="visible.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="visible" zHandle>
      <z-drawer-header>
        <z-drawer-title>Drawer</z-drawer-title>
        <z-drawer-description>Drawer with a swipe handle.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted h-80 w-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSwipeHandleComponent {
  readonly visible = signal(false);
}
```

### Nested

Open drawers from inside another drawer. Parent drawers stay mounted and stack behind the frontmost drawer.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';

import { injectIsMobile } from './is-mobile';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="first.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="first" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Drawer</z-drawer-title>
        <z-drawer-description>Open another drawer from the same direction.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button zType="outline" (click)="second.set(true)">Open Nested Drawer</button>
      </z-drawer-footer>
    </z-drawer>

    <z-drawer [(zVisible)]="second" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Nested Drawer</z-drawer-title>
        <z-drawer-description>The parent drawer stays mounted behind this one.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button zType="outline" (click)="third.set(true)">Open Third Drawer</button>
      </z-drawer-footer>
    </z-drawer>

    <z-drawer [(zVisible)]="third" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Third Drawer</z-drawer-title>
        <z-drawer-description>Two drawers are stacked behind this one.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNestedComponent {
  private readonly isMobileViewport = injectIsMobile();

  readonly first = signal(false);
  readonly second = signal(false);
  readonly third = signal(false);

  readonly isMobile = computed(() => this.isMobileViewport());
  readonly placement = computed<ZardDrawerPlacement>(() => (this.isMobile() ? 'bottom' : 'right'));
}
```

### Non Modal

Set `[zModal]="false"` to allow interaction with the rest of the page while the drawer is open. A non-modal drawer keeps no mask, so an outside press does not dismiss it.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="outline" (click)="visible.set(true)">Non Modal</button>

    <z-drawer [(zVisible)]="visible" zPlacement="right" [zModal]="false">
      <z-drawer-header>
        <z-drawer-title>Non Modal Drawer</z-drawer-title>
        <z-drawer-description>The page behind stays scrollable and clickable.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNonModalComponent {
  readonly visible = signal(false);
}
```

### Snap Points

Use `zSnapPoints` to snap a drawer to preset heights. Numbers between `0` and `1` represent fractions of the viewport. Numbers greater than `1` are treated as pixel values. String values support `px` and `rem` units. Snap points apply to vertical drawers. Track the active one with `[(zSnapPoint)]`; at the largest snap point the drawer gets a `data-expanded` attribute you can style against.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerSnapPoint } from '@/shared/components/drawer/drawer.utils';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="outline" (click)="visible.set(true)">Open Snap Drawer</button>

    <z-drawer [(zVisible)]="visible" [zSnapPoints]="snapPoints" [(zSnapPoint)]="snapPoint" zHandle>
      <z-drawer-header>
        <z-drawer-title>Snap points</z-drawer-title>
        <z-drawer-description>
          Drag the drawer to snap between a compact peek and a near full-height view.
        </z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 touch-pan-y overflow-y-auto p-4">
        <div class="bg-muted h-80 w-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSnapPointsComponent {
  readonly snapPoints: ZardDrawerSnapPoint[] = ['31rem', 1];

  readonly visible = signal(false);
  readonly snapPoint = signal<ZardDrawerSnapPoint | undefined>('31rem');
}
```

### Responsive

You can combine the Dialog and Drawer components to create a responsive dialog. This renders a Dialog on desktop and a Drawer on mobile.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogService } from '@/shared/components/dialog';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardInputComponent } from '@/shared/components/input';

import { injectIsMobile } from './is-mobile';

@Component({
  selector: 'z-demo-drawer-profile-form',
  imports: [ZardButtonComponent, ZardInputComponent],
  template: `
    <form class="grid items-start gap-6" (submit)="$event.preventDefault()">
      <div class="grid gap-3">
        <label for="drawer-demo-email" class="text-sm leading-none font-medium select-none">Email</label>
        <input z-input id="drawer-demo-email" type="email" value="shadcn@example.com" />
      </div>

      <div class="grid gap-3">
        <label for="drawer-demo-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="drawer-demo-username" value="@shadcn" />
      </div>

      <button type="submit" z-button>Save changes</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerProfileFormComponent {}

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports, ZardDemoDrawerProfileFormComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Edit Profile</button>

    <z-drawer [(zVisible)]="visible">
      <z-drawer-header>
        <z-drawer-title>Edit profile</z-drawer-title>
        <z-drawer-description>Make changes to your profile here. Click save when you're done.</z-drawer-description>
      </z-drawer-header>

      <div class="p-4">
        <z-demo-drawer-profile-form />
      </div>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerResponsiveComponent {
  private readonly dialogService = inject(ZardDialogService);
  private readonly isMobile = injectIsMobile();

  readonly visible = signal(false);

  /** Same content, two surfaces: a dialog where there is room, a drawer where there is not. */
  open() {
    if (this.isMobile()) {
      this.visible.set(true);
      return;
    }

    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDrawerProfileFormComponent,
      zOkText: null,
      zCancelText: null,
    });
  }
}
```

### Service

Use `ZardDrawerService.create()` when the drawer is opened from code instead of from a template.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardInputComponent } from '@/shared/components/input';

@Component({
  selector: 'z-demo-drawer-service-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4 px-4">
      <div class="grid gap-3">
        <label for="drawer-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="drawer-service-name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="drawer-service-goal" class="text-sm leading-none font-medium select-none">Daily goal</label>
        <input z-input id="drawer-service-goal" type="number" formControlName="goal" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerServiceFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    goal: new FormControl(350),
  });
}

@Component({
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="openDrawer()">Open from a service</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerServiceComponent {
  private readonly drawerService = inject(ZardDrawerService);

  openDrawer() {
    this.drawerService.create({
      zTitle: 'Move goal',
      zDescription: 'Set your daily activity goal.',
      zContent: ZardDemoDrawerServiceFormComponent,
      zOkText: 'Submit',
      zCancelText: 'Cancel',
      zOnOk: instance => {
        console.log('Goal submitted:', instance.form.value);
      },
    });
  }
}
```

## API Reference

### z-drawer

Root of a declarative drawer. Holds the open state and hosts the projected content. The panel exposes `data-placement`, `data-axis`, `data-state`, `data-swiping`, `data-snap-points` and `data-expanded`, plus a `--z-drawer-bleed` variable that fills the inset gap for an edge-to-edge look.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVisible]` | Open state, two-way bound | `boolean` | `false` |
| `[zPlacement]` | Edge of the screen the drawer slides from | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `[zSnapPoints]` | Sizes the drawer rests at. 0–1 is a fraction of the viewport, above that pixels, strings keep their CSS unit | `(number \| string)[]` | `-` |
| `[zSnapPoint]` | Active snap point, two-way bound. Defaults to the first one | `number \| string` | `-` |
| `[zDismissible]` | Whether swiping, the mask and Escape can close the drawer | `boolean` | `true` |
| `[zHandle]` | Renders the swipe handle | `boolean` | `false` |
| `[zModal]` | Renders the mask and blocks the page behind. Set false for a non-modal drawer | `boolean` | `true` |
| `[class]` | Custom CSS classes applied to the panel | `ClassValue` | `-` |
| `(zAfterOpen)` | Emitted once the drawer is attached | `OutputRef<void>` | `-` |
| `(zAfterClose)` | Emitted once the exit animation has finished | `OutputRef<void>` | `-` |

### z-drawer-header / z-drawer-footer

Layout slots for the top and bottom of a drawer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-drawer-title

Accessible name of the drawer. Wired to `aria-labelledby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Title text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-drawer-description

Supporting text. Wired to `aria-describedby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDescription]` | Description text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### [z-drawer-close]

Closes the drawer it is projected into. Works for declarative and service-opened drawers alike.

### ZardDrawerOptions

Configuration accepted by `ZardDrawerService.create()`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Drawer title text or template | `string \| TemplateRef<void>` | `-` |
| `[zDescription]` | Drawer description text or template | `string \| TemplateRef<void>` | `-` |
| `[zContent]` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `[zPlacement]` | Edge of the screen the drawer slides from | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `[zSnapPoints]` | Sizes the drawer rests at | `(number \| string)[]` | `-` |
| `[zSnapPoint]` | Snap point the drawer opens at | `number \| string` | `-` |
| `[zDismissible]` | Whether swiping, the mask and Escape can close the drawer | `boolean` | `true` |
| `[zHandle]` | Renders the swipe handle | `boolean` | `false` |
| `[zMask]` | Renders the backdrop and blocks the page behind. Set false for a non-modal drawer | `boolean` | `true` |
| `[zMaskClosable]` | Whether clicking outside closes the drawer | `boolean` | `true` |
| `[zClosable]` | Whether to show the close button | `boolean` | `true` |
| `[zDuration]` | Exit animation duration in ms | `number` | `450` |
| `[zOkText]` | OK button text, null to hide button | `string \| null` | `'OK'` |
| `[zCancelText]` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `[zOkIcon]` | OK button icon — registered icon name or inline SVG string | `string` | `-` |
| `[zCancelIcon]` | Cancel button icon — registered icon name or inline SVG string | `string` | `-` |
| `[zOkDestructive]` | Whether OK button should have destructive styling | `boolean` | `false` |
| `[zOkDisabled]` | Whether OK button should be disabled | `boolean` | `false` |
| `[zHideFooter]` | Whether to hide the footer with action buttons | `boolean` | `false` |
| `[zCustomClasses]` | Additional CSS classes to apply | `ClassValue` | `-` |
| `[zOnOk]` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zOnCancel]` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zData]` | Data to pass to custom content components | `object` | `-` |
| `[zViewContainerRef]` | View container for rendering custom content | `ViewContainerRef` | `-` |

### ZardDrawerRef

Reference returned by `ZardDrawerService.create()`, used to observe and close the drawer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[close]` | Closes the drawer, optionally with a result | `(result?: R) => void` | `-` |
| `[isClosing]` | Signal that turns true once the drawer starts closing | `Signal<boolean>` | `false` |
| `[result]` | Signal holding the result passed to close() | `Signal<R \| undefined>` | `undefined` |
| `[componentInstance]` | Signal with the instance of the component rendered as content | `Signal<T \| null>` | `null` |

---

[Open in browser](https://zardui.com/docs/components/drawer)
