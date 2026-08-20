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
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
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
  inject,
  output,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardDialogRef } from './dialog-ref';
import {
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogVariants,
} from './dialog.variants';
import { ZardButtonComponent } from '../button/button.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardDialogOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when closing. Defaults to 100 (matches CSS transition). */
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
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-dialog',
  imports: [A11yModule, OverlayModule, PortalModule, ZardButtonComponent, ZardIdDirective, NgIcon],
  template: `
    <ng-container zardId="z-dialog" #idRef="zardId">
      @if (config.zClosable || config.zClosable === undefined) {
        <button
          type="button"
          data-testid="z-close-header-button"
          data-slot="dialog-close"
          z-button
          zType="ghost"
          zSize="icon-sm"
          class="absolute top-2 right-2"
          (click)="onCloseClick()"
        >
          <ng-icon name="lucideX" class="size-4!" />
          <span class="sr-only">Close</span>
        </button>
      }

      @if (config.zTitle || config.zDescription) {
        <header [class]="headerClasses()" data-slot="dialog-header">
          @if (config.zTitle) {
            <h4 data-testid="z-title" data-slot="dialog-title" [class]="titleClasses()" [id]="idRef.id() + '-title'">
              {{ config.zTitle }}
            </h4>

            @if (config.zDescription) {
              <p
                data-testid="z-description"
                data-slot="dialog-description"
                [class]="descriptionClasses()"
                [id]="idRef.id() + '-description'"
              >
                {{ config.zDescription }}
              </p>
            }
          }
        </header>
      }

      <main class="flex flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <footer [class]="footerClasses()" data-slot="dialog-footer">
          @if (config.zCancelText !== null) {
            <button type="button" data-testid="z-cancel-button" z-button zType="outline" (click)="onCloseClick()">
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
              (click)="onOkClick()"
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
        </footer>
      }
    </ng-container>
  `,
  styles: `
    :host {
      --z-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-dialog-duration) ease-out,
        transform var(--z-dialog-duration) ease-out;
    }

    @starting-style {
      :host {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    :host.dialog-leave {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-dialog-duration) ease-in,
        transform var(--z-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    '[style.--z-dialog-duration]': 'durationCss()',
    'data-slot': 'dialog-content',
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    cdkTrapFocus: 'true',
    cdkTrapFocusAutoCapture: 'true',
  },
  exportAs: 'zDialog',
})
export class ZardDialogComponent<T, U> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardDialogOptions<T, U>);
  private readonly idRef = viewChild.required<ZardIdDirective>('idRef');

  protected readonly classes = computed(() => mergeClasses(dialogVariants(), this.config.zCustomClasses));
  protected readonly headerClasses = computed(() =>
    mergeClasses(dialogHeaderVariants(), this.config.zHideHeader && 'sr-only'),
  );

  protected readonly titleClasses = computed(() => dialogTitleVariants());
  protected readonly descriptionClasses = computed(() => dialogDescriptionVariants());
  protected readonly footerClasses = computed(() => dialogFooterVariants());
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');
  protected readonly titleId = computed(() => (this.config.zTitle ? `${this.idRef().id()}-title` : null));
  protected readonly descriptionId = computed(() =>
    this.config.zDescription ? `${this.idRef().id()}-description` : null,
  );

  protected readonly durationCss = computed(() =>
    this.config.zDuration !== undefined ? `${this.config.zDuration}ms` : null,
  );

  protected isSvgString(icon: string): boolean {
    return /^\s*<svg/i.test(icon);
  }

  dialogRef?: ZardDialogRef<T>;

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();

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

  onOkClick() {
    this.okTriggered.emit();
  }

  onCloseClick() {
    this.cancelTriggered.emit();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  [
    'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4',
    'rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none',
    'sm:max-w-sm',
  ].join(' '),
);

export const dialogHeaderVariants = cva('flex flex-col gap-2');

export const dialogTitleVariants = cva('text-base leading-none font-medium');

export const dialogDescriptionVariants = cva(
  'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-[3px] *:[a]:hover:text-foreground',
);

export const dialogFooterVariants = cva(
  '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end',
);

export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
```

```angular-ts
import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil } from 'rxjs';

import type { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/**
 * Reference to a dialog opened via {@link ZardDialogService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the dialog.
 *
 * Multiple open dialogs are tracked in a private stack so that pressing
 * Escape only closes the topmost one.
 */
export class ZardDialogRef<T = unknown, R = unknown, U = unknown> {
  /** Stack of currently open dialogs. The last entry is the topmost. */
  private static readonly stack: ZardDialogRef[] = [];

  /** Element focused before the dialog opened, used to restore focus on close. */
  private readonly previouslyFocusedElement: HTMLElement | null;

  /** Animation duration (ms) used when closing. Mirrors the CSS transition. */
  private readonly animationDuration: number;

  /** Pending dispose timer; cleared if dispose runs early or twice. */
  private disposeTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  private readonly _isClosing = signal(false);
  private readonly _result = signal<R | undefined>(undefined);
  private readonly _componentInstance = signal<T | null>(null);

  /** True from the moment {@link close} is called until the overlay is disposed. */
  readonly isClosing = this._isClosing.asReadonly();
  /** Result passed to {@link close}, available after it's called. */
  readonly result = this._result.asReadonly();
  /** Instance of the component projected as content, or null for templates / strings. */
  readonly componentInstance = this._componentInstance.asReadonly();

  constructor(
    private readonly overlayRef: OverlayRef | null,
    private readonly config: ZardDialogOptions<T, U>,
    private readonly containerInstance: ZardDialogComponent<T, U> | null,
    private readonly platformId: object,
  ) {
    this.animationDuration = config.zDuration ?? 100;
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;

    if (!this.overlayRef || !this.containerInstance) return;

    ZardDialogRef.stack.push(this as unknown as ZardDialogRef);

    const detached$ = this.overlayRef.detachments();

    // If the overlay is torn down externally (parent destroyed, app shutdown, etc.),
    // ensure stack/focus state is cleaned up.
    detached$.subscribe(() => this.dispose());

    outputToObservable(this.containerInstance.cancelTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.trigger(eTriggerAction.CANCEL));
    outputToObservable(this.containerInstance.okTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.trigger(eTriggerAction.OK));

    if (config.zMaskClosable ?? true) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(detached$))
        .subscribe(() => this.close());
    }

    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => ESCAPE_KEYS.includes(event.key as (typeof ESCAPE_KEYS)[number])),
        takeUntil(detached$),
      )
      .subscribe(event => {
        if (this.isTopmost()) {
          event.preventDefault();
          this.close();
        }
      });
  }

  /** Internal: set the component instance once attached. */
  setComponentInstance(instance: T | null) {
    this._componentInstance.set(instance);
  }

  close(result?: R) {
    if (this._isClosing()) return;

    this._isClosing.set(true);
    this._result.set(result);

    if (isPlatformBrowser(this.platformId) && this.containerInstance) {
      const hostElement = this.containerInstance.getNativeElement();
      hostElement.classList.add('dialog-leave');
    }

    this.disposeTimer = setTimeout(() => this.dispose(), this.animationDuration);
  }

  private dispose() {
    if (this.disposed) return;
    this.disposed = true;

    if (this.disposeTimer !== null) {
      clearTimeout(this.disposeTimer);
      this.disposeTimer = null;
    }

    if (this.overlayRef) {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detachBackdrop();
      }
      this.overlayRef.dispose();
    }

    const idx = ZardDialogRef.stack.indexOf(this as unknown as ZardDialogRef);
    if (idx >= 0) ZardDialogRef.stack.splice(idx, 1);

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private isTopmost(): boolean {
    return ZardDialogRef.stack[ZardDialogRef.stack.length - 1] === (this as unknown as ZardDialogRef);
  }

  private trigger(action: eTriggerAction) {
    const trigger = action === eTriggerAction.OK ? this.config.zOnOk : this.config.zOnCancel;

    if (trigger instanceof EventEmitter) {
      trigger.emit(this._componentInstance() as T);
    } else if (typeof trigger === 'function') {
      const result = trigger(this._componentInstance() as T) as R | false;
      if (result !== false) {
        this.close(result as R);
      }
    } else {
      this.close();
    }
  }
}
```

```angular-ts
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogComponent } from '@/shared/components/dialog/dialog.component';

export const ZardDialogImports = [ZardButtonComponent, ZardDialogComponent, OverlayModule, PortalModule] as const;
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

import { ZardDialogRef } from './dialog-ref';
import { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

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
        backdropClass: ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'],
        positionStrategy: this.overlay.position().global(),
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

    const containerPortal = new ComponentPortal<ZardDialogComponent<T, U>>(
      ZardDialogComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach<ZardDialogComponent<T, U>>(containerPortal).instance;
  }

  private attachDialogContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    dialogContainer: ZardDialogComponent<T, U>,
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
    } else if (typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T, U>(dialogRef, config);
      const contentRef = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      dialogRef.setComponentInstance(contentRef.instance);
    }

    return dialogRef;
  }

  private createInjector<T, U>(dialogRef: ZardDialogRef<T>, config: ZardDialogOptions<T, U>): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardDialogRef, useValue: dialogRef },
        { provide: Z_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}
```

```angular-ts
export { ZardDialogComponent, ZardDialogOptions } from './dialog.component';
export { type OnClickCallback as DialogOnClickCallback } from './dialog.component';
export * from './dialog.service';
export * from './dialog-ref';
export * from './dialog.variants';
export * from './dialog.imports';
```

## Usage

```angular-ts
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
```

```angular-html
<z-dialog zTitle="Edit profile" zDescription="Make changes to your profile here.">
  <p>Dialog content goes here.</p>
</z-dialog>
```

## Examples

### Custom Close

Replace the default close control with your own button.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogRef } from '@/shared/components/dialog/dialog-ref';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'zard-demo-dialog-custom-close-content',
  imports: [ZardButtonComponent, ZardInputComponent],
  template: `
    <div class="flex items-center gap-2">
      <div class="grid flex-1 gap-2">
        <label for="link" class="sr-only">Link</label>
        <input z-input id="link" value="https://ui.zardui.com/docs/installation" readonly />
      </div>
    </div>
    <footer
      class="bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-start"
    >
      <button type="button" z-button (click)="dialogRef.close()">Close</button>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseContentComponent {
  protected readonly dialogRef = inject(ZardDialogRef);
}

@Component({
  selector: 'zard-demo-dialog-custom-close',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Share</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogCustomCloseComponent {
  private readonly dialogService = inject(ZardDialogService);

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

Use `zClosable: false` to hide the close button.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'zard-demo-dialog-no-close-button',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">No Close Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogNoCloseButtonComponent {
  private readonly dialogService = inject(ZardDialogService);

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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

@Component({
  selector: 'zard-demo-dialog-sticky-footer-content',
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
  selector: 'zard-demo-dialog-sticky-footer',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Sticky Footer</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogStickyFooterComponent {
  private readonly dialogService = inject(ZardDialogService);

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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

const PARAGRAPHS = Array.from({ length: 10 }).map(
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

@Component({
  selector: 'zard-demo-dialog-scrollable-content-content',
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
  selector: 'zard-demo-dialog-scrollable-content',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Scrollable Content</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogScrollableContentComponent {
  private readonly dialogService = inject(ZardDialogService);

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

### ZardDialogService

Provides methods to open and close dialogs.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zAutofocus` | Sets the autofocus button. | `'ok' \| 'cancel' \| 'auto' \| null` | `'auto'` |
| `zCancelIcon` | Sets the cancel icon. | `string` |  |
| `zCancelText` | Sets the cancel text. | `string` |  |
| `zClosable` | Enables closing the dialog. | `boolean` | `true` |
| `zContent` | Sets the dialog content. | `string \| TemplateRef<T> \| Type<T>` |  |
| `zData` | Sets the data for the dialog. | `U` |  |
| `zDescription` | Sets the dialog description. | `string` |  |
| `zHideFooter` | Hides the footer. | `boolean` | `false` |
| `zHideHeader` | Keeps the title and description available to screen readers only (`sr-only`). | `boolean` | `false` |
| `zMaskClosable` | Enables closing the dialog by clicking on the mask. | `boolean` | `true` |
| `zOkDestructive` | Marks the OK button as destructive. | `boolean` | `false` |
| `zOkDisabled` | Disables the OK button. | `boolean` | `false` |
| `zOkIcon` | Sets the OK button icon. | `string` |  |
| `zOkText` | Sets the OK button text. | `string \| null` |  |
| `zOnCancel` | Callback for cancel action. | `EventEmitter<T> \| OnClickCallback<T>` | `noopFn` |
| `zOnOk` | Callback for OK action. | `EventEmitter<T> \| OnClickCallback<T>` | `noopFn` |
| `zTitle` | Sets the dialog title. | `string \| TemplateRef<T>` |  |
| `zViewContainerRef` | View container reference for dynamic component loading. | `ViewContainerRef` |  |
| `zWidth` | Sets the dialog width. | `string` |  |

---

[Open in browser](https://zardui.com/docs/components/dialog)
