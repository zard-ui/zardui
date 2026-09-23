import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The panel floats: it is inset from the viewport on every edge and fully rounded,
 * so the page stays visible around it. `m-2` is that inset — the enter/exit
 * transform in the component adds it back so the drawer still leaves the screen.
 */
export const drawerVariants = cva(
  [
    'group/drawer pointer-events-auto fixed z-50 m-2 flex min-h-0 flex-col',
    'rounded-3xl border border-popover bg-popover text-sm text-popover-foreground shadow-xl dark:border-border',
    'outline-none select-none will-change-transform',
  ],
  {
    variants: {
      zPlacement: {
        top: 'inset-x-0 top-0 origin-top',
        right: 'inset-y-0 right-0 w-3/4 origin-right flex-row sm:w-96',
        bottom: 'inset-x-0 bottom-0 origin-bottom',
        left: 'inset-y-0 left-0 w-3/4 origin-left flex-row sm:w-96',
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
  },
);

/**
 * The grab strip. It only reserves space — the pill itself is an `::after` drawn by
 * the panel's stylesheet, so the slot stays a single element in the DOM.
 */
export const drawerHandleVariants = cva('relative z-10 flex shrink-0 cursor-grab active:cursor-grabbing', {
  variants: {
    zPlacement: {
      top: 'order-last h-3 w-full items-start justify-center',
      right: 'h-full w-3 items-center justify-start',
      bottom: 'h-3 w-full items-end justify-center',
      left: 'order-last h-full w-3 items-center justify-end',
    },
  },
  defaultVariants: {
    zPlacement: 'bottom',
  },
});

/** Everything the consumer projects, kept scrollable and clipped by the panel radius. */
export const drawerBodyVariants = cva(
  'flex min-h-0 w-full flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] select-text',
);

export const drawerHeaderVariants = cva(
  'flex shrink-0 flex-col gap-0.5 p-4 pb-0 group-data-[axis=y]/drawer:text-center md:gap-1.5 md:text-left',
);

export const drawerTitleVariants = cva('text-base font-medium text-foreground');

export const drawerDescriptionVariants = cva('text-sm text-balance text-muted-foreground');

export const drawerFooterVariants = cva('mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0');

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
