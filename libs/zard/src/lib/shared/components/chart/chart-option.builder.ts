import type { EChartsOption } from 'echarts';

import { buildArcLabels, resolveRadius } from './chart-arc-label.util';
import { paletteColor, withAlpha } from './chart-colors.util';
import { buildTooltipHtml, type ZardChartTooltipContext, type ZardChartTooltipParam } from './chart-tooltip.formatter';
import type {
  ZardChartChromeColors,
  ZardChartConfig,
  ZardChartDatum,
  ZardChartGrid,
  ZardChartLegendEntry,
  ZardChartRadarShape,
  ZardChartRadialVariant,
  ZardChartSeries,
  ZardChartSeriesInput,
  ZardChartStackOffset,
  ZardChartType,
} from './chart.types';

/** Bars keep shadcn's default corner radius unless a series overrides it. */
const DEFAULT_BAR_RADIUS = 4;
const DEFAULT_SYMBOL_SIZE = 8;
/**
 * Horizontal breathing room for the plot area, in pixels. Lines and areas sit flush against the
 * axis ends (`boundaryGap: false`), so without it the first and last point are drawn half outside
 * the canvas — the same reason every shadcn area/line chart passes `margin={{ left: 12, right: 12 }}`.
 */
const CURVE_GRID_INSET = 12;
/** Keeps the donut's centre reading above anything a chart paints behind its ring. */
const CENTER_TEXT_Z = 100;
const DEFAULT_AREA_OPACITY = 0.4;
const DEFAULT_RADAR_OPACITY = 0.6;
const DEFAULT_RADAR_STROKE = 1;
const DEFAULT_RADAR_RADIUS = '72%';
const IMPLICIT_STACK_ID = 'zard-stack';

/**
 * Entry motion. A chart is watched once, when it appears, so it can afford to be explanatory —
 * but Recharts' 1.5s `ease` reads as sluggish across a grid of them. This is the same gesture,
 * shortened, on a strong ease-out: fast off the mark, settling at the end, where the eye is.
 */
const ENTRY_DURATION = 700;
const ENTRY_EASING = 'quinticOut';
/** Re-drawing after a toggle is movement on screen, not an entrance: quicker, and eased both ends. */
const UPDATE_DURATION = 250;

/** Everything the builder needs. Pure data plus one color resolver, so it stays testable. */
export interface ZardChartBuildContext {
  type: ZardChartType;
  data: readonly ZardChartDatum[];
  config: ZardChartConfig;
  series: ZardChartSeriesInput;
  xAxisKey?: string;
  nameKey?: string;
  stacked: boolean;
  stackOffset: ZardChartStackOffset;
  horizontal: boolean;
  grid: ZardChartGrid;
  xAxis: boolean;
  yAxis: boolean;
  xAxisFormatter?: (value: string) => string;
  yAxisFormatter?: (value: number) => string;
  innerRadius?: string | number;
  outerRadius?: string | number;
  radialVariant: ZardChartRadialVariant;
  /** Radial only: the muted ring drawn behind each bar. */
  track: boolean;
  /** Radial only: writes each category's name along its own ring. */
  radialLabel: boolean;
  /** The canvas, in pixels. Zero until the chart has been laid out. */
  size: { width: number; height: number };
  fontFamily: string;
  radarShape: ZardChartRadarShape;
  /** Radar only: the spokes running from the centre to each indicator. */
  radarRadialLines: boolean;
  startAngle?: number;
  endAngle?: number;
  padAngle: number;
  gradient: boolean;
  label: boolean;
  centerValue?: string;
  centerLabel?: string;
  accessibility: boolean;
  animation: boolean;
  dataZoom: boolean;
  brush: boolean;
  toolbox: boolean;
  /** Series colors already resolved from `zConfig` for the active theme, keyed by data key. */
  colors: Record<string, string>;
  chrome: ZardChartChromeColors;
  tooltip: (Omit<ZardChartTooltipContext, 'colors' | 'config'> & { cursor: boolean }) | null;
  hasLegend: boolean;
  /** True on touch, where a tooltip has to survive the finger lifting. */
  coarsePointer: boolean;
  /** Turns `var(--token)` into a literal ECharts can paint with. */
  resolveColor: (value: string) => string;
}

type OptionRecord = Record<string, unknown>;

export function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Accepts both the `string[]` shorthand and the fully described `ZardChartSeries[]`. */
export function normalizeSeries(input: ZardChartSeriesInput | undefined): ZardChartSeries[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.map(item => (typeof item === 'string' ? { dataKey: item } : { ...item }));
}

function labelFor(config: ZardChartConfig, key: string): string {
  return config[key]?.label ?? key;
}

function colorFor(ctx: ZardChartBuildContext, key: string, index: number, declared?: string): string {
  if (declared) {
    return ctx.resolveColor(declared);
  }
  const resolved = ctx.colors[key];
  if (resolved) {
    return resolved;
  }
  return ctx.resolveColor(paletteColor(index));
}

/** Reads a row's category, honouring `zNameKey` before falling back to `zXAxisKey`. */
function categoryOf(ctx: ZardChartBuildContext, row: ZardChartDatum): string {
  const key = ctx.nameKey ?? ctx.xAxisKey;
  return key ? String(row[key] ?? '') : '';
}

/** `stackOffset="expand"` has no ECharts counterpart — normalise the rows to 0-1 first. */
function expandRow(row: ZardChartDatum, keys: string[]): Record<string, number | null> {
  const total = keys.reduce((sum, key) => sum + Math.abs(toNumber(row[key]) ?? 0), 0);
  const normalized: Record<string, number | null> = {};

  for (const key of keys) {
    const value = toNumber(row[key]);
    normalized[key] = value === null ? null : total === 0 ? 0 : value / total;
  }

  return normalized;
}

/** A cartesian data point: a bare number, or an object when the row styles itself. */
type CartesianPoint = number | null | OptionRecord;

/**
 * Per-point overrides a row may carry, mirroring what Recharts expresses with `<Cell>`:
 * `fill` for the color, plus `itemStyle` and `label` for anything else about that one point.
 */
function pointStyleOf(ctx: ZardChartBuildContext, row: ZardChartDatum): OptionRecord | undefined {
  const fill = typeof row['fill'] === 'string' ? ctx.resolveColor(row['fill'] as string) : undefined;
  const declared = isPlainObject(row['itemStyle']) ? row['itemStyle'] : undefined;
  const label = isPlainObject(row['label']) ? row['label'] : undefined;

  if (!fill && !declared && !label) {
    return undefined;
  }

  const itemStyle = { ...(fill ? { color: fill } : {}), ...(declared ?? {}) };

  return {
    ...(Object.keys(itemStyle).length > 0 ? { itemStyle } : {}),
    ...(label ? { label } : {}),
  };
}

function seriesValues(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): Map<string, CartesianPoint[]> {
  const keys = definitions.map(definition => definition.dataKey);
  const values = new Map<string, CartesianPoint[]>(keys.map(key => [key, []]));

  for (const row of ctx.data) {
    const source = ctx.stackOffset === 'expand' ? expandRow(row, keys) : row;
    const style = pointStyleOf(ctx, row);

    for (const key of keys) {
      const value = toNumber(source[key]);
      values.get(key)?.push(style ? { value, ...style } : value);
    }
  }

  return values;
}

function stackIdOf(ctx: ZardChartBuildContext, definition: ZardChartSeries): string | undefined {
  if (definition.stack) {
    return definition.stack;
  }
  return ctx.stacked ? IMPLICIT_STACK_ID : undefined;
}

/** Only the outermost bar of a stack is rounded, exactly like Recharts. */
function barRadius(
  ctx: ZardChartBuildContext,
  definition: ZardChartSeries,
  isStackTop: boolean,
): number | number[] | undefined {
  const declared = definition.radius ?? DEFAULT_BAR_RADIUS;
  if (Array.isArray(declared)) {
    return declared;
  }
  if (!isStackTop) {
    return 0;
  }
  return ctx.horizontal ? [0, declared, declared, 0] : [declared, declared, 0, 0];
}

function areaFill(ctx: ZardChartBuildContext, color: string, definition: ZardChartSeries): OptionRecord {
  if (ctx.gradient) {
    return {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: withAlpha(color, 0.8) },
          { offset: 1, color: withAlpha(color, 0.1) },
        ],
      },
    };
  }

  return { color, opacity: definition.fillOpacity ?? DEFAULT_AREA_OPACITY };
}

function seriesLabelOption(ctx: ZardChartBuildContext, definition: ZardChartSeries): OptionRecord {
  const show = definition.label ?? ctx.label;
  if (!show) {
    return { show: false };
  }

  return {
    show: true,
    position: ctx.horizontal ? 'right' : 'top',
    distance: 6,
    color: ctx.chrome.foreground,
    fontSize: 12,
  };
}

function gridVisibility(grid: ZardChartGrid): { horizontal: boolean; vertical: boolean } {
  return {
    horizontal: grid === true || grid === 'horizontal',
    vertical: grid === true || grid === 'vertical',
  };
}

function buildAxes(ctx: ZardChartBuildContext, definitions: ZardChartSeries[], categories: string[]): OptionRecord {
  const lines = gridVisibility(ctx.grid);
  const hasBars = definitions.some(definition => (definition.type ?? ctx.type) === 'bar');

  const categoryAxis: OptionRecord = {
    type: 'category',
    data: categories,
    boundaryGap: hasBars,
    axisLine: { show: false },
    axisTick: { show: false },
    // `border/50`, like shadcn's `[&_.recharts-cartesian-grid_line]:stroke-border/50`. `opacity`
    // multiplies the token's own alpha instead of replacing it, which `--border` already carries.
    splitLine: { show: false, lineStyle: { color: ctx.chrome.border, opacity: 0.5 } },
    axisLabel: {
      // `zXAxis` and `zXAxisFormatter` both address the category axis, whichever way the chart is
      // turned — the same pairing shadcn gets from `<XAxis dataKey>` plus its `tickFormatter`.
      show: ctx.xAxis,
      margin: 8,
      hideOverlap: true,
      color: ctx.chrome.mutedForeground,
      fontSize: 12,
      ...(ctx.xAxisFormatter ? { formatter: (value: string) => ctx.xAxisFormatter?.(value) ?? value } : {}),
    },
  };

  const valueAxis: OptionRecord = {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    // `border/50`, like shadcn's `[&_.recharts-cartesian-grid_line]:stroke-border/50`. `opacity`
    // multiplies the token's own alpha instead of replacing it, which `--border` already carries.
    splitLine: { show: false, lineStyle: { color: ctx.chrome.border, opacity: 0.5 } },
    axisLabel: {
      // Likewise `zYAxis` and `zYAxisFormatter` always address the value axis.
      show: ctx.yAxis,
      margin: 8,
      color: ctx.chrome.mutedForeground,
      fontSize: 12,
      ...(ctx.yAxisFormatter ? { formatter: (value: number) => ctx.yAxisFormatter?.(value) ?? String(value) } : {}),
    },
    ...(ctx.stackOffset === 'expand' ? { max: 1, min: 0 } : {}),
  };

  const xAxis = ctx.horizontal ? valueAxis : categoryAxis;
  const yAxis = ctx.horizontal ? categoryAxis : valueAxis;

  // `splitLine` of the Y axis always draws horizontal lines, whichever way the chart is turned.
  (yAxis['splitLine'] as OptionRecord)['show'] = lines.horizontal;
  (xAxis['splitLine'] as OptionRecord)['show'] = lines.vertical;

  if (ctx.horizontal) {
    yAxis['inverse'] = true;
  }

  return { xAxis, yAxis };
}

function buildCartesianSeries(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord[] {
  const values = seriesValues(ctx, definitions);
  const lastOfStack = new Map<string, number>();

  definitions.forEach((definition, index) => {
    const stack = stackIdOf(ctx, definition);
    if (stack) {
      lastOfStack.set(stack, index);
    }
  });

  return definitions.map((definition, index) => {
    const type = definition.type ?? ctx.type;
    const isBar = type === 'bar';
    const isArea = type === 'area';
    const color = colorFor(ctx, definition.dataKey, index, definition.color);
    const stack = stackIdOf(ctx, definition);
    const isStackTop = !stack || lastOfStack.get(stack) === index;

    const series: OptionRecord = {
      id: definition.dataKey,
      name: labelFor(ctx.config, definition.dataKey),
      type: isBar ? 'bar' : 'line',
      data: values.get(definition.dataKey) ?? [],
      itemStyle: { color, ...(isBar ? { borderRadius: barRadius(ctx, definition, isStackTop) } : {}) },
      // Recharts sets a hair of space between the bars of a group; ECharts leaves a third of a bar.
      ...(isBar ? { emphasis: { disabled: true }, barGap: '5%' } : {}),
      label: seriesLabelOption(ctx, definition),
      animation: ctx.animation,
      ...(stack ? { stack } : {}),
      ...(definition.yAxisIndex === undefined ? {} : { yAxisIndex: definition.yAxisIndex }),
    };

    if (!isBar) {
      const area = isArea ? areaFill(ctx, color, definition) : undefined;

      series['lineStyle'] = { color, width: definition.strokeWidth ?? 2 };
      series['smooth'] = definition.smooth ?? false;
      series['showSymbol'] = definition.showSymbol ?? false;
      series['symbol'] = 'circle';
      series['symbolSize'] = definition.symbolSize ?? DEFAULT_SYMBOL_SIZE;
      series['emphasis'] = { focus: 'none' };
      // An axis tooltip highlights one point, which fades the rest of the line to nothing.
      // Recharts only adds an active dot, so pin the blur state to the normal one.
      series['blur'] = {
        lineStyle: { opacity: 1 },
        itemStyle: { opacity: 1 },
        ...(area ? { areaStyle: { opacity: (area['opacity'] as number) ?? 1 } } : {}),
      };
      if (definition.step) {
        series['step'] = definition.step;
      }
      if (area) {
        series['areaStyle'] = area;
      }
    }

    return series;
  });
}

/**
 * ECharts lays radar indicators out counter-clockwise from the top; Recharts goes clockwise.
 * Keeping the first row at twelve o'clock and reversing the rest flips the direction without
 * moving the starting point.
 */
function clockwise<T>(items: readonly T[]): T[] {
  const [first, ...rest] = items;
  return first === undefined ? [] : [first, ...rest.reverse()];
}

function buildRadar(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord {
  const lines = gridVisibility(ctx.grid);
  const gridVisible = lines.horizontal || lines.vertical;
  const indicators = clockwise(ctx.data.map(row => ({ name: categoryOf(ctx, row) })));

  const data = definitions.map((definition, index) => {
    const color = colorFor(ctx, definition.dataKey, index, definition.color);
    const opacity = definition.fillOpacity ?? DEFAULT_RADAR_OPACITY;

    return {
      name: labelFor(ctx.config, definition.dataKey),
      value: clockwise(ctx.data.map(row => toNumber(row[definition.dataKey]))),
      itemStyle: { color },
      lineStyle: { color, width: definition.strokeWidth ?? DEFAULT_RADAR_STROKE },
      symbol: (definition.showSymbol ?? false) ? 'circle' : 'none',
      symbolSize: definition.symbolSize ?? DEFAULT_SYMBOL_SIZE,
      ...(opacity > 0 ? { areaStyle: { color, opacity } } : {}),
      label: seriesLabelOption(ctx, definition),
    };
  });

  return {
    radar: {
      indicator: indicators,
      shape: ctx.radarShape,
      axisName: { color: ctx.chrome.mutedForeground, fontSize: 12 },
      axisLine: { show: gridVisible && ctx.radarRadialLines, lineStyle: { color: ctx.chrome.border } },
      splitLine: { show: gridVisible, lineStyle: { color: ctx.chrome.border } },
      splitArea: { show: false },
      // Recharts sizes the web off the container, not off however much room the names leave.
      radius: ctx.outerRadius ?? DEFAULT_RADAR_RADIUS,
    },
    series: [{ type: 'radar', data, animation: ctx.animation }],
  };
}

function buildPie(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord {
  const [definition] = definitions;
  const valueKey = definition?.dataKey ?? '';

  const data = ctx.data.map((row, index) => {
    const name = categoryOf(ctx, row);
    const declared = typeof row['fill'] === 'string' ? (row['fill'] as string) : undefined;

    return {
      name: labelFor(ctx.config, name),
      value: toNumber(row[valueKey]) ?? 0,
      itemStyle: { color: colorFor(ctx, name, index, declared ?? definition?.color) },
    };
  });

  return {
    series: [
      {
        type: 'pie',
        radius: [ctx.innerRadius ?? 0, ctx.outerRadius ?? '80%'],
        center: ['50%', '50%'],
        padAngle: ctx.padAngle,
        // Recharts walks a pie counter-clockwise from twelve o'clock; ECharts goes the other way.
        clockwise: ctx.startAngle !== undefined && ctx.endAngle !== undefined ? ctx.endAngle < ctx.startAngle : false,
        avoidLabelOverlap: true,
        animation: ctx.animation,
        itemStyle: { borderColor: ctx.chrome.background, borderWidth: definitions[0]?.strokeWidth ?? 0 },
        label: {
          show: ctx.label,
          color: ctx.chrome.foreground,
          fontSize: 12,
          formatter: '{c}',
        },
        labelLine: { show: ctx.label, lineStyle: { color: ctx.chrome.border } },
        data,
        // Recharts starts a pie at three o'clock, not twelve.
        startAngle: ctx.startAngle ?? 0,
        ...(ctx.endAngle === undefined ? {} : { endAngle: ctx.endAngle }),
      },
    ],
  };
}

/** Reproduces the polar layout ECharts is about to compute, so the labels can ride the rings. */
function arcLabels(ctx: ZardChartBuildContext, names: string[]): OptionRecord[] {
  const { width, height } = ctx.size;
  if (width <= 0 || height <= 0 || names.length === 0) {
    return [];
  }

  const base = Math.min(width, height) / 2;
  const inner = resolveRadius(ctx.innerRadius, base, base * 0.3);
  const outer = resolveRadius(ctx.outerRadius, base, base * 0.9);
  const band = (outer - inner) / names.length;
  const fontSize = 11;

  return buildArcLabels(names, {
    cx: width / 2,
    cy: height / 2,
    radii: names.map((_, index) => inner + band * (index + 0.5)),
    startAngle: ctx.startAngle ?? 90,
    ascending: (ctx.endAngle ?? 360) >= (ctx.startAngle ?? 90),
    font: `${fontSize}px ${ctx.fontFamily}`,
    fontSize,
    fill: '#fff',
  });
}

function buildRadialBar(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord {
  const [definition] = definitions;
  const stacked = definitions.length > 1;
  const names = stacked
    ? definitions.map(item => labelFor(ctx.config, item.dataKey))
    : ctx.data.map(row => labelFor(ctx.config, categoryOf(ctx, row)));

  const rowValues = stacked
    ? definitions.map(item => toNumber(ctx.data[0]?.[item.dataKey]) ?? 0)
    : ctx.data.map(row => toNumber(row[definition?.dataKey ?? '']) ?? 0);

  const max = Math.max(...rowValues, 0) || 1;
  const track = withAlpha(ctx.chrome.mutedForeground, 0.15);

  const series: OptionRecord[] = [];

  if (stacked) {
    // Every series shares one ring, so only the outermost segment gets a rounded cap.
    definitions.forEach((item, index) => {
      series.push({
        type: 'bar',
        coordinateSystem: 'polar',
        name: labelFor(ctx.config, item.dataKey),
        stack: IMPLICIT_STACK_ID,
        roundCap: index === definitions.length - 1,
        data: [rowValues[index]],
        itemStyle: { color: colorFor(ctx, item.dataKey, index, item.color) },
        animation: ctx.animation,
      });
    });
  } else {
    const data = ctx.data.map((row, index) => {
      const name = categoryOf(ctx, row);
      const declared = typeof row['fill'] === 'string' ? (row['fill'] as string) : undefined;

      return {
        value: toNumber(row[definition?.dataKey ?? '']) ?? 0,
        itemStyle: { color: colorFor(ctx, name, index, declared ?? definition?.color) },
      };
    });

    series.push({
      type: 'bar',
      coordinateSystem: 'polar',
      name: labelFor(ctx.config, definition?.dataKey ?? ''),
      roundCap: true,
      // Recharts leaves barely a hair between the rings; ECharts' default gap is four times that.
      barCategoryGap: '10%',
      showBackground: ctx.track,
      backgroundStyle: { color: track },
      animation: ctx.animation,
      data,
    });
  }

  return {
    ...(ctx.radialLabel && !stacked ? { graphic: arcLabels(ctx, names) } : {}),
    polar: {
      radius: [ctx.innerRadius ?? '30%', ctx.outerRadius ?? '90%'],
      center: ['50%', '50%'],
    },
    angleAxis: {
      type: 'value',
      min: 0,
      max: stacked ? rowValues.reduce((sum, value) => sum + value, 0) || 1 : max,
      show: false,
      // Recharts reads the two angles as a direction: 180 → 0 sweeps clockwise, -90 → 380
      // counter-clockwise. ECharts needs that spelled out.
      ...(ctx.startAngle === undefined || ctx.endAngle === undefined
        ? {}
        : { clockwise: ctx.endAngle < ctx.startAngle }),
      ...(ctx.startAngle === undefined ? {} : { startAngle: ctx.startAngle }),
      ...(ctx.endAngle === undefined ? {} : { endAngle: ctx.endAngle }),
    },
    radiusAxis: {
      type: 'category',
      data: stacked ? [names.join(' / ')] : names,
      show: false,
      z: 10,
    },
    series,
  };
}

function buildRadialGauge(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord {
  const [definition] = definitions;
  const row = ctx.data[0] ?? {};
  const value = toNumber(row[definition?.dataKey ?? '']) ?? 0;
  const declared = typeof row['fill'] === 'string' ? (row['fill'] as string) : undefined;
  const color = colorFor(ctx, categoryOf(ctx, row), 0, declared ?? definition?.color);
  const track = withAlpha(ctx.chrome.mutedForeground, 0.15);
  const width = 26;

  return {
    series: [
      {
        type: 'gauge',
        startAngle: ctx.startAngle ?? 90,
        endAngle: ctx.endAngle ?? -270,
        radius: ctx.outerRadius ?? '85%',
        center: ['50%', '50%'],
        min: 0,
        max: Math.max(value, 1) * 1.25,
        animation: ctx.animation,
        progress: { show: true, roundCap: true, width, itemStyle: { color } },
        axisLine: { roundCap: true, lineStyle: { width, color: [[1, track]] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: { show: false },
        data: [{ value, name: labelFor(ctx.config, definition?.dataKey ?? '') }],
      },
    ],
  };
}

/**
 * shadcn nests a `<Label content={…} />` in the donut; ECharts needs `graphic` text nodes.
 *
 * The nodes are positioned with plain `x`/`y` inside the group — `left`/`top` would override
 * them and stack the value and the caption on the very same pixel.
 */
function buildCenterText(ctx: ZardChartBuildContext): OptionRecord[] {
  if (!ctx.centerValue && !ctx.centerLabel) {
    return [];
  }

  const children: OptionRecord[] = [];
  const hasBoth = !!ctx.centerValue && !!ctx.centerLabel;

  if (ctx.centerValue) {
    children.push({
      type: 'text',
      x: 0,
      y: 0,
      z: CENTER_TEXT_Z,
      style: {
        text: ctx.centerValue,
        fill: ctx.chrome.foreground,
        fontSize: 36,
        fontWeight: 700,
        align: 'center',
        verticalAlign: 'middle',
        textAlign: 'center',
        textVerticalAlign: 'middle',
      },
    });
  }

  if (ctx.centerLabel) {
    children.push({
      type: 'text',
      x: 0,
      y: hasBoth ? 24 : 0,
      z: CENTER_TEXT_Z,
      style: {
        text: ctx.centerLabel,
        fill: ctx.chrome.mutedForeground,
        fontSize: 12,
        align: 'center',
        verticalAlign: 'middle',
        textAlign: 'center',
        textVerticalAlign: 'middle',
      },
    });
  }

  return children;
}

function buildTooltip(ctx: ZardChartBuildContext, legendEntries: ZardChartLegendEntry[]): OptionRecord | undefined {
  if (!ctx.tooltip) {
    return undefined;
  }

  const colors: Record<string, string> = {};
  for (const entry of legendEntries) {
    colors[entry.name] = entry.color;
  }

  // A radar arrives as one param holding every indicator, so the tooltip needs their names.
  const indicators =
    ctx.type === 'radar' ? clockwise(ctx.data.map(row => labelFor(ctx.config, categoryOf(ctx, row)))) : undefined;

  const context: ZardChartTooltipContext = { ...ctx.tooltip, config: ctx.config, colors, indicators };

  const hasBars = normalizeSeries(ctx.series).some(definition => (definition.type ?? ctx.type) === 'bar');
  const cursor = ctx.tooltip.cursor
    ? hasBars
      ? { type: 'shadow', shadowStyle: { color: withAlpha(ctx.chrome.mutedForeground, 0.15) } }
      : { type: 'line', lineStyle: { color: ctx.chrome.border, width: 1 } }
    : { type: 'none' };

  return {
    trigger: ctx.tooltip.trigger,
    // A tap is a hover that ends immediately, so on touch the tooltip would flash and vanish.
    // Binding it to the click alone keeps it up until the next tap, the way Recharts behaves.
    triggerOn: ctx.coarsePointer ? 'click' : 'mousemove|click',
    axisPointer: cursor,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    // Recharts keeps its tooltip inside the responsive container; ECharts would let it
    // spill over whatever sits next to the chart.
    confine: true,
    extraCssText: 'box-shadow:none;',
    appendToBody: false,
    formatter: (params: ZardChartTooltipParam | ZardChartTooltipParam[]) => buildTooltipHtml(params, context),
  };
}

/** One legend entry per series — or per slice, for the single-series chart types. */
export function buildLegendEntries(ctx: ZardChartBuildContext): ZardChartLegendEntry[] {
  const definitions = normalizeSeries(ctx.series);
  const perSlice = ctx.type === 'pie' || (ctx.type === 'radial' && definitions.length <= 1);

  if (perSlice) {
    return ctx.data.map((row, index) => {
      const name = categoryOf(ctx, row);
      const declared = typeof row['fill'] === 'string' ? (row['fill'] as string) : undefined;

      return {
        name: labelFor(ctx.config, name),
        dataKey: name,
        label: labelFor(ctx.config, name),
        color: colorFor(ctx, name, index, declared),
        icon: ctx.config[name]?.icon,
      };
    });
  }

  return definitions.map((definition, index) => ({
    name: labelFor(ctx.config, definition.dataKey),
    dataKey: definition.dataKey,
    label: labelFor(ctx.config, definition.dataKey),
    color: colorFor(ctx, definition.dataKey, index, definition.color),
    icon: ctx.config[definition.dataKey]?.icon,
  }));
}

function isPlainObject(value: unknown): value is OptionRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Deep-merges the `[zOption]` escape hatch over the generated option. Arrays merge
 * index by index so `{ series: [{ symbolSize: 12 }] }` patches the first series
 * instead of replacing the whole list.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    const length = Math.max(base.length, override.length);
    const merged = [];
    for (let index = 0; index < length; index++) {
      merged.push(index >= override.length ? base[index] : deepMerge(base[index], override[index]));
    }
    return merged as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const merged: OptionRecord = { ...base };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = key in base ? deepMerge(base[key], value) : value;
    }
    return merged as T;
  }

  return override as T;
}

/**
 * Resolves every `var(--token)` left anywhere in the option. The builder already resolves the
 * colors it produces, but `[zOption]` is authored by hand — and ECharts silently falls back to
 * black when it meets a `var()` it cannot parse, so the escape hatch has to be swept too.
 */
export function resolveOptionColors<T>(option: T, resolveColor: (value: string) => string): T {
  if (typeof option === 'string') {
    return (option.startsWith('var(--') ? resolveColor(option) : option) as T;
  }

  if (Array.isArray(option)) {
    return option.map(item => resolveOptionColors(item, resolveColor)) as T;
  }

  if (isPlainObject(option)) {
    const resolved: OptionRecord = {};
    for (const [key, value] of Object.entries(option)) {
      resolved[key] = resolveOptionColors(value, resolveColor);
    }
    return resolved as T;
  }

  return option;
}

/** Turns a `ZardChartConfig` plus the component inputs into a complete `EChartsOption`. */
export function buildChartOption(ctx: ZardChartBuildContext): EChartsOption {
  const definitions = normalizeSeries(ctx.series);
  const legendEntries = buildLegendEntries(ctx);
  const isCartesian = ctx.type === 'area' || ctx.type === 'bar' || ctx.type === 'line';

  const option: OptionRecord = {
    animation: ctx.animation,
    animationDuration: ENTRY_DURATION,
    animationEasing: ENTRY_EASING,
    animationDurationUpdate: UPDATE_DURATION,
    animationEasingUpdate: 'cubicInOut',
    aria: { enabled: ctx.accessibility },
    color: legendEntries.map(entry => entry.color),
    textStyle: { fontFamily: 'inherit' },
  };

  if (isCartesian) {
    const categories = ctx.data.map(row => String(row[ctx.xAxisKey ?? ''] ?? ''));
    Object.assign(option, buildAxes(ctx, definitions, categories));
    const inset =
      ctx.horizontal || definitions.some(definition => (definition.type ?? ctx.type) === 'bar') ? 0 : CURVE_GRID_INSET;
    option['grid'] = {
      left: inset,
      right: inset,
      top: 12,
      bottom: 0,
      outerBoundsMode: 'same',
      outerBoundsContain: 'axisLabel',
    };
    option['series'] = buildCartesianSeries(ctx, definitions);
  } else if (ctx.type === 'radar') {
    Object.assign(option, buildRadar(ctx, definitions));
  } else if (ctx.type === 'pie') {
    Object.assign(option, buildPie(ctx, definitions));
  } else {
    Object.assign(
      option,
      ctx.radialVariant === 'gauge' ? buildRadialGauge(ctx, definitions) : buildRadialBar(ctx, definitions),
    );
  }

  const tooltip = buildTooltip(ctx, legendEntries);
  if (tooltip) {
    option['tooltip'] = tooltip;
  }

  // The legend stays hidden — `z-chart-legend` renders the shadcn markup — but it must be
  // declared so `dispatchAction({ type: 'legendToggleSelect' })` has something to act on.
  if (ctx.hasLegend) {
    option['legend'] = { show: false, data: legendEntries.map(entry => entry.name) };
  }

  const centerText = buildCenterText(ctx);
  if (centerText.length > 0) {
    // A radial chart may already have put its ring labels here; the centre joins them.
    const existing = Array.isArray(option['graphic']) ? (option['graphic'] as OptionRecord[]) : [];
    option['graphic'] = [...existing, { type: 'group', left: 'center', top: 'center', children: centerText }];
  }

  if (ctx.dataZoom && isCartesian) {
    option['dataZoom'] = [
      { type: 'inside' },
      {
        type: 'slider',
        height: 18,
        bottom: 0,
        borderColor: ctx.chrome.border,
        backgroundColor: 'transparent',
        fillerColor: withAlpha(ctx.chrome.mutedForeground, 0.12),
        handleStyle: { color: ctx.chrome.background, borderColor: ctx.chrome.border },
        textStyle: { color: ctx.chrome.mutedForeground },
      },
    ];
    (option['grid'] as OptionRecord)['bottom'] = 28;
  }

  // A brush selects along an axis, and only the cartesian charts have one — the same guard
  // `dataZoom` carries above.
  const brush = ctx.brush && isCartesian;

  if (brush) {
    option['brush'] = { toolbox: ['rect', 'polygon', 'clear'], xAxisIndex: 0 };
  }

  // The brush is only reachable through the toolbox, so asking for one brings the other along.
  if (ctx.toolbox || brush) {
    option['toolbox'] = {
      right: 0,
      top: 0,
      iconStyle: { borderColor: ctx.chrome.mutedForeground },
      feature: {
        ...(ctx.brush ? { brush: {} } : {}),
        ...(ctx.toolbox ? { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } : {}),
      },
    };
  }

  return option as EChartsOption;
}
