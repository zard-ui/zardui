import { Subject, takeUntil } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter } from '@angular/core';

import { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

export class ZardDialogRef<T = any, R = any> {
  private destroy$ = new Subject<void>();
  protected result?: R;
  componentInstance: T | null = null;

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardDialogOptions<T>,
    private containerInstance: ZardDialogComponent<T>,
  ) {
    this.containerInstance.cancelTriggered.subscribe(() => this.trigger(eTriggerAction.CANCEL));
    this.containerInstance.okTriggered.subscribe(() => this.trigger(eTriggerAction.OK));

    if (this.config.zMaskClosable || this.config.zMaskClosable === undefined) {
      this.containerInstance.getNativeElement().addEventListener(
        'animationend',
        () => {
          this.containerInstance
            .overlayClickOutside()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.close());
        },
        { once: true },
      );
    }
  }

  close(result?: R) {
    this.result = result;
    this.overlayRef.detachBackdrop();
    this.overlayRef.dispose();
    this.destroy$.next();
  }

  private trigger(action: eTriggerAction) {
    const trigger = { ok: this.config.zOnOk, cancel: this.config.zOnCancel }[action];

    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent()) as R;
      this.closeWhitResult(result);
    } else this.close();
  }

  private getContentComponent(): T {
    return this.componentInstance as T;
  }

  private closeWhitResult(result: R): void {
    if (result !== false) this.close(result);
  }
}
