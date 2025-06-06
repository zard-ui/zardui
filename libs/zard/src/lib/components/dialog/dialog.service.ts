import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, TemplateRef } from '@angular/core';

import { ZardDialogRef } from './dialog-ref';
import { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;
export const Z_MODAL_DATA = new InjectionToken<any>('Z_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardDialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  create<T>(config: ZardDialogOptions<T>): ZardDialogRef<T> {
    return this.open<T>(config.zContent as ComponentType<T>, config);
  }

  private open<T>(componentOrTemplateRef: ContentType<T>, config: ZardDialogOptions<T>) {
    const overlayRef = this.createOverlay();

    const dialogContainer = this.attachDialogContainer<T>(overlayRef, config);

    const dialogRef = this.attachDialogContent<T>(componentOrTemplateRef, dialogContainer, overlayRef, config);
    dialogContainer.dialogRef = dialogRef;

    return dialogRef;
  }

  private createOverlay() {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global(),
    });

    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer<T>(overlayRef: OverlayRef, config: ZardDialogOptions<T>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardDialogOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardDialogComponent<T>>(ZardDialogComponent, config.zViewContainerRef, injector);
    const containerRef = overlayRef.attach<ZardDialogComponent<T>>(containerPortal);
    containerRef.instance.state.set('open');

    return containerRef.instance;
  }

  private attachDialogContent<T>(componentOrTemplateRef: ContentType<T>, dialogContainer: ZardDialogComponent<T>, overlayRef: OverlayRef, config: ZardDialogOptions<T>) {
    const dialogRef = new ZardDialogRef<T>(overlayRef, config, dialogContainer);

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          dialogRef: dialogRef,
        } as any),
      );
    } else if (typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T>(dialogRef, config);
      const contentRef = dialogContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
      dialogRef.componentInstance = contentRef.instance;
    }

    return dialogRef;
  }

  private createInjector<T>(dialogRef: ZardDialogRef<T>, config: ZardDialogOptions<T>) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardDialogRef, useValue: dialogRef },
        { provide: Z_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}
