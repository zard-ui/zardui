import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

/** How long the leave transition runs, in ms. Mirrors the CSS. */
const DIALOG_DURATION = 100;

/**
 * Reference to a dialog opened via {@link ZardDialogService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the dialog. The lifecycle itself
 * lives in {@link ZardOverlayRefBase}, shared with sheet, drawer and
 * alert-dialog, so Escape closes the topmost overlay of any kind.
 */
export class ZardDialogRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardDialogOptions<T, U>,
    private readonly containerInstance: ZardDialogComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardDialogRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return DIALOG_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.getNativeElement().classList.add('dialog-leave');
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? true;
  }
}
