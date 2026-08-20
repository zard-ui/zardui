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
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  type ComponentPortal,
  PortalModule,
  type TemplatePortal,
} from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  ElementRef,
  type EmbeddedViewRef,
  type EventEmitter,
  inject,
  output,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

import type { ZardAlertDialogRef } from './alert-dialog-ref';
import {
  alertDialogDescriptionVariants,
  alertDialogFooterVariants,
  alertDialogHeaderVariants,
  alertDialogMediaVariants,
  alertDialogTitleVariants,
  alertDialogVariants,
  type ZardAlertDialogSizeVariants,
} from './alert-dialog.variants';
import { ZardButtonComponent } from '../button/button.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardAlertDialogOptions<T> {
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: object;
  zDescription?: string;
  /** Animation duration (ms) used when closing. Defaults to 100 (matches CSS transition). */
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
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-alert-dialog',
  imports: [A11yModule, NgTemplateOutlet, OverlayModule, PortalModule, ZardButtonComponent, ZardIdDirective],
  template: `
    <ng-container zardId="z-alert-dialog" #idRef="zardId">
      @if (config.zMedia || config.zTitle || config.zDescription) {
        <header [class]="headerClasses()" data-slot="alert-dialog-header">
          @if (config.zMedia) {
            <div data-slot="alert-dialog-media" [class]="mediaClasses()">
              <ng-container [ngTemplateOutlet]="config.zMedia" />
            </div>
          }

          @if (config.zTitle) {
            <h2
              data-testid="z-alert-title"
              data-slot="alert-dialog-title"
              [class]="titleClasses()"
              [id]="idRef.id() + '-title'"
            >
              {{ config.zTitle }}
            </h2>
          }

          @if (config.zDescription) {
            <!-- Angular auto-sanitizes [innerHTML]; safe inline links/markup are preserved. -->
            <p
              data-testid="z-alert-description"
              data-slot="alert-dialog-description"
              [class]="descriptionClasses()"
              [id]="idRef.id() + '-description'"
              [innerHTML]="config.zDescription"
            ></p>
          }
        </header>
      }

      <main class="flex flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-alert-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      <footer [class]="footerClasses()" data-slot="alert-dialog-footer">
        @if (config.zCancelText !== null) {
          <button type="button" data-testid="z-alert-cancel-button" z-button zType="outline" (click)="onCancelClick()">
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
            (click)="onOkClick()"
          >
            {{ config.zOkText || 'Continue' }}
          </button>
        }
      </footer>
    </ng-container>
  `,
  styles: `
    :host {
      --z-alert-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-alert-dialog-duration) ease-out,
        transform var(--z-alert-dialog-duration) ease-out;
    }

    @starting-style {
      :host {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    :host.alert-dialog-leave {
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
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    '[style.--z-alert-dialog-duration]': 'durationCss()',
    '[attr.data-size]': 'size()',
    'data-slot': 'alert-dialog-content',
    role: 'alertdialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    cdkTrapFocus: 'true',
    cdkTrapFocusAutoCapture: 'true',
  },
  exportAs: 'zAlertDialog',
})
export class ZardAlertDialogComponent<T> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardAlertDialogOptions<T>);
  private readonly idRef = viewChild.required<ZardIdDirective>('idRef');

  protected readonly size = computed<ZardAlertDialogSizeVariants>(() => this.config.zSize ?? 'default');
  protected readonly classes = computed(() =>
    mergeClasses(alertDialogVariants({ zSize: this.size() }), this.config.zCustomClasses),
  );

  protected readonly headerClasses = computed(() => alertDialogHeaderVariants());
  protected readonly titleClasses = computed(() => alertDialogTitleVariants());
  protected readonly descriptionClasses = computed(() => alertDialogDescriptionVariants());
  protected readonly footerClasses = computed(() => alertDialogFooterVariants());
  protected readonly mediaClasses = computed(() => mergeClasses(alertDialogMediaVariants(), this.config.zMediaClass));
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');
  protected readonly titleId = computed(() => (this.config.zTitle ? `${this.idRef().id()}-title` : null));
  protected readonly descriptionId = computed(() =>
    this.config.zDescription ? `${this.idRef().id()}-description` : null,
  );

  protected readonly durationCss = computed(() =>
    this.config.zDuration !== undefined ? `${this.config.zDuration}ms` : null,
  );

  alertDialogRef?: ZardAlertDialogRef<T>;

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<C>(portal: ComponentPortal<C>): ComponentRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet().attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCancelClick() {
    this.cancelTriggered.emit();
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

export const alertDialogHeaderVariants = cva([
  'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center',
  'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4',
  'sm:group-data-[size=default]/alert-dialog-content:place-items-start',
  'sm:group-data-[size=default]/alert-dialog-content:text-left',
  'sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
]);

export const alertDialogTitleVariants = cva([
  'text-base font-medium',
  'sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
]);

export const alertDialogDescriptionVariants = cva([
  'text-sm text-balance text-muted-foreground md:text-pretty',
  '*:[a]:underline *:[a]:underline-offset-[3px] *:[a]:hover:text-foreground',
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
import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

/** How long the leave transition runs, in ms. Mirrors the CSS. */
const ALERT_DIALOG_DURATION = 100;

/**
 * Reference to an alert dialog opened via {@link ZardAlertDialogService}.
 *
 * The lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog, sheet
 * and drawer. Two things are the alert dialog's own: the mask does not dismiss
 * unless `zMaskClosable` says so — a confirmation should not be dismissable by
 * accident — and it closes with no result, because the answer is yes or no.
 */
export class ZardAlertDialogRef<T = unknown> extends ZardOverlayRefBase<T, void> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogComponent<T> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardAlertDialogRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return ALERT_DIALOG_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.getNativeElement().classList.add('alert-dialog-leave');
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

import { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string | undefined;

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
    const alertDialogRef = this.attachAlertDialogContent<T>(config.zContent, alertDialogContainer, overlayRef, config);

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
        backdropClass: ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'],
        positionStrategy: this.overlay.position().global(),
      }),
    );
  }

  private attachAlertDialogContainer<T>(overlayRef: OverlayRef, config: ZardAlertDialogOptions<T>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardAlertDialogOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardAlertDialogComponent<T>>(
      ZardAlertDialogComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach(containerPortal).instance;
  }

  private attachAlertDialogContent<T>(
    componentOrTemplateRef: ContentType<T>,
    alertDialogContainer: ZardAlertDialogComponent<T>,
    overlayRef: OverlayRef,
    config: ZardAlertDialogOptions<T>,
  ): ZardAlertDialogRef<T> {
    const alertDialogRef = new ZardAlertDialogRef<T>(overlayRef, config, alertDialogContainer, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      // CDK's TemplatePortal type requires a ViewContainerRef even though it tolerates null at runtime,
      // and types the template context as T (the template's data shape) — we expose `alertDialogRef` instead.
      const vcr = (config.zViewContainerRef ?? null) as unknown as ViewContainerRef;
      const ctx = { alertDialogRef } as unknown as T;
      alertDialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, vcr, ctx));
    } else if (componentOrTemplateRef && typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T>(alertDialogRef, config);
      const contentRef = alertDialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      alertDialogRef.setComponentInstance(contentRef.instance);
    }

    return alertDialogRef;
  }

  private createInjector<T>(alertDialogRef: ZardAlertDialogRef<T>, config: ZardAlertDialogOptions<T>): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardAlertDialogRef, useValue: alertDialogRef },
        { provide: Z_ALERT_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}
```

```angular-ts
export { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';
export { type OnClickCallback as AlertDialogOnClickCallback } from './alert-dialog.component';
export * from './alert-dialog.service';
export * from './alert-dialog-ref';
export * from './alert-dialog.variants';
```

## Usage

```angular-ts
import { ZardAlertDialogComponent } from '@/shared/components/alert-dialog/alert-dialog.component';
```

```angular-html
<z-alert-dialog
  zTitle="Are you absolutely sure?"
  zDescription="This action cannot be undone."
></z-alert-dialog>
```

## Examples

### Small

Use the `zSize: "sm"` option to make the alert dialog smaller.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'z-demo-alert-dialog-small',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogSmallComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

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

Pass a `<ng-template>` via `zMedia` to add a media element such as an icon or image to the alert dialog.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingPlus } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'z-demo-alert-dialog-media',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideCircleFadingPlus" />
    </ng-template>
    <button type="button" z-button zType="outline" (click)="open(mediaIcon)">Share Project</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingPlus })],
})
export class ZardDemoAlertDialogMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

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

Combine `zSize: "sm"` with the `zMedia` template to add a media element to the smaller alert dialog.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'z-demo-alert-dialog-small-with-media',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideBluetooth" />
    </ng-template>
    <button type="button" z-button zType="outline" (click)="open(mediaIcon)">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBluetooth })],
})
export class ZardDemoAlertDialogSmallWithMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

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

Use `zOkDestructive: true` along with `zMediaClass` to add a destructive action to the alert dialog.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'z-demo-alert-dialog-destructive',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideTrash2" />
    </ng-template>
    <button type="button" z-button zType="destructive" (click)="open(mediaIcon)">Delete Chat</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrash2 })],
})
export class ZardDemoAlertDialogDestructiveComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

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

### ZardAlertDialogService

Configuration options for creating alert dialogs.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | Dialog title text or template | `string \| TemplateRef<T>` | `-` |
| `[zDescription]` | Dialog description/body text | `string` | `-` |
| `[zContent]` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `[zData]` | Data to pass to custom content components | `object` | `-` |
| `[zOkText]` | OK button text, null to hide button | `string \| null` | `'Continue'` |
| `[zCancelText]` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `[zOkDestructive]` | Whether OK button should have destructive styling | `boolean` | `false` |
| `[zOkDisabled]` | Whether OK button should be disabled | `boolean` | `false` |
| `[zMaskClosable]` | Whether clicking outside closes the dialog | `boolean` | `false` |
| `[zClosable]` | Whether dialog can be closed | `boolean` | `true` |
| `[zWidth]` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `[zCustomClasses]` | Additional CSS classes to apply | `ClassValue` | `-` |
| `[zOnOk]` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zOnCancel]` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `[zViewContainerRef]` | View container for rendering custom content | `ViewContainerRef` | `-` |

---

[Open in browser](https://zardui.com/docs/components/alert-dialog)
