### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">toast.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { NgxSonnerToaster, Position, Theme } from 'ngx-sonner';

import { mergeClasses } from '../../shared/utils/utils';
import { toastVariants, ZardToastVariants } from './toast.variants';

@Component({
  selector: 'z-toaster',
  exportAs: 'zToaster',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgxSonnerToaster],
  template: `
    <ngx-sonner-toaster
      [theme]="theme()"
      [position]="position()"
      [expand]="expand()"
      [richColors]="richColors()"
      [closeButton]="closeButton()"
      [toastOptions]="{
        classes: {
          toast: classes(),
          title: 'text-sm font-semibold',
          description: 'text-sm opacity-90',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded text-sm font-medium',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80 px-3 py-2 rounded text-sm font-medium',
          closeButton: 'bg-background text-foreground hover:bg-muted rounded-full p-1'
        }
      }"
    />
  `,
})
export class ZardToastComponent {
  readonly variant = input<ZardToastVariants['variant']>('default');
  readonly size = input<ZardToastVariants['size']>('default');
  readonly class = input<string>('');
  readonly theme = input<Theme>('system');
  readonly position = input<Position>('bottom-right');
  readonly expand = input<boolean>(false);
  readonly richColors = input<boolean>(true);
  readonly closeButton = input<boolean>(false);

  protected readonly classes = computed(() =>
    mergeClasses(
      toastVariants({
        variant: this.variant(),
        size: this.size(),
      }),
      this.class(),
    ),
  );
}
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">toast.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
  'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
  {
    variants: {
      variant: {
        default: 'group-[.toaster]:bg-background group-[.toaster]:text-foreground',
        destructive: 'destructive group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive',
        success: 'success group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-50 dark:group-[.toaster]:border-green-800',
        warning: 'warning group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-50 dark:group-[.toaster]:border-yellow-800',
        info: 'info group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-50 dark:group-[.toaster]:border-blue-800',
      },
      size: {
        default: 'group-[.toaster]:min-h-12 group-[.toaster]:p-4',
        sm: 'group-[.toaster]:min-h-10 group-[.toaster]:p-3 group-[.toaster]:text-sm',
        lg: 'group-[.toaster]:min-h-14 group-[.toaster]:p-6 group-[.toaster]:text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ZardToastVariants = VariantProps<typeof toastVariants>;
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">install-deps-toast.md

```bash
npm install ngx-sonner
```