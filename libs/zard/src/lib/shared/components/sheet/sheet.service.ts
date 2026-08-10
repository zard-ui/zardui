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
