import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center box-content hover:bg-primary/90 cursor-default', {
  variants: {
    zType: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground shadow-sm shadow-black',
    },
    zSize: {
      default: 'w-12 h-12',
      sm: 'w-10 h-10',
      md: 'w-18 h-18',
      lg: 'w-37 h-37',
      full: 'w-full h-full',
    },
    zShape: {
      default: 'rounded-md',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    zStatus: {
      online: 'online',
      offline: 'offline',
      doNotDisturb: 'doNotDisturb',
      away: 'away',
      invisible: 'invisible',
    },
    zBorder: {
      true: 'border border-3 border-white',
    },
    zLoading: {
      true: 'opacity-100',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});

export const imageVariants = cva('relative object-cover object-center w-full h-full z-10', {
  variants: {
    zShape: {
      default: 'rounded-md',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
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
export type ZardAvatarVariants = VariantProps<typeof avatarVariants> & ZardAvatarImage;
