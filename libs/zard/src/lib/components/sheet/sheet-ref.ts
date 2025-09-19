import { EventEmitter, Inject, inject, PLATFORM_ID } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { OverlayRef } from '@angular/cdk/overlay';

import { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

export class ZardSheetRef<T = any, R = any, U = any> {
  private destroy$ = new Subject<void>();
  protected result?: R;
  componentInstance: T | null = null;

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardSheetOptions<T, U>,
    private containerInstance: ZardSheetComponent<T, U>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.containerInstance.cancelTriggered.subscribe(() => this.trigger(eTriggerAction.CANCEL));
    this.containerInstance.okTriggered.subscribe(() => this.trigger(eTriggerAction.OK));

    if ((this.config.zMaskClosable || this.config.zMaskClosable === undefined) && isPlatformBrowser(this.platformId)) {
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

    if (isPlatformBrowser(this.platformId)) {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          filter(event => event.key === 'Escape'),
          takeUntil(this.destroy$),
        )
        .subscribe(() => this.close());
    }
  }

  close(result?: R) {
    this.result = result;
    this.containerInstance.state.set('closed');

    const element = this.containerInstance.getNativeElement();
    const onAnimationEnd = () => {
      element.removeEventListener('animationend', onAnimationEnd);
      this.overlayRef.detachBackdrop();
      this.overlayRef.dispose();
      this.destroy$.next();
    };

    element.addEventListener('animationend', onAnimationEnd);

    setTimeout(() => {
      onAnimationEnd();
    }, 300);
  }

  private trigger(action: eTriggerAction) {
    const trigger = { ok: this.config.zOnOk, cancel: this.config.zOnCancel }[action];

    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent()) as R;
      this.closeWithResult(result);
    } else this.close();
  }

  private getContentComponent(): T {
    return this.componentInstance as T;
  }

  private closeWithResult(result: R): void {
    if (result !== false) this.close(result);
  }
}
