import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil } from 'rxjs';

import type { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/**
 * Reference to a dialog opened via {@link ZardDialogService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and methods for closing the dialog.
 *
 * Multiple open dialogs are tracked in a private stack so that pressing
 * Escape only closes the topmost one.
 */
export class ZardDialogRef<T = unknown, R = unknown, U = unknown> {
  /** Stack of currently open dialogs. The last entry is the topmost. */
  private static readonly stack: ZardDialogRef[] = [];

  /** Element focused before the dialog opened, used to restore focus on close. */
  private readonly previouslyFocusedElement: HTMLElement | null;

  /** Animation duration (ms) used when closing. Mirrors the CSS transition. */
  private readonly animationDuration: number;

  /** Pending dispose timer; cleared if dispose runs early or twice. */
  private disposeTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  private readonly _isClosing = signal(false);
  private readonly _result = signal<R | undefined>(undefined);
  private readonly _componentInstance = signal<T | null>(null);

  /** True from the moment {@link close} is called until the overlay is disposed. */
  readonly isClosing = this._isClosing.asReadonly();
  /** Result passed to {@link close}, available after it's called. */
  readonly result = this._result.asReadonly();
  /** Instance of the component projected as content, or null for templates / strings. */
  readonly componentInstance = this._componentInstance.asReadonly();

  constructor(
    private readonly overlayRef: OverlayRef | null,
    private readonly config: ZardDialogOptions<T, U>,
    private readonly containerInstance: ZardDialogComponent<T, U> | null,
    private readonly platformId: object,
  ) {
    this.animationDuration = config.zDuration ?? 100;
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;

    if (!this.overlayRef || !this.containerInstance) return;

    ZardDialogRef.stack.push(this as unknown as ZardDialogRef);

    const detached$ = this.overlayRef.detachments();

    // If the overlay is torn down externally (parent destroyed, app shutdown, etc.),
    // ensure stack/focus state is cleaned up.
    detached$.subscribe(() => this.dispose());

    outputToObservable(this.containerInstance.cancelTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.trigger(eTriggerAction.CANCEL));
    outputToObservable(this.containerInstance.okTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.trigger(eTriggerAction.OK));

    if (config.zMaskClosable ?? true) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(detached$))
        .subscribe(() => this.close());
    }

    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => ESCAPE_KEYS.includes(event.key as (typeof ESCAPE_KEYS)[number])),
        takeUntil(detached$),
      )
      .subscribe(event => {
        if (this.isTopmost()) {
          event.preventDefault();
          this.close();
        }
      });
  }

  /** Internal: set the component instance once attached. */
  setComponentInstance(instance: T | null) {
    this._componentInstance.set(instance);
  }

  close(result?: R) {
    if (this._isClosing()) return;

    this._isClosing.set(true);
    this._result.set(result);

    if (isPlatformBrowser(this.platformId) && this.containerInstance) {
      const hostElement = this.containerInstance.getNativeElement();
      hostElement.classList.add('dialog-leave');
    }

    this.disposeTimer = setTimeout(() => this.dispose(), this.animationDuration);
  }

  private dispose() {
    if (this.disposed) return;
    this.disposed = true;

    if (this.disposeTimer !== null) {
      clearTimeout(this.disposeTimer);
      this.disposeTimer = null;
    }

    if (this.overlayRef) {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detachBackdrop();
      }
      this.overlayRef.dispose();
    }

    const idx = ZardDialogRef.stack.indexOf(this as unknown as ZardDialogRef);
    if (idx >= 0) ZardDialogRef.stack.splice(idx, 1);

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private isTopmost(): boolean {
    return ZardDialogRef.stack[ZardDialogRef.stack.length - 1] === (this as unknown as ZardDialogRef);
  }

  private trigger(action: eTriggerAction) {
    const trigger = action === eTriggerAction.OK ? this.config.zOnOk : this.config.zOnCancel;

    if (trigger instanceof EventEmitter) {
      trigger.emit(this._componentInstance() as T);
    } else if (typeof trigger === 'function') {
      const result = trigger(this._componentInstance() as T) as R | false;
      if (result !== false) {
        this.close(result as R);
      }
    } else {
      this.close();
    }
  }
}
