import { cva, type VariantProps } from 'class-variance-authority';

export const mapStyleSelectVariants = cva('cn-map-style-select');

/** The mini-map swatch: small in the trigger, large in the option rows. Painted with `--l-*` / `--d-*` variables. */
export const mapStyleSwatchVariants = cva('block shrink-0 overflow-hidden ring-1 ring-foreground/10 ring-inset', {
  variants: {
    zSize: {
      sm: 'cn-map-style-select-swatch-size-sm',
      default: 'cn-map-style-select-swatch-size-default transition-transform group-hover:scale-[1.03]',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const mapStyleOptionVariants = cva(
  'cn-map-style-select-option group outline-none hover:bg-accent data-[selected=true]:bg-accent',
);

export type ZardMapStyleSwatchSizeVariants = NonNullable<VariantProps<typeof mapStyleSwatchVariants>['zSize']>;
