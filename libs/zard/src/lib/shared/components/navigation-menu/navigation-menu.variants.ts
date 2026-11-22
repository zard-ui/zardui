import { cva, type VariantProps } from 'class-variance-authority';

export const navigationMenuVariants = cva('cn-navigation-menu group/navigation-menu');

export const navigationMenuListVariants = cva('cn-navigation-menu-list group');

export const navigationMenuItemVariants = cva('cn-navigation-menu-item');

export const navigationMenuTriggerVariants = cva(
  'cn-navigation-menu-trigger group/navigation-menu-trigger outline-none disabled:pointer-events-none data-disabled:pointer-events-none data-disabled:opacity-50',
);

export const navigationMenuTriggerIconVariants = cva('cn-navigation-menu-trigger-icon');

export const navigationMenuContentVariants = cva('cn-navigation-menu-content outline-none', {
  variants: {
    viewport: {
      true: '',
      // The overlay is offset by 8px from the trigger, and that gap belongs to no element: a
      false:
        // pointer crossing it slowly would schedule the close before reaching the popup. This
        // invisible collar covers the offset on every side, since submenus open sideways too.
        'cn-navigation-menu-content-viewport-false',
    },
  },
  defaultVariants: {
    viewport: false,
  },
});

/**
 * Lives inside a CDK overlay pane anchored to the bar, so it needs no positioning of its own —
 * the horizontal offset that tracks the active trigger is applied as an inline `translate`, and
 * the transition here is what makes that tracking slide instead of jump. The top padding doubles
 * as the bridge the pointer crosses on its way from the trigger to the popup.
 */
export const navigationMenuViewportWrapperVariants = cva('cn-navigation-menu-viewport-wrapper');

export const navigationMenuViewportVariants = cva('cn-navigation-menu-viewport outline-none');

export const navigationMenuLinkVariants = cva(
  'cn-navigation-menu-link select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      inset: {
        true: 'cn-navigation-menu-link-inset-true',
        false: '',
      },
      zType: {
        default: '',
        destructive: 'cn-navigation-menu-link-variant-destructive',
      },
    },
    defaultVariants: {
      inset: false,
      zType: 'default',
    },
  },
);

export const navigationMenuIndicatorVariants = cva('cn-navigation-menu-indicator pointer-events-none');

export const navigationMenuSubmenuArrowVariants = cva('cn-navigation-menu-submenu-arrow');

export const navigationMenuLabelVariants = cva('cn-navigation-menu-label', {
  variants: {
    inset: {
      true: 'cn-navigation-menu-label-inset-true',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const navigationMenuShortcutVariants = cva('cn-navigation-menu-shortcut');

export type ZardNavigationMenuLinkTypeVariants = NonNullable<VariantProps<typeof navigationMenuLinkVariants>['zType']>;

/** Which edge of the active trigger the shared viewport lines up with. */
export type ZardNavigationMenuAlign = 'start' | 'center' | 'end';
