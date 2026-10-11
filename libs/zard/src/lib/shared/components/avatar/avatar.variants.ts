import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils';

export const avatarVariants = cva('cn-avatar group/avatar select-none', {
  variants: {
    zSize: {
      sm: 'cn-avatar-size-sm',
      default: 'cn-avatar-size-default',
      lg: 'cn-avatar-size-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const fallbackVariants = cva('cn-avatar-fallback');

export const imageVariants = cva('cn-avatar-image', {
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

export const avatarBadgeVariants = mergeClasses(
  'absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none',
  'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
  'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
  'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
);

export const avatarGroupVariants = cva('cn-avatar-group group/avatar-group', {
  variants: {
    zOrientation: {
      horizontal: 'cn-avatar-group-orientation-horizontal',
      vertical: 'cn-avatar-group-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

/**
 * The "+N" chip appended to a `z-avatar-group` for members the stack does not show.
 * Carries `data-slot="avatar"` so it also picks up the group's own ring/spacing rules.
 */
export const avatarGroupCountVariants = cva('cn-avatar-group-count select-none', {
  variants: {
    zSize: {
      sm: 'cn-avatar-group-count-size-sm',
      default: 'cn-avatar-group-count-size-default',
      lg: 'cn-avatar-group-count-size-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardAvatarSizeVariants = NonNullable<VariantProps<typeof avatarVariants>['zSize']>;
export type ZardAvatarGroupOrientationVariants = NonNullable<VariantProps<typeof avatarGroupVariants>['zOrientation']>;
