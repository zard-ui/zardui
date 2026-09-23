import type { OverlayRef } from '@angular/cdk/overlay';

import { ZardOverlayRefBase } from '@/shared/core';

import type { ZardDrawerContainerComponent, ZardDrawerOptions } from './drawer-container.component';
import { DRAWER_DURATION } from './drawer.utils';

/**
 * Reference to a drawer opened via {@link ZardDrawerService}.
 *
 * The lifecycle lives in {@link ZardOverlayRefBase}, shared with dialog, sheet
 * and alert-dialog — which is what makes Escape close the topmost overlay and
 * nothing else. Before that, two stacked drawers both closed on one press.
 */
export class ZardDrawerRef<T = unknown, R = unknown, U = unknown> extends ZardOverlayRefBase<T, R> {
  constructor(
    overlayRef: OverlayRef | null,
    private readonly config: ZardDrawerOptions<T, U>,
    private readonly containerInstance: ZardDrawerContainerComponent<T, U> | null,
    platformId: object,
  ) {
    super(overlayRef, config, platformId);
    this.attach(this.containerInstance ? ZardDrawerRef.outputsOf(this.containerInstance) : null);
  }

  protected override get defaultDuration(): number {
    return DRAWER_DURATION;
  }

  protected override playLeaveAnimation(): void {
    this.containerInstance?.leave();
    this.overlayRef?.detachBackdrop();
  }

  /**
   * A non-modal drawer has no mask, so a press outside it is a press on the page
   * the drawer deliberately left usable — it must not dismiss.
   */
  protected override closesOnOutsidePointer(): boolean {
    return (this.config.zMask ?? true) && (this.config.zMaskClosable ?? true) && (this.config.zDismissible ?? true);
  }

  protected override closesOnEscape(): boolean {
    return this.config.zDismissible ?? true;
  }
}
