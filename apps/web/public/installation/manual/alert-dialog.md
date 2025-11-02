```angular-ts title="alert-dialog.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { BasePortalOutlet, CdkPortalOutlet, type ComponentPortal, PortalModule, type TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  ElementRef,
  type EmbeddedViewRef,
  type EventEmitter,
  inject,
  NgModule,
  output,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogService } from './alert-dialog.service';
import { alertDialogVariants } from './alert-dialog.variants';
import { generateId, mergeClasses, noopFun } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardAlertDialogOptions<T> {
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: object;
  zDescription?: string;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-alert-dialog',
  exportAs: 'zAlertDialog',
  standalone: true,
  imports: [OverlayModule, PortalModule, ZardButtonComponent, A11yModule],
  templateUrl: './alert-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    role: 'alertdialog',
    '[attr.aria-modal]': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    'animate.enter': 'alert-dialog-enter',
    'animate.leave': 'alert-dialog-leave',
  },
  styles: [
    `
      z-alert-dialog {
        inset: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
        transform-origin: center center;
        opacity: 1;
        transform: scale(1);
        transition:
          opacity 150ms ease-out,
          transform 150ms ease-out;
      }

      @starting-style {
        z-alert-dialog {
          opacity: 0;
          transform: scale(0.9);
        }
      }

      z-alert-dialog.alert-dialog-leave {
        opacity: 0;
        transform: scale(0.9);
        transition:
          opacity 150ms ease-in,
          transform 150ms ease-in;
      }
    `,
  ],
})
export class ZardAlertDialogComponent<T> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardAlertDialogOptions<T>);

  protected readonly classes = computed(() => mergeClasses(alertDialogVariants(), this.config.zCustomClasses));

  private readonly alertDialogId = generateId('alert-dialog');
  protected readonly titleId = computed(() => (this.config.zTitle ? `${this.alertDialogId}-title` : null));
  protected readonly descriptionId = computed(() => (this.config.zDescription ? `${this.alertDialogId}-description` : null));

  public alertDialogRef?: ZardAlertDialogRef<T>;

  protected readonly isStringContent = typeof this.config.zContent === 'string';

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();

  constructor() {
    super();
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet()?.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }

    return this.portalOutlet()?.attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCancelClick() {
    this.cancelTriggered.emit();
  }
}

@NgModule({
  imports: [ZardButtonComponent, ZardAlertDialogComponent, OverlayModule, PortalModule, A11yModule],
  providers: [ZardAlertDialogService],
})
export class ZardAlertDialogModule {}

```

```angular-ts title="alert-dialog.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva('fixed z-50 w-full max-w-[calc(100%-2rem)] border bg-background shadow-lg rounded-lg sm:max-w-lg');

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;

```

```angular-ts title="alert-dialog-ref.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { OverlayRef } from '@angular/cdk/overlay';

import { filter, type Observable, Subject, takeUntil } from 'rxjs';

import type { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

export class ZardAlertDialogRef<T = unknown, R = unknown> {
  componentInstance?: T;

  private readonly destroy$ = new Subject<void>();
  private readonly afterClosedSubject = new Subject<R | undefined>();
  private isClosing = false;

  readonly afterClosed: Observable<R | undefined> = this.afterClosedSubject.asObservable();

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogComponent<T>,
  ) {
    containerInstance.cancelTriggered.subscribe(() => this.handleCancel());
    containerInstance.okTriggered.subscribe(() => this.handleOk());

    this.handleMaskClick();
    this.handleEscapeKey();
  }

  close(dialogResult?: R): void {
    if (this.isClosing) return;
    this.isClosing = true;

    const element = this.containerInstance.getNativeElement?.() ?? null;
    if (element) {
      element.classList.add('alert-dialog-leave');
    }
    this.waitForTransitionEnd(element).then(() => this.dispose(dialogResult));
  }

  private handleCancel(): void {
    const cancelFn = this.config.zOnCancel;
    if (typeof cancelFn === 'function') {
      const result = (cancelFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) this.close(result as R);
    } else {
      this.close();
    }
  }

  private handleOk(): void {
    const okFn = this.config.zOnOk;
    if (typeof okFn === 'function') {
      const result = (okFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) this.close(result as R);
    } else {
      this.close();
    }
  }

  private handleMaskClick(): void {
    const hasMaskClosable = this.config.zMaskClosable ?? true;
    if (hasMaskClosable) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.close());
    }
  }

  private handleEscapeKey(): void {
    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.close());
  }

  private async waitForTransitionEnd(element: HTMLElement | null): Promise<void> {
    if (!element) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return;
    }

    await Promise.race([
      new Promise<void>(resolve => {
        const handler = () => {
          element.removeEventListener('transitionend', handler);
          resolve();
        };
        element.addEventListener('transitionend', handler, { once: true });
      }),
      new Promise(resolve => setTimeout(resolve, 150)),
    ]);
  }

  private dispose(result?: R): void {
    try {
      this.overlayRef?.dispose();
    } catch {
      // Overlay already destroyed or SSR
    }

    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();

    if (!this.destroy$.closed) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
}

```

```angular-html title="alert-dialog.component.html" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
<div class="flex flex-col gap-4 p-6" cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
  @if (config.zTitle || config.zDescription) {
    <header class="flex flex-col gap-2 text-center sm:text-left">
      @if (config.zTitle) {
        <h2 data-testid="z-alert-title" [id]="titleId()" class="text-lg font-semibold">{{ config.zTitle }}</h2>
      }

      @if (config.zDescription) {
        <p data-testid="z-alert-description" [id]="descriptionId()" class="text-sm text-muted-foreground">{{ config.zDescription }}</p>
      }
    </header>
  }

  <main>
    <ng-template cdkPortalOutlet></ng-template>

    @if (isStringContent) {
      <div data-testid="z-alert-content" [innerHTML]="config.zContent"></div>
    }
  </main>

  <footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    @if (config.zCancelText !== null) {
      <button data-testid="z-alert-cancel-button" z-button zType="outline" (click)="onCancelClick()">
        {{ config.zCancelText || 'Cancel' }}
      </button>
    }

    @if (config.zOkText !== null) {
      <button data-testid="z-alert-ok-button" z-button [zType]="config.zOkDestructive ? 'destructive' : 'default'" [disabled]="config.zOkDisabled" (click)="onOkClick()">
        {{ config.zOkText || 'Continue' }}
      </button>
    }
  </footer>
</div>

```

```angular-ts title="alert-dialog.service.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { type ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, TemplateRef } from '@angular/core';

import { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string | undefined;

export const Z_ALERT_MODAL_DATA = new InjectionToken<unknown>('Z_ALERT_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardAlertDialogService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  create<T>(config: ZardAlertDialogOptions<T>): ZardAlertDialogRef<T> {
    return this.open<T>(config.zContent, config);
  }

  confirm<T>(
    config: Omit<ZardAlertDialogOptions<T>, 'zOkText' | 'zCancelText'> & {
      zOkText?: string;
      zCancelText?: string;
    },
  ): ZardAlertDialogRef<T> {
    const confirmConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText ?? 'Confirm',
      zCancelText: config.zCancelText ?? 'Cancel',
      zOkDestructive: config.zOkDestructive ?? false,
    };
    return this.create(confirmConfig);
  }

  warning<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    const warningConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText ?? 'OK',
      zCancelText: null,
    };
    return this.create(warningConfig);
  }

  info<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    const infoConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText ?? 'OK',
      zCancelText: null,
    };
    return this.create(infoConfig);
  }

  private open<T>(componentOrTemplateRef: ContentType<T>, config: ZardAlertDialogOptions<T>) {
    const overlayRef = this.createOverlay();

    if (!overlayRef) {
      return new ZardAlertDialogRef(undefined as any, config, undefined as any);
    }

    const alertDialogContainer = this.attachAlertDialogContainer<T>(overlayRef, config);
    const alertDialogRef = this.attachAlertDialogContent<T>(componentOrTemplateRef, alertDialogContainer, overlayRef, config);

    alertDialogContainer.alertDialogRef = alertDialogRef;

    return alertDialogRef;
  }

  private createOverlay(): OverlayRef | undefined {
    if (!isPlatformBrowser(this.platformId)) return undefined;

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global(),
    });

    return this.overlay.create(overlayConfig);
  }

  private attachAlertDialogContainer<T>(overlayRef: OverlayRef, config: ZardAlertDialogOptions<T>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardAlertDialogOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardAlertDialogComponent<T>>(ZardAlertDialogComponent, config.zViewContainerRef, injector);

    const containerRef = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private attachAlertDialogContent<T>(
    componentOrTemplateRef: ContentType<T>,
    alertDialogContainer: ZardAlertDialogComponent<T>,
    overlayRef: OverlayRef,
    config: ZardAlertDialogOptions<T>,
  ) {
    const alertDialogRef = new ZardAlertDialogRef<T>(overlayRef, config, alertDialogContainer);

    if (componentOrTemplateRef instanceof TemplateRef) {
      alertDialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          alertDialogRef,
        } as any),
      );
    } else if (componentOrTemplateRef && typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T>(alertDialogRef, config);
      const contentRef = alertDialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
      alertDialogRef.componentInstance = contentRef.instance;
    }

    return alertDialogRef;
  }

  private createInjector<T>(alertDialogRef: ZardAlertDialogRef<T>, config: ZardAlertDialogOptions<T>) {
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
