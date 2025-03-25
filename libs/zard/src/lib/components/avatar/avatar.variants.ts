import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center border-transparent overflow-hidden p-2 box-content hover:bg-primary/90 cursor-default', {
  variants: {
    zType: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground shadow-sm shadow-black',
    },
    zSize: {
      default: 'w-10 h-10',
      sm: 'w-8 h-8',
      md: 'w-16 h-16',
      lg: 'w-35 h-35',
      full: 'w-full h-full',
    },
    zShape: {
      default: 'rounded-md',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});

export type ZardAvatarImage = {
  zImage: {
    fallback: string;
    url?: string;
    alt?: string;
  };
};
export type ZardAvatarLoading = {
  time: number | undefined;
};

export type ZardAvatarVariants = VariantProps<typeof avatarVariants> & ZardAvatarImage & ZardAvatarLoading;
