import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils';

export const avatarVariants = cva(
  mergeClasses(
    'group/avatar relative flex shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border',
    'after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
  ),
  {
    variants: {
      zSize: {
        sm: 'size-6',
        default: 'size-8',
        lg: 'size-10',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const fallbackVariants = cva(
  'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
);

export const imageVariants = cva('aspect-square size-full rounded-full object-cover', {
  variants: {
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const badgeVariants = mergeClasses(
  'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none',
  'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
  'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
  'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
);

export const avatarGroupVariants = cva(
  'group/avatar-group flex *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
  {
    variants: {
      zOrientation: {
        horizontal: 'flex-row -space-x-2',
        vertical: 'flex-col -space-y-2',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);

export type ZardAvatarSizeVariants = NonNullable<VariantProps<typeof avatarVariants>['zSize']>;
export type ZardAvatarGroupOrientationVariants = NonNullable<VariantProps<typeof avatarGroupVariants>['zOrientation']>;
