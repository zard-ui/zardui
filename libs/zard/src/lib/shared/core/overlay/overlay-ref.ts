import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil, type Observable } from 'rxjs';

import { isTopmostOverlay, popOverlay, pushOverlay } from './overlay-stack';

/** The keys that dismiss the topmost overlay. `Esc` is the legacy IE/Edge spelling. */
const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/** Which of the two footer buttons fired. */
export const enum ZardOverlayTrigger {
  CANCEL = 'cancel',
  OK = 'ok',
}

/**
 * A callback the consumer passes for the OK / cancel buttons.
 *
 * Returning `false` keeps the overlay open — which is how a form stays up when
 * validation fails.
 */
export type ZardOverlayCallback<T> = ((instance: T) => false | void | object) | EventEmitter<T> | undefined;

/** The subset of an overlay's options this base class reads. */
export interface ZardOverlayRefOptions<T> {
  zDuration?: number;
  zOnOk?: ZardOverlayCallback<T>;
  zOnCancel?: ZardOverlayCallback<T>;
}

/**
 * The lifecycle every service-opened overlay shares.
 *
 * Dialog, sheet, alert-dialog and drawer each had their own copy of this: the
 * same signals, the same Escape wiring, the same dispose-once timer. The copies
 * drifted — one kept no stack, another swallowed dispose errors — so the parts
 * that are genuinely per-overlay are now the only things a subclass writes:
 *
 *   {@link defaultDuration}   how long the leave animation lasts
 *   {@link playLeaveAnimation} what marks the container as leaving
 *   {@link closesOnOutsidePointer} whether a press outside dismisses
 *
 * Subclasses call {@link attach} at the end of their constructor, once their own
 * fields are initialized.
 */
export abstract class ZardOverlayRefBase<T = unknown, R = unknown> {
  /** Element focused before the overlay opened, used to restore focus on close. */
  private readonly previouslyFocusedElement: HTMLElement | null;

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

  protected constructor(
    protected readonly overlayRef: OverlayRef | null,
    private readonly overlayOptions: ZardOverlayRefOptions<T>,
    private readonly platformId: object,
  ) {
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;
  }

  /** How long the leave animation runs when `zDuration` is not given. */
  protected abstract get defaultDuration(): number;

  /** Marks the container as leaving, so the CSS transition can run before dispose. */
  protected abstract playLeaveAnimation(): void;

  /** Whether a press outside the overlay should dismiss it. */
  protected closesOnOutsidePointer(): boolean {
    return true;
  }

  /** Whether Escape should dismiss it, on top of being the topmost overlay. */
  protected closesOnEscape(): boolean {
    return true;
  }

  /**
   * Whether what a footer callback returns becomes the overlay's `result`.
   *
   * A confirm dialog answers yes or no, so alert-dialog closes with nothing and
   * keeps `result()` undefined.
   */
  protected forwardsCallbackResult(): boolean {
    return true;
  }

  /**
   * Wires the overlay up and registers it as the topmost one.
   *
   * Called by the subclass rather than by this constructor: the outputs come from
   * the container, and a subclass field holding it is not initialized yet while
   * the base constructor runs.
   */
  protected attach(outputs: { ok: Observable<unknown>; cancel: Observable<unknown> } | null): void {
    if (!this.overlayRef || !outputs) {
      return;
    }

    pushOverlay(this);

    const detached$ = this.overlayRef.detachments();

    // If the overlay is torn down externally (parent destroyed, app shutdown, etc.),
    // make sure stack and focus state are cleaned up.
    detached$.subscribe(() => this.dispose());

    outputs.cancel.pipe(takeUntil(detached$)).subscribe(() => this.trigger(ZardOverlayTrigger.CANCEL));
    outputs.ok.pipe(takeUntil(detached$)).subscribe(() => this.trigger(ZardOverlayTrigger.OK));

    if (this.closesOnOutsidePointer()) {
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
        if (isTopmostOverlay(this) && this.closesOnEscape()) {
          event.preventDefault();
          this.close();
        }
      });
  }

  /** Turns a container's two outputs into the shape {@link attach} wants. */
  protected static outputsOf(container: {
    okTriggered: Parameters<typeof outputToObservable>[0];
    cancelTriggered: Parameters<typeof outputToObservable>[0];
  }): { ok: Observable<unknown>; cancel: Observable<unknown> } {
    return {
      ok: outputToObservable(container.okTriggered),
      cancel: outputToObservable(container.cancelTriggered),
    };
  }

  /** Internal: set the component instance once attached. */
  setComponentInstance(instance: T | null): void {
    this._componentInstance.set(instance);
  }

  close(result?: R): void {
    if (this._isClosing()) {
      return;
    }

    this._isClosing.set(true);
    this._result.set(result);

    if (isPlatformBrowser(this.platformId)) {
      this.playLeaveAnimation();
    }

    this.disposeTimer = setTimeout(() => this.dispose(), this.overlayOptions.zDuration ?? this.defaultDuration);
  }

  private dispose(): void {
    if (this.disposed) {
      return;
    }
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

    popOverlay(this);

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private trigger(action: ZardOverlayTrigger): void {
    const callback = action === ZardOverlayTrigger.OK ? this.overlayOptions.zOnOk : this.overlayOptions.zOnCancel;

    if (callback instanceof EventEmitter) {
      callback.emit(this._componentInstance() as T);
      return;
    }

    if (typeof callback === 'function') {
      const result = callback(this._componentInstance() as T) as R | false;
      // `false` keeps the overlay open — a form that failed validation stays up.
      if (result !== false) {
        this.close(this.forwardsCallbackResult() ? (result as R) : undefined);
      }
      return;
    }

    this.close();
  }
}
