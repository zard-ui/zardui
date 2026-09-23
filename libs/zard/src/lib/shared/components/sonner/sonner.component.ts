import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo, lucideLoader2, lucideOctagonX, lucideTriangleAlert } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';
import { NgxSonnerToaster, toastState, type ToasterProps } from 'ngx-sonner';

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
  styles: `
    /*
     * Neutralize the UA styles of a popover host: the toaster inside is already
     * fixed positioned, so the host must be a zero-sized, invisible anchor that
     * never paints or captures pointer events.
     */
    z-sonner[popover] {
      position: fixed;
      inset: auto;
      display: block;
      width: 0;
      height: 0;
      max-width: none;
      max-height: none;
      margin: 0;
      border: 0;
      padding: 0;
      overflow: visible;
      background: transparent;
      color: inherit;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo, lucideLoader2, lucideOctagonX, lucideTriangleAlert })],
  host: {
    'data-slot': 'sonner',
  },
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
  /**
   * Renders the toaster in the native top layer so toasts stay above CDK
   * overlays (dialog, drawer, sheet, ...), which also live in the top layer
   * and would otherwise cover them regardless of `z-index`.
   */
  readonly topLayer = input(true, { transform: booleanAttribute });

  protected readonly classes = computed(() => mergeClasses(sonnerVariants(), this.class()));
  protected readonly resolvedStyle = computed(() => ({ ...DEFAULT_STYLE, ...(this.style() ?? {}) }));
  protected readonly resolvedToastOptions = computed<ToasterProps['toastOptions']>(() => {
    const provided = this.toastOptions();
    if (!provided) {
      return DEFAULT_TOAST_OPTIONS;
    }
    return {
      ...DEFAULT_TOAST_OPTIONS,
      ...provided,
      classes: { ...DEFAULT_TOAST_OPTIONS.classes, ...(provided.classes ?? {}) },
    };
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly supportsTopLayer = typeof this.host.showPopover === 'function';

  constructor() {
    effect(() => {
      // The top layer stacks by promotion order, so the toaster has to be
      // re-promoted every time the toast list changes to stay on top of
      // overlays opened after it.
      toastState.toasts();

      if (this.topLayer() && this.supportsTopLayer) {
        this.promote();
      } else {
        this.demote();
      }
    });

    if (this.supportsTopLayer) {
      this.zone.runOutsideAngular(() => {
        // Any other element entering the top layer (a dialog opened while a
        // toast is visible) would be painted above the toaster.
        this.host.ownerDocument.addEventListener('toggle', this.onDocumentToggle, true);
      });

      inject(DestroyRef).onDestroy(() =>
        this.host.ownerDocument.removeEventListener('toggle', this.onDocumentToggle, true),
      );
    }
  }

  private readonly onDocumentToggle = (event: Event) => {
    const isOpening = (event as Event & { newState?: string }).newState === 'open';

    if (isOpening && event.target !== this.host && this.topLayer() && toastState.toasts().length > 0) {
      this.promote();
    }
  };

  private promote(): void {
    this.host.setAttribute('popover', 'manual');

    // `showPopover()` on an already open popover is a no-op, so it has to be
    // closed first to be moved back to the front of the top layer.
    try {
      this.host.hidePopover();
    } catch {
      // Not open yet.
    }

    try {
      this.host.showPopover();
    } catch {
      // Not connected to the document yet: drop the attribute so the toaster
      // keeps rendering in the normal flow instead of being hidden by the
      // closed-popover UA styles. The next toast promotes it again.
      this.host.removeAttribute('popover');
    }
  }

  private demote(): void {
    if (!this.host.hasAttribute('popover')) {
      return;
    }

    try {
      this.host.hidePopover();
    } catch {
      // Already hidden or disconnected.
    }

    this.host.removeAttribute('popover');
  }
}
