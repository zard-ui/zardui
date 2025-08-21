import { cva, VariantProps } from 'class-variance-authority';

export const menuVariants = cva('z-menu relative flex max-w-max flex-1 items-center justify-center list-none m-0 p-0', {
  variants: {
    zMode: {
      horizontal: 'group flex flex-1 list-none items-center justify-center gap-1',
      vertical: 'flex flex-col w-full space-y-1 p-1',
      inline: 'flex flex-col w-full space-y-1 p-1',
    },
    zTheme: {
      light: 'bg-background text-foreground',
      dark: 'bg-neutral-900 text-neutral-100',
    },
    zCollapsed: {
      true: 'w-20',
      false: '',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
    zTheme: 'light',
    zCollapsed: false,
  },
});

export const menuItemVariants = cva(
  'z-menu-item group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  {
    variants: {
      zMode: {
        horizontal: 'w-max',
        vertical: 'w-full justify-start',
        inline: 'w-full justify-start',
      },
      zSelected: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
      zDisabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
      zLevel: {
        1: '',
        2: 'pl-8',
        3: 'pl-12',
        4: 'pl-16',
      },
    },
    defaultVariants: {
      zMode: 'vertical',
      zSelected: false,
      zDisabled: false,
      zLevel: 1,
    },
  },
);

export const submenuVariants = cva('z-submenu relative', {
  variants: {
    zMode: {
      horizontal: 'inline-block',
      vertical: 'w-full',
      inline: 'w-full',
    },
    zOpen: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
    zOpen: false,
  },
});

export const submenuTitleVariants = cva(
  'z-submenu-title group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  {
    variants: {
      zMode: {
        horizontal: 'w-max',
        vertical: 'w-full justify-start',
        inline: 'w-full justify-start',
      },
      zDisabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
      zLevel: {
        1: '',
        2: 'pl-8',
        3: 'pl-12',
        4: 'pl-16',
      },
    },
    defaultVariants: {
      zMode: 'vertical',
      zDisabled: false,
      zLevel: 1,
    },
  },
);

export const submenuContentVariants = cva('z-submenu-content', {
  variants: {
    zMode: {
      horizontal:
        'relative mt-1.5 h-auto w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-auto min-w-auto',
      vertical:
        'relative mt-1.5 h-auto w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-auto min-w-auto',
      inline: 'overflow-hidden transition-all duration-200 space-y-1 pl-4',
    },
    zOpen: {
      true: '',
      false: 'hidden',
    },
    zCollapsed: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      zMode: 'inline',
      zOpen: true,
      class: 'max-h-[1000px] opacity-100',
    },
    {
      zMode: 'inline',
      zOpen: false,
      class: 'max-h-0 opacity-0',
    },
    // Z-index management for nested submenus
    {
      zMode: ['horizontal', 'vertical'],
      class: 'z-50',
    },
  ],
  defaultVariants: {
    zMode: 'vertical',
    zOpen: false,
    zCollapsed: false,
  },
});

export const menuGroupVariants = cva('z-menu-group', {
  variants: {
    zMode: {
      horizontal: 'inline-block',
      vertical: 'w-full',
      inline: 'w-full',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
  },
});

export const menuGroupTitleVariants = cva('z-menu-group-title px-2 py-1.5 text-xs font-semibold text-muted-foreground', {
  variants: {
    zLevel: {
      1: '',
      2: 'pl-8',
      3: 'pl-12',
      4: 'pl-16',
    },
  },
  defaultVariants: {
    zLevel: 1,
  },
});

export const menuDividerVariants = cva('z-menu-divider my-1 border-t border-border', {
  variants: {
    zMode: {
      horizontal: 'mx-2 w-px h-4 border-t-0 border-l',
      vertical: 'mx-0',
      inline: 'mx-0',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
  },
});

export type ZardMenuVariants = VariantProps<typeof menuVariants>;
export type ZardMenuItemVariants = VariantProps<typeof menuItemVariants>;
export type ZardSubmenuVariants = VariantProps<typeof submenuVariants>;
export type ZardMenuGroupVariants = VariantProps<typeof menuGroupVariants>;
export type ZardMenuDividerVariants = VariantProps<typeof menuDividerVariants>;
