import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The panel floats: it is inset from the viewport on every edge and fully rounded,
 * so the page stays visible around it. `m-2` is that inset — the enter/exit
 * transform in the component adds it back so the drawer still leaves the screen.
 */
export const drawerVariants = cva('cn-drawer group/drawer pointer-events-auto outline-none select-none', {
  variants: {
    zPlacement: {
      top: 'cn-drawer-placement-top',
      right: 'cn-drawer-placement-right',
      bottom: 'cn-drawer-placement-bottom',
      left: 'cn-drawer-placement-left',
    },
    /**
     * A drawer with snap points is laid out at full height and only translated, so
     * the content-driven height that caps a plain vertical drawer has to go.
     */
    zSnapping: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { zPlacement: ['top', 'bottom'], zSnapping: false, class: 'max-h-[calc(100dvh-6rem)]' },
    { zPlacement: ['top', 'bottom'], zSnapping: true, class: 'h-dvh' },
  ],
  defaultVariants: {
    zPlacement: 'bottom',
    zSnapping: false,
  },
});

/**
 * The grab strip. It only reserves space — the pill itself is an `::after` drawn by
 * the panel's stylesheet, so the slot stays a single element in the DOM.
 */
export const drawerHandleVariants = cva('cn-drawer-handle', {
  variants: {
    zPlacement: {
      top: 'cn-drawer-handle-placement-top',
      right: 'cn-drawer-handle-placement-right',
      bottom: 'cn-drawer-handle-placement-bottom',
      left: 'cn-drawer-handle-placement-left',
    },
  },
  defaultVariants: {
    zPlacement: 'bottom',
  },
});

/** Everything the consumer projects, kept scrollable and clipped by the panel radius. */
export const drawerBodyVariants = cva('cn-drawer-body select-text');

export const drawerHeaderVariants = cva('cn-drawer-header');

export const drawerTitleVariants = cva('cn-drawer-title');

export const drawerDescriptionVariants = cva('cn-drawer-description');

export const drawerFooterVariants = cva('cn-drawer-footer');

/** Mask classes handed to the CDK overlay backdrop. */
export const DRAWER_BACKDROP_CLASSES = [
  'bg-black/30',
  'supports-backdrop-filter:backdrop-blur-sm',
  'transition-opacity',
  'duration-450',
  'ease-[cubic-bezier(0.32,0.72,0,1)]',
];

export type ZardDrawerVariants = VariantProps<typeof drawerVariants>;
export type ZardDrawerPlacement = NonNullable<ZardDrawerVariants['zPlacement']>;
