import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva('cn-card group/card', {
  variants: {
    zSize: {
      default: '',
      sm: '',
    },
  },
});

export type ZardCardSizeType = NonNullable<VariantProps<typeof cardVariants>['zSize']>;

export const cardHeaderVariants = cva('cn-card-header group/card-header @container/card-header');

export const cardTitleVariants = cva('cn-card-title cn-font-heading');

export const cardDescriptionVariants = cva('cn-card-description');

export const cardActionVariants = cva('cn-card-action');

export const cardContentVariants = cva('cn-card-content');

export const cardFooterVariants = cva('cn-card-footer');
