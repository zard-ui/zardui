import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';
import { NgxSonnerToaster } from 'ngx-sonner';

import { toastVariants, type ZardToastVariants } from './toast.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-toast, z-toaster',
  imports: [NgxSonnerToaster],
  standalone: true,
  template: `
    <ngx-sonner-toaster
      [theme]="theme()"
      [class]="classes()"
      [position]="position()"
      [richColors]="richColors()"
      [expand]="expand()"
      [duration]="duration()"
      [visibleToasts]="visibleToasts()"
      [closeButton]="closeButton()"
      [toastOptions]="toastOptions()"
      [dir]="dir()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zToast',
})
export class ZardToastComponent {
  readonly class = input<ClassValue>('');
  readonly variant = input<ZardToastVariants['variant']>('default');
  readonly theme = input<'light' | 'dark' | 'system'>('system');
  readonly position = input<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>(
    'bottom-right',
  );

  readonly richColors = input<boolean>(false);
  readonly expand = input<boolean>(false);
  readonly duration = input<number>(4000);
  readonly visibleToasts = input<number>(3);
  readonly closeButton = input<boolean>(false);
  readonly toastOptions = input<Record<string, unknown>>({});
  readonly dir = input<'ltr' | 'rtl' | 'auto'>('auto');

  protected readonly classes = computed(() =>
    mergeClasses('toaster group', toastVariants({ variant: this.variant() }), this.class()),
  );
}
