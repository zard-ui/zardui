import { cva, type VariantProps } from 'class-variance-authority';

export const itemGroupVariants = cva('cn-item-group group/item-group');

export const itemSeparatorVariants = cva('cn-item-separator');

export const itemVariants = cva('cn-item group/item outline-none', {
  variants: {
    zVariant: {
      default: 'cn-item-variant-default',
      outline: 'cn-item-variant-outline',
      muted: 'cn-item-variant-muted',
    },
    zSize: {
      default: 'cn-item-size-default',
      sm: 'cn-item-size-sm',
      xs: 'cn-item-size-xs',
    },
  },
  defaultVariants: {
    zVariant: 'default',
    zSize: 'default',
  },
});

export const itemMediaVariants = cva('cn-item-media [&_svg]:pointer-events-none', {
  variants: {
    zVariant: {
      default: 'cn-item-media-variant-default',
      icon: 'cn-item-media-variant-icon',
      image: 'cn-item-media-variant-image',
    },
  },
  defaultVariants: {
    zVariant: 'default',
  },
});

export const itemContentVariants = cva('cn-item-content');

export const itemTitleVariants = cva('cn-item-title');

export const itemDescriptionVariants = cva('cn-item-description');

export const itemActionsVariants = cva('cn-item-actions');

export const itemHeaderVariants = cva('cn-item-header');

export const itemFooterVariants = cva('cn-item-footer');

export type ZardItemVariantVariants = NonNullable<VariantProps<typeof itemVariants>['zVariant']>;
export type ZardItemSizeVariants = NonNullable<VariantProps<typeof itemVariants>['zSize']>;
export type ZardItemMediaVariantVariants = NonNullable<VariantProps<typeof itemMediaVariants>['zVariant']>;
