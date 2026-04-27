import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil } from 'rxjs';

import type { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/**
 * Reference to an alert dialog opened via {@link ZardAlertDialogService}.
 *
 * Multiple open alert dialogs share a stack so that pressing Escape only
 * closes the topmost one. Exposes signals for reactive consumption.
 */
export class ZardAlertDialogRef<T = unknown> {
  private static readonly stack: ZardAlertDialogRef[] = [];

  private readonly previouslyFocusedElement: HTMLElement | null;
  private readonly animationDuration: number;

  private disposeTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  private readonly _isClosing = signal(false);
  private readonly _componentInstance = signal<T | null>(null);

  /** True from the moment {@link close} is called until the overlay is disposed. */
  readonly isClosing = this._isClosing.asReadonly();
  /** Instance of the component projected as content, or null for templates / strings. */
  readonly componentInstance = this._componentInstance.asReadonly();

  constructor(
    private readonly overlayRef: OverlayRef | null,
    private readonly config: ZardAlertDialogOptions<T>,
    private readonly containerInstance: ZardAlertDialogComponent<T> | null,
    private readonly platformId: object,
  ) {
    this.animationDuration = config.zDuration ?? 100;
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;

    if (!this.overlayRef || !this.containerInstance) return;

    ZardAlertDialogRef.stack.push(this as unknown as ZardAlertDialogRef);

    const detached$ = this.overlayRef.detachments();

    detached$.subscribe(() => this.dispose());

    outputToObservable(this.containerInstance.cancelTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.handleCancel());
    outputToObservable(this.containerInstance.okTriggered)
      .pipe(takeUntil(detached$))
      .subscribe(() => this.handleOk());

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

  close(): void {
    if (this._isClosing()) return;
    this._isClosing.set(true);

    if (isPlatformBrowser(this.platformId) && this.containerInstance) {
      const hostElement = this.containerInstance.getNativeElement();
      hostElement.classList.add('alert-dialog-leave');
    }

    this.disposeTimer = setTimeout(() => this.dispose(), this.animationDuration);
  }

  private dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (this.disposeTimer !== null) {
      clearTimeout(this.disposeTimer);
      this.disposeTimer = null;
    }

    if (this.overlayRef) {
      try {
        this.overlayRef.dispose();
      } catch {
        // Already disposed.
      }
    }

    const idx = ZardAlertDialogRef.stack.indexOf(this as unknown as ZardAlertDialogRef);
    if (idx >= 0) ZardAlertDialogRef.stack.splice(idx, 1);

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private isTopmost(): boolean {
    return ZardAlertDialogRef.stack[ZardAlertDialogRef.stack.length - 1] === (this as unknown as ZardAlertDialogRef);
  }

  private handleCancel(): void {
    const cancelFn = this.config.zOnCancel;
    if (typeof cancelFn === 'function') {
      const result = (cancelFn as OnClickCallback<T>)(this._componentInstance() as T);
      if (result !== false) {
        this.close();
      }
    } else {
      this.close();
    }
  }

  private handleOk(): void {
    const okFn = this.config.zOnOk;
    if (typeof okFn === 'function') {
      const result = (okFn as OnClickCallback<T>)(this._componentInstance() as T);
      if (result !== false) {
        this.close();
      }
    } else {
      this.close();
    }
  }
}
