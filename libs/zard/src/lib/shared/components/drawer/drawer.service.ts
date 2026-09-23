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

import { ZardDrawerContainerComponent, ZardDrawerOptions } from './drawer-container.component';
import { ZardDrawerHost } from './drawer-host';
import { ZardDrawerRef } from './drawer-ref';
import { hasOpenDrawer } from './drawer-stack';
import { DRAWER_BACKDROP_CLASSES } from './drawer.variants';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;

export const Z_DRAWER_DATA = new InjectionToken<unknown>('Z_DRAWER_DATA');

/**
 * Type-safe accessor for the data passed to a drawer via {@link ZardDrawerOptions.zData}.
 *
 * Must be called from an injection context (component constructor / field initializer).
 *
 * @example
 * private readonly data = injectDrawerData<MyData>();
 */
export function injectDrawerData<T>(): T {
  return inject(Z_DRAWER_DATA) as T;
}

@Injectable({
  providedIn: 'root',
})
export class ZardDrawerService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Opens a drawer with the given configuration.
   *
   * On non-browser platforms (SSR / build) the returned `ZardDrawerRef` is a
   * no-op that resolves cleanly when calling `close()`.
   */
  create<T, U = unknown>(config: ZardDrawerOptions<T, U>): ZardDrawerRef<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return new ZardDrawerRef<T>(null, config, null, this.platformId);
    }

    const overlayRef = this.createOverlay(config);
    const container = this.attachContainer<T, U>(overlayRef, config);
    const drawerRef = this.attachContent<T, U>(config.zContent as ContentType<T>, container, overlayRef, config);

    return drawerRef;
  }

  private createOverlay<T, U>(config: ZardDrawerOptions<T, U>): OverlayRef {
    const modal = config.zMask ?? true;
    // A drawer opening on top of another one gets a see-through mask: the drawer
    // underneath dims itself instead, so masks never stack up into a black screen.
    const nested = hasOpenDrawer();

    return this.overlay.create(
      new OverlayConfig({
        hasBackdrop: modal,
        backdropClass: nested ? ['bg-transparent'] : DRAWER_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: modal ? this.overlay.scrollStrategies.block() : this.overlay.scrollStrategies.noop(),
        disposeOnNavigation: true,
      }),
    );
  }

  private attachContainer<T, U>(overlayRef: OverlayRef, config: ZardDrawerOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardDrawerOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardDrawerContainerComponent<T, U>>(
      ZardDrawerContainerComponent,
      config.zViewContainerRef,
      injector,
    );

    return overlayRef.attach<ZardDrawerContainerComponent<T, U>>(containerPortal).instance;
  }

  private attachContent<T, U>(
    componentOrTemplateRef: ContentType<T>,
    container: ZardDrawerContainerComponent<T, U>,
    overlayRef: OverlayRef,
    config: ZardDrawerOptions<T, U>,
  ): ZardDrawerRef<T> {
    const drawerRef = new ZardDrawerRef<T>(overlayRef, config, container, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      // CDK's TemplatePortal type requires a ViewContainerRef even though it tolerates null at runtime,
      // and types the template context as T (the template's data shape) — we expose `drawerRef` instead.
      const vcr = (config.zViewContainerRef ?? null) as unknown as ViewContainerRef;
      const ctx = { drawerRef } as unknown as T;
      container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, vcr, ctx));
    } else if (componentOrTemplateRef != null && typeof componentOrTemplateRef !== 'string') {
      // Guard against a missing `zContent`: without it, `undefined` reaches ComponentPortal and
      // Angular throws NG0919 (DEF_TYPE_UNDEFINED) while creating the component.
      const injector = this.createInjector<T, U>(drawerRef, container, config);
      const contentRef = container.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector),
      );
      drawerRef.setComponentInstance(contentRef.instance);
    }

    return drawerRef;
  }

  private createInjector<T, U>(
    drawerRef: ZardDrawerRef<T>,
    container: ZardDrawerContainerComponent<T, U>,
    config: ZardDrawerOptions<T, U>,
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardDrawerRef, useValue: drawerRef },
        { provide: ZardDrawerHost, useValue: container },
        { provide: Z_DRAWER_DATA, useValue: config.zData },
      ],
    });
  }
}
