import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, TemplateRef } from '@angular/core';
import { type ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';

import { ZardSheetComponent, ZardSheetOptions } from './sheet.component';
import { ZardSheetRef } from './sheet-ref';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;
export const Z_MODAL_DATA = new InjectionToken<any>('Z_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardSheetService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  create<T, U>(config: ZardSheetOptions<T, U>): ZardSheetRef<T> {
    return this.open<T, U>(config.zContent as ComponentType<T>, config);
  }

  private open<T, U>(componentOrTemplateRef: ContentType<T>, config: ZardSheetOptions<T, U>) {
    const overlayRef = this.createOverlay();

    if (!overlayRef) {
      // Return a mock sheet ref for SSR environments
      return new ZardSheetRef(undefined as any, config, undefined as any, this.platformId);
    }

    const sheetContainer = this.attachSheetContainer<T, U>(overlayRef, config);

    const sheetRef = this.attachSheetContent<T, U>(componentOrTemplateRef, sheetContainer, overlayRef, config);
    sheetContainer.sheetRef = sheetRef;

    return sheetRef;
  }

  private createOverlay(): OverlayRef | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const overlayConfig = new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: this.overlay.position().global(),
      });

      return this.overlay.create(overlayConfig);
    }
    return undefined;
  }

  private attachSheetContainer<T, U>(overlayRef: OverlayRef, config: ZardSheetOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardSheetOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardSheetComponent<T, U>>(ZardSheetComponent, config.zViewContainerRef, injector);
    const containerRef = overlayRef.attach<ZardSheetComponent<T, U>>(containerPortal);
    containerRef.instance.state.set('open');

    return containerRef.instance;
  }

  private attachSheetContent<T, U>(componentOrTemplateRef: ContentType<T>, sheetContainer: ZardSheetComponent<T, U>, overlayRef: OverlayRef, config: ZardSheetOptions<T, U>) {
    const sheetRef = new ZardSheetRef<T>(overlayRef, config, sheetContainer, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      sheetContainer.attachTemplatePortal(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          sheetRef: sheetRef,
        } as any),
      );
    } else if (typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T, U>(sheetRef, config);
      const contentRef = sheetContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
      sheetRef.componentInstance = contentRef.instance;
    }

    return sheetRef;
  }

  private createInjector<T, U>(sheetRef: ZardSheetRef<T>, config: ZardSheetOptions<T, U>) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardSheetRef, useValue: sheetRef },
        { provide: Z_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}
