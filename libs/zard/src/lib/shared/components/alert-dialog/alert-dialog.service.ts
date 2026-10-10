import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, type ViewContainerRef } from '@angular/core';

import { takeUntil } from 'rxjs';

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
  // Optional: the direction of <html>, used when the caller gives no zViewContainerRef to inherit one from.
  private readonly rootDirectionality = inject(Directionality, { optional: true });

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

    const overlayRef = this.createOverlay(config);
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

  private createOverlay<T>(config: ZardAlertDialogOptions<T>): OverlayRef {
    const directionality = this.directionalityFor(config.zViewContainerRef);
    const overlayRef = this.overlay.create(
      new OverlayConfig({
        direction: directionality?.value ?? 'ltr',
        hasBackdrop: true,
        backdropClass: ALERT_DIALOG_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
      }),
    );

    // A [dir] switch while the overlay is open updates it in place: the panel keeps its content and mirrors.
    directionality?.change
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe(() => overlayRef.setDirection(directionality.value));

    return overlayRef;
  }

  /** The direction of where the overlay was requested from (zViewContainerRef), falling back to <html>. */
  private directionalityFor(viewContainerRef?: ViewContainerRef): Directionality | null {
    return viewContainerRef?.injector.get(Directionality, null) ?? this.rootDirectionality;
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
