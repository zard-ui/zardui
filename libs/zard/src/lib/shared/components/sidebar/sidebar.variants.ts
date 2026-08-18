import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarWrapperVariants = cva(
  'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
);

/** `collapsible="none"` — a plain, always-visible column. */
export const sidebarNoneVariants = cva('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground');

/** The desktop wrapper. Carries `group` and `peer`, so it has to sit on the host element. */
export const sidebarRootVariants = cva('group peer hidden text-sidebar-foreground md:block');

export const sidebarGapVariants = cva(
  'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180',
  {
    variants: {
      zVariant: {
        sidebar: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        floating: 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
        inset: 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
      },
    },
    defaultVariants: {
      zVariant: 'sidebar',
    },
  },
);

export const sidebarContainerVariants = cva(
  'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
  {
    variants: {
      zSide: {
        left: 'left-0 group-data-[collapsible=offcanvas]:-left-(--sidebar-width)',
        right: 'right-0 group-data-[collapsible=offcanvas]:-right-(--sidebar-width)',
      },
      zVariant: {
        sidebar:
          'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        floating: 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
        inset: 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
      },
    },
    defaultVariants: {
      zSide: 'left',
      zVariant: 'sidebar',
    },
  },
);

export const sidebarInnerVariants = cva(
  'flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm',
);

/**
 * Mobile drawer — replaces shadcn's `Sheet`, which is imperative in Zard. Both parts stay mounted
 * and animate off `data-state`, so the drawer slides out as well as in; `inert` keeps the closed
 * drawer out of the tab order and the accessibility tree.
 */
export const sidebarMobileBackdropVariants = cva(
  'fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 ease-in-out data-closed:pointer-events-none data-closed:opacity-0 data-open:opacity-100',
);

export const sidebarMobileVariants = cva(
  'fixed inset-y-0 z-50 flex h-full w-(--sidebar-width) flex-col bg-sidebar p-0 text-sidebar-foreground shadow-lg transition-transform ease-in-out data-closed:duration-300 data-open:duration-500',
  {
    variants: {
      zSide: {
        left: 'left-0 data-closed:-translate-x-full',
        right: 'right-0 data-closed:translate-x-full',
      },
    },
    defaultVariants: {
      zSide: 'left',
    },
  },
);

/**
 * `buttonVariants` already carries `[&_svg:not([class*='size-'])]:size-4`, but @ng-icons styles the
 * svg it renders with higher specificity, so the icon fell back to the 14px font size — 2px short of
 * shadcn. Targeting `ng-icon` with `!` is the same escape hatch the menu button needs.
 */
export const sidebarTriggerVariants = cva("size-7 [&_ng-icon:not([class*='size-'])]:size-4!");

export const sidebarRailVariants = cva([
  'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex',
  'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
  '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
  'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
  '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
  '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
]);

export const sidebarInsetVariants = cva([
  'relative flex w-full flex-1 flex-col bg-background',
  'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
]);

export const sidebarInputVariants = cva('h-8 w-full bg-background shadow-none');

export const sidebarHeaderVariants = cva('flex flex-col gap-2 p-2');

export const sidebarFooterVariants = cva('flex flex-col gap-2 p-2');

export const sidebarSeparatorVariants = cva('mx-2 w-auto bg-sidebar-border');

export const sidebarContentVariants = cva(
  'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
);

export const sidebarGroupVariants = cva('relative flex w-full min-w-0 flex-col p-2');

export const sidebarGroupLabelVariants = cva([
  "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
  'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
]);

export const sidebarGroupActionVariants = cva([
  "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
  // Increases the hit area of the button on mobile.
  'after:absolute after:-inset-2 md:after:hidden',
  'group-data-[collapsible=icon]:hidden',
]);

export const sidebarGroupContentVariants = cva('w-full text-sm');

export const sidebarMenuVariants = cva('flex w-full min-w-0 flex-col gap-1');

export const sidebarMenuItemVariants = cva('group/menu-item relative');

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
  {
    variants: {
      zType: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      zSize: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export const sidebarMenuActionVariants = cva(
  [
    "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
    // Increases the hit area of the button on mobile.
    'after:absolute after:-inset-2 md:after:hidden',
    'peer-data-[size=sm]/menu-button:top-1',
    'peer-data-[size=default]/menu-button:top-1.5',
    'peer-data-[size=lg]/menu-button:top-2.5',
    'group-data-[collapsible=icon]:hidden',
  ],
  {
    variants: {
      zShowOnHover: {
        true: 'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
        false: '',
      },
    },
    defaultVariants: {
      zShowOnHover: false,
    },
  },
);

export const sidebarMenuBadgeVariants = cva([
  'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none',
  'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
  'peer-data-[size=sm]/menu-button:top-1',
  'peer-data-[size=default]/menu-button:top-1.5',
  'peer-data-[size=lg]/menu-button:top-2.5',
  'group-data-[collapsible=icon]:hidden',
]);

export const sidebarMenuSkeletonVariants = cva('flex h-8 items-center gap-2 rounded-md px-2');

export const sidebarMenuSubVariants = cva([
  'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
  'group-data-[collapsible=icon]:hidden',
]);

export const sidebarMenuSubItemVariants = cva('group/menu-sub-item relative');

export const sidebarMenuSubButtonVariants = cva(
  [
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4! [&_svg]:text-sidebar-accent-foreground",
    'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
    'group-data-[collapsible=icon]:hidden',
  ],
  {
    variants: {
      zSize: {
        sm: 'text-xs',
        md: 'text-sm',
      },
    },
    defaultVariants: {
      zSize: 'md',
    },
  },
);

export type ZardSidebarSideVariants = NonNullable<VariantProps<typeof sidebarContainerVariants>['zSide']>;
export type ZardSidebarVariantVariants = NonNullable<VariantProps<typeof sidebarContainerVariants>['zVariant']>;
export type ZardSidebarCollapsibleVariants = 'offcanvas' | 'icon' | 'none';
export type ZardSidebarMenuButtonTypeVariants = NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['zType']>;
export type ZardSidebarMenuButtonSizeVariants = NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['zSize']>;
export type ZardSidebarMenuSubButtonSizeVariants = NonNullable<
  VariantProps<typeof sidebarMenuSubButtonVariants>['zSize']
>;
