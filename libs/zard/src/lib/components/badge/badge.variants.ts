import { cva, VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center border text-xs px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      zType: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
      zShape: {
        default: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zShape: 'default',
    },
  },
);
export type ZardBadgeVariants = VariantProps<typeof badgeVariants>;
