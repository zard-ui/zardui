import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva('cn-button-group group/button-group', {
  variants: {
    zOrientation: {
      horizontal: 'cn-button-group-orientation-horizontal',
      vertical: 'cn-button-group-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});
export type ZardButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;

export const buttonGroupSeparatorVariants = cva('cn-button-group-separator pointer-events-none select-none', {
  variants: {
    zOrientation: {
      horizontal: 'cn-button-group-separator-orientation-horizontal',
      vertical: 'cn-button-group-separator-orientation-vertical',
    },
  },
});

export const buttonGroupTextVariants = cva('cn-button-group-text [&_svg]:pointer-events-none');
