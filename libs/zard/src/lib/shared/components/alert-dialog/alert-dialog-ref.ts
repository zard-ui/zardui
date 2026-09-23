import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

/** How long the leave transition runs, in ms. Mirrors the CSS. */
const ALERT_DIALOG_DURATION = 100;

/**
 * Reference to an alert dialog opened via {@link ZardAlertDialogService}.
 *
 * The lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog, sheet
 * and drawer. Two things are the alert dialog's own: the mask does not dismiss
 * unless `zMaskClosable` says so — a confirmation should not be dismissable by
 * accident — and it closes with no result, because the answer is yes or no.
 */
export class ZardAlertDialogRef<T = unknown> extends ZardOverlayRefBase<T, void> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogComponent<T> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardAlertDialogRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return ALERT_DIALOG_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.getNativeElement().classList.add('alert-dialog-leave');
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? false;
  }

  protected override forwardsCallbackResult(): boolean {
    return false;
  }
}
