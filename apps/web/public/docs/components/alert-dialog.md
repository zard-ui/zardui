---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
---

# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response.

## Installation

### CLI

```bash
npx zard-cli@latest add alert-dialog
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

import { nextAlertDialogId, ZardAlertDialogHost } from './alert-dialog-host';
import { ALERT_DIALOG_DURATION, ZardAlertDialogPanelComponent } from './alert-dialog-panel.component';
import {
  ALERT_DIALOG_BACKDROP_CLASSES,
  alertDialogDescriptionVariants,
  alertDialogFooterVariants,
  alertDialogHeaderVariants,
  alertDialogMediaVariants,
  alertDialogTitleVariants,
  type ZardAlertDialogSizeVariants,
} from './alert-dialog.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A modal that interrupts the user with a decision, composed in the template.
 *
 * ```html
 * <z-alert-dialog [(zVisible)]="visible">
 *   <z-alert-dialog-header>
 *     <z-alert-dialog-media><ng-icon name="lucideTrash2" /></z-alert-dialog-media>
 *     <z-alert-dialog-title>Delete chat?</z-alert-dialog-title>
 *     <z-alert-dialog-description>This cannot be undone.</z-alert-dialog-description>
 *   </z-alert-dialog-header>
 *   <z-alert-dialog-footer>
 *     <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
 *     <button type="button" z-button zType="destructive" (click)="remove()">Delete</button>
 *   </z-alert-dialog-footer>
 * </z-alert-dialog>
 * ```
 *
 * `ZardAlertDialogService.create()` opens the same panel from code.
 */
@Component({
  selector: 'z-alert-dialog',
  imports: [ZardAlertDialogPanelComponent],
  template: `
    <ng-template #panel>
      <z-alert-dialog-panel
        [zSize]="zSize()"
        [zWidth]="zWidth()"
        [zDuration]="zDuration()"
        [zState]="state()"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
      >
        <ng-content />
      </z-alert-dialog-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardAlertDialogComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardAlertDialogHost, useExisting: forwardRef(() => ZardAlertDialogComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zAlertDialog',
})
export class ZardAlertDialogComponent extends ZardAlertDialogHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Visual size. `default` widens on sm+ and lays media and title side by side; `sm` stays compact and centered. */
  readonly zSize = input<ZardAlertDialogSizeVariants>('default');
  /** Explicit width; leave unset for the size preset. */
  readonly zWidth = input<string | undefined>(undefined);
  /** Whether a click on the mask closes the alert dialog. Off by default: the user has to decide. */
  readonly zMaskClosable = input(false, { transform: booleanAttribute });
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(ALERT_DIALOG_DURATION);
  /** Custom classes applied to the panel. */
  readonly class = input<ClassValue>('');

  /** Emitted once the alert dialog is attached to the DOM. */
  readonly zAfterOpen = output<void>();
  /** Emitted once the alert dialog has finished its exit transition and is gone. */
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
        backdropClass: ALERT_DIALOG_BACKDROP_CLASSES,
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
  selector: 'z-alert-dialog-header, [z-alert-dialog-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-header',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogHeader',
})
export class ZardAlertDialogHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogHeaderVariants(), this.class()));
}

/** Media slot above the title, usually an icon. The header lays it next to the title on `default` size. */
@Component({
  selector: 'z-alert-dialog-media, [z-alert-dialog-media]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-media',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogMedia',
})
export class ZardAlertDialogMediaComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogMediaVariants(), this.class()));
}

@Component({
  selector: 'z-alert-dialog-title, [z-alert-dialog-title]',
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
    'data-slot': 'alert-dialog-title',
    role: 'heading',
    'aria-level': '2',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogTitle',
})
export class ZardAlertDialogTitleComponent {
  private readonly alertDialog = inject(ZardAlertDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextAlertDialogId('title');
  protected readonly classes = computed(() => mergeClasses(alertDialogTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.alertDialog?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.alertDialog?.titleId() === this.id) {
        this.alertDialog.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-alert-dialog-description, [z-alert-dialog-description]',
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
    'data-slot': 'alert-dialog-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogDescription',
})
export class ZardAlertDialogDescriptionComponent {
  private readonly alertDialog = inject(ZardAlertDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextAlertDialogId('description');
  protected readonly classes = computed(() => mergeClasses(alertDialogDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.alertDialog?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.alertDialog?.descriptionId() === this.id) {
        this.alertDialog.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-alert-dialog-footer, [z-alert-dialog-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogFooter',
})
export class ZardAlertDialogFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogFooterVariants(), this.class()));
}

/** Closes the alert dialog it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-alert-dialog-close]',
  host: {
    'data-slot': 'alert-dialog-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zAlertDialogClose',
})
export class ZardAlertDialogCloseDirective {
  private readonly alertDialog = inject(ZardAlertDialogHost, { optional: true });

  protected onClick(): void {
    this.alertDialog?.requestClose();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva(
  [
    'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-1/2 gap-4',
    'rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 outline-none',
    'data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm',
  ],
  {
    variants: {
      zSize: {
        default: '',
        sm: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

/** Classes of the mask behind an alert dialog, shared by the declarative form and the service. */
export const ALERT_DIALOG_BACKDROP_CLASSES = ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'];

export const alertDialogHeaderVariants = cva([
  'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center',
  'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4',
  'sm:group-data-[size=default]/alert-dialog-content:place-items-start',
  'sm:group-data-[size=default]/alert-dialog-content:text-left',
  'sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
]);

export const alertDialogTitleVariants = cva([
  'text-base font-medium wrap-anywhere',
  'sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
]);

export const alertDialogDescriptionVariants = cva([
  'text-sm text-balance text-muted-foreground wrap-anywhere md:text-pretty',
  '[&_a]:underline [&_a]:underline-offset-[3px] [&_a]:hover:text-foreground',
]);

export const alertDialogFooterVariants = cva([
  '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4',
  'group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2',
  'sm:flex-row sm:justify-end',
]);

export const alertDialogMediaVariants = cva([
  'mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted',
  'sm:group-data-[size=default]/alert-dialog-content:row-span-2',
  "*:[svg:not([class*='size-'])]:size-6",
]);

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;
export type ZardAlertDialogSizeVariants = NonNullable<VariantProps<typeof alertDialogVariants>['zSize']>;
```

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  type EventEmitter,
  forwardRef,
  inject,
  output,
  signal,
  type TemplateRef,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { noopFn } from '@/shared/utils/noop';

import { ZardAlertDialogHost } from './alert-dialog-host';
import { ALERT_DIALOG_DURATION, ZardAlertDialogPanelComponent } from './alert-dialog-panel.component';
import type { ZardAlertDialogRef } from './alert-dialog-ref';
import {
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
} from './alert-dialog.component';
import type { ZardAlertDialogSizeVariants } from './alert-dialog.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardAlertDialogOptions<T> {
  zCancelText?: string | null;
  zClosable?: boolean;
  zCustomClasses?: ClassValue;
  zData?: object;
  /** Description text. Inline markup (a link, emphasis) is rendered; scripts and handlers are stripped. */
  zDescription?: string;
  /** Animation duration (ms) used when opening and closing. Defaults to 100 (matches CSS transition). */
  zDuration?: number;
  zMaskClosable?: boolean;
  /**
   * Optional template rendered as a media slot above the title (e.g. an icon).
   * When present, the header layout adapts to align media + title side-by-side
   * on `default` size at sm breakpoint.
   */
  zMedia?: TemplateRef<void>;
  /** Extra classes applied to the media slot wrapper (e.g. tinted backgrounds for destructive). */
  zMediaClass?: ClassValue;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  /** Visual size of the dialog. `default` is wider on sm+; `sm` keeps the compact width. */
  zSize?: ZardAlertDialogSizeVariants;
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

/**
 * What `ZardAlertDialogService.create()` attaches to the overlay: the shared
 * `z-alert-dialog-panel` with a header and a footer built from the options.
 *
 * @internal Open alert dialogs through the service; compose `z-alert-dialog` for the declarative form.
 */
@Component({
  selector: 'z-alert-dialog-container',
  imports: [
    NgTemplateOutlet,
    ZardButtonComponent,
    ZardAlertDialogPanelComponent,
    ZardAlertDialogHeaderComponent,
    ZardAlertDialogMediaComponent,
    ZardAlertDialogTitleComponent,
    ZardAlertDialogDescriptionComponent,
    ZardAlertDialogFooterComponent,
  ],
  template: `
    <z-alert-dialog-panel
      [zSize]="config.zSize ?? 'default'"
      [zWidth]="config.zWidth"
      [zDuration]="duration()"
      [zState]="state()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
    >
      @if (config.zMedia || config.zTitle || config.zDescription) {
        <z-alert-dialog-header>
          @if (config.zMedia) {
            <z-alert-dialog-media [class]="config.zMediaClass">
              <ng-container [ngTemplateOutlet]="config.zMedia" />
            </z-alert-dialog-media>
          }

          @if (config.zTitle) {
            <z-alert-dialog-title data-testid="z-alert-title" [zTitle]="config.zTitle" />
          }

          @if (config.zDescription) {
            <!-- Angular auto-sanitizes [innerHTML]; safe inline links/markup are preserved. -->
            <z-alert-dialog-description data-testid="z-alert-description">
              <span [innerHTML]="config.zDescription"></span>
            </z-alert-dialog-description>
          }
        </z-alert-dialog-header>
      }

      <z-alert-dialog-footer>
        @if (config.zCancelText !== null) {
          <button
            type="button"
            data-testid="z-alert-cancel-button"
            z-button
            zType="outline"
            (click)="cancelTriggered.emit()"
          >
            {{ config.zCancelText || 'Cancel' }}
          </button>
        }
        @if (config.zOkText !== null) {
          <button
            type="button"
            data-testid="z-alert-ok-button"
            z-button
            [zType]="config.zOkDestructive ? 'destructive' : 'default'"
            [zDisabled]="config.zOkDisabled"
            (click)="okTriggered.emit()"
          >
            {{ config.zOkText || 'Continue' }}
          </button>
        }
      </z-alert-dialog-footer>
    </z-alert-dialog-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardAlertDialogContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardAlertDialogHost, useExisting: forwardRef(() => ZardAlertDialogContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zAlertDialogContainer',
})
export class ZardAlertDialogContainerComponent<T> implements ZardAlertDialogHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardAlertDialogOptions<T>);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = computed(() => this.config.zDuration ?? ALERT_DIALOG_DURATION);

  alertDialogRef?: ZardAlertDialogRef<T>;

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
}
```

```angular-ts
import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description an alert dialog points its ARIA attributes at. */
export function nextAlertDialogId(suffix: string): string {
  return `z-alert-dialog-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-alert-dialog` and the container the service opens,
 * so projected content (`z-alert-dialog-title`, `[z-alert-dialog-close]`, …) works the same in both.
 */
export abstract class ZardAlertDialogHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the alert dialog to close. */
  abstract requestClose(): void;
}
```

```angular-ts
import { FocusTrapFactory } from '@angular/cdk/a11y';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { alertDialogVariants, type ZardAlertDialogSizeVariants } from './alert-dialog.variants';

/** How long the enter and leave transitions run, in ms. Mirrors the CSS. */
export const ALERT_DIALOG_DURATION = 100;

/**
 * The floating panel of an alert dialog: styling per size, the enter and leave transitions
 * and the focus trap. Shared by the declarative `z-alert-dialog` and by the container the
 * `ZardAlertDialogService` attaches, so both behave identically.
 *
 * @internal Compose `z-alert-dialog` instead of using this directly.
 */
@Component({
  selector: 'z-alert-dialog-panel',
  template: `
    <ng-content />
  `,
  styles: `
    z-alert-dialog-panel {
      --z-alert-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-alert-dialog-duration) ease-out,
        transform var(--z-alert-dialog-duration) ease-out;
    }

    @starting-style {
      z-alert-dialog-panel {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    z-alert-dialog-panel[data-state='closed'] {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-alert-dialog-duration) ease-in,
        transform var(--z-alert-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-content',
    role: 'alertdialog',
    'aria-modal': 'true',
    tabindex: '-1',
    '[attr.data-size]': 'zSize()',
    '[attr.data-state]': 'zState()',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.width]': 'zWidth() || null',
    '[style.--z-alert-dialog-duration.ms]': 'zDuration()',
  },
  exportAs: 'zAlertDialogPanel',
})
export class ZardAlertDialogPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  /** Visual size. `default` widens on sm+ and lays media and title side by side; `sm` stays compact and centered. */
  readonly zSize = input<ZardAlertDialogSizeVariants>('default');
  /** Explicit width; leave unset for the size preset. */
  readonly zWidth = input<string | undefined>(undefined);
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(ALERT_DIALOG_DURATION);
  /** `closed` plays the leave transition; the owner disposes the overlay once it ends. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogVariants({ zSize: this.zSize() }), this.class()));

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

import type { ZardAlertDialogContainerComponent, ZardAlertDialogOptions } from './alert-dialog-container.component';
import { ALERT_DIALOG_DURATION } from './alert-dialog-panel.component';

/**
 * Reference to an alert dialog opened via {@link ZardAlertDialogService}.
 *
 * An alert dialog answers yes or no, so it closes with no result: `result()`
 * stays undefined and what the footer callbacks return is not forwarded. The
 * rest of the lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog,
 * sheet and drawer.
 */
export class ZardAlertDialogRef<T = unknown> extends ZardOverlayRefBase<T, void> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogContainerComponent<T> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardAlertDialogRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return ALERT_DIALOG_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.leave();
    this.overlayRef?.detachBackdrop();
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? false;
  }

  protected override forwardsCallbackResult(): boolean {
    return false;
  }
}
```

```angular-ts
import {
  ZardAlertDialogCloseDirective,
  ZardAlertDialogComponent,
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
} from '@/shared/components/alert-dialog/alert-dialog.component';

/** Every part of the declarative alert dialog, for a template that composes one. */
export const ZardAlertDialogImports = [
  ZardAlertDialogComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogCloseDirective,
] as const;
```

```angular-ts
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID } from '@angular/core';

import { ZardAlertDialogContainerComponent, ZardAlertDialogOptions } from './alert-dialog-container.component';
import { ZardAlertDialogRef } from './alert-dialog-ref';
import { ALERT_DIALOG_BACKDROP_CLASSES } from './alert-dialog.variants';

export const Z_ALERT_MODAL_DATA = new InjectionToken<unknown>('Z_ALERT_MODAL_DATA');

/**
 * Type-safe accessor for the data passed to an alert dialog via {@link ZardAlertDialogOptions.zData}.
 *
 * Must be called from an injection context (component constructor / field initializer).
 *
 * @example
 * private readonly data = injectAlertDialogData<MyData>();
 */
export function injectAlertDialogData<T>(): T {
  return inject(Z_ALERT_MODAL_DATA) as T;
}

@Injectable({
  providedIn: 'root',
})
export class ZardAlertDialogService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Opens an alert dialog with the given configuration.
   *
   * On non-browser platforms (SSR / build) the returned `ZardAlertDialogRef`
   * is a no-op that resolves cleanly when calling `close()`.
   */
  create<T>(config: ZardAlertDialogOptions<T>): ZardAlertDialogRef<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return new ZardAlertDialogRef<T>(null, config, null, this.platformId);
    }

    const overlayRef = this.createOverlay();
    const alertDialogContainer = this.attachAlertDialogContainer<T>(overlayRef, config);
    const alertDialogRef = new ZardAlertDialogRef<T>(overlayRef, config, alertDialogContainer, this.platformId);

    alertDialogContainer.alertDialogRef = alertDialogRef;

    return alertDialogRef;
  }

  confirm<T>(
    config: Omit<ZardAlertDialogOptions<T>, 'zOkText' | 'zCancelText'> & {
      zOkText?: string;
      zCancelText?: string;
    },
  ): ZardAlertDialogRef<T> {
    return this.create({
      ...config,
      zOkText: config.zOkText ?? 'Confirm',
      zCancelText: config.zCancelText ?? 'Cancel',
      zOkDestructive: config.zOkDestructive ?? false,
    });
  }

  warning<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    return this.create({
      ...config,
      zOkText: config.zOkText ?? 'OK',
      zCancelText: null,
    });
  }

  info<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    return this.create({
      ...config,
      zOkText: config.zOkText ?? 'OK',
      zCancelText: null,
    });
  }

  private createOverlay(): OverlayRef {
    return this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: ALERT_DIALOG_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
      }),
    );
  }

  private attachAlertDialogContainer<T>(overlayRef: OverlayRef, config: ZardAlertDialogOptions<T>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardAlertDialogOptions, useValue: config },
        { provide: Z_ALERT_MODAL_DATA, useValue: config.zData },
      ],
    });

    const containerPortal = new ComponentPortal<ZardAlertDialogContainerComponent<T>>(
      ZardAlertDialogContainerComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach(containerPortal).instance;
  }
}
```

```angular-ts
export { type OnClickCallback as AlertDialogOnClickCallback } from './alert-dialog-container.component';
export { ZardAlertDialogContainerComponent, ZardAlertDialogOptions } from './alert-dialog-container.component';
export * from './alert-dialog-host';
export * from './alert-dialog-panel.component';
export * from './alert-dialog-ref';
export * from './alert-dialog.component';
export * from './alert-dialog.imports';
export * from './alert-dialog.service';
export * from './alert-dialog.variants';
```

## Usage

```angular-ts
import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
```

```angular-html
<button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

<z-alert-dialog [(zVisible)]="visible">
  <z-alert-dialog-header>
    <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
    <z-alert-dialog-description>
      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
    </z-alert-dialog-description>
  </z-alert-dialog-header>
  <z-alert-dialog-footer>
    <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
    <button type="button" z-button (click)="visible.set(false)">Continue</button>
  </z-alert-dialog-footer>
</z-alert-dialog>
```

## Composition

```text
z-alert-dialog
├── z-alert-dialog-header
│   ├── z-alert-dialog-media
│   ├── z-alert-dialog-title
│   └── z-alert-dialog-description
└── z-alert-dialog-footer
    └── [z-alert-dialog-close]
```

## Examples

### Basic

The minimal alert dialog: a title, a description and the cancel/continue buttons. In the template the buttons are yours; `[z-alert-dialog-close]` closes without a handler.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-basic',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogBasicComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}
```

### Small

Use `zSize="sm"`, as an input or an option, to make the alert dialog smaller.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-small',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible" zSize="sm">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Allow accessory to connect?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Do you want to allow the USB accessory to connect to this device?
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Don't allow</button>
            <button type="button" z-button (click)="visible.set(false)">Allow</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogSmallComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open() {
    this.alertDialogService.create({
      zSize: 'sm',
      zTitle: 'Allow accessory to connect?',
      zDescription: 'Do you want to allow the USB accessory to connect to this device?',
      zOkText: 'Allow',
      zCancelText: "Don't allow",
    });
  }
}
```

### Media

Add a media element such as an icon above the title: `z-alert-dialog-media` in the template, or a `<ng-template>` passed via `zMedia` to the service.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingPlus } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-media',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports, NgIcon],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Share Project</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-media>
              <ng-icon name="lucideCircleFadingPlus" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Share this project?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Anyone with the link will be able to view and edit this project.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Share</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <ng-template #mediaIcon>
          <ng-icon name="lucideCircleFadingPlus" />
        </ng-template>
        <button type="button" z-button zType="outline" (click)="open(mediaIcon)">Share Project</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingPlus })],
})
export class ZardDemoAlertDialogMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zMedia: media,
      zTitle: 'Share this project?',
      zDescription: 'Anyone with the link will be able to view and edit this project.',
      zOkText: 'Share',
      zCancelText: 'Cancel',
    });
  }
}
```

### Small With Media

Combine `zSize="sm"` with the media slot to add a media element to the smaller alert dialog.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-small-with-media',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports, NgIcon],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible" zSize="sm">
          <z-alert-dialog-header>
            <z-alert-dialog-media>
              <ng-icon name="lucideBluetooth" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Allow accessory to connect?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Do you want to allow the USB accessory to connect to this device?
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Don't allow</button>
            <button type="button" z-button (click)="visible.set(false)">Allow</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <ng-template #mediaIcon>
          <ng-icon name="lucideBluetooth" />
        </ng-template>
        <button type="button" z-button zType="outline" (click)="open(mediaIcon)">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBluetooth })],
})
export class ZardDemoAlertDialogSmallWithMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zSize: 'sm',
      zMedia: media,
      zTitle: 'Allow accessory to connect?',
      zDescription: 'Do you want to allow the USB accessory to connect to this device?',
      zOkText: 'Allow',
      zCancelText: "Don't allow",
    });
  }
}
```

### Destructive

A destructive action: tint the media slot (`class` on `z-alert-dialog-media`, or `zMediaClass`) and make the confirm button destructive (`zType="destructive"`, or `zOkDestructive: true`).

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-destructive',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports, NgIcon],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="destructive" (click)="visible.set(true)">Delete Chat</button>

        <z-alert-dialog [(zVisible)]="visible" zSize="sm">
          <z-alert-dialog-header>
            <z-alert-dialog-media class="bg-destructive/10 text-destructive dark:bg-destructive/20">
              <ng-icon name="lucideTrash2" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Delete chat?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This will permanently delete this chat conversation. View
              <a href="#">Settings</a>
              delete any memories saved during this chat.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button zType="destructive" (click)="visible.set(false)">Delete</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <ng-template #mediaIcon>
          <ng-icon name="lucideTrash2" />
        </ng-template>
        <button type="button" z-button zType="destructive" (click)="open(mediaIcon)">Delete Chat</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrash2 })],
})
export class ZardDemoAlertDialogDestructiveComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zSize: 'sm',
      zMedia: media,
      zMediaClass: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
      zTitle: 'Delete chat?',
      zDescription:
        'This will permanently delete this chat conversation. View <a href="#">Settings</a> delete any memories saved during this chat.',
      zOkText: 'Delete',
      zCancelText: 'Cancel',
      zOkDestructive: true,
    });
  }
}
```

## API Reference

### z-alert-dialog

Root of a declarative alert dialog. Holds the open state and projects its content into the panel (`role="alertdialog"`), which exposes `data-size` and `data-state` (`open` | `closed`) while the enter and leave transitions run.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVisible]` | Open state, two-way bound | `boolean` | `false` |
| `[zSize]` | Visual size. `default` widens on `sm+` and lays the media next to the title; `sm` keeps a compact, centered layout | `'default' \| 'sm'` | `'default'` |
| `[zWidth]` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `[zMaskClosable]` | Whether clicking outside closes the alert dialog. Off by default: the user has to decide | `boolean` | `false` |
| `[zDuration]` | How long the enter and leave transitions run, in ms | `number` | `100` |
| `[class]` | Custom CSS classes applied to the panel | `ClassValue` | `-` |
| `(zAfterOpen)` | Emitted once the alert dialog is attached | `EventEmitter<void>` | `-` |
| `(zAfterClose)` | Emitted once the exit transition has finished | `EventEmitter<void>` | `-` |

### z-alert-dialog-header

Layout slot for the top of an alert dialog: `z-alert-dialog-media`, `z-alert-dialog-title` and `z-alert-dialog-description`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-alert-dialog-media

Media slot above the title, usually an icon. The header lays it next to the title on `default` size.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply (e.g. tinted backgrounds for destructive) | `ClassValue` | `-` |

### z-alert-dialog-title

Accessible name of the alert dialog. Wired to `aria-labelledby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Title text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-alert-dialog-description

Supporting text. Wired to `aria-describedby` automatically.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDescription]` | Description text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### z-alert-dialog-footer

Layout slot for the action buttons.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes to apply | `ClassValue` | `-` |

### [z-alert-dialog-close]

Closes the alert dialog it is projected into. Works for declarative and service-opened alert dialogs alike.

### ZardAlertDialogService

Opens the same alert dialog from code. `create()`, `confirm()`, `warning()` and `info()` take the options below and return a `ZardAlertDialogRef`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Dialog title text or template | `string \| TemplateRef<void>` | `-` |
| `[zDescription]` | Dialog description/body text | `string` | `-` |
| `[zMedia]` | Template rendered as a media slot above the title (e.g. an icon) | `TemplateRef<void>` | `-` |
| `[zMediaClass]` | Extra classes applied to the media slot wrapper (e.g. tinted backgrounds for destructive) | `ClassValue` | `-` |
| `[zData]` | Data to pass to custom content components | `object` | `-` |
| `[zOkText]` | OK button text, null to hide button | `string \| null` | `'Continue'` |
| `[zCancelText]` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `[zOkDestructive]` | Whether OK button should have destructive styling | `boolean` | `false` |
| `[zOkDisabled]` | Whether OK button should be disabled | `boolean` | `false` |
| `[zMaskClosable]` | Whether clicking outside closes the dialog | `boolean` | `false` |
| `[zClosable]` | Whether dialog can be closed | `boolean` | `true` |
| `[zSize]` | Visual size of the dialog. `default` is wider on `sm+` breakpoints; `sm` keeps a compact width | `'default' \| 'sm'` | `'default'` |
| `[zWidth]` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `[zCustomClasses]` | Additional CSS classes to apply | `ClassValue` | `-` |
| `[zDuration]` | Animation duration (ms) used when closing. Matches the CSS transition | `number` | `100` |
| `[zOnOk]` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zOnCancel]` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zViewContainerRef]` | View container for rendering custom content | `ViewContainerRef` | `-` |

---

[Open in browser](https://zardui.com/docs/components/alert-dialog)
