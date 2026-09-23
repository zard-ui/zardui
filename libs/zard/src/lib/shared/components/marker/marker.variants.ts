import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const markerVariants = cva(
  mergeClasses(
    'group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground',
    "[--ng-icon__size:1rem] [&_svg:not([class*='size-'])]:size-4",
    '[a]:underline [a]:underline-offset-3 [a]:hover:text-foreground',
  ),
  {
    variants: {
      zVariant: {
        default: '',
        border: 'border-b border-border pb-2',
        separator:
          'before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const markerIconVariants = cva("size-4 shrink-0 [--ng-icon__size:1rem] [&_svg:not([class*='size-'])]:size-4");

export const markerContentVariants = cva(
  mergeClasses(
    'min-w-0 wrap-break-word',
    'group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center',
    '*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
  ),
);

export type ZardMarkerVariants = NonNullable<VariantProps<typeof markerVariants>['zVariant']>;
