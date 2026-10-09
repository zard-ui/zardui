---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
---

# Sheet

Extends the Dialog component to display content that complements the main content of the screen.

## Installation

### CLI

```bash
npx zard-cli@latest add sheet
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

import { nextSheetId, ZardSheetHost } from './sheet-host';
import {
  SHEET_DURATION,
  ZardSheetPanelComponent,
  type ZardSheetSide,
  type ZardSheetSize,
} from './sheet-panel.component';
import {
  SHEET_BACKDROP_CLASSES,
  sheetDescriptionVariants,
  sheetFooterVariants,
  sheetHeaderVariants,
  sheetTitleVariants,
} from './sheet.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A panel that slides in from an edge of the screen, composed in the template.
 *
 * ```html
 * <z-sheet [(zVisible)]="visible" zSide="right">
 *   <z-sheet-header>
 *     <z-sheet-title>Title</z-sheet-title>
 *     <z-sheet-description>Description</z-sheet-description>
 *   </z-sheet-header>
 *   ...content...
 *   <z-sheet-footer>
 *     <button type="button" z-button z-sheet-close>Cancel</button>
 *   </z-sheet-footer>
 * </z-sheet>
 * ```
 *
 * `ZardSheetService.create()` opens the same panel from code.
 */
@Component({
  selector: 'z-sheet',
  imports: [ZardSheetPanelComponent],
  template: `
    <ng-template #panel>
      <z-sheet-panel
        [zSide]="zSide()"
        [zSize]="zSize()"
        [zWidth]="zWidth()"
        [zHeight]="zHeight()"
        [zClosable]="zClosable()"
        [zDuration]="zDuration()"
        [zState]="state()"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
        (closeRequested)="requestClose()"
      >
        <ng-content />
      </z-sheet-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardSheetComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardSheetHost, useExisting: forwardRef(() => ZardSheetComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zSheet',
})
export class ZardSheetComponent extends ZardSheetHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Edge of the screen the sheet slides from. */
  readonly zSide = input<ZardSheetSide>('right');
  /** Preset width (left/right) or height (top/bottom). Ignored once `zWidth` or `zHeight` is set. */
  readonly zSize = input<ZardSheetSize>('default');
  /** Explicit width, for left/right sheets. */
  readonly zWidth = input<string | undefined>(undefined);
  /** Explicit height, for top/bottom sheets. */
  readonly zHeight = input<string | undefined>(undefined);
  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** Whether a click on the mask closes the sheet. */
  readonly zMaskClosable = input(true, { transform: booleanAttribute });
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(SHEET_DURATION);
  /** Custom classes applied to the panel. */
  readonly class = input<ClassValue>('');

  /** Emitted once the sheet is attached to the DOM. */
  readonly zAfterOpen = output<void>();
  /** Emitted once the sheet has finished its exit transition and is gone. */
  readonly zAfterClose = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');

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
    this.zVisible.set(false);
  }

  private open(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Re-opening mid-exit: keep the same overlay and reverse the transition.
    if (this.overlayRef) {
      this.clearDisposeTimer();
      this.state.set('open');
      return;
    }

    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.state.set('open');

    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: SHEET_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
        disposeOnNavigation: true,
      }),
    );
    this.overlayRef = overlayRef;

    overlayRef.attach(new TemplatePortal(this.panel(), this.viewContainerRef));

    overlayRef.backdropClick().subscribe(() => {
      if (this.zMaskClosable()) {
        this.requestClose();
      }
    });
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
    this.disposeTimer = setTimeout(() => this.dispose(), this.zDuration());
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
  selector: 'z-sheet-header, [z-sheet-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sheet-header',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetHeader',
})
export class ZardSheetHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sheetHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-sheet-title, [z-sheet-title]',
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
    'data-slot': 'sheet-title',
    role: 'heading',
    'aria-level': '2',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetTitle',
})
export class ZardSheetTitleComponent {
  private readonly sheet = inject(ZardSheetHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextSheetId('title');
  protected readonly classes = computed(() => mergeClasses(sheetTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.sheet?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.sheet?.titleId() === this.id) {
        this.sheet.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-sheet-description, [z-sheet-description]',
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
    'data-slot': 'sheet-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetDescription',
})
export class ZardSheetDescriptionComponent {
  private readonly sheet = inject(ZardSheetHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextSheetId('description');
  protected readonly classes = computed(() => mergeClasses(sheetDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.sheet?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.sheet?.descriptionId() === this.id) {
        this.sheet.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-sheet-footer, [z-sheet-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sheet-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetFooter',
})
export class ZardSheetFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sheetFooterVariants(), this.class()));
}

/** Closes the sheet it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-sheet-close]',
  host: {
    'data-slot': 'sheet-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zSheetClose',
})
export class ZardSheetCloseDirective {
  private readonly sheet = inject(ZardSheetHost, { optional: true });

  protected onClick(): void {
    this.sheet?.requestClose();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva(
  [
    'fixed z-50 flex flex-col gap-4',
    'bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg outline-none',
  ],
  {
    variants: {
      zSide: {
        top: 'inset-x-0 top-0 h-auto border-b',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l',
        bottom: 'inset-x-0 bottom-0 h-auto border-t',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r',
      },
      zSize: {
        default: '',
        sm: '',
        lg: '',
        // Dimensions come from zWidth/zHeight as inline styles.
        custom: '',
      },
    },
    compoundVariants: [
      {
        zSide: ['left', 'right'],
        zSize: 'default',
        class: 'sm:max-w-sm',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'sm',
        class: 'w-1/2 sm:max-w-xs',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'lg',
        class: 'w-full sm:max-w-lg',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'sm',
        class: 'h-1/3',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'lg',
        class: 'h-3/4',
      },
    ],
    defaultVariants: {
      zSide: 'right',
      zSize: 'default',
    },
  },
);

/** Classes of the mask behind a sheet, shared by the declarative form and the service. */
export const SHEET_BACKDROP_CLASSES = ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'];

export const sheetHeaderVariants = cva('flex flex-col gap-0.5 p-4');

export const sheetTitleVariants = cva('text-base font-medium text-foreground wrap-anywhere');

export const sheetDescriptionVariants = cva('text-sm text-muted-foreground wrap-anywhere');

export const sheetFooterVariants = cva('mt-auto flex flex-col gap-2 p-4');

export type ZardSheetVariants = VariantProps<typeof sheetVariants>;
```

```angular-ts
export { type OnClickCallback as SheetOnClickCallback } from './sheet-container.component';
export { ZardSheetContainerComponent, ZardSheetOptions } from './sheet-container.component';
export * from './sheet-host';
export * from './sheet-panel.component';
export * from './sheet-ref';
export * from './sheet.component';
export * from './sheet.imports';
export * from './sheet.service';
export * from './sheet.variants';
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
  Injector,
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { noopFn } from '@/shared/utils/noop';

import { ZardSheetHost } from './sheet-host';
import { SHEET_DURATION, ZardSheetPanelComponent } from './sheet-panel.component';
import type { ZardSheetRef } from './sheet-ref';
import {
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
} from './sheet.component';
import type { ZardSheetVariants } from './sheet.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardSheetOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when opening and closing. Defaults to 200 (matches CSS transition). */
  zDuration?: number;
  zHeight?: string;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zSide?: ZardSheetVariants['zSide'] = 'right';
  zSize?: ZardSheetVariants['zSize'] = 'default';
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

/**
 * What `ZardSheetService.create()` attaches to the overlay: the shared `z-sheet-panel`
 * with a header, the projected content and a footer built from the options.
 *
 * @internal Open sheets through the service; compose `z-sheet` for the declarative form.
 */
@Component({
  selector: 'z-sheet-container',
  imports: [
    PortalModule,
    NgIcon,
    ZardButtonComponent,
    ZardSheetPanelComponent,
    ZardSheetHeaderComponent,
    ZardSheetTitleComponent,
    ZardSheetDescriptionComponent,
    ZardSheetFooterComponent,
  ],
  template: `
    <z-sheet-panel
      [zSide]="config.zSide ?? 'right'"
      [zSize]="config.zSize ?? 'default'"
      [zWidth]="config.zWidth"
      [zHeight]="config.zHeight"
      [zClosable]="config.zClosable ?? true"
      [zDuration]="duration()"
      [zState]="state()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
      (closeRequested)="cancelTriggered.emit()"
    >
      @if (config.zTitle || config.zDescription) {
        <z-sheet-header>
          @if (config.zTitle) {
            <z-sheet-title data-testid="z-title" [zTitle]="config.zTitle" />
          }
          @if (config.zDescription) {
            <z-sheet-description data-testid="z-description" [zDescription]="config.zDescription" />
          }
        </z-sheet-header>
      }

      <!-- min-h-0 lets the content area shrink below its intrinsic height, so scrollable
           content stays inside the sheet instead of pushing the footer past the viewport. -->
      <main class="flex min-h-0 w-full flex-1 flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <z-sheet-footer>
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
        </z-sheet-footer>
      }
    </z-sheet-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardSheetContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardSheetHost, useExisting: forwardRef(() => ZardSheetContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zSheetContainer',
})
export class ZardSheetContainerComponent<T, U> extends BasePortalOutlet implements ZardSheetHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardSheetOptions<T, U>);

  /** Element injector of the container, the parent of the injector handed to the projected content. */
  readonly injector = inject(Injector);

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = computed(() => this.config.zDuration ?? SHEET_DURATION);
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');

  sheetRef?: ZardSheetRef<T>;

  protected isSvgString(icon: string): boolean {
    return /^\s*<svg/i.test(icon);
  }

  requestClose(): void {
    this.cancelTriggered.emit();
  }

  /** Plays the exit transition. The ref disposes the overlay once it finishes. */
  leave(): void {
    this.state.set('closed');
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<C>(portal: ComponentPortal<C>): ComponentRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet().attachTemplatePortal(portal);
  }
}
```

```angular-ts
import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description a sheet points its ARIA attributes at. */
export function nextSheetId(suffix: string): string {
  return `z-sheet-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-sheet` and the container the service opens,
 * so projected content (`z-sheet-title`, `[z-sheet-close]`, …) works the same in both.
 */
export abstract class ZardSheetHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the sheet to close. */
  abstract requestClose(): void;
}
```

```angular-ts
import { FocusTrapFactory } from '@angular/cdk/a11y';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { sheetVariants, type ZardSheetVariants } from './sheet.variants';

/** How long the enter and leave transitions run, in ms. Mirrors the CSS. */
export const SHEET_DURATION = 200;

export type ZardSheetSide = NonNullable<ZardSheetVariants['zSide']>;
export type ZardSheetSize = NonNullable<ZardSheetVariants['zSize']>;

/**
 * The sliding panel of a sheet: styling per side and size, the enter and leave transitions,
 * the focus trap and the corner close button. Shared by the declarative `z-sheet` and by the
 * container the `ZardSheetService` attaches, so both behave identically.
 *
 * @internal Compose `z-sheet` instead of using this directly.
 */
@Component({
  selector: 'z-sheet-panel',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    @if (zClosable()) {
      <button
        type="button"
        data-testid="z-close-header-button"
        data-slot="sheet-close"
        z-button
        zType="ghost"
        zSize="icon-sm"
        class="absolute top-3 right-3"
        (click)="closeRequested.emit()"
      >
        <ng-icon name="lucideX" class="size-4!" />
        <span class="sr-only">Close</span>
      </button>
    }
    <ng-content />
  `,
  styles: `
    z-sheet-panel {
      --z-sheet-duration: 200ms;
      opacity: 1;
      translate: 0 0;
      transition:
        opacity var(--z-sheet-duration) ease-in-out,
        translate var(--z-sheet-duration) ease-in-out;
    }

    @starting-style {
      z-sheet-panel[data-side='right'] {
        opacity: 0;
        translate: 2.5rem 0;
      }
      z-sheet-panel[data-side='left'] {
        opacity: 0;
        translate: -2.5rem 0;
      }
      z-sheet-panel[data-side='top'] {
        opacity: 0;
        translate: 0 -2.5rem;
      }
      z-sheet-panel[data-side='bottom'] {
        opacity: 0;
        translate: 0 2.5rem;
      }
    }

    z-sheet-panel[data-state='closed'][data-side='right'] {
      opacity: 0;
      translate: 2.5rem 0;
    }
    z-sheet-panel[data-state='closed'][data-side='left'] {
      opacity: 0;
      translate: -2.5rem 0;
    }
    z-sheet-panel[data-state='closed'][data-side='top'] {
      opacity: 0;
      translate: 0 -2.5rem;
    }
    z-sheet-panel[data-state='closed'][data-side='bottom'] {
      opacity: 0;
      translate: 0 2.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    'data-slot': 'sheet-content',
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
    '[attr.data-side]': 'zSide()',
    '[attr.data-state]': 'zState()',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.width]': 'zWidth() || null',
    '[style.height]': 'zHeight() || null',
    '[style.--z-sheet-duration.ms]': 'zDuration()',
  },
  exportAs: 'zSheetPanel',
})
export class ZardSheetPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  /** Edge of the screen the sheet slides from. */
  readonly zSide = input<ZardSheetSide>('right');
  /** Preset width (left/right) or height (top/bottom). Ignored once `zWidth` or `zHeight` is set. */
  readonly zSize = input<ZardSheetSize>('default');
  /** Explicit width, for left/right sheets. */
  readonly zWidth = input<string | undefined>(undefined);
  /** Explicit height, for top/bottom sheets. */
  readonly zHeight = input<string | undefined>(undefined);
  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(SHEET_DURATION);
  /** `closed` plays the leave transition; the owner disposes the overlay once it ends. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  /** The corner close button was pressed. */
  readonly closeRequested = output<void>();

  protected readonly classes = computed(() => {
    const zSize = this.zWidth() || this.zHeight() ? 'custom' : this.zSize();
    return mergeClasses(sheetVariants({ zSide: this.zSide(), zSize }), this.class());
  });

  constructor() {
    afterNextRender(() => {
      const trap = this.focusTrapFactory.create(this.host.nativeElement);
      void trap.focusInitialElementWhenReady();
      this.destroyRef.onDestroy(() => trap.destroy());
    });
  }
}
```

```angular-ts
import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardSheetContainerComponent, ZardSheetOptions } from './sheet-container.component';
import { SHEET_DURATION } from './sheet-panel.component';

/**
 * Reference to a sheet opened via {@link ZardSheetService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the sheet. The lifecycle itself
 * lives in {@link ZardOverlayRefBase}, shared with dialog, drawer and
 * alert-dialog; only the leave animation and the mask behaviour are the
 * sheet's own.
 */
export class ZardSheetRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardSheetOptions<T, U>,
    private readonly containerInstance: ZardSheetContainerComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardSheetRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return SHEET_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.leave();
    this.overlayRef?.detachBackdrop();
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? true;
  }
}
```

```angular-ts
import {
  ZardSheetCloseDirective,
  ZardSheetComponent,
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
} from '@/shared/components/sheet/sheet.component';

/** Every part of the declarative sheet, for a template that composes one. */
export const ZardSheetImports = [
  ZardSheetComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetCloseDirective,
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

import { ZardSheetContainerComponent, ZardSheetOptions } from './sheet-container.component';
import { ZardSheetRef } from './sheet-ref';
import { SHEET_BACKDROP_CLASSES } from './sheet.variants';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;

export const Z_SHEET_DATA = new InjectionToken<unknown>('Z_SHEET_DATA');

/**
 * Type-safe accessor for the data passed to a sheet via {@link ZardSheetOptions.zData}.
 *
 * Must be called from an injection context (component constructor / field initializer).
 *
 * @example
 * private readonly data = injectSheetData<MyData>();
 */
export function injectSheetData<T>(): T {
  return inject(Z_SHEET_DATA) as T;
}

@Injectable({
  providedIn: 'root',
})
export class ZardSheetService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Opens a sheet with the given configuration.
   *
   * On non-browser platforms (SSR / build) the returned `ZardSheetRef` is a
   * no-op that resolves cleanly when calling `close()`.
   */
  create<T, U = unknown>(config: ZardSheetOptions<T, U>): ZardSheetRef<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return new ZardSheetRef<T>(null, config, null, this.platformId);
    }

    const overlayRef = this.createOverlay();
    const sheetContainer = this.attachSheetContainer<T, U>(overlayRef, config);
    const sheetRef = this.attachSheetContent<T, U>(
      config.zContent as ContentType<T>,
      sheetContainer,
      overlayRef,
      config,
    );

    sheetContainer.sheetRef = sheetRef;

    return sheetRef;
  }

  private createOverlay(): OverlayRef {
    return this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: SHEET_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
      }),
    );
  }

  private attachSheetContainer<T, U>(overlayRef: OverlayRef, config: ZardSheetOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardSheetOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardSheetContainerComponent<T, U>>(
      ZardSheetContainerComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach<ZardSheetContainerComponent<T, U>>(containerPortal).instance;
  }

  private attachSheetContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    sheetContainer: ZardSheetContainerComponent<T, U>,
    overlayRef: OverlayRef,
    config: ZardSheetOptions<T, U>,
  ): ZardSheetRef<T> {
    const sheetRef = new ZardSheetRef<T>(overlayRef, config, sheetContainer, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      // CDK's TemplatePortal type requires a ViewContainerRef even though it tolerates null at runtime,
      // and types the template context as T (the template's data shape) — we expose `sheetRef` instead.
      const vcr = (config.zViewContainerRef ?? null) as unknown as ViewContainerRef;
      const ctx = { sheetRef } as unknown as T;
      sheetContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, vcr, ctx));
    } else if (componentOrTemplateRef != null && typeof componentOrTemplateRef !== 'string') {
      // Guard against a missing `zContent`: without it, `undefined` reaches ComponentPortal and
      // Angular throws NG0919 (DEF_TYPE_UNDEFINED) while creating the component.
      const injector = this.createInjector<T, U>(sheetRef, config, sheetContainer);
      const contentRef = sheetContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      sheetRef.setComponentInstance(contentRef.instance);
    }

    return sheetRef;
  }

  private createInjector<T, U>(
    sheetRef: ZardSheetRef<T>,
    config: ZardSheetOptions<T, U>,
    sheetContainer: ZardSheetContainerComponent<T, U>,
  ): Injector {
    // Parented to the container's element injector so the content can reach `ZardSheetHost`
    // — that is what lets `[z-sheet-close]` work inside service-opened content too.
    return Injector.create({
      parent: sheetContainer.injector,
      providers: [
        { provide: ZardSheetRef, useValue: sheetRef },
        { provide: Z_SHEET_DATA, useValue: config.zData },
      ],
    });
  }
}
```

## Usage

```angular-ts
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
```

```angular-html
<button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

<z-sheet [(zVisible)]="visible">
  <z-sheet-header>
    <z-sheet-title>Edit profile</z-sheet-title>
    <z-sheet-description>Make changes to your profile here.</z-sheet-description>
  </z-sheet-header>
  <p class="px-4">Sheet content goes here.</p>
  <z-sheet-footer>
    <button type="button" z-button (click)="save()">Save changes</button>
    <button type="button" z-button zType="outline" z-sheet-close>Close</button>
  </z-sheet-footer>
</z-sheet>
```

## Composition

```text
z-sheet
├── z-sheet-header
│   ├── z-sheet-title
│   └── z-sheet-description
├── (your content)
└── z-sheet-footer
    └── [z-sheet-close]
```

## Examples

### Side

Use `zSide`, as an input or an option, to set the edge of the screen where the sheet appears. Values are `top`, `right`, `bottom`, or `left`.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import type { ZardSheetSide } from '@/shared/components/sheet/sheet-panel.component';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const SIDES = ['top', 'right', 'bottom', 'left'] as const satisfies readonly ZardSheetSide[];

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
);

/** Content the service renders: a scrolling column of paragraphs. */
@Component({
  selector: 'z-demo-sheet-side-content',
  template: `
    @for (paragraph of paragraphs; track $index) {
      <p class="mb-2 leading-relaxed">{{ paragraph }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'no-scrollbar min-h-0 overflow-y-auto px-4' },
})
export class ZardDemoSheetSideContentComponent {
  protected readonly paragraphs = PARAGRAPHS;
}

@Component({
  selector: 'z-demo-sheet-side',
  imports: [ZardButtonComponent, ZardSheetImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <div class="flex flex-wrap gap-2">
          @for (option of sides; track option) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="open(option)">
              {{ option }}
            </button>
          }
        </div>

        <!-- Horizontal sheets already fill the viewport height; cap the vertical ones so the
             content scrolls instead of pushing the footer off-screen. -->
        <z-sheet [(zVisible)]="visible" [zSide]="side()" [class]="vertical() ? 'max-h-[50vh]' : ''">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <div class="no-scrollbar min-h-0 overflow-y-auto px-4">
            @for (paragraph of paragraphs; track $index) {
              <p class="mb-2 leading-relaxed">{{ paragraph }}</p>
            }
          </div>
          <z-sheet-footer>
            <button type="button" z-button z-sheet-close>Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Cancel</button>
          </z-sheet-footer>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <div class="flex flex-wrap gap-2">
          @for (option of sides; track option) {
            <button type="button" z-button zType="outline" class="capitalize" (click)="openSheet(option)">
              {{ option }}
            </button>
          }
        </div>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetSideComponent {
  private readonly sheetService = inject(ZardSheetService);

  protected readonly sides = SIDES;
  protected readonly paragraphs = PARAGRAPHS;

  readonly visible = signal(false);
  readonly side = signal<ZardSheetSide>('right');
  readonly vertical = computed(() => this.side() === 'top' || this.side() === 'bottom');

  open(side: ZardSheetSide) {
    this.side.set(side);
    this.visible.set(true);
  }

  openSheet(side: ZardSheetSide) {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetSideContentComponent,
      zSide: side,
      zCustomClasses: side === 'top' || side === 'bottom' ? 'max-h-[50vh]' : undefined,
      zOkText: 'Save changes',
      zCancelText: 'Cancel',
    });
  }
}
```

### No Close Button

Set `[zClosable]="false"` in the template, or `zClosable: false` in the options, to hide the close button; press Escape or click outside the sheet to close it.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-sheet-no-close-button',
  imports: [ZardButtonComponent, ZardSheetImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open Sheet</button>

        <z-sheet [(zVisible)]="visible" [zClosable]="false">
          <z-sheet-header>
            <z-sheet-title>No Close Button</z-sheet-title>
            <z-sheet-description>
              This sheet doesn't have a close button in the top-right corner. Click outside to close.
            </z-sheet-description>
          </z-sheet-header>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openSheet()">Open Sheet</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetNoCloseButtonComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly visible = signal(false);

  openSheet() {
    this.sheetService.create({
      zTitle: 'No Close Button',
      zDescription: "This sheet doesn't have a close button in the top-right corner. Click outside to close.",
      zClosable: false,
      zHideFooter: true,
    });
  }
}
```

## API Reference

### z-sheet

Root of a declarative sheet. Holds the open state and projects its content into the panel, which exposes `data-side` and `data-state` (`open` | `closed`) while the enter and leave transitions run.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVisible]` | Open state, two-way bound | `boolean` | `false` |
| `[zSide]` | Edge of the screen the sheet slides from | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `[zSize]` | Preset width (left/right) or height (top/bottom). Ignored once `zWidth` or `zHeight` is set | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `[zWidth]` | Explicit width, for left/right sheets | `string` | `-` |
| `[zHeight]` | Explicit height, for top/bottom sheets | `string` | `-` |
| `[zClosable]` | Renders the close (X) button in the top-right corner | `boolean` | `true` |
| `[zMaskClosable]` | Whether clicking outside the sheet (on the mask) closes it | `boolean` | `true` |
| `[zDuration]` | How long the enter and leave transitions run, in ms | `number` | `200` |
| `[class]` | Custom CSS classes applied to the panel | `ClassValue` | `-` |
| `(zAfterOpen)` | Emitted once the sheet is attached | `EventEmitter<void>` | `-` |
| `(zAfterClose)` | Emitted once the exit transition has finished | `EventEmitter<void>` | `-` |

### z-sheet-header

Layout slot for the top of a sheet, next to `z-sheet-title` and `z-sheet-description`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-sheet-footer

Layout slot for the bottom of a sheet, typically the action buttons.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-sheet-title

Accessible name of the sheet. Wired to `aria-labelledby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Title text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-sheet-description

Supporting text. Wired to `aria-describedby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDescription]` | Description text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### [z-sheet-close]

Closes the sheet it is projected into. Works for declarative and service-opened sheets alike.

### ZardSheetOptions

Configuration accepted by `ZardSheetService.create()`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zCancelIcon]` | Cancel button icon — registered icon name or inline SVG string | `string` | `-` |
| `[zCancelText]` | Cancel button text, null to hide the button | `string \| null` | `'Cancel'` |
| `[zClosable]` | Whether the close (X) button in the header is shown. Escape and clicking outside the mask still dismiss the sheet unless `zMaskClosable` is also set to false | `boolean` | `true` |
| `[zContent]` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `[zCustomClasses]` | Additional CSS classes to apply | `ClassValue` | `-` |
| `[zData]` | Data to pass to custom content components | `object` | `-` |
| `[zDescription]` | Sheet description/body text | `string` | `-` |
| `[zDuration]` | Exit animation duration in ms | `number` | `200` |
| `[zHeight]` | Custom height (e.g., '80vh', '500px') | `string` | `-` |
| `[zHideFooter]` | Whether to hide the footer with action buttons | `boolean` | `false` |
| `[zMaskClosable]` | Whether clicking outside the sheet (on the mask) closes it | `boolean` | `true` |
| `[zOkDestructive]` | Whether the OK button should have destructive styling | `boolean` | `false` |
| `[zOkDisabled]` | Whether the OK button should be disabled | `boolean` | `false` |
| `[zOkIcon]` | OK button icon — registered icon name or inline SVG string | `string` | `-` |
| `[zOkText]` | OK button text, null to hide the button | `string \| null` | `'OK'` |
| `[zOnCancel]` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zOnOk]` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zSide]` | Edge of the screen where the sheet appears | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `[zSize]` | Preset size for the sheet, relative to its side. Ignored in favor of a custom size when `zWidth` or `zHeight` is set | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `[zTitle]` | Sheet title text or template | `string \| TemplateRef<void>` | `-` |
| `[zViewContainerRef]` | View container for rendering custom content | `ViewContainerRef` | `-` |
| `[zWidth]` | Custom width (e.g., '400px', '50%') | `string` | `-` |

### ZardSheetRef

Reference returned by `ZardSheetService.create()`, used to observe and close the sheet.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[close]` | Closes the sheet, optionally with a result | `(result?: R) => void` | `-` |
| `[isClosing]` | Signal that turns true once the sheet starts closing | `Signal<boolean>` | `false` |
| `[result]` | Signal holding the result passed to close() | `Signal<R \| undefined>` | `undefined` |
| `[componentInstance]` | Signal with the instance of the component rendered as content | `Signal<T \| null>` | `null` |

---

[Open in browser](https://zardui.com/docs/components/sheet)
