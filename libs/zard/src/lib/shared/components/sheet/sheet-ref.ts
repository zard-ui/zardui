import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

/** How long the leave transition runs, in ms. Mirrors the CSS. */
const SHEET_DURATION = 200;

/**
 * Reference to a sheet opened via {@link ZardSheetService}.
 *
 * The lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog, drawer
 * and alert-dialog; only the leave animation and the mask behaviour are the
 * sheet's own.
 */
export class ZardSheetRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardSheetOptions<T, U>,
    private readonly containerInstance: ZardSheetComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardSheetRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return SHEET_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.getNativeElement().classList.add('sheet-leave');
  }

  protected override closesOnOutsidePointer(): boolean {
    return this.config.zMaskClosable ?? true;
  }
}
