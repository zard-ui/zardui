import { cva, type VariantProps } from 'class-variance-authority';

export const navigationMenuVariants = cva([
  'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
]);

export const navigationMenuListVariants = cva(['group flex flex-1 list-none items-center justify-center gap-0']);

export const navigationMenuItemVariants = cva(['relative']);

export const navigationMenuTriggerVariants = cva([
  'group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1 rounded-lg px-2.5 py-1.5',
  'text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted',
  'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1',
  'disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50',
  'data-[state=open]:bg-muted/50 data-[state=open]:hover:bg-muted data-[state=open]:focus:bg-muted',
]);

export const navigationMenuTriggerIconVariants = cva([
  'relative top-px size-3 shrink-0 transition-transform duration-300',
  'group-data-[state=open]/navigation-menu-trigger:rotate-180',
]);

export const navigationMenuContentVariants = cva(
  [
    'h-full w-auto p-1 outline-none',
    'transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
    'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
    'data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52',
    'data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52',
  ],
  {
    variants: {
      viewport: {
        true: '',
        false: [
          'relative z-50 min-w-32 rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10',
          // The overlay is offset by 8px from the trigger, and that gap belongs to no element: a
          // pointer crossing it slowly would schedule the close before reaching the popup. This
          // invisible collar covers the offset on every side, since submenus open sideways too.
          "before:absolute before:-inset-2 before:-z-10 before:content-['']",
          'animate-in data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        ],
      },
    },
    defaultVariants: {
      viewport: false,
    },
  },
);

/**
 * Lives inside a CDK overlay pane anchored to the bar, so it needs no positioning of its own —
 * the horizontal offset that tracks the active trigger is applied as an inline `translate`, and
 * the transition here is what makes that tracking slide instead of jump. The top padding doubles
 * as the bridge the pointer crosses on its way from the trigger to the popup.
 */
export const navigationMenuViewportWrapperVariants = cva([
  'flex pt-1.5 transition-[translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
]);

export const navigationMenuViewportVariants = cva([
  'relative h-(--zard-navigation-menu-viewport-height) w-(--zard-navigation-menu-viewport-width)',
  'origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10',
  'transition-[opacity,transform,width,height] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none',
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-90',
  'data-[state=closed]:duration-150',
]);

export const navigationMenuLinkVariants = cva(
  [
    'relative flex w-full cursor-default select-none items-center gap-2 rounded-md p-2 text-left text-sm',
    'transition-all outline-none hover:bg-muted focus:bg-muted',
    'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1',
    'data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&>i]:mr-2 [&>z-icon]:mr-2 [&>ng-icon]:shrink-0",
  ],
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
      zType: {
        default: '',
        destructive: 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive',
      },
    },
    defaultVariants: {
      inset: false,
      zType: 'default',
    },
  },
);

export const navigationMenuIndicatorVariants = cva([
  'pointer-events-none absolute top-full left-0 z-1 flex h-1.5 items-end justify-center overflow-hidden',
  'transition-[translate,width,opacity] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
]);

export const navigationMenuSubmenuArrowVariants = cva([
  'ml-auto opacity-60 transition-opacity duration-150',
  'text-muted-foreground dark:text-gray-400',
  'group-hover:opacity-100 group-focus:opacity-100',
]);

export const navigationMenuLabelVariants = cva(
  'relative flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground',
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      inset: false,
    },
  },
);

export const navigationMenuShortcutVariants = cva('ml-auto text-xs tracking-widest text-muted-foreground');

export type ZardNavigationMenuLinkTypeVariants = NonNullable<VariantProps<typeof navigationMenuLinkVariants>['zType']>;

/** Which edge of the active trigger the shared viewport lines up with. */
export type ZardNavigationMenuAlign = 'start' | 'center' | 'end';
