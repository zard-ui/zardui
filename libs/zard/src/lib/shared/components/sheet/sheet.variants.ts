import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva('cn-sheet outline-none', {
  variants: {
    zSide: {
      top: 'cn-sheet-side-top',
      right: 'cn-sheet-side-right',
      bottom: 'cn-sheet-side-bottom',
      left: 'cn-sheet-side-left',
    },
    zSize: {
      default: '',
      sm: '',
      lg: '',
      // Dimensions come from zWidth/zHeight as inline styles.
      custom: '',
    },
  },
  compoundVariants: [
    {
      zSide: ['left', 'right'],
      zSize: 'default',
      class: 'sm:max-w-sm',
    },
    {
      zSide: ['left', 'right'],
      zSize: 'sm',
      class: 'w-1/2 sm:max-w-xs',
    },
    {
      zSide: ['left', 'right'],
      zSize: 'lg',
      class: 'w-full sm:max-w-lg',
    },
    {
      zSide: ['top', 'bottom'],
      zSize: 'sm',
      class: 'h-1/3',
    },
    {
      zSide: ['top', 'bottom'],
      zSize: 'lg',
      class: 'h-3/4',
    },
  ],
  defaultVariants: {
    zSide: 'right',
    zSize: 'default',
  },
});

/** Classes of the mask behind a sheet, shared by the declarative form and the service. */
export const SHEET_BACKDROP_CLASSES = ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'];

export const sheetHeaderVariants = cva('cn-sheet-header');

export const sheetTitleVariants = cva('cn-sheet-title cn-font-heading');

export const sheetDescriptionVariants = cva('cn-sheet-description');

export const sheetFooterVariants = cva('cn-sheet-footer');

export type ZardSheetVariants = VariantProps<typeof sheetVariants>;
