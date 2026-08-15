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
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
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
      if (parsed !== null) return parsed;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    return toNumber((value as { value?: unknown }).value);
  }
  return toNumber(value);
}

function formatValue(value: number | null, name: string, ctx: ZardChartTooltipContext): string {
  if (value === null) return '';
  if (ctx.valueFormatter) return ctx.valueFormatter(value, name);
  return value.toLocaleString();
}

function itemLabel(param: ZardChartTooltipParam, ctx: ZardChartTooltipContext): string {
  const key = ctx.nameKey ?? (ctx.trigger === 'item' ? (param.name ?? '') : (param.seriesName ?? ''));
  return ctx.config[key]?.label ?? (ctx.trigger === 'item' ? (param.name ?? '') : (param.seriesName ?? ''));
}

function headerLabel(params: ZardChartTooltipParam[], ctx: ZardChartTooltipContext): string {
  const [first] = params;
  if (!first) return '';

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
  if (ctx.hideIndicator) return '';

  const classes = mergeClasses(
    'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
    INDICATOR_CLASSES[ctx.indicator],
    nestLabel && ctx.indicator === 'dashed' ? 'my-0.5' : '',
  );
  const style = `--color-bg: ${escapeHtml(color)}; --color-border: ${escapeHtml(color)};`;

  return `<div class="${classes}" style="${style}"></div>`;
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
  if (items.length === 0) return '';

  const label = headerLabel(items, ctx);
  const nestLabel = items.length === 1 && ctx.indicator !== 'dot';
  const showHeader = !ctx.hideLabel && !nestLabel && label !== '';

  const rows = items
    .map(param => {
      const name = itemLabel(param, ctx);
      const color = ctx.colors[param.seriesName ?? ''] ?? ctx.colors[param.name ?? ''] ?? param.color ?? '';
      const value = formatValue(readValue(param), name, ctx);
      const rowClasses = mergeClasses(ROW_CLASSES, ctx.indicator === 'dot' ? 'items-center' : '');
      const innerAlign = nestLabel ? 'items-end' : 'items-center';
      const nestedLabel =
        nestLabel && !ctx.hideLabel && label !== ''
          ? `<div class="font-medium ${ctx.labelClass}">${escapeHtml(label)}</div>`
          : '';

      return `<div class="${rowClasses}">${indicatorHtml(color, ctx, nestLabel)}<div class="flex flex-1 justify-between leading-none ${innerAlign}"><div class="grid gap-1.5">${nestedLabel}<span class="text-muted-foreground">${escapeHtml(name)}</span></div><span class="font-mono font-medium tabular-nums text-foreground">${escapeHtml(value)}</span></div></div>`;
    })
    .join('');

  const header = showHeader
    ? `<div class="${mergeClasses('font-medium', ctx.labelClass)}">${escapeHtml(label)}</div>`
    : '';

  return `<div class="${mergeClasses(CONTAINER_CLASSES, ctx.class)}">${header}<div class="grid gap-1.5">${rows}</div></div>`;
}
