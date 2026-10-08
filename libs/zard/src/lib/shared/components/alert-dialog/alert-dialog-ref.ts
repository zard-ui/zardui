import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardAlertDialogContainerComponent, ZardAlertDialogOptions } from './alert-dialog-container.component';
import { ALERT_DIALOG_DURATION } from './alert-dialog-panel.component';

/**
 * Reference to an alert dialog opened via {@link ZardAlertDialogService}.
 *
 * An alert dialog answers yes or no, so it closes with no result: `result()`
 * stays undefined and what the footer callbacks return is not forwarded. The
 * rest of the lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog,
 * sheet and drawer.
 */
export class ZardAlertDialogRef<T = unknown> extends ZardOverlayRefBase<T, void> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogContainerComponent<T> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardAlertDialogRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return ALERT_DIALOG_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.leave();
    this.overlayRef?.detachBackdrop();
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? false;
  }

  protected override forwardsCallbackResult(): boolean {
    return false;
  }
}
