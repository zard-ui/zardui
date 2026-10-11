import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva('cn-select group');

export const selectTriggerVariants = cva(
  'cn-select-trigger outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {},
  },
);

export const selectContentVariants = cva('cn-select-content cn-menu-target cn-menu-translucent', {
  variants: {
    zPosition: {
      'item-aligned': '',
      popper: 'cn-select-content-position-popper',
    },
  },
  defaultVariants: {
    zPosition: 'popper',
  },
});

export const selectViewportVariants = cva('cn-select-viewport', {
  variants: {
    zPosition: {
      'item-aligned': '',
      popper: 'cn-select-viewport-position-popper',
    },
  },
  defaultVariants: {
    zPosition: 'popper',
  },
});

export const selectScrollButtonVariants = cva('cn-select-scroll-button');

export const selectGroupVariants = cva('');

export const selectLabelVariants = cva('cn-select-label');

export const selectSeparatorVariants = cva('cn-select-separator pointer-events-none');

export const selectItemVariants = cva('cn-select-item outline-hidden select-none', {
  variants: {
    zSize: {
      sm: 'cn-select-item-size-sm',
      default: 'cn-select-item-size-default',
      lg: 'cn-select-item-size-lg',
    },
    zMode: {
      normal: 'cn-select-item-mode-normal',
      compact: 'cn-select-item-mode-compact',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zMode: 'normal',
  },
});

export const selectItemStateVariants = cva(
  'cn-select-item-state data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
);

export const selectItemIconVariants = cva('cn-select-item-icon', {
  variants: {
    // zSize variants are placeholders for compound variant matching
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
    zMode: {
      normal: 'cn-select-item-icon-mode-normal',
      compact: 'cn-select-item-icon-mode-compact',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zMode: 'normal',
  },
});

export type ZardSelectPositionVariants = NonNullable<VariantProps<typeof selectContentVariants>['zPosition']>;
export type ZardSelectItemModeVariants = NonNullable<VariantProps<typeof selectItemVariants>['zMode']>;
export type ZardSelectAlignVariants = 'start' | 'center' | 'end';
