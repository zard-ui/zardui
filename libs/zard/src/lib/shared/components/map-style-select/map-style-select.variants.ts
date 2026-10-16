import { cva, type VariantProps } from 'class-variance-authority';

export const mapStyleSelectVariants = cva('flex w-full min-w-48 flex-col gap-2');

export const mapStyleSwatchVariants = cva(
  'inline-block shrink-0 rounded-full border border-black/15 dark:border-white/20',
  {
    variants: {
      zSize: {
        sm: 'size-3',
        default: 'size-4',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardMapStyleSwatchSizeVariants = NonNullable<VariantProps<typeof mapStyleSwatchVariants>['zSize']>;
