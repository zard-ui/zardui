import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardSheetContainerComponent, ZardSheetOptions } from './sheet-container.component';
import { SHEET_DURATION } from './sheet-panel.component';

/**
 * Reference to a sheet opened via {@link ZardSheetService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the sheet. The lifecycle itself
 * lives in {@link ZardOverlayRefBase}, shared with dialog, drawer and
 * alert-dialog; only the leave animation and the mask behaviour are the
 * sheet's own.
 */
export class ZardSheetRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardSheetOptions<T, U>,
    private readonly containerInstance: ZardSheetContainerComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardSheetRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return SHEET_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.leave();
    this.overlayRef?.detachBackdrop();
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? true;
  }
}
