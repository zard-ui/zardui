import { cva, type VariantProps } from 'class-variance-authority';

// `aspect-video` mirrors shadcn's ChartContainer: without it a chart with no explicit
// height would initialise at zero pixels and draw nothing. Any height class wins over it.
export const chartVariants = cva('flex aspect-video w-full flex-col justify-center text-xs', {
  variants: {
    zType: {
      area: '',
      bar: '',
      line: '',
      pie: '',
      radar: '',
      radial: '',
    },
  },
  defaultVariants: {
    zType: 'bar',
  },
});

export type ZardChartTypeVariants = NonNullable<VariantProps<typeof chartVariants>['zType']>;

/** The element the ECharts instance is mounted on. It must always resolve to a real height. */
export const chartCanvasVariants = cva('order-1 min-h-0 w-full flex-1');

export const chartLegendVariants = cva('flex items-center justify-center gap-4 pt-3', {
  variants: {
    zVerticalAlign: {
      bottom: 'order-2',
      top: 'order-0 pt-0 pb-3',
    },
  },
  defaultVariants: {
    zVerticalAlign: 'bottom',
  },
});

export type ZardChartLegendAlignVariants = NonNullable<VariantProps<typeof chartLegendVariants>['zVerticalAlign']>;

export const chartLegendItemVariants = cva(
  'flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-opacity',
  {
    variants: {
      zInactive: {
        false: '',
        true: 'opacity-50',
      },
    },
    defaultVariants: {
      zInactive: false,
    },
  },
);

export const chartLegendSwatchVariants = cva('size-2 shrink-0 rounded-[2px]');
