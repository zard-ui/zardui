import { cva, type VariantProps } from 'class-variance-authority';

export const mapStyleSelectVariants = cva('inline-block');

/** The mini-map swatch: small in the trigger, large in the option rows. Painted with `--l-*` / `--d-*` variables. */
export const mapStyleSwatchVariants = cva('block shrink-0 overflow-hidden ring-1 ring-foreground/10 ring-inset', {
  variants: {
    zSize: {
      sm: 'h-6 w-9 rounded-[5px]',
      default: 'h-11 w-16 rounded-md transition-transform group-hover:scale-[1.03]',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const mapStyleOptionVariants = cva(
  'group flex items-center gap-3 rounded-md p-1.5 text-left outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[selected=true]:bg-accent',
);

export type ZardMapStyleSwatchSizeVariants = NonNullable<VariantProps<typeof mapStyleSwatchVariants>['zSize']>;
