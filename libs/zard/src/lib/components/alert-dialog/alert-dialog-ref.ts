import type { OverlayRef } from '@angular/cdk/overlay';

import { filter, type Observable, Subject, takeUntil } from 'rxjs';

import type { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

export class ZardAlertDialogRef<T = unknown, R = unknown> {
  componentInstance?: T;

  private readonly destroy$ = new Subject<void>();
  private readonly afterClosedSubject = new Subject<R | undefined>();
  private isClosing = false;

  readonly afterClosed: Observable<R | undefined> = this.afterClosedSubject.asObservable();

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogComponent<T>,
  ) {
    containerInstance.cancelTriggered.subscribe(() => this.handleCancel());
    containerInstance.okTriggered.subscribe(() => this.handleOk());

    this.handleMaskClick();
    this.handleEscapeKey();
  }

  close(dialogResult?: R): void {
    if (this.isClosing) return;
    this.isClosing = true;

    const element = this.containerInstance.getNativeElement?.() ?? null;
    if (element) {
      element.classList.add('alert-dialog-leave');
    }
    this.waitForTransitionEnd(element).then(() => this.dispose(dialogResult));
  }

  private handleCancel(): void {
    const cancelFn = this.config.zOnCancel;
    if (typeof cancelFn === 'function') {
      const result = (cancelFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) this.close(result as R);
    } else {
      this.close();
    }
  }

  private handleOk(): void {
    const okFn = this.config.zOnOk;
    if (typeof okFn === 'function') {
      const result = (okFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) this.close(result as R);
    } else {
      this.close();
    }
  }

  private handleMaskClick(): void {
    const hasMaskClosable = this.config.zMaskClosable ?? true;
    if (hasMaskClosable) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.close());
    }
  }

  private handleEscapeKey(): void {
    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.close());
  }

  private async waitForTransitionEnd(element: HTMLElement | null): Promise<void> {
    if (!element) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return;
    }

    await Promise.race([
      new Promise<void>(resolve => {
        const handler = () => {
          element.removeEventListener('transitionend', handler);
          resolve();
        };
        element.addEventListener('transitionend', handler, { once: true });
      }),
      new Promise(resolve => setTimeout(resolve, 150)),
    ]);
  }

  private dispose(result?: R): void {
    try {
      this.overlayRef?.dispose();
    } catch {
      // Overlay already destroyed or SSR
    }

    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();

    if (!this.destroy$.closed) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
}
