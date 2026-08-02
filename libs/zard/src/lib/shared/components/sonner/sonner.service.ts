import { Injectable, type Type } from '@angular/core';

import { toast, type ExternalToast, type PromiseData, type PromiseT } from 'ngx-sonner';

/**
 * Type-safe Angular wrapper around the underlying `ngx-sonner` toast API.
 *
 * Use this service from any component / service to dispatch toasts
 * without coupling the consumer code to the third-party library.
 *
 * @example
 * private readonly sonner = inject(ZardSonnerService);
 *
 * this.sonner.success('Saved!');
 * this.sonner.error('Failed', { description: 'Try again later.' });
 * this.sonner.promise(savePromise, {
 *   loading: 'Saving...',
 *   success: 'Saved!',
 *   error: 'Failed.',
 * });
 */
@Injectable({ providedIn: 'root' })
export class ZardSonnerService {
  /** Dispatch a default toast. Returns the toast id. */
  show(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast(message, options);
  }

  /** Dispatch a success-styled toast (green). */
  success(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast.success(message, options);
  }

  /** Dispatch an error-styled toast (red). */
  error(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast.error(message, options);
  }

  /** Dispatch a warning-styled toast (yellow). */
  warning(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast.warning(message, options);
  }

  /** Dispatch an info-styled toast (blue). */
  info(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast.info(message, options);
  }

  /** Dispatch a loading-styled toast (with spinner). */
  loading(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast.loading(message, options);
  }

  /** Dispatch a neutral message-styled toast. */
  message(message: string | Type<unknown>, options?: ExternalToast): string | number {
    return toast.message(message, options);
  }

  /**
   * Bind a toast lifecycle to a promise. The toast updates from `loading`
   * to `success` / `error` based on the promise resolution.
   */
  promise<T>(promise: PromiseT<T>, options?: PromiseData<T>): string | number | undefined {
    return toast.promise(promise, options);
  }

  /** Dismiss a toast by id, or all toasts when no id is provided. */
  dismiss(id?: string | number): void {
    toast.dismiss(id);
  }

  /** Dispatch a toast that renders a custom Angular component. */
  custom<T>(component: Type<T>, options?: ExternalToast): string | number {
    return toast.custom(component, options);
  }
}
