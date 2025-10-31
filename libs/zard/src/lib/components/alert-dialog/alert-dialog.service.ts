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
