import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil } from 'rxjs';

import type { ZardDrawerContainerComponent, ZardDrawerOptions } from './drawer-container.component';
import { DRAWER_DURATION } from './drawer.utils';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/**
 * Reference to a drawer opened via {@link ZardDrawerService}.
 *
 * Exposes signals for reactive consumption (`isClosing`, `result`,
 * `componentInstance`) and a `close()` method, mirroring `ZardSheetRef`.
 */
export class ZardDrawerRef<T = unknown, R = unknown, U = unknown> {
  /** Element focused before the drawer opened, used to restore focus on close. */
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
    private readonly config: ZardDrawerOptions<T, U>,
    private readonly containerInstance: ZardDrawerContainerComponent<T, U> | null,
    private readonly platformId: object,
  ) {
    this.animationDuration = config.zDuration ?? DRAWER_DURATION;
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;

    if (!this.overlayRef || !this.containerInstance) return;

    const detached$ = this.overlayRef.detachments();

    // If the overlay is torn down externally (parent destroyed, app shutdown, etc.),
    // ensure focus state is cleaned up.
    detached$.subscribe(() => this.dispose());

    outputToObservable(this.containerInstance.cancelTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.trigger(eTriggerAction.CANCEL));
    outputToObservable(this.containerInstance.okTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.trigger(eTriggerAction.OK));

    if ((config.zMaskClosable ?? true) && (config.zDismissible ?? true)) {
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
        if (this.config.zDismissible ?? true) {
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
      this.containerInstance.leave();
      this.overlayRef?.detachBackdrop();
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

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
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
