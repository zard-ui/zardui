### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">toast.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ClassValue } from 'class-variance-authority/dist/types';

import { mergeClasses } from '../../shared/utils/utils';
import { toastVariants, ZardToastVariants } from './toast.variants';

@Component({
  selector: 'z-toast, z-toaster',
  standalone: true,
  exportAs: 'zToast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgxSonnerToaster],
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
})
export class ZardToastComponent {
  readonly class = input<ClassValue>('');
  readonly variant = input<ZardToastVariants['variant']>('default');
  readonly theme = input<'light' | 'dark' | 'system'>('system');
  readonly position = input<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-right');
  readonly richColors = input<boolean>(false);
  readonly expand = input<boolean>(false);
  readonly duration = input<number>(4000);
  readonly visibleToasts = input<number>(3);
  readonly closeButton = input<boolean>(false);
  readonly toastOptions = input<Record<string, unknown>>({});
  readonly dir = input<'ltr' | 'rtl' | 'auto'>('auto');

  protected readonly classes = computed(() => mergeClasses('toaster group', toastVariants({ variant: this.variant() }), this.class()));
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">toast.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const toastVariants = cva('group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg', {
  variants: {
    variant: {
      default: 'group-[.toaster]:bg-background group-[.toaster]:text-foreground',
      destructive: 'group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground destructive group-[.toaster]:border-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type ZardToastVariants = VariantProps<typeof toastVariants>;

```

