import { cva, type VariantProps } from 'class-variance-authority';

// `aspect-video` mirrors shadcn's ChartContainer: without it a chart with no explicit
// height would initialise at zero pixels and draw nothing. Any height class wins over it.
export const chartVariants = cva('cn-chart', {
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
export const chartCanvasVariants = cva('cn-chart-canvas');

export const chartLegendVariants = cva('cn-chart-legend', {
  variants: {
    zVerticalAlign: {
      bottom: 'cn-chart-legend-vertical-align-bottom',
      top: 'cn-chart-legend-vertical-align-top',
    },
  },
  defaultVariants: {
    zVerticalAlign: 'bottom',
  },
});

export type ZardChartLegendAlignVariants = NonNullable<VariantProps<typeof chartLegendVariants>['zVerticalAlign']>;

export const chartLegendItemVariants = cva('cn-chart-legend-item', {
  variants: {
    zInactive: {
      false: '',
      true: 'cn-chart-legend-item-inactive-true',
    },
  },
  defaultVariants: {
    zInactive: false,
  },
});

export const chartLegendSwatchVariants = cva('cn-chart-legend-swatch');
