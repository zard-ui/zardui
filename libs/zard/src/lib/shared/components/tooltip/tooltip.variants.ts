import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva('cn-tooltip');
export type ZardTooltipVariants = VariantProps<typeof tooltipVariants>;

export const tooltipPositionVariants = cva('cn-tooltip-position', {
  variants: {
    position: {
      top: 'cn-tooltip-position-position-top',
      bottom: 'cn-tooltip-position-position-bottom',
      left: 'cn-tooltip-position-position-left',
      right: 'cn-tooltip-position-position-right',
    },
  },
});

export type ZardTooltipPositionVariants = NonNullable<VariantProps<typeof tooltipPositionVariants>['position']>;
