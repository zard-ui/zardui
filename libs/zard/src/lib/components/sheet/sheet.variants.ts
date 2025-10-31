import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      zSide: {
        right: 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 border-l',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 border-r',
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom: 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
      },
      zSize: {
        default: '',
        sm: '',
        lg: '',
        custom: '',
      },
    },
    compoundVariants: [
      {
        zSide: ['left', 'right'],
        zSize: 'default',
        class: 'w-3/4 sm:max-w-sm h-full',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'sm',
        class: 'w-1/2 sm:max-w-xs h-full',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'lg',
        class: 'w-full sm:max-w-lg h-full',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'default',
        class: 'h-auto',
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
  },
);
export type ZardSheetVariants = VariantProps<typeof sheetVariants>;
