import { filter, Observable, Subject } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';

import { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

export class ZardAlertDialogRef<T = unknown, R = unknown> {
  componentInstance?: T;
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
  }

  close(dialogResult?: R): void {
    this.containerInstance.state.set('close');

    // Dar tempo para a animação de saída
    setTimeout(() => {
      this.overlayRef.dispose();
      this.afterClosedSubject.next(dialogResult);
      this.afterClosedSubject.complete();
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
