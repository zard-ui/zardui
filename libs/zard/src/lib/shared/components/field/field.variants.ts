import { cva, type VariantProps } from 'class-variance-authority';

export const fieldSetVariants = cva('cn-field-set');

export const fieldLegendVariants = cva('cn-field-legend');

export const fieldGroupVariants = cva('cn-field-group group/field-group @container/field-group');

export const fieldVariants = cva('cn-field group/field', {
  variants: {
    zOrientation: {
      vertical: 'cn-field-orientation-vertical',
      horizontal: 'cn-field-orientation-horizontal',
      responsive: 'cn-field-orientation-responsive',
    },
  },
  defaultVariants: {
    zOrientation: 'vertical',
  },
});

export const fieldContentVariants = cva('cn-field-content group/field-content leading-snug');

export const fieldLabelVariants = cva('cn-label cn-field-label group/field-label peer/field-label');

export const fieldTitleVariants = cva('cn-field-title');

export const fieldDescriptionVariants = cva(
  'cn-field-description leading-normal font-normal group-has-data-horizontal/field:text-balance last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
);

export const fieldSeparatorVariants = cva('cn-field-separator');

export const fieldErrorVariants = cva('cn-field-error');

export type ZardFieldOrientationVariants = NonNullable<VariantProps<typeof fieldVariants>['zOrientation']>;
export type ZardFieldLegendVariants = 'legend' | 'label';
