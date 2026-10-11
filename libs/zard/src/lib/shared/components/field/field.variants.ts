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

export const fieldContentVariants = cva('cn-field-content group/field-content');

export const fieldLabelVariants = cva('cn-field-label group/field-label peer/field-label');

export const fieldTitleVariants = cva('cn-field-title');

export const fieldDescriptionVariants = cva('cn-field-description');

export const fieldSeparatorVariants = cva('cn-field-separator');

export const fieldErrorVariants = cva('cn-field-error');

export type ZardFieldOrientationVariants = NonNullable<VariantProps<typeof fieldVariants>['zOrientation']>;
export type ZardFieldLegendVariants = 'legend' | 'label';
