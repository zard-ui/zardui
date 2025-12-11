import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva(
  'flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative has-[>z-button-group]:gap-2',
  {
    variants: {
      zOrientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>z-select:not(:first-child)>button]:rounded-l-none [&>z-select:not(:first-child)>button]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>z-select:not(:last-child)>button]:rounded-r-none [&>input]:h-9 [&>input]:py-0',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>z-select:not(:first-child)>button]:rounded-t-none [&>z-select:not(:first-child)>button]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>z-select:not(:last-child)>button]:rounded-b-none',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);
export type ZardButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;

export const buttonGroupDividerVariants = cva(
  'bg-input relative self-stretch grow-0 shrink-0 pointer-events-none select-none',
  {
    variants: {
      zOrientation: {
        horizontal: 'w-auto',
        vertical: 'h-auto',
      },
    },
  },
);

export const buttonGroupTextVariants = cva(
  "bg-muted flex items-center gap-2 rounded-md border h-9 px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
);
