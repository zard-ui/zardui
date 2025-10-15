import { filter, Observable, Subject, takeUntil } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';

import { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

export class ZardAlertDialogRef<T = unknown, R = unknown> {
  componentInstance?: T;
  private destroy$ = new Subject<void>();
  private isClosing = false;
  private readonly afterClosedSubject: Subject<R | undefined> = new Subject();

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardAlertDialogOptions<T>,
    private containerInstance: ZardAlertDialogComponent<T>,
  ) {
    containerInstance.cancelTriggered.subscribe(() => {
      this.handleCancel();
    });

    containerInstance.okTriggered.subscribe(() => {
      this.handleOk();
    });

    this.handleMaskClick();
    this.handleEscapeKey();
  }

  close(dialogResult?: R): void {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.containerInstance.state.set('close');

    setTimeout(() => {
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }

      this.afterClosedSubject.next(dialogResult);
      this.afterClosedSubject.complete();

      if (!this.destroy$.closed) {
        this.destroy$.next();
        this.destroy$.complete();
      }
    }, 150);
  }

  afterClosed(): Observable<R | undefined> {
    return this.afterClosedSubject.asObservable();
  }

  private handleCancel() {
    const cancelFn = this.config.zOnCancel;

    if (typeof cancelFn === 'function') {
      const result = (cancelFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) {
        this.close(result as R);
      }
    } else {
      this.close();
    }
  }

  private handleOk() {
    const okFn = this.config.zOnOk;

    if (typeof okFn === 'function') {
      const result = (okFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) {
        this.close(result as R);
      }
    } else {
      this.close();
    }
  }

  private handleMaskClick() {
    const hasMaskClosable = this.config.zMaskClosable ?? true;
    if (hasMaskClosable) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.close();
        });
    }
  }

  private handleEscapeKey() {
    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.close());
  }
}
