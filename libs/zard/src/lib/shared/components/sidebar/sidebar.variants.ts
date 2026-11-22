import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarWrapperVariants = cva('cn-sidebar-wrapper group/sidebar-wrapper');

/** `collapsible="none"` — a plain, always-visible column. */
export const sidebarNoneVariants = cva('cn-sidebar-none');

/** The desktop wrapper. Carries `group` and `peer`, so it has to sit on the host element. */
export const sidebarRootVariants = cva('cn-sidebar-root group peer');

export const sidebarGapVariants = cva('cn-sidebar-gap', {
  variants: {
    zVariant: {
      sidebar: 'cn-sidebar-gap-variant-sidebar',
      floating: 'cn-sidebar-gap-variant-floating',
      inset: 'cn-sidebar-gap-variant-inset',
    },
  },
  defaultVariants: {
    zVariant: 'sidebar',
  },
});

export const sidebarContainerVariants = cva('cn-sidebar-container', {
  variants: {
    zSide: {
      left: 'cn-sidebar-container-side-left',
      right: 'cn-sidebar-container-side-right',
    },
    zVariant: {
      sidebar: 'cn-sidebar-container-variant-sidebar',
      floating: 'cn-sidebar-container-variant-floating',
      inset: 'cn-sidebar-container-variant-inset',
    },
  },
  defaultVariants: {
    zSide: 'left',
    zVariant: 'sidebar',
  },
});

export const sidebarInnerVariants = cva('cn-sidebar-inner');

/**
 * Mobile drawer — replaces shadcn's `Sheet`, which is imperative in Zard. Both parts stay mounted
 * and animate off `data-state`, so the drawer slides out as well as in; `inert` keeps the closed
 * drawer out of the tab order and the accessibility tree.
 */
export const sidebarMobileBackdropVariants = cva('cn-sidebar-mobile-backdrop');

export const sidebarMobileVariants = cva('cn-sidebar-mobile', {
  variants: {
    zSide: {
      left: 'cn-sidebar-mobile-side-left',
      right: 'cn-sidebar-mobile-side-right',
    },
  },
  defaultVariants: {
    zSide: 'left',
  },
});

/**
 * `buttonVariants` already carries `[&_svg:not([class*='size-'])]:size-4`, but @ng-icons styles the
 * svg it renders with higher specificity, so the icon fell back to the 14px font size — 2px short of
 * shadcn. Targeting `ng-icon` with `!` is the same escape hatch the menu button needs.
 */
export const sidebarTriggerVariants = cva('cn-sidebar-trigger');

export const sidebarRailVariants = cva('cn-sidebar-rail');

export const sidebarInsetVariants = cva('cn-sidebar-inset');

export const sidebarInputVariants = cva('cn-sidebar-input');

export const sidebarHeaderVariants = cva('cn-sidebar-header');

export const sidebarFooterVariants = cva('cn-sidebar-footer');

export const sidebarSeparatorVariants = cva('cn-sidebar-separator');

export const sidebarContentVariants = cva('cn-sidebar-content');

export const sidebarGroupVariants = cva('cn-sidebar-group');

export const sidebarGroupLabelVariants = cva('cn-sidebar-group-label outline-hidden [&_svg]:shrink-0');

export const sidebarGroupActionVariants = cva(
  // Increases the hit area of the button on mobile.
  'cn-sidebar-group-action outline-hidden [&_svg]:shrink-0',
);

export const sidebarGroupContentVariants = cva('cn-sidebar-group-content');

export const sidebarMenuVariants = cva('cn-sidebar-menu');

export const sidebarMenuItemVariants = cva('cn-sidebar-menu-item group/menu-item');

export const sidebarMenuButtonVariants = cva(
  'cn-sidebar-menu-button peer/menu-button outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      zType: {
        default: 'cn-sidebar-menu-button-variant-default',
        outline: 'cn-sidebar-menu-button-variant-outline',
      },
      zSize: {
        default: 'cn-sidebar-menu-button-size-default',
        sm: 'cn-sidebar-menu-button-size-sm',
        lg: 'cn-sidebar-menu-button-size-lg',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export const sidebarMenuActionVariants = cva(
  // Increases the hit area of the button on mobile.
  'cn-sidebar-menu-action outline-hidden [&_svg]:shrink-0',
  {
    variants: {
      zShowOnHover: {
        true: 'cn-sidebar-menu-action-show-on-hover-true',
        false: '',
      },
    },
    defaultVariants: {
      zShowOnHover: false,
    },
  },
);

export const sidebarMenuBadgeVariants = cva('cn-sidebar-menu-badge select-none');

export const sidebarMenuSkeletonVariants = cva('cn-sidebar-menu-skeleton');

export const sidebarMenuSubVariants = cva('cn-sidebar-menu-sub');

export const sidebarMenuSubItemVariants = cva('cn-sidebar-menu-sub-item group/menu-sub-item');

export const sidebarMenuSubButtonVariants = cva(
  'cn-sidebar-menu-sub-button outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      zSize: {
        sm: 'cn-sidebar-menu-sub-button-size-sm',
        md: 'cn-sidebar-menu-sub-button-size-md',
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
