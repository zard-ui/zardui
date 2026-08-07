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

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardSheetRef } from './sheet-ref';
import {
  sheetDescriptionVariants,
  sheetFooterVariants,
  sheetHeaderVariants,
  sheetTitleVariants,
  sheetVariants,
  type ZardSheetVariants,
} from './sheet.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardSheetOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when closing. Defaults to 200 (matches CSS transition). */
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
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-sheet',
  imports: [A11yModule, OverlayModule, PortalModule, ZardButtonComponent, ZardIdDirective, NgIcon],
  template: `
    <ng-container zardId="z-sheet" #idRef="zardId">
      @if (config.zClosable || config.zClosable === undefined) {
        <button
          type="button"
          data-testid="z-close-header-button"
          data-slot="sheet-close"
          z-button
          zType="ghost"
          zSize="icon-sm"
          class="absolute top-3 right-3"
          (click)="onCloseClick()"
        >
          <ng-icon name="lucideX" class="size-4!" />
          <span class="sr-only">Close</span>
        </button>
      }

      @if (config.zTitle || config.zDescription) {
        <header [class]="headerClasses()" data-slot="sheet-header">
          @if (config.zTitle) {
            <h4 data-testid="z-title" data-slot="sheet-title" [class]="titleClasses()" [id]="idRef.id() + '-title'">
              {{ config.zTitle }}
            </h4>

            @if (config.zDescription) {
              <p
                data-testid="z-description"
                data-slot="sheet-description"
                [class]="descriptionClasses()"
                [id]="idRef.id() + '-description'"
              >
                {{ config.zDescription }}
              </p>
            }
          }
        </header>
      }

      <main class="flex w-full flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <footer [class]="footerClasses()" data-slot="sheet-footer">
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
        </footer>
      }
    </ng-container>
  `,
  styles: `
    :host {
      --z-sheet-duration: 200ms;
      opacity: 1;
      translate: 0 0;
      transition:
        opacity var(--z-sheet-duration) ease-in-out,
        translate var(--z-sheet-duration) ease-in-out;
    }

    @starting-style {
      :host([data-side='right']) {
        opacity: 0;
        translate: 2.5rem 0;
      }

      :host([data-side='left']) {
        opacity: 0;
        translate: -2.5rem 0;
      }

      :host([data-side='top']) {
        opacity: 0;
        translate: 0 -2.5rem;
      }

      :host([data-side='bottom']) {
        opacity: 0;
        translate: 0 2.5rem;
      }
    }

    :host(.sheet-leave[data-side='right']) {
      opacity: 0;
      translate: 2.5rem 0;
    }

    :host(.sheet-leave[data-side='left']) {
      opacity: 0;
      translate: -2.5rem 0;
    }

    :host(.sheet-leave[data-side='top']) {
      opacity: 0;
      translate: 0 -2.5rem;
    }

    :host(.sheet-leave[data-side='bottom']) {
      opacity: 0;
      translate: 0 2.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    'data-slot': 'sheet-content',
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    '[style.height]': 'config.zHeight ? config.zHeight : null',
    '[style.--z-sheet-duration]': 'durationCss()',
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    cdkTrapFocus: 'true',
    cdkTrapFocusAutoCapture: 'true',
  },
  exportAs: 'zSheet',
})
export class ZardSheetComponent<T, U> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardSheetOptions<T, U>);
  private readonly idRef = viewChild.required<ZardIdDirective>('idRef');

  protected readonly side = computed(() => this.config.zSide ?? 'right');

  protected readonly classes = computed(() => {
    const zSize = this.config.zWidth || this.config.zHeight ? 'custom' : this.config.zSize;

    return mergeClasses(sheetVariants({ zSide: this.side(), zSize }), this.config.zCustomClasses);
  });

  protected readonly headerClasses = computed(() => sheetHeaderVariants());
  protected readonly titleClasses = computed(() => sheetTitleVariants());
  protected readonly descriptionClasses = computed(() => sheetDescriptionVariants());
  protected readonly footerClasses = computed(() => sheetFooterVariants());
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

  sheetRef?: ZardSheetRef<T>;

  constructor() {
    super();

    // Set in the constructor rather than through a host binding: the CDK appends this element to the
    // DOM before the first change detection runs, and `@starting-style` only applies to the very
    // first style resolution — a late `data-side` would silently skip the enter animation.
    this.host.nativeElement.setAttribute('data-side', this.side());
  }

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

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

export const sheetVariants = cva(
  [
    'fixed z-50 flex flex-col gap-4',
    'bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg outline-none',
  ].join(' '),
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

export const sheetHeaderVariants = cva('flex flex-col gap-0.5 p-4');

export const sheetTitleVariants = cva('text-base font-medium text-foreground');

export const sheetDescriptionVariants = cva('text-sm text-muted-foreground');

export const sheetFooterVariants = cva('mt-auto flex flex-col gap-2 p-4');

export type ZardSheetVariants = VariantProps<typeof sheetVariants>;
```

```angular-ts
export { type OnClickCallback as SheetOnClickCallback } from '@/shared/components/sheet/sheet.component';
export { ZardSheetComponent, ZardSheetOptions } from '@/shared/components/sheet/sheet.component';
export * from '@/shared/components/sheet/sheet.service';
export * from '@/shared/components/sheet/sheet-ref';
export * from '@/shared/components/sheet/sheet.imports';
export * from '@/shared/components/sheet/sheet.variants';
```

```angular-ts
import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil } from 'rxjs';

import type { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/**
 * Reference to a sheet opened via {@link ZardSheetService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the sheet.
 *
 * Multiple open sheets are tracked in a private stack so that pressing
 * Escape only closes the topmost one.
 */
export class ZardSheetRef<T = unknown, R = unknown, U = unknown> {
  /** Stack of currently open sheets. The last entry is the topmost. */
  private static readonly stack: ZardSheetRef[] = [];

  /** Element focused before the sheet opened, used to restore focus on close. */
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
    private readonly config: ZardSheetOptions<T, U>,
    private readonly containerInstance: ZardSheetComponent<T, U> | null,
    private readonly platformId: object,
  ) {
    this.animationDuration = config.zDuration ?? 200;
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;

    if (!this.overlayRef || !this.containerInstance) return;

    ZardSheetRef.stack.push(this as unknown as ZardSheetRef);

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
      hostElement.classList.add('sheet-leave');
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

    const idx = ZardSheetRef.stack.indexOf(this as unknown as ZardSheetRef);
    if (idx >= 0) ZardSheetRef.stack.splice(idx, 1);

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private isTopmost(): boolean {
    return ZardSheetRef.stack[ZardSheetRef.stack.length - 1] === (this as unknown as ZardSheetRef);
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

import { ZardSheetComponent } from '@/shared/components/sheet/sheet.component';

export const ZardSheetImports = [ZardSheetComponent, OverlayModule, PortalModule] as const;
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

import { ZardSheetRef } from './sheet-ref';
import { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

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
        backdropClass: ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'],
        positionStrategy: this.overlay.position().global(),
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

    const containerPortal = new ComponentPortal<ZardSheetComponent<T, U>>(
      ZardSheetComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach<ZardSheetComponent<T, U>>(containerPortal).instance;
  }

  private attachSheetContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    sheetContainer: ZardSheetComponent<T, U>,
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
      const injector = this.createInjector<T, U>(sheetRef, config);
      const contentRef = sheetContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      sheetRef.setComponentInstance(contentRef.instance);
    }

    return sheetRef;
  }

  private createInjector<T, U>(sheetRef: ZardSheetRef<T>, config: ZardSheetOptions<T, U>): Injector {
    return Injector.create({
      parent: this.injector,
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
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
```

```angular-html
<button type="button" z-button zType="outline" (click)="openSheet()">Open</button>
```

## Examples

### Side

Use the `zSide` option to set the edge of the screen where the sheet appears. Values are `top`, `right`, `bottom`, or `left`.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import type { ZardSheetVariants } from '@/shared/components/sheet/sheet.variants';

@Component({
  selector: 'zard-demo-sheet-side-form',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label for="sheet-side-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="sheet-side-name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="sheet-side-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="sheet-side-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetSideForm',
})
export class ZardDemoSheetSideFormComponent {
  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });
}

@Component({
  imports: [ZardButtonComponent, ZardSheetImports],
  template: `
    <div class="grid grid-cols-2 gap-2">
      @for (side of sides; track side) {
        <button type="button" z-button zType="outline" (click)="openSheet(side)">{{ side }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetSideComponent {
  private readonly sheetService = inject(ZardSheetService);

  protected readonly sides = ['top', 'right', 'bottom', 'left'] as const satisfies readonly NonNullable<
    ZardSheetVariants['zSide']
  >[];

  openSheet(side: ZardSheetVariants['zSide']) {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetSideFormComponent,
      zSide: side,
      zOkText: 'Save changes',
      zCancelText: 'Close',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

### No Close Button

Use `zClosable: false` to hide the close button.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';

@Component({
  selector: 'zard-demo-sheet-no-close-button',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">No Close Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetNoCloseButtonComponent {
  private readonly sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'No Close Button',
      zDescription: "This sheet doesn't have a close button in the top-right corner.",
      zClosable: false,
      zCancelText: 'Close',
      zOkText: null,
    });
  }
}
```

## API Reference

### ZardSheetOptions

Configuration options for creating and managing sheet overlays.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zTitle` | Sheet title text or template | `string \| TemplateRef<T>` | `-` |
| `zDescription` | Sheet description/body text | `string` | `-` |
| `zContent` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `zSide` | Edge of the screen where the sheet appears | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `zSize` | Preset size for the sheet, relative to its side | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `zWidth` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `zHeight` | Custom height (e.g., '80vh', '500px') | `string` | `-` |
| `zDuration` | Exit animation duration in ms | `number` | `200` |
| `zOkText` | OK button text, null to hide button | `string \| null` | `'OK'` |
| `zCancelText` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `zOkIcon` | OK button icon — registered icon name or inline SVG string | `string` | `-` |
| `zCancelIcon` | Cancel button icon — registered icon name or inline SVG string | `string` | `-` |
| `zOkDestructive` | Whether OK button should have destructive styling | `boolean` | `false` |
| `zOkDisabled` | Whether OK button should be disabled | `boolean` | `false` |
| `zHideFooter` | Whether to hide the footer with action buttons | `boolean` | `false` |
| `zMaskClosable` | Whether clicking outside closes the sheet | `boolean` | `true` |
| `zClosable` | Whether to show the close button | `boolean` | `true` |
| `zCustomClasses` | Additional CSS classes to apply | `ClassValue` | `-` |
| `zOnOk` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zOnCancel` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zData` | Data to pass to custom content components | `object` | `-` |
| `zViewContainerRef` | View container for rendering custom content | `ViewContainerRef` | `-` |

### ZardSheetRef

Reference returned by `ZardSheetService.create()`, used to observe and close the sheet.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `close` | Closes the sheet, optionally with a result | `(result?: R) => void` | `-` |
| `isClosing` | Signal that turns true once the sheet starts closing | `Signal<boolean>` | `false` |
| `result` | Signal holding the result passed to close() | `Signal<R \| undefined>` | `undefined` |
| `componentInstance` | Signal with the instance of the component rendered as content | `Signal<T \| null>` | `null` |

### ZardSheetComponent

Sheet overlay component outputs.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `okTriggered` | Emitted when OK button is clicked | `EventEmitter<void>` | `-` |
| `cancelTriggered` | Emitted when Cancel button is clicked | `EventEmitter<void>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/sheet)
