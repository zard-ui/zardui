import { cva, type VariantProps } from 'class-variance-authority';

export const markerVariants = cva('cn-marker group/marker', {
  variants: {
    zVariant: {
      default: '',
      border: 'cn-marker-variant-border',
      separator: 'cn-marker-variant-separator',
    },
  },
  defaultVariants: {
    zVariant: 'default',
  },
});

export const markerIconVariants = cva('cn-marker-icon');

export const markerContentVariants = cva('cn-marker-content');

export type ZardMarkerVariants = NonNullable<VariantProps<typeof markerVariants>['zVariant']>;
