import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID } from '@angular/core';

import { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

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
    const alertDialogRef = this.attachAlertDialogContent<T>(alertDialogContainer, overlayRef, config);

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
    alertDialogContainer: ZardAlertDialogComponent<T>,
    overlayRef: OverlayRef,
    config: ZardAlertDialogOptions<T>,
  ): ZardAlertDialogRef<T> {
    const alertDialogRef = new ZardAlertDialogRef<T>(overlayRef, config, alertDialogContainer, this.platformId);

    return alertDialogRef;
  }
}
