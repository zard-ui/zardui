---
title: Dialog
description: Visually or semantically separates content.
---

# Dialog

Visually or semantically separates content.

## Installation

### CLI

```bash
npx zard-cli@latest add dialog
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

import { nextDialogId, ZardDialogHost } from './dialog-host';
import { DIALOG_DURATION, ZardDialogPanelComponent } from './dialog-panel.component';
import {
  DIALOG_BACKDROP_CLASSES,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
} from './dialog.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A modal window layered over the page, composed in the template.
 *
 * ```html
 * <z-dialog [(zVisible)]="visible">
 *   <z-dialog-header>
 *     <z-dialog-title>Title</z-dialog-title>
 *     <z-dialog-description>Description</z-dialog-description>
 *   </z-dialog-header>
 *   ...content...
 *   <z-dialog-footer>
 *     <button type="button" z-button z-dialog-close>Cancel</button>
 *   </z-dialog-footer>
 * </z-dialog>
 * ```
 *
 * `ZardDialogService.create()` opens the same panel from code.
 */
@Component({
  selector: 'z-dialog',
  imports: [ZardDialogPanelComponent],
  template: `
    <ng-template #panel>
      <z-dialog-panel
        [zClosable]="zClosable()"
        [zWidth]="zWidth()"
        [zDuration]="zDuration()"
        [zState]="state()"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
        (closeRequested)="requestClose()"
      >
        <ng-content />
      </z-dialog-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDialogComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDialogHost, useExisting: forwardRef(() => ZardDialogComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zDialog',
})
export class ZardDialogComponent extends ZardDialogHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** Whether a click on the mask closes the dialog. */
  readonly zMaskClosable = input(true, { transform: booleanAttribute });
  /** Explicit width; leave unset for the responsive default. */
  readonly zWidth = input<string | undefined>(undefined);
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(DIALOG_DURATION);
  /** Custom classes applied to the panel. */
  readonly class = input<ClassValue>('');

  /** Emitted once the dialog is attached to the DOM. */
  readonly zAfterOpen = output<void>();
  /** Emitted once the dialog has finished its exit transition and is gone. */
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
        backdropClass: DIALOG_BACKDROP_CLASSES,
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
  selector: 'z-dialog-header, [z-dialog-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'dialog-header',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogHeader',
})
export class ZardDialogHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dialogHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-dialog-title, [z-dialog-title]',
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
    'data-slot': 'dialog-title',
    role: 'heading',
    'aria-level': '2',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogTitle',
})
export class ZardDialogTitleComponent {
  private readonly dialog = inject(ZardDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextDialogId('title');
  protected readonly classes = computed(() => mergeClasses(dialogTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.dialog?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.dialog?.titleId() === this.id) {
        this.dialog.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-dialog-description, [z-dialog-description]',
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
    'data-slot': 'dialog-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogDescription',
})
export class ZardDialogDescriptionComponent {
  private readonly dialog = inject(ZardDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextDialogId('description');
  protected readonly classes = computed(() => mergeClasses(dialogDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.dialog?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.dialog?.descriptionId() === this.id) {
        this.dialog.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-dialog-footer, [z-dialog-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'dialog-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogFooter',
})
export class ZardDialogFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dialogFooterVariants(), this.class()));
}

/** Closes the dialog it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-dialog-close]',
  host: {
    'data-slot': 'dialog-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zDialogClose',
})
export class ZardDialogCloseDirective {
  private readonly dialog = inject(ZardDialogHost, { optional: true });

  protected onClick(): void {
    this.dialog?.requestClose();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva([
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-4',
  'rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none',
  'sm:max-w-sm',
]);

/** Classes of the mask behind a dialog, shared by the declarative form and the service. */
export const DIALOG_BACKDROP_CLASSES = ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'];

export const dialogHeaderVariants = cva('flex flex-col gap-2');

export const dialogTitleVariants = cva('text-base leading-none font-medium wrap-anywhere');

export const dialogDescriptionVariants = cva(
  'text-sm text-muted-foreground wrap-anywhere *:[a]:underline *:[a]:underline-offset-[3px] *:[a]:hover:text-foreground',
);

export const dialogFooterVariants = cva(
  '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end',
);

export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
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

import { ZardDialogHost } from './dialog-host';
import { DIALOG_DURATION, ZardDialogPanelComponent } from './dialog-panel.component';
import type { ZardDialogRef } from './dialog-ref';
import {
  ZardDialogDescriptionComponent,
  ZardDialogFooterComponent,
  ZardDialogHeaderComponent,
  ZardDialogTitleComponent,
} from './dialog.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardDialogOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when opening and closing. Defaults to 100 (matches CSS transition). */
  zDuration?: number;
  zHideFooter?: boolean;
  /**
   * Keeps the title and description in the accessibility tree but out of the layout (`sr-only`),
   * the same trick shadcn uses when a dialog's content owns its own visual header.
   */
  zHideHeader?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

/**
 * What `ZardDialogService.create()` attaches to the overlay: the shared `z-dialog-panel`
 * with a header, the projected content and a footer built from the options.
 *
 * @internal Open dialogs through the service; compose `z-dialog` for the declarative form.
 */
@Component({
  selector: 'z-dialog-container',
  imports: [
    PortalModule,
    NgIcon,
    ZardButtonComponent,
    ZardDialogPanelComponent,
    ZardDialogHeaderComponent,
    ZardDialogTitleComponent,
    ZardDialogDescriptionComponent,
    ZardDialogFooterComponent,
  ],
  template: `
    <z-dialog-panel
      [zClosable]="config.zClosable ?? true"
      [zWidth]="config.zWidth"
      [zDuration]="duration()"
      [zState]="state()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
      (closeRequested)="cancelTriggered.emit()"
    >
      @if (config.zTitle || config.zDescription) {
        <z-dialog-header [class]="config.zHideHeader ? 'sr-only' : ''">
          @if (config.zTitle) {
            <z-dialog-title data-testid="z-title" [zTitle]="config.zTitle" />
          }
          @if (config.zDescription) {
            <z-dialog-description data-testid="z-description" [zDescription]="config.zDescription" />
          }
        </z-dialog-header>
      }

      <main class="flex flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <z-dialog-footer>
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
        </z-dialog-footer>
      }
    </z-dialog-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDialogContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDialogHost, useExisting: forwardRef(() => ZardDialogContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zDialogContainer',
})
export class ZardDialogContainerComponent<T, U> extends BasePortalOutlet implements ZardDialogHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardDialogOptions<T, U>);

  /** Element injector of the container, the parent of the injector handed to the projected content. */
  readonly injector = inject(Injector);

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = computed(() => this.config.zDuration ?? DIALOG_DURATION);
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');

  dialogRef?: ZardDialogRef<T>;

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

/** Unique id for the title/description a dialog points its ARIA attributes at. */
export function nextDialogId(suffix: string): string {
  return `z-dialog-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-dialog` and the container the service opens,
 * so projected content (`z-dialog-title`, `[z-dialog-close]`, …) works the same in both.
 */
export abstract class ZardDialogHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the dialog to close. */
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

import { dialogVariants } from './dialog.variants';

/** How long the enter and leave transitions run, in ms. Mirrors the CSS. */
export const DIALOG_DURATION = 100;

/**
 * The floating panel of a dialog: styling, the enter and leave transitions, the focus trap
 * and the corner close button. Shared by the declarative `z-dialog` and by the container the
 * `ZardDialogService` attaches, so both behave identically.
 *
 * @internal Compose `z-dialog` instead of using this directly.
 */
@Component({
  selector: 'z-dialog-panel',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    @if (zClosable()) {
      <button
        type="button"
        data-testid="z-close-header-button"
        data-slot="dialog-close"
        z-button
        zType="ghost"
        zSize="icon-sm"
        class="absolute top-2 right-2"
        (click)="closeRequested.emit()"
      >
        <ng-icon name="lucideX" class="size-4!" />
        <span class="sr-only">Close</span>
      </button>
    }
    <ng-content />
  `,
  styles: `
    z-dialog-panel {
      --z-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-dialog-duration) ease-out,
        transform var(--z-dialog-duration) ease-out;
    }

    @starting-style {
      z-dialog-panel {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    z-dialog-panel[data-state='closed'] {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-dialog-duration) ease-in,
        transform var(--z-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    'data-slot': 'dialog-content',
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
    '[attr.data-state]': 'zState()',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.width]': 'zWidth() || null',
    '[style.--z-dialog-duration.ms]': 'zDuration()',
  },
  exportAs: 'zDialogPanel',
})
export class ZardDialogPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** Explicit width; leave unset for the responsive default. */
  readonly zWidth = input<string | undefined>(undefined);
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(DIALOG_DURATION);
  /** `closed` plays the leave transition; the owner disposes the overlay once it ends. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  /** The corner close button was pressed. */
  readonly closeRequested = output<void>();

  protected readonly classes = computed(() => mergeClasses(dialogVariants(), this.class()));

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

import type { ZardDialogContainerComponent, ZardDialogOptions } from './dialog-container.component';
import { DIALOG_DURATION } from './dialog-panel.component';

/**
 * Reference to a dialog opened via {@link ZardDialogService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the dialog. The lifecycle itself
 * lives in {@link ZardOverlayRefBase}, shared with sheet, drawer and
 * alert-dialog, so Escape closes the topmost overlay of any kind.
 */
export class ZardDialogRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardDialogOptions<T, U>,
    private readonly containerInstance: ZardDialogContainerComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardDialogRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return DIALOG_DURATION;
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
  ZardDialogCloseDirective,
  ZardDialogComponent,
  ZardDialogDescriptionComponent,
  ZardDialogFooterComponent,
  ZardDialogHeaderComponent,
  ZardDialogTitleComponent,
} from '@/shared/components/dialog/dialog.component';

/** Every part of the declarative dialog, for a template that composes one. */
export const ZardDialogImports = [
  ZardDialogComponent,
  ZardDialogHeaderComponent,
  ZardDialogTitleComponent,
  ZardDialogDescriptionComponent,
  ZardDialogFooterComponent,
  ZardDialogCloseDirective,
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

import { ZardDialogContainerComponent, ZardDialogOptions } from './dialog-container.component';
import { ZardDialogRef } from './dialog-ref';
import { DIALOG_BACKDROP_CLASSES } from './dialog.variants';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;

export const Z_MODAL_DATA = new InjectionToken<unknown>('Z_MODAL_DATA');

/**
 * Type-safe accessor for the data passed to a dialog via {@link ZardDialogOptions.zData}.
 *
 * Must be called from an injection context (component constructor / field initializer).
 *
 * @example
 * private readonly data = injectDialogData<MyData>();
 */
export function injectDialogData<T>(): T {
  return inject(Z_MODAL_DATA) as T;
}

@Injectable({
  providedIn: 'root',
})
export class ZardDialogService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Opens a dialog with the given configuration.
   *
   * On non-browser platforms (SSR / build) the returned `ZardDialogRef` is a
   * no-op that resolves cleanly when calling `close()`.
   */
  create<T, U = unknown>(config: ZardDialogOptions<T, U>): ZardDialogRef<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return new ZardDialogRef<T>(null, config, null, this.platformId);
    }

    const overlayRef = this.createOverlay();
    const dialogContainer = this.attachDialogContainer<T, U>(overlayRef, config);
    const dialogRef = this.attachDialogContent<T, U>(
      config.zContent as ContentType<T>,
      dialogContainer,
      overlayRef,
      config,
    );

    dialogContainer.dialogRef = dialogRef;

    return dialogRef;
  }

  private createOverlay(): OverlayRef {
    return this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: DIALOG_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
      }),
    );
  }

  private attachDialogContainer<T, U>(overlayRef: OverlayRef, config: ZardDialogOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardDialogOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardDialogContainerComponent<T, U>>(
      ZardDialogContainerComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach<ZardDialogContainerComponent<T, U>>(containerPortal).instance;
  }

  private attachDialogContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    dialogContainer: ZardDialogContainerComponent<T, U>,
    overlayRef: OverlayRef,
    config: ZardDialogOptions<T, U>,
  ): ZardDialogRef<T> {
    const dialogRef = new ZardDialogRef<T>(overlayRef, config, dialogContainer, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      // CDK's TemplatePortal type requires a ViewContainerRef even though it tolerates null at runtime,
      // and types the template context as T (the template's data shape) — we expose `dialogRef` instead.
      const vcr = (config.zViewContainerRef ?? null) as unknown as ViewContainerRef;
      const ctx = { dialogRef } as unknown as T;
      dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, vcr, ctx));
    } else if (componentOrTemplateRef != null && typeof componentOrTemplateRef !== 'string') {
      // Guard against a missing `zContent`: without it, `undefined` reaches ComponentPortal and
      // Angular throws NG0919 (DEF_TYPE_UNDEFINED) while creating the component.
      const injector = this.createInjector<T, U>(dialogRef, config, dialogContainer);
      const contentRef = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      dialogRef.setComponentInstance(contentRef.instance);
    }

    return dialogRef;
  }

  private createInjector<T, U>(
    dialogRef: ZardDialogRef<T>,
    config: ZardDialogOptions<T, U>,
    dialogContainer: ZardDialogContainerComponent<T, U>,
  ): Injector {
    // Parented to the container's element injector so the content can reach `ZardDialogHost`
    // — that is what lets `[z-dialog-close]` work inside service-opened content too.
    return Injector.create({
      parent: dialogContainer.injector,
      providers: [
        { provide: ZardDialogRef, useValue: dialogRef },
        { provide: Z_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}
```

```angular-ts
export { type OnClickCallback as DialogOnClickCallback } from './dialog-container.component';
export { ZardDialogContainerComponent, ZardDialogOptions } from './dialog-container.component';
export * from './dialog-host';
export * from './dialog-panel.component';
export * from './dialog-ref';
export * from './dialog.component';
export * from './dialog.imports';
export * from './dialog.service';
export * from './dialog.variants';
```

## Usage

```angular-ts
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
```

```angular-html
<button type="button" z-button zType="outline" (click)="visible.set(true)">Edit profile</button>

<z-dialog [(zVisible)]="visible">
  <z-dialog-header>
    <z-dialog-title>Edit profile</z-dialog-title>
    <z-dialog-description>Make changes to your profile here.</z-dialog-description>
  </z-dialog-header>
  <p>Dialog content goes here.</p>
  <z-dialog-footer>
    <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
    <button type="button" z-button (click)="save()">Save changes</button>
  </z-dialog-footer>
</z-dialog>
```

## Composition

```text
z-dialog
├── z-dialog-header
│   ├── z-dialog-title
│   └── z-dialog-description
├── (your content)
└── z-dialog-footer
    └── [z-dialog-close]
```

## Examples

### Custom Close

Replace the default footer with your own: a `z-dialog-footer` with a `[z-dialog-close]` button works in both forms, the service one with `zHideFooter: true`.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Content the service renders; it brings its own footer, so the options hide the default one. */
@Component({
  selector: 'z-demo-dialog-custom-close-content',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent],
  template: `
    <div class="flex items-center gap-2">
      <div class="grid flex-1 gap-2">
        <label for="share-link-service" class="sr-only">Link</label>
        <input z-input id="share-link-service" value="https://ui.zardui.com/docs/installation" readonly />
      </div>
    </div>
    <z-dialog-footer class="sm:justify-start">
      <button type="button" z-button z-dialog-close>Close</button>
    </z-dialog-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseContentComponent {}

@Component({
  selector: 'z-demo-dialog-custom-close',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Share</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Share link</z-dialog-title>
            <z-dialog-description>Anyone who has this link will be able to view this.</z-dialog-description>
          </z-dialog-header>
          <div class="flex items-center gap-2">
            <div class="grid flex-1 gap-2">
              <label for="share-link" class="sr-only">Link</label>
              <input z-input id="share-link" value="https://ui.zardui.com/docs/installation" readonly />
            </div>
          </div>
          <z-dialog-footer class="sm:justify-start">
            <button type="button" z-button z-dialog-close>Close</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Share</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'Share link',
      zDescription: 'Anyone who has this link will be able to view this.',
      zContent: ZardDemoDialogCustomCloseContentComponent,
      zHideFooter: true,
    });
  }
}
```

### No Close Button

Set `[zClosable]="false"` in the template, or `zClosable: false` in the options, to hide the close button; press Escape or click outside the dialog to close it.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-dialog-no-close-button',
  imports: [ZardButtonComponent, ZardDialogImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">No Close Button</button>

        <z-dialog [(zVisible)]="visible" [zClosable]="false">
          <z-dialog-header>
            <z-dialog-title>No Close Button</z-dialog-title>
            <z-dialog-description>
              This dialog doesn't have a close button in the top-right corner.
            </z-dialog-description>
          </z-dialog-header>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">No Close Button</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogNoCloseButtonComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'No Close Button',
      zDescription: "This dialog doesn't have a close button in the top-right corner.",
      zClosable: false,
      zHideFooter: true,
    });
  }
}
```

### Sticky Footer

Keep actions visible while the content scrolls.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
);

/** Content the service renders: the paragraphs scroll while the footer stays put. */
@Component({
  selector: 'z-demo-dialog-sticky-footer-content',
  template: `
    <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
      @for (paragraph of paragraphs; track $index) {
        <p class="mb-4 leading-normal">{{ paragraph }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogStickyFooterContentComponent {
  protected readonly paragraphs = PARAGRAPHS;
}

@Component({
  selector: 'z-demo-dialog-sticky-footer',
  imports: [ZardButtonComponent, ZardDialogImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Sticky Footer</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Sticky Footer</z-dialog-title>
            <z-dialog-description>
              This dialog has a sticky footer that stays visible while the content scrolls.
            </z-dialog-description>
          </z-dialog-header>
          <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            @for (paragraph of paragraphs; track $index) {
              <p class="mb-4 leading-normal">{{ paragraph }}</p>
            }
          </div>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Close</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Sticky Footer</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogStickyFooterComponent {
  private readonly dialogService = inject(ZardDialogService);

  protected readonly paragraphs = PARAGRAPHS;
  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'Sticky Footer',
      zDescription: 'This dialog has a sticky footer that stays visible while the content scrolls.',
      zContent: ZardDemoDialogStickyFooterContentComponent,
      zCancelText: 'Close',
      zOkText: null,
    });
  }
}
```

### Scrollable Content

Long content can scroll while the header stays in view.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
);

/** Content the service renders: the paragraphs scroll inside the dialog. */
@Component({
  selector: 'z-demo-dialog-scrollable-content-content',
  template: `
    <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
      @for (paragraph of paragraphs; track $index) {
        <p class="mb-4 leading-normal">{{ paragraph }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogScrollableContentInnerComponent {
  protected readonly paragraphs = PARAGRAPHS;
}

@Component({
  selector: 'z-demo-dialog-scrollable-content',
  imports: [ZardButtonComponent, ZardDialogImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Scrollable Content</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Scrollable Content</z-dialog-title>
            <z-dialog-description>This is a dialog with scrollable content.</z-dialog-description>
          </z-dialog-header>
          <div class="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            @for (paragraph of paragraphs; track $index) {
              <p class="mb-4 leading-normal">{{ paragraph }}</p>
            }
          </div>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Scrollable Content</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogScrollableContentComponent {
  private readonly dialogService = inject(ZardDialogService);

  protected readonly paragraphs = PARAGRAPHS;
  readonly visible = signal(false);

  open() {
    this.dialogService.create({
      zTitle: 'Scrollable Content',
      zDescription: 'This is a dialog with scrollable content.',
      zContent: ZardDemoDialogScrollableContentInnerComponent,
      zHideFooter: true,
    });
  }
}
```

## API Reference

### z-dialog

Root of a declarative dialog. Holds the open state and projects its content into the panel, which exposes `data-state` (`open` | `closed`) while the enter and leave transitions run.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVisible]` | Open state, two-way bound | `boolean` | `false` |
| `[zClosable]` | Renders the close (X) button in the top-right corner | `boolean` | `true` |
| `[zMaskClosable]` | Whether clicking outside the dialog (on the mask) closes it | `boolean` | `true` |
| `[zWidth]` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `[zDuration]` | How long the enter and leave transitions run, in ms | `number` | `100` |
| `[class]` | Custom CSS classes applied to the panel | `ClassValue` | `-` |
| `(zAfterOpen)` | Emitted once the dialog is attached | `EventEmitter<void>` | `-` |
| `(zAfterClose)` | Emitted once the exit transition has finished | `EventEmitter<void>` | `-` |

### z-dialog-header

Layout slot for the top of a dialog, next to `z-dialog-title` and `z-dialog-description`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-dialog-footer

Layout slot for the bottom of a dialog, typically the action buttons.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-dialog-title

Accessible name of the dialog. Wired to `aria-labelledby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Title text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-dialog-description

Supporting text. Wired to `aria-describedby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDescription]` | Description text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### [z-dialog-close]

Closes the dialog it is projected into. Works for declarative and service-opened dialogs alike.

### ZardDialogService

Opens the same dialog from code. `create()` takes the options below and returns a `ZardDialogRef`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zCancelIcon]` | Sets the cancel icon. | `string` | `-` |
| `[zCancelText]` | Cancel button text, null to hide the button. Defaults to 'Cancel'. | `string \| null` | `'Cancel'` |
| `[zClosable]` | Whether the close (X) button in the header is shown. Escape and clicking outside the mask still dismiss the dialog unless `zMaskClosable` is also set to false. | `boolean` | `true` |
| `[zContent]` | Custom content component, template, or HTML. | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `[zCustomClasses]` | Additional CSS classes to apply to the dialog panel. | `ClassValue` | `-` |
| `[zData]` | Data to pass to custom content components. | `U` | `-` |
| `[zDescription]` | Sets the dialog description. | `string` | `-` |
| `[zDuration]` | Animation duration (ms) used when closing. Matches the CSS transition. | `number` | `100` |
| `[zHideFooter]` | Hides the footer. | `boolean` | `false` |
| `[zHideHeader]` | Keeps the title and description available to screen readers only (`sr-only`). | `boolean` | `false` |
| `[zMaskClosable]` | Whether clicking outside the dialog (on the mask) closes it. | `boolean` | `true` |
| `[zOkDestructive]` | Whether the OK button should have destructive styling. | `boolean` | `false` |
| `[zOkDisabled]` | Whether the OK button should be disabled. | `boolean` | `false` |
| `[zOkIcon]` | Sets the OK button icon. | `string` | `-` |
| `[zOkText]` | OK button text, null to hide the button. Defaults to 'OK'. | `string \| null` | `'OK'` |
| `[zOnCancel]` | Cancel button click handler. | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zOnOk]` | OK button click handler. | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zTitle]` | Dialog title text or template. | `string \| TemplateRef<void>` | `-` |
| `[zViewContainerRef]` | View container reference for dynamic component loading. | `ViewContainerRef` | `-` |
| `[zWidth]` | Custom width (e.g., '400px', '50%'). | `string` | `-` |

---

[Open in browser](https://zardui.com/docs/components/dialog)
