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
