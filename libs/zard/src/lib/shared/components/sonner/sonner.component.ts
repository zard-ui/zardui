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
