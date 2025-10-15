import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string | undefined;
export const Z_ALERT_MODAL_DATA = new InjectionToken<unknown>('Z_ALERT_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardAlertDialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

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
      zOkText: config.zOkText || 'Confirm',
      zCancelText: config.zCancelText || 'Cancel',
      zOkDestructive: config.zOkDestructive ?? false,
      zIcon: config.zIcon,
      zType: config.zType || 'default',
    };
    return this.create(confirmConfig);
  }

  warning<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    const warningConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText || 'OK',
      zCancelText: null,
      zIcon: config.zIcon || 'alert-triangle',
      zType: config.zType || 'warning',
    };
    return this.create(warningConfig);
  }

  info<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    const infoConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText || 'OK',
      zCancelText: null,
      zIcon: config.zIcon || 'info',
      zType: config.zType || 'default',
    };
    return this.create(infoConfig);
  }

  private open<T>(componentOrTemplateRef: ContentType<T>, config: ZardAlertDialogOptions<T>) {
    const overlayRef = this.createOverlay();

    if (!overlayRef) {
      // Return a mock alert dialog ref for SSR environments
      return new ZardAlertDialogRef(undefined as any, config, undefined as any);
    }

    const alertDialogContainer = this.attachAlertDialogContainer<T>(overlayRef, config);

    const alertDialogRef = this.attachAlertDialogContent<T>(componentOrTemplateRef, alertDialogContainer, overlayRef, config);
    alertDialogContainer.alertDialogRef = alertDialogRef;

    return alertDialogRef;
  }

  private createOverlay(): OverlayRef | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const overlayConfig = new OverlayConfig({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        positionStrategy: this.overlay.position().global(),
      });

      return this.overlay.create(overlayConfig);
    }
    return undefined;
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
    const containerRef = overlayRef.attach<ZardAlertDialogComponent<T>>(containerPortal);

    setTimeout(() => {
      containerRef.instance.state.set('open');
    }, 0);

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          alertDialogRef: alertDialogRef,
        } as any),
      );
    } else if (componentOrTemplateRef && typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T>(alertDialogRef, config);
      const contentRef = alertDialogContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
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
