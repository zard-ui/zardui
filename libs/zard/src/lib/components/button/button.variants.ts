import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      zType: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground dark:text-secondary-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      zSize: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 ',
        lg: 'h-11 px-8 ',
        icon: 'h-10 w-10',
      },
      zShape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
      zFull: {
        true: 'w-full',
      },
      zLoading: {
        true: 'opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);
export type ZardButtonVariants = VariantProps<typeof buttonVariants>;
