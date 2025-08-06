import { filter, fromEvent, Observable, Subject, takeUntil } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';

import { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

export class ZardAlertDialogRef<T = unknown, R = unknown> {
  componentInstance?: T;
  private destroy$ = new Subject<void>();
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

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.close());
  }

  close(dialogResult?: R): void {
    this.containerInstance.state.set('close');

    setTimeout(() => {
      this.overlayRef.dispose();
      this.afterClosedSubject.next(dialogResult);
      this.afterClosedSubject.complete();
      this.destroy$.next();
      this.destroy$.complete();
    }, 200);
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
    if (this.config.zMaskClosable) {
      this.containerInstance
        .overlayClickOutside()
        .pipe(filter(() => this.config.zMaskClosable === true))
        .subscribe(() => {
          this.close();
        });
    }
  }
}
