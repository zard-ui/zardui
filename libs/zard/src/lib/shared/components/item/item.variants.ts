import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const itemGroupVariants = cva(
  'group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2',
);

export const itemSeparatorVariants = cva('bg-border my-2 block h-px w-full shrink-0');

export const itemVariants = cva(
  mergeClasses(
    'group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    '[a]:transition-colors [a]:hover:bg-muted',
  ),
  {
    variants: {
      zVariant: {
        default: 'border-transparent',
        outline: 'border-border',
        muted: 'border-transparent bg-muted/50',
      },
      zSize: {
        default: 'gap-2.5 px-3 py-2.5',
        sm: 'gap-2.5 px-3 py-2.5',
        xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0',
      },
    },
    defaultVariants: {
      zVariant: 'default',
      zSize: 'default',
    },
  },
);

export const itemMediaVariants = cva(
  mergeClasses(
    'flex shrink-0 items-center justify-center gap-2',
    'group-has-data-[slot=item-description]/item:translate-y-0.5',
    'group-has-data-[slot=item-description]/item:self-start',
    '[&_svg]:pointer-events-none',
  ),
  {
    variants: {
      zVariant: {
        default: 'bg-transparent',
        icon: "[--ng-icon__size:1rem] [&_svg:not([class*='size-'])]:size-4",
        image:
          'size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const itemContentVariants = cva(
  'flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none',
);

export const itemTitleVariants = cva(
  'line-clamp-1 flex w-fit items-center gap-2 text-sm font-medium leading-snug underline-offset-4',
);

export const itemDescriptionVariants = cva(
  mergeClasses(
    'line-clamp-2 text-left text-sm font-normal leading-normal text-muted-foreground',
    'group-data-[size=xs]/item:text-xs',
    '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
  ),
);

export const itemActionsVariants = cva('flex items-center gap-2');

export const itemHeaderVariants = cva('flex basis-full items-center justify-between gap-2');

export const itemFooterVariants = cva('flex basis-full items-center justify-between gap-2');

export type ZardItemVariantVariants = NonNullable<VariantProps<typeof itemVariants>['zVariant']>;
export type ZardItemSizeVariants = NonNullable<VariantProps<typeof itemVariants>['zSize']>;
export type ZardItemMediaVariantVariants = NonNullable<VariantProps<typeof itemMediaVariants>['zVariant']>;
