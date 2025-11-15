import { cva, type VariantProps } from 'class-variance-authority';

import type { zAlign } from './tabs.component';

export const tabContainerVariants = cva('flex', {
  variants: {
    zPosition: {
      top: 'flex-col',
      bottom: 'flex-col',
      left: 'flex-row',
      right: 'flex-row',
    },
  },
  defaultVariants: {
    zPosition: 'top',
  },
});

export const tabNavVariants = cva('flex gap-4 overflow-auto scroll nav-tab-scroll', {
  variants: {
    zPosition: {
      top: 'flex-row border-b mb-4',
      bottom: 'flex-row border-t mt-4',
      left: 'flex-col border-r mr-4 min-h-0',
      right: 'flex-col border-l ml-4 min-h-0',
    },
    zAlignTabs: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
  defaultVariants: {
    zPosition: 'top',
    zAlignTabs: 'start',
  },
});

export const tabButtonVariants = cva('hover:bg-transparent rounded-none flex-shrink-0', {
  variants: {
    zActivePosition: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    isActive: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      zActivePosition: 'top',
      isActive: true,
      class: 'border-t-2 border-t-primary',
    },
    {
      zActivePosition: 'bottom',
      isActive: true,
      class: 'border-b-2 border-b-primary',
    },
    {
      zActivePosition: 'left',
      isActive: true,
      class: 'border-l-2 border-l-primary',
    },
    {
      zActivePosition: 'right',
      isActive: true,
      class: 'border-r-2 border-r-primary',
    },
  ],
  defaultVariants: {
    zActivePosition: 'bottom',
    isActive: false,
  },
});

export type ZardTabVariants = VariantProps<typeof tabContainerVariants> &
  VariantProps<typeof tabNavVariants> &
  VariantProps<typeof tabButtonVariants> & { zAlignTabs: zAlign };
