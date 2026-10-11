import { cva, type VariantProps } from 'class-variance-authority';

export const tabContainerVariants = cva('cn-tabs-tab-container group/tabs', {
  variants: {
    zOrientation: {
      horizontal: 'cn-tabs-tab-container-orientation-horizontal',
      vertical: 'cn-tabs-tab-container-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const tabNavVariants = cva('cn-tabs-tab-nav group/tabs-list', {
  variants: {
    zVariant: {
      default: 'cn-tabs-tab-nav-variant-default',
      line: 'cn-tabs-tab-nav-variant-line',
    },
  },
  defaultVariants: {
    zVariant: 'default',
  },
});

export const tabButtonVariants = cva('cn-tabs-tab-button disabled:pointer-events-none [&_svg]:pointer-events-none');

export type ZardTabVariants = VariantProps<typeof tabContainerVariants> & VariantProps<typeof tabNavVariants>;
