import { mergeClasses } from '@/shared/utils/merge-classes';

import type { ZardChartConfig, ZardChartTooltipIndicator, ZardChartTooltipTrigger } from './chart.types';

/** The subset of the ECharts callback params the tooltip actually reads. */
export interface ZardChartTooltipParam {
  axisValue?: string | number;
  axisValueLabel?: string;
  seriesName?: string;
  seriesId?: string;
  name?: string;
  dataIndex?: number;
  color?: string;
  percent?: number;
  value?: unknown;
  data?: unknown;
}

/** Everything `z-chart-tooltip` declares, plus what only the parent chart can resolve. */
export interface ZardChartTooltipContext {
  indicator: ZardChartTooltipIndicator;
  trigger: ZardChartTooltipTrigger;
  hideLabel: boolean;
  hideIndicator: boolean;
  labelKey?: string;
  nameKey?: string;
  labelFormatter?: (value: string) => string;
  valueFormatter?: (value: number, name: string) => string;
  class: string;
  labelClass: string;
  config: ZardChartConfig;
  /** Series colors resolved by the parent chart, keyed by the name ECharts uses. */
  colors: Record<string, string>;
  /**
   * Radar only: the indicator names, in the order ECharts lays them out. A radar hands the whole
   * web over in a single param, so the rows are read off the value array against these names.
   */
  indicators?: readonly string[];
}

const CONTAINER_CLASSES =
  'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl';

const ROW_CLASSES =
  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground';

const INDICATOR_CLASSES: Record<ZardChartTooltipIndicator, string> = {
  dashed: 'w-0 border-[1.5px] border-dashed bg-transparent',
  dot: 'h-2.5 w-2.5',
  line: 'w-1',
};

const HTML_ENTITIES: Record<string, string> = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;',
};

/** Escapes user data before it is concatenated into the tooltip's innerHTML. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => HTML_ENTITIES[char]);
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** ECharts hands array-typed values for cartesian series and plain values for pie/radar. */
function readValue(param: ZardChartTooltipParam): number | null {
  const { value } = param;
  if (Array.isArray(value)) {
    for (let index = value.length - 1; index >= 0; index--) {
      const parsed = toNumber(value[index]);
      if (parsed !== null) {
        return parsed;
      }
    }
    return null;
  }
  if (value && typeof value === 'object') {
    return toNumber((value as { value?: unknown }).value);
  }
  return toNumber(value);
}

function formatValue(value: number | null, name: string, ctx: ZardChartTooltipContext): string {
  if (value === null) {
    return '';
  }
  if (ctx.valueFormatter) {
    return ctx.valueFormatter(value, name);
  }
  return value.toLocaleString();
}

/** One line of the tooltip: a swatch, a name and a value. */
interface TooltipRow {
  name: string;
  color: string;
  value: string;
}

function colorOf(param: ZardChartTooltipParam, ctx: ZardChartTooltipContext): string {
  return ctx.colors[param.seriesName ?? ''] ?? ctx.colors[param.name ?? ''] ?? param.color ?? '';
}

/** True when the params are a radar's, which arrive as one param holding every indicator. */
function isRadar(items: ZardChartTooltipParam[], ctx: ZardChartTooltipContext): boolean {
  return !!ctx.indicators?.length && items.every(param => Array.isArray(param.value));
}

/**
 * A radar's rows: one per indicator, the way ECharts' own tooltip reads a web. Taking a single
 * number off the array instead would show the same value at every vertex.
 */
function radarRows(items: ZardChartTooltipParam[], ctx: ZardChartTooltipContext): TooltipRow[] {
  const indicators = ctx.indicators ?? [];

  return items.flatMap(param => {
    const color = colorOf(param, ctx);
    const values = Array.isArray(param.value) ? param.value : [];

    return values.flatMap((raw, index) => {
      const parsed = toNumber(raw);
      if (parsed === null) {
        return [];
      }

      const name = indicators[index] ?? '';
      const label = ctx.config[name]?.label ?? name;
      return [{ name: label, color, value: formatValue(parsed, label, ctx) }];
    });
  });
}

/** One param, one row: everything that is not a radar. */
function rowOf(param: ZardChartTooltipParam, ctx: ZardChartTooltipContext): TooltipRow {
  const name = itemLabel(param, ctx);
  return { name, color: colorOf(param, ctx), value: formatValue(readValue(param), name, ctx) };
}

function itemLabel(param: ZardChartTooltipParam, ctx: ZardChartTooltipContext): string {
  const key = ctx.nameKey ?? (ctx.trigger === 'item' ? (param.name ?? '') : (param.seriesName ?? ''));
  return ctx.config[key]?.label ?? (ctx.trigger === 'item' ? (param.name ?? '') : (param.seriesName ?? ''));
}

function headerLabel(params: ZardChartTooltipParam[], ctx: ZardChartTooltipContext): string {
  const [first] = params;
  if (!first) {
    return '';
  }

  const raw =
    ctx.labelKey && ctx.config[ctx.labelKey]?.label
      ? (ctx.config[ctx.labelKey]?.label ?? '')
      : ctx.trigger === 'item'
        ? (first.name ?? '')
        : String(first.axisValueLabel ?? first.axisValue ?? '');

  const configured = ctx.config[raw]?.label ?? raw;
  return ctx.labelFormatter ? ctx.labelFormatter(configured) : configured;
}

function indicatorHtml(color: string, ctx: ZardChartTooltipContext, nestLabel: boolean): string {
  if (ctx.hideIndicator) {
    return '';
  }

  const classes = mergeClasses(
    'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
    INDICATOR_CLASSES[ctx.indicator],
    nestLabel && ctx.indicator === 'dashed' ? 'my-0.5' : '',
  );
  // The two custom properties the classes above read the swatch color from.
  const swatch = escapeHtml(color);
  const declarations = [`--color-bg: ${swatch}`, `--color-border: ${swatch}`].join('; ');

  return `<div class="${classes}" style="${declarations};"></div>`;
}

/**
 * Builds the tooltip markup, mirroring shadcn/ui's `ChartTooltipContent`.
 * ECharts injects the returned string straight into the DOM, so every dynamic
 * fragment goes through {@link escapeHtml} first.
 */
export function buildTooltipHtml(
  params: ZardChartTooltipParam | ZardChartTooltipParam[],
  ctx: ZardChartTooltipContext,
): string {
  const items = (Array.isArray(params) ? params : [params]).filter(Boolean);
  if (items.length === 0) {
    return '';
  }

  const radar = isRadar(items, ctx);
  const entries: TooltipRow[] = radar ? radarRows(items, ctx) : items.map(param => rowOf(param, ctx));

  if (entries.length === 0) {
    return '';
  }

  // A radar is headed by the series it belongs to; everything else by its category.
  const label = radar ? (items[0]?.seriesName ?? '') : headerLabel(items, ctx);
  const nestLabel = entries.length === 1 && ctx.indicator !== 'dot';
  const showHeader = !ctx.hideLabel && !nestLabel && label !== '';

  // Resolved once: the heading reads the same whether it sits above the rows or inside one, and
  // a class carrying a quote would otherwise close the attribute and corrupt the markup.
  const labelClasses = escapeHtml(mergeClasses('font-medium', ctx.labelClass));

  const rows = entries
    .map(({ name, color, value }) => {
      const rowClasses = mergeClasses(ROW_CLASSES, ctx.indicator === 'dot' ? 'items-center' : '');
      const innerAlign = nestLabel ? 'items-end' : 'items-center';
      const nestedLabel =
        nestLabel && !ctx.hideLabel && label !== '' ? `<div class="${labelClasses}">${escapeHtml(label)}</div>` : '';

      return `<div class="${rowClasses}">${indicatorHtml(color, ctx, nestLabel)}<div class="flex flex-1 justify-between leading-none ${innerAlign}"><div class="grid gap-1.5">${nestedLabel}<span class="text-muted-foreground">${escapeHtml(name)}</span></div><span class="font-mono font-medium tabular-nums text-foreground">${escapeHtml(value)}</span></div></div>`;
    })
    .join('');

  const header = showHeader ? `<div class="${labelClasses}">${escapeHtml(label)}</div>` : '';
  const containerClasses = escapeHtml(mergeClasses(CONTAINER_CLASSES, ctx.class));

  // `role="tooltip"` is what a screen reader — and a test — recognises this box by.
  return `<div role="tooltip" class="${containerClasses}">${header}<div class="grid gap-1.5">${rows}</div></div>`;
}
