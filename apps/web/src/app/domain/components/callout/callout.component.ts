import { Component, input } from '@angular/core';

import { cva, type VariantProps } from 'class-variance-authority';

const calloutVariants = cva('rounded-lg border p-4 sm:p-6', {
  variants: {
    variant: {
      info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
      warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
      muted: 'border bg-muted/30',
      gradient: 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950 dark:to-blue-950 dark:border-purple-800',
    },
  },
  defaultVariants: {
    variant: 'muted',
  },
});

const iconVariants = cva('flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-white text-sm font-bold shrink-0 mt-1', {
  variants: {
    variant: {
      info: 'bg-blue-600',
      warning: 'bg-yellow-600',
      muted: 'bg-muted-foreground text-background',
      gradient: 'bg-purple-600',
    },
  },
  defaultVariants: {
    variant: 'muted',
  },
});

const titleVariants = cva('text-sm sm:text-base font-semibold', {
  variants: {
    variant: {
      info: 'text-blue-900 dark:text-blue-100',
      warning: 'text-yellow-900 dark:text-yellow-100',
      muted: '',
      gradient: 'text-purple-900 dark:text-purple-100',
    },
  },
  defaultVariants: {
    variant: 'muted',
  },
});

const contentVariants = cva('text-xs sm:text-sm leading-relaxed', {
  variants: {
    variant: {
      info: 'text-blue-800 dark:text-blue-200',
      warning: 'text-yellow-800 dark:text-yellow-200',
      muted: 'text-muted-foreground',
      gradient: 'text-purple-800 dark:text-purple-200',
    },
  },
  defaultVariants: {
    variant: 'muted',
  },
});

export type CalloutVariant = VariantProps<typeof calloutVariants>['variant'];

@Component({
  selector: 'z-callout',
  standalone: true,
  template: `
    <div [class]="calloutClasses()">
      <div class="flex items-start gap-4">
        <div [class]="iconClasses()">{{ icon() }}</div>
        <div class="flex flex-col gap-3">
          <h4 [class]="titleClasses()">{{ title() }}</h4>
          <p [class]="contentClasses()">
            <ng-content></ng-content>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class CalloutComponent {
  readonly variant = input<CalloutVariant>('muted');
  readonly title = input.required<string>();
  readonly icon = input.required<string>();

  protected calloutClasses = () => calloutVariants({ variant: this.variant() });
  protected iconClasses = () => iconVariants({ variant: this.variant() });
  protected titleClasses = () => titleVariants({ variant: this.variant() });
  protected contentClasses = () => contentVariants({ variant: this.variant() });
}
