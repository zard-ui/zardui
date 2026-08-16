import type { EChartsOption } from 'echarts';

/** Human-readable metadata for a data key: label, color and optional icon. */
export interface ZardChartConfigItem {
  /** Human-readable label shown in tooltip and legend. */
  label?: string;
  /** Icon name resolved through @ng-icons/lucide. */
  icon?: string;
  /** A CSS color: 'var(--chart-1)', '#2563eb', 'hsl(220 98% 61%)' or 'oklch(0.5 0.2 240)'. */
  color?: string;
  /** Per-theme colors, taking precedence over `color`. */
  theme?: { light: string; dark: string };
}

/** Maps every data key to its label, color and icon. Decoupled from the data itself. */
export type ZardChartConfig = Record<string, ZardChartConfigItem>;

export type ZardChartType = 'area' | 'bar' | 'line' | 'pie' | 'radar' | 'radial';

export type ZardChartTooltipIndicator = 'dot' | 'line' | 'dashed';

export type ZardChartTooltipTrigger = 'axis' | 'item';

export type ZardChartGrid = boolean | 'horizontal' | 'vertical';

export type ZardChartStackOffset = 'none' | 'expand';

export type ZardChartRadialVariant = 'bar' | 'gauge';

export type ZardChartRadarShape = 'polygon' | 'circle';

export type ZardChartRenderer = 'canvas' | 'svg';

/** A single data row. Keys are data keys, values are numbers, strings or a `fill` color. */
export type ZardChartDatum = Record<string, unknown>;

/** Per-series overrides. Use when `zSeries: string[]` is not expressive enough. */
export interface ZardChartSeries {
  dataKey: string;
  type?: ZardChartType;
  stack?: string;
  smooth?: boolean | number;
  step?: 'start' | 'middle' | 'end';
  radius?: number | number[];
  showSymbol?: boolean;
  /** Stroke width of the line, or of a radar web's outline. */
  strokeWidth?: number;
  symbolSize?: number;
  yAxisIndex?: number;
  color?: string;
  label?: boolean;
  /**
   * ZardUI extension. Opacity of the filled band, for `area` and `radar` series.
   * Ignored when the chart renders a gradient fill.
   */
  fillOpacity?: number;
}

/** Either the shorthand list of data keys or the fully described series. */
export type ZardChartSeriesInput = readonly string[] | readonly ZardChartSeries[];

/** Escape hatch: deep-merged into the generated option, always winning. */
export type ZardChartOptionOverride = EChartsOption;

/** Colors of everything that is not a series: grid, axes, labels and surfaces. */
export interface ZardChartChromeColors {
  border: string;
  mutedForeground: string;
  background: string;
  foreground: string;
}

/** What the legend needs to render one entry, resolved by the parent chart. */
export interface ZardChartLegendEntry {
  /** The name ECharts knows the series (or pie slice) by. */
  name: string;
  /** The data key this entry came from. */
  dataKey: string;
  label: string;
  color: string;
  icon?: string;
}
