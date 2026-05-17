import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva(
  'group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 [&>input]:flex-1',
  {
    variants: {
      zOrientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>z-select:not(:first-child)>button]:rounded-l-none [&>z-select:not(:first-child)>button]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>z-select:not(:last-child)>button]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>z-select:not(:first-child)>button]:rounded-t-none [&>z-select:not(:first-child)>button]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>z-select:not(:last-child)>button]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!',
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
        horizontal: 'mx-px w-auto',
        vertical: 'my-px h-auto',
      },
    },
  },
);

export const buttonGroupTextVariants = cva(
  "bg-muted flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
);
