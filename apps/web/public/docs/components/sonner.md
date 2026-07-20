---
title: Sonner
description: An opinionated toast component for Angular.
---

# Sonner

An opinionated toast component for Angular.

## Installation

### CLI

```bash
npx zard-cli@latest add sonner
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo, lucideLoader2, lucideOctagonX, lucideTriangleAlert } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';
import { NgxSonnerToaster, type ToasterProps } from 'ngx-sonner';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { sonnerVariants } from './sonner.variants';

export type ZardSonnerPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const DEFAULT_STYLE: Record<string, string> = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
};

const DEFAULT_TOAST_OPTIONS: ToasterProps['toastOptions'] = {
  classes: {
    toast: 'cn-toast',
  },
};

@Component({
  selector: 'z-sonner',
  imports: [NgIcon, NgxSonnerToaster],
  template: `
    <ngx-sonner-toaster
      [theme]="theme()"
      [class]="classes()"
      [style]="resolvedStyle()"
      [position]="position()"
      [richColors]="richColors()"
      [expand]="expand()"
      [duration]="duration()"
      [visibleToasts]="visibleToasts()"
      [closeButton]="closeButton()"
      [toastOptions]="resolvedToastOptions()"
      [dir]="dir()"
    >
      <ng-icon loading-icon name="lucideLoader2" class="size-4 [&>svg]:animate-spin" />
      <ng-icon success-icon name="lucideCircleCheck" class="size-4" />
      <ng-icon error-icon name="lucideOctagonX" class="size-4" />
      <ng-icon warning-icon name="lucideTriangleAlert" class="size-4" />
      <ng-icon info-icon name="lucideInfo" class="size-4" />
    </ngx-sonner-toaster>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo, lucideLoader2, lucideOctagonX, lucideTriangleAlert })],
  exportAs: 'zSonner',
})
export class ZardSonnerComponent {
  readonly class = input<ClassValue>('');
  readonly theme = input<'light' | 'dark' | 'system'>('system');
  readonly position = input<ZardSonnerPosition>('top-center');
  readonly richColors = input<boolean>(false);
  readonly expand = input<boolean>(false);
  readonly duration = input<number>(4000);
  readonly visibleToasts = input<number>(3);
  readonly closeButton = input<boolean>(false);
  readonly toastOptions = input<ToasterProps['toastOptions']>();
  readonly style = input<Record<string, string>>();
  readonly dir = input<'ltr' | 'rtl' | 'auto'>('auto');

  protected readonly classes = computed(() => mergeClasses(sonnerVariants(), this.class()));
  protected readonly resolvedStyle = computed(() => ({ ...DEFAULT_STYLE, ...(this.style() ?? {}) }));
  protected readonly resolvedToastOptions = computed<ToasterProps['toastOptions']>(() => {
    const provided = this.toastOptions();
    if (!provided) return DEFAULT_TOAST_OPTIONS;
    return {
      ...DEFAULT_TOAST_OPTIONS,
      ...provided,
      classes: { ...DEFAULT_TOAST_OPTIONS.classes, ...(provided.classes ?? {}) },
    };
  });
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const sonnerVariants = cva('toaster group');
```

```angular-ts
export * from './sonner.component';
export * from './sonner.service';
export * from './sonner.variants';
```

```angular-ts
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
```

### Register

```angular-ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardSonnerComponent } from '@/shared/components/sonner/sonner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZardSonnerComponent],
  template: `
    <router-outlet></router-outlet>
    <z-sonner />
  `,
})
export class AppComponent {}
```

## Usage

```angular-ts
import { ZardSonnerComponent } from '@/shared/components/sonner/sonner.component';
```

```angular-html
<z-sonner />
```

## Examples

### Types

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-types',
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" z-button zType="outline" (click)="sonner.show('Event has been created')">Default</button>
      <button type="button" z-button zType="outline" (click)="sonner.success('Event has been created')">Success</button>
      <button
        type="button"
        z-button
        zType="outline"
        (click)="sonner.info('Be at the area 10 minutes before the event time')"
      >
        Info
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        (click)="sonner.warning('Event start time cannot be earlier than 8am')"
      >
        Warning
      </button>
      <button type="button" z-button zType="outline" (click)="sonner.error('Event has not been created')">Error</button>
      <button type="button" z-button zType="outline" (click)="showPromise()">Promise</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerTypesComponent {
  protected readonly sonner = inject(ZardSonnerService);

  showPromise() {
    this.sonner.promise<{ name: string }>(
      () => new Promise(resolve => setTimeout(() => resolve({ name: 'Event' }), 2000)),
      {
        loading: 'Loading...',
        success: data => `${data.name} has been created`,
        error: 'Error',
      },
    );
  }
}
```

### Description

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-description',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" class="w-fit" (click)="show()">Show Toast</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerDescriptionComponent {
  private readonly sonner = inject(ZardSonnerService);

  show() {
    this.sonner.show('Event has been created', {
      description: 'Monday, January 3rd at 6:00pm',
    });
  }
}
```

### Position

Use the `position` option to change the position of the toast.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { type ZardSonnerPosition } from '@/shared/components/sonner/sonner.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-position',
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-2">
      <button type="button" z-button zType="outline" (click)="show('top-left')">Top Left</button>
      <button type="button" z-button zType="outline" (click)="show('top-center')">Top Center</button>
      <button type="button" z-button zType="outline" (click)="show('top-right')">Top Right</button>
      <button type="button" z-button zType="outline" (click)="show('bottom-left')">Bottom Left</button>
      <button type="button" z-button zType="outline" (click)="show('bottom-center')">Bottom Center</button>
      <button type="button" z-button zType="outline" (click)="show('bottom-right')">Bottom Right</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerPositionComponent {
  private readonly sonner = inject(ZardSonnerService);

  show(position: ZardSonnerPosition) {
    this.sonner.show('Event has been created', { position });
  }
}
```

## API Reference

### z-sonner

Container that renders toast notifications. Place once at the root of your app.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[theme]` | Theme used for the toasts. | `'light' \| 'dark' \| 'system'` | `'system'` |
| `[position]` | Position of the toast container on the viewport. | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-center'` |
| `[richColors]` | Enables tinted backgrounds for success / error / warning / info toasts. | `boolean` | `false` |
| `[expand]` | Expands toasts by default instead of stacking them. | `boolean` | `false` |
| `[duration]` | Default auto-dismiss duration (ms). | `number` | `4000` |
| `[visibleToasts]` | Maximum number of toasts visible at the same time. | `number` | `3` |
| `[closeButton]` | Shows a close button on each toast. | `boolean` | `false` |
| `[toastOptions]` | Default options applied to every toast (classes, duration, descriptions, etc). | `ToasterProps['toastOptions']` | `{}` |
| `[dir]` | Text direction for toasts. | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` |
| `[class]` | Additional Tailwind / utility classes merged into the host. | `ClassValue` | `''` |

### ZardSonnerService

Inject this service to dispatch toasts from any component or service.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `show(message, options?)` | Dispatches a default toast and returns its id. | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `success(message, options?)` | Dispatches a success-styled toast (green). | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `error(message, options?)` | Dispatches an error-styled toast (red). | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `warning(message, options?)` | Dispatches a warning-styled toast (yellow). | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `info(message, options?)` | Dispatches an info-styled toast (blue). | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `loading(message, options?)` | Dispatches a loading-styled toast with a spinner. | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `message(message, options?)` | Dispatches a neutral message-styled toast. | `(message: string \| number, options?: ExternalToast) => string \| number` |  |
| `promise(promise, options)` | Binds a toast to the lifecycle of a promise (loading → success/error). | `<T>(promise: PromiseT<T>, options: PromiseData<T>) => string \| number` |  |
| `dismiss(id?)` | Dismisses a toast by id, or all toasts when no id is provided. | `(id?: string \| number) => void` |  |

---

[Open in browser](https://zardui.com/docs/components/sonner)
