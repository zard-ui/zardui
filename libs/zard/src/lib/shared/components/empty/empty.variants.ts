import { cva } from 'class-variance-authority';

export const emptyVariants = cva('cn-empty', {
  variants: {},
});

export const emptyHeaderVariants = cva('cn-empty-header', {
  variants: {},
});

export const emptyImageVariants = cva('cn-empty-image [&_svg]:pointer-events-none [&_svg]:shrink-0', {
  variants: {},
});

export const emptyIconVariants = cva('cn-empty-icon [&_svg]:pointer-events-none [&_svg]:shrink-0', {
  variants: {},
});

export const emptyTitleVariants = cva('cn-empty-title', {
  variants: {},
});

export const emptyDescriptionVariants = cva('cn-empty-description', {
  variants: {},
});

export const emptyActionsVariants = cva('cn-empty-actions', {
  variants: {},
});
