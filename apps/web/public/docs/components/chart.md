---
title: Chart
description: Beautiful charts built with Apache ECharts. Copy and paste into your apps.
---

# Chart

Beautiful charts built with Apache ECharts. Copy and paste into your apps.

## About

The chart is built on Apache ECharts, wired into Angular through ngx-echarts.

[Apache ECharts](https://echarts.apache.org/)

## Installation

### CLI

```bash
npx zard-cli@latest add chart
```

### Manual

```angular-ts
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import type { ClassValue } from 'clsx';
import type { EChartsOption } from 'echarts';
import type { ECElementEvent, EChartsType } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { EDarkModes, ZardDarkMode } from '@/shared/services/dark-mode';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { resolveChartChrome, resolveChartColors, resolveCssColor } from './chart-colors.util';
import { ZARD_CHART, type ZardChartHost } from './chart-context';
import { zardEcharts } from './chart-echarts.registry';
import { ZardChartLegendComponent } from './chart-legend.component';
import {
  buildChartOption,
  buildLegendEntries,
  deepMerge,
  normalizeSeries,
  resolveOptionColors,
  type ZardChartBuildContext,
} from './chart-option.builder';
import { renderChartToSvg, type ZardEchartsSsrApi } from './chart-ssr.util';
import { ZardChartTooltipComponent } from './chart-tooltip.component';
import type {
  ZardChartConfig,
  ZardChartDatum,
  ZardChartGrid,
  ZardChartLegendEntry,
  ZardChartOptionOverride,
  ZardChartRadarShape,
  ZardChartRadialVariant,
  ZardChartRenderer,
  ZardChartSeriesInput,
  ZardChartStackOffset,
  ZardChartType,
} from './chart.types';
import { chartCanvasVariants, chartVariants } from './chart.variants';

@Component({
  selector: 'z-chart',
  imports: [NgxEchartsDirective],
  template: `
    @if (ssrSvg(); as svg) {
      <div [class]="canvasClasses()" [attr.role]="hostRole()" [attr.aria-label]="ariaLabel()" [innerHTML]="svg"></div>
    } @else {
      <div
        echarts
        [class]="canvasClasses()"
        [attr.role]="hostRole()"
        [attr.aria-label]="ariaLabel()"
        [options]="option()"
        [initOpts]="initOpts()"
        [autoResize]="true"
        (chartInit)="onChartInit($event)"
        (chartClick)="zChartClick.emit($event)"
        (chartLegendSelectChanged)="zLegendSelectChanged.emit($event)"
        (chartDataZoom)="zDataZoomChange.emit($event)"
      ></div>
    }
    <ng-content />
  `,
  providers: [{ provide: ZARD_CHART, useExisting: forwardRef(() => ZardChartComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    ngSkipHydration: 'true',
    '[class]': 'classes()',
  },
  exportAs: 'zChart',
})
export class ZardChartComponent implements ZardChartHost {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly darkMode = inject(ZardDarkMode);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly class = input<ClassValue>('');
  readonly zConfig = input<ZardChartConfig>({});
  readonly zData = input<readonly ZardChartDatum[]>([]);
  readonly zType = input<ZardChartType>('bar');
  readonly zSeries = input<ZardChartSeriesInput>([]);
  readonly zXAxisKey = input<string>();
  readonly zNameKey = input<string>();
  readonly zStacked = input(false, { transform: booleanAttribute });
  readonly zStackOffset = input<ZardChartStackOffset>('none');
  readonly zHorizontal = input(false, { transform: booleanAttribute });
  readonly zGrid = input<ZardChartGrid>('horizontal');
  readonly zXAxis = input(true, { transform: booleanAttribute });
  readonly zYAxis = input(false, { transform: booleanAttribute });
  readonly zXAxisFormatter = input<(value: string) => string>();
  readonly zYAxisFormatter = input<(value: number) => string>();
  readonly zInnerRadius = input<string | number>();
  readonly zOuterRadius = input<string | number>();
  readonly zRadialVariant = input<ZardChartRadialVariant>('bar');
  readonly zRadarShape = input<ZardChartRadarShape>('polygon');
  readonly zStartAngle = input<number | undefined>(undefined, { transform: numberAttribute });
  readonly zEndAngle = input<number | undefined>(undefined, { transform: numberAttribute });
  readonly zPadAngle = input(0, { transform: numberAttribute });
  readonly zGradient = input(false, { transform: booleanAttribute });
  readonly zLabel = input(false, { transform: booleanAttribute });
  readonly zCenterValue = input<string>();
  readonly zCenterLabel = input<string>();
  readonly zAccessibility = input(true, { transform: booleanAttribute });
  readonly zAnimation = input(true, { transform: booleanAttribute });
  readonly zDataZoom = input(false, { transform: booleanAttribute });
  readonly zBrush = input(false, { transform: booleanAttribute });
  readonly zToolbox = input(false, { transform: booleanAttribute });
  readonly zRenderer = input<ZardChartRenderer>('canvas');
  readonly zSsrWidth = input(600, { transform: numberAttribute });
  readonly zSsrHeight = input(300, { transform: numberAttribute });
  readonly zOption = input<ZardChartOptionOverride>({});

  readonly zChartInit = output<EChartsType>();
  readonly zChartClick = output<ECElementEvent>();
  readonly zLegendSelectChanged = output<unknown>();
  readonly zDataZoomChange = output<unknown>();

  private readonly tooltipRef = contentChild(ZardChartTooltipComponent);
  private readonly legendRef = contentChild(ZardChartLegendComponent);

  private readonly chartInstance = signal<EChartsType | null>(null);
  /** Bumped one frame after a theme switch, once the `.dark` class is on the document. */
  private readonly colorRevision = signal(0);

  readonly hiddenSeries = signal<ReadonlySet<string>>(new Set<string>());

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        this.darkMode.themeMode();
        // The `.dark` class lands on <html> in a separate effect, so the computed colors are
        // only trustworthy on the next frame.
        this.scheduleColorRefresh();
      });
    }
  }

  private scheduleColorRefresh(): void {
    const bump = () => this.colorRevision.update(value => value + 1);

    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(bump);
      return;
    }

    setTimeout(bump);
  }

  /** Flattens the declarative `z-chart-tooltip` child into plain data for the builder. */
  private readonly tooltipContext = computed<ZardChartBuildContext['tooltip']>(() => {
    const tooltip = this.tooltipRef();
    if (!tooltip) return null;

    return {
      indicator: tooltip.zIndicator(),
      trigger: tooltip.zTrigger(),
      hideLabel: tooltip.zHideLabel(),
      hideIndicator: tooltip.zHideIndicator(),
      labelKey: tooltip.zLabelKey(),
      nameKey: tooltip.zNameKey(),
      labelFormatter: tooltip.zLabelFormatter(),
      valueFormatter: tooltip.zValueFormatter(),
      class: mergeClasses(tooltip.class()),
      labelClass: mergeClasses(tooltip.zLabelClass()),
    };
  });

  private readonly buildContext = computed<ZardChartBuildContext>(() => {
    this.colorRevision();

    const host = this.isBrowser ? (this.elementRef.nativeElement as HTMLElement) : null;
    const isDark = this.darkMode.themeMode() === EDarkModes.DARK;
    const config = this.zConfig();

    return {
      type: this.zType(),
      data: this.zData(),
      config,
      series: this.zSeries(),
      xAxisKey: this.zXAxisKey(),
      nameKey: this.zNameKey(),
      stacked: this.zStacked(),
      stackOffset: this.zStackOffset(),
      horizontal: this.zHorizontal(),
      grid: this.zGrid(),
      xAxis: this.zXAxis(),
      yAxis: this.zYAxis(),
      xAxisFormatter: this.zXAxisFormatter(),
      yAxisFormatter: this.zYAxisFormatter(),
      innerRadius: this.zInnerRadius(),
      outerRadius: this.zOuterRadius(),
      radialVariant: this.zRadialVariant(),
      radarShape: this.zRadarShape(),
      startAngle: this.zStartAngle(),
      endAngle: this.zEndAngle(),
      padAngle: this.zPadAngle(),
      gradient: this.zGradient(),
      label: this.zLabel(),
      centerValue: this.zCenterValue(),
      centerLabel: this.zCenterLabel(),
      accessibility: this.zAccessibility(),
      animation: this.zAnimation(),
      dataZoom: this.zDataZoom(),
      brush: this.zBrush(),
      toolbox: this.zToolbox(),
      colors: resolveChartColors(host, config, isDark),
      chrome: resolveChartChrome(host),
      hasLegend: !!this.legendRef(),
      resolveColor: (value: string) => resolveCssColor(host, value),
      tooltip: this.tooltipContext(),
    };
  });

  protected readonly option = computed<EChartsOption>(() => {
    const context = this.buildContext();
    const merged = deepMerge(buildChartOption(context), this.zOption());
    return resolveOptionColors(merged, context.resolveColor);
  });

  readonly legendEntries = computed<ZardChartLegendEntry[]>(() => buildLegendEntries(this.buildContext()));

  protected readonly initOpts = computed(() => ({ renderer: this.zRenderer() }));

  protected readonly ssrSvg = computed<SafeHtml | null>(() => {
    if (this.isBrowser) return null;

    const api = zardEcharts as unknown as ZardEchartsSsrApi;
    const svg = renderChartToSvg(api, this.option(), this.zSsrWidth(), this.zSsrHeight());
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  });

  protected readonly hostRole = computed(() => (this.zAccessibility() ? 'img' : null));

  protected readonly ariaLabel = computed(() => {
    if (!this.zAccessibility()) return null;

    const config = this.zConfig();
    const labels = normalizeSeries(this.zSeries())
      .map(definition => config[definition.dataKey]?.label ?? definition.dataKey)
      .filter(Boolean);

    return labels.length > 0 ? `${this.zType()} chart of ${labels.join(', ')}` : `${this.zType()} chart`;
  });

  protected readonly classes = computed(() => mergeClasses(chartVariants({ zType: this.zType() }), this.class()));

  protected readonly canvasClasses = computed(() => mergeClasses(chartCanvasVariants()));

  protected onChartInit(instance: EChartsType): void {
    this.chartInstance.set(instance);
    this.hiddenSeries.set(new Set<string>());
    this.zChartInit.emit(instance);
  }

  toggleSeries(name: string): void {
    this.chartInstance()?.dispatchAction({ type: 'legendToggleSelect', name });

    this.hiddenSeries.update(current => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }
}
```

```angular-ts
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

export const chartLegendSwatchVariants = cva('h-2 w-2 shrink-0 rounded-[2px]');
```

```angular-ts
import type { ZardChartChromeColors, ZardChartConfig } from './chart.types';

/** How many `--chart-*` tokens the default palette cycles through. */
export const CHART_PALETTE_SIZE = 5;

const VAR_PATTERN = /^var\(\s*(--[^,)\s]+)\s*(?:,\s*([\s\S]+?))?\s*\)$/;
const HEX_PATTERN = /^#([0-9a-f]{3,8})$/i;
const FUNCTION_PATTERN = /^([a-z-]+)\(\s*([\s\S]*?)\s*\)$/i;
const MAX_VAR_DEPTH = 8;

/** CSS color functions that accept the modern `<channels> / <alpha>` syntax. */
const SLASH_ALPHA_FUNCTIONS = new Set(['color', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'rgb', 'rgba']);

/** The two functions that also have a legacy comma syntax, mapped to their alpha-aware twin. */
const LEGACY_ALPHA_FUNCTIONS: Record<string, string> = { hsl: 'hsla', hsla: 'hsla', rgb: 'rgba', rgba: 'rgba' };

/** Canonical name to emit when writing the modern slash syntax. */
const CANONICAL_FUNCTIONS: Record<string, string> = { hsla: 'hsl', rgba: 'rgb' };

/**
 * Literal fallbacks used where `getComputedStyle` is unavailable — server-side rendering.
 * They mirror the light theme of `apps/web/src/styles.css` as hex, because ECharts' server
 * renderer is safer with sRGB values than with `oklch()`.
 */
const SSR_TOKEN_COLORS: Record<string, string> = {
  '--background': '#ffffff',
  '--border': '#e5e5e5',
  '--card': '#ffffff',
  '--chart-1': '#e76e50',
  '--chart-2': '#2a9d90',
  '--chart-3': '#274754',
  '--chart-4': '#e8c468',
  '--chart-5': '#f4a462',
  '--foreground': '#0a0a0a',
  '--muted-foreground': '#737373',
};

function readCssVariable(host: HTMLElement | null | undefined, token: string): string {
  if (!host || typeof globalThis.getComputedStyle !== 'function') {
    return SSR_TOKEN_COLORS[token] ?? '';
  }

  try {
    return globalThis.getComputedStyle(host).getPropertyValue(token).trim();
  } catch {
    return SSR_TOKEN_COLORS[token] ?? '';
  }
}

/**
 * Resolves a CSS color that may be a `var(--token)` reference into a literal value
 * ECharts can consume. Falls back to the var()'s own fallback, then to the raw input.
 */
export function resolveCssColor(host: HTMLElement | null | undefined, value: string, depth = 0): string {
  const raw = (value ?? '').trim();
  if (!raw || depth >= MAX_VAR_DEPTH) return raw;

  const match = VAR_PATTERN.exec(raw);
  if (!match) return raw;

  const [, token, fallback] = match;
  const computed = readCssVariable(host, token);
  if (computed) return resolveCssColor(host, computed, depth + 1);
  if (fallback) return resolveCssColor(host, fallback, depth + 1);

  return raw;
}

function hexWithAlpha(digits: string, alpha: number): string {
  const expanded = digits.length <= 4 ? [...digits].map(char => char + char).join('') : digits;
  const channel = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${expanded.slice(0, 6)}${channel}`;
}

/** Applies alpha to any CSS color, preferring oklch's native slash syntax. */
export function withAlpha(color: string, alpha: number): string {
  const raw = (color ?? '').trim();
  if (!raw) return raw;

  const clamped = Math.min(1, Math.max(0, alpha));

  const hex = HEX_PATTERN.exec(raw);
  if (hex) return hexWithAlpha(hex[1], clamped);

  const fn = FUNCTION_PATTERN.exec(raw);
  if (fn) {
    const name = fn[1].toLowerCase();
    const body = fn[2];

    if (SLASH_ALPHA_FUNCTIONS.has(name)) {
      if (!body.includes(',')) {
        const channels = body.split('/')[0].trim();
        return `${CANONICAL_FUNCTIONS[name] ?? name}(${channels} / ${clamped})`;
      }

      // Legacy comma syntax only exists for rgb()/hsl(), which have `rgba()`/`hsla()` counterparts.
      const legacy = LEGACY_ALPHA_FUNCTIONS[name];
      if (legacy) {
        const channels = body
          .split(',')
          .slice(0, 3)
          .map(part => part.trim())
          .join(', ');
        return `${legacy}(${channels}, ${clamped})`;
      }
    }
  }

  return `color-mix(in oklab, ${raw} ${Math.round(clamped * 100)}%, transparent)`;
}

/** Default palette: var(--chart-1) … var(--chart-5), cycling. */
export function paletteColor(index: number): string {
  const position = ((index % CHART_PALETTE_SIZE) + CHART_PALETTE_SIZE) % CHART_PALETTE_SIZE;
  return `var(--chart-${position + 1})`;
}

/** Resolves every color referenced by a ZardChartConfig for the current theme. */
export function resolveChartColors(
  host: HTMLElement | null | undefined,
  config: ZardChartConfig,
  isDark: boolean,
): Record<string, string> {
  const resolved: Record<string, string> = {};

  for (const [key, item] of Object.entries(config ?? {})) {
    const themed = isDark ? item?.theme?.dark : item?.theme?.light;
    const declared = themed ?? item?.color;
    if (!declared) continue;

    resolved[key] = resolveCssColor(host, declared);
  }

  return resolved;
}

/** Resolves the grid, axis and surface colors the chart chrome is painted with. */
export function resolveChartChrome(host: HTMLElement | null | undefined): ZardChartChromeColors {
  return {
    background: resolveCssColor(host, 'var(--background)'),
    border: resolveCssColor(host, 'var(--border)'),
    foreground: resolveCssColor(host, 'var(--foreground)'),
    mutedForeground: resolveCssColor(host, 'var(--muted-foreground)'),
  };
}
```

```angular-ts
import { InjectionToken, type Signal } from '@angular/core';

import type { ZardChartLegendEntry } from './chart.types';

/**
 * The slice of `z-chart` its declarative children are allowed to touch.
 * Declared apart from the component so `z-chart-legend` can inject the parent
 * without the two files importing each other.
 */
export interface ZardChartHost {
  /** One entry per series — or per slice, for pie and single-series radial charts. */
  readonly legendEntries: Signal<ZardChartLegendEntry[]>;
  /** Names currently toggled off through the legend. */
  readonly hiddenSeries: Signal<ReadonlySet<string>>;
  /** Toggles a series on the live ECharts instance. */
  toggleSeries(name: string): void;
}

export const ZARD_CHART = new InjectionToken<ZardChartHost>('ZARD_CHART');
```

```angular-ts
import { provideEchartsCore } from 'ngx-echarts';

/**
 * Registers the ECharts modules ZardUI charts need. Add to `app.config.ts` providers.
 *
 * The engine is imported lazily: `ngx-echarts` accepts a loader function and awaits it the
 * first time a chart is created, which keeps roughly a megabyte of ECharts out of the
 * application's initial bundle. Edit `chart-echarts.registry.ts` to change what is loaded.
 */
export const provideZardCharts = () =>
  provideEchartsCore({ echarts: () => import('./chart-echarts.registry').then(module => module.zardEcharts) });
```

```angular-ts
import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  AriaComponent,
  BrushComponent,
  DatasetComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

/**
 * The tree-shaken ECharts build ZardUI charts run on. Drop what you do not use — every
 * entry removed here leaves the bundle.
 *
 * Two must stay:
 * - `LegendComponent`, because the option keeps `legend: { show: false }` and the HTML
 *   legend toggles series through `dispatchAction({ type: 'legendToggleSelect' })`.
 * - `SVGRenderer`, because the server renders through `renderToSVGString()`.
 *
 * This module is kept apart from `provideZardCharts()` so the provider can import it
 * lazily and keep ECharts out of the application's initial bundle.
 */
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  PolarComponent,
  GraphicComponent,
  ToolboxComponent,
  BrushComponent,
  AriaComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  SVGRenderer,
]);

/** The registered ECharts core. Also what `z-chart` renders with on the server. */
export const zardEcharts = echarts;
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZARD_CHART } from './chart-context';
import type { ZardChartLegendEntry } from './chart.types';
import {
  chartLegendItemVariants,
  chartLegendSwatchVariants,
  chartLegendVariants,
  type ZardChartLegendAlignVariants,
} from './chart.variants';

/**
 * The only declarative child that renders real DOM. ECharts' own legend cannot reproduce the
 * shadcn markup, so the option keeps `legend: { show: false }` and this component draws the
 * entries below (or above) the canvas, toggling series through `legendToggleSelect`.
 */
@Component({
  selector: 'z-chart-legend',
  imports: [NgIcon],
  template: `
    @for (entry of entries(); track entry.name) {
      <button
        type="button"
        [class]="itemClasses(entry.name)"
        [attr.aria-pressed]="!hidden().has(entry.name)"
        (click)="toggle(entry.name)"
      >
        @if (entry.icon) {
          <ng-icon [name]="entry.icon" class="h-3 w-3" />
        } @else {
          <span [class]="swatchClasses()" [style.background-color]="entry.color"></span>
        }
        {{ entry.label }}
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
  exportAs: 'zChartLegend',
})
export class ZardChartLegendComponent {
  private readonly chart = inject(ZARD_CHART, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zNameKey = input<string>();
  readonly zVerticalAlign = input<ZardChartLegendAlignVariants>('bottom');

  protected readonly entries = computed<ZardChartLegendEntry[]>(() => this.chart?.legendEntries() ?? []);
  protected readonly hidden = computed<ReadonlySet<string>>(() => this.chart?.hiddenSeries() ?? new Set<string>());

  protected readonly classes = computed(() =>
    mergeClasses(chartLegendVariants({ zVerticalAlign: this.zVerticalAlign() }), this.class()),
  );

  protected readonly swatchClasses = computed(() => mergeClasses(chartLegendSwatchVariants()));

  protected itemClasses(name: string): string {
    return mergeClasses(chartLegendItemVariants({ zInactive: this.hidden().has(name) }));
  }

  protected toggle(name: string): void {
    this.chart?.toggleSeries(name);
  }
}
```

```angular-ts
import type { EChartsOption } from 'echarts';

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
const DEFAULT_AREA_OPACITY = 0.4;
const DEFAULT_RADAR_OPACITY = 0.6;
const IMPLICIT_STACK_ID = 'zard-stack';

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
  radarShape: ZardChartRadarShape;
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
  tooltip: Omit<ZardChartTooltipContext, 'colors' | 'config'> | null;
  hasLegend: boolean;
  /** Turns `var(--token)` into a literal ECharts can paint with. */
  resolveColor: (value: string) => string;
}

type OptionRecord = Record<string, unknown>;

export function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Accepts both the `string[]` shorthand and the fully described `ZardChartSeries[]`. */
export function normalizeSeries(input: ZardChartSeriesInput | undefined): ZardChartSeries[] {
  if (!Array.isArray(input)) return [];
  return input.map(item => (typeof item === 'string' ? { dataKey: item } : { ...item }));
}

function labelFor(config: ZardChartConfig, key: string): string {
  return config[key]?.label ?? key;
}

function colorFor(ctx: ZardChartBuildContext, key: string, index: number, declared?: string): string {
  if (declared) return ctx.resolveColor(declared);
  const resolved = ctx.colors[key];
  if (resolved) return resolved;
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

/** A cartesian data point: a bare number, or an object when the row carries its own `fill`. */
type CartesianPoint = number | null | { value: number | null; itemStyle: { color: string } };

function seriesValues(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): Map<string, CartesianPoint[]> {
  const keys = definitions.map(definition => definition.dataKey);
  const values = new Map<string, CartesianPoint[]>(keys.map(key => [key, []]));

  for (const row of ctx.data) {
    const source = ctx.stackOffset === 'expand' ? expandRow(row, keys) : row;
    // shadcn drives per-point colors from a `fill` field on the row; honour it here too.
    const fill = typeof row['fill'] === 'string' ? ctx.resolveColor(row['fill'] as string) : undefined;

    for (const key of keys) {
      const value = toNumber(source[key]);
      values.get(key)?.push(fill ? { value, itemStyle: { color: fill } } : value);
    }
  }

  return values;
}

function stackIdOf(ctx: ZardChartBuildContext, definition: ZardChartSeries): string | undefined {
  if (definition.stack) return definition.stack;
  return ctx.stacked ? IMPLICIT_STACK_ID : undefined;
}

/** Only the outermost bar of a stack is rounded, exactly like Recharts. */
function barRadius(
  ctx: ZardChartBuildContext,
  definition: ZardChartSeries,
  isStackTop: boolean,
): number | number[] | undefined {
  const declared = definition.radius ?? DEFAULT_BAR_RADIUS;
  if (Array.isArray(declared)) return declared;
  if (!isStackTop) return 0;
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
  if (!show) return { show: false };

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
    splitLine: { show: false, lineStyle: { color: ctx.chrome.border } },
    axisLabel: {
      show: ctx.horizontal ? ctx.yAxis : ctx.xAxis,
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
    splitLine: { show: false, lineStyle: { color: ctx.chrome.border } },
    axisLabel: {
      show: ctx.horizontal ? ctx.xAxis : ctx.yAxis,
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

  if (ctx.horizontal) yAxis['inverse'] = true;

  return { xAxis, yAxis };
}

function buildCartesianSeries(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord[] {
  const values = seriesValues(ctx, definitions);
  const lastOfStack = new Map<string, number>();

  definitions.forEach((definition, index) => {
    const stack = stackIdOf(ctx, definition);
    if (stack) lastOfStack.set(stack, index);
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
      label: seriesLabelOption(ctx, definition),
      animation: ctx.animation,
      ...(stack ? { stack } : {}),
      ...(definition.yAxisIndex === undefined ? {} : { yAxisIndex: definition.yAxisIndex }),
    };

    if (!isBar) {
      series['lineStyle'] = { color, width: 2 };
      series['smooth'] = definition.smooth ?? false;
      series['showSymbol'] = definition.showSymbol ?? false;
      series['symbol'] = 'circle';
      series['symbolSize'] = definition.symbolSize ?? DEFAULT_SYMBOL_SIZE;
      series['emphasis'] = { focus: 'none' };
      if (definition.step) series['step'] = definition.step;
      if (isArea) series['areaStyle'] = areaFill(ctx, color, definition);
    }

    return series;
  });
}

function buildRadar(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord {
  const lines = gridVisibility(ctx.grid);
  const gridVisible = lines.horizontal || lines.vertical;
  const indicators = ctx.data.map(row => ({ name: categoryOf(ctx, row) }));

  const data = definitions.map((definition, index) => {
    const color = colorFor(ctx, definition.dataKey, index, definition.color);
    const opacity = definition.fillOpacity ?? DEFAULT_RADAR_OPACITY;

    return {
      name: labelFor(ctx.config, definition.dataKey),
      value: ctx.data.map(row => toNumber(row[definition.dataKey])),
      itemStyle: { color },
      lineStyle: { color, width: 2 },
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
      axisLine: { show: gridVisible, lineStyle: { color: ctx.chrome.border } },
      splitLine: { show: gridVisible, lineStyle: { color: ctx.chrome.border } },
      splitArea: { show: false },
      ...(ctx.outerRadius === undefined ? {} : { radius: ctx.outerRadius }),
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
      name,
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
        avoidLabelOverlap: true,
        animation: ctx.animation,
        itemStyle: { borderColor: ctx.chrome.background, borderWidth: 2 },
        label: {
          show: ctx.label,
          color: ctx.chrome.foreground,
          fontSize: 12,
        },
        labelLine: { show: ctx.label, lineStyle: { color: ctx.chrome.border } },
        data,
        ...(ctx.startAngle === undefined ? {} : { startAngle: ctx.startAngle }),
        ...(ctx.endAngle === undefined ? {} : { endAngle: ctx.endAngle }),
      },
    ],
  };
}

function buildRadialBar(ctx: ZardChartBuildContext, definitions: ZardChartSeries[]): OptionRecord {
  const [definition] = definitions;
  const stacked = definitions.length > 1;
  const names = stacked
    ? definitions.map(item => labelFor(ctx.config, item.dataKey))
    : ctx.data.map(row => categoryOf(ctx, row));

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
      showBackground: true,
      backgroundStyle: { color: track },
      animation: ctx.animation,
      data,
    });
  }

  return {
    polar: {
      radius: [ctx.innerRadius ?? '30%', ctx.outerRadius ?? '90%'],
      center: ['50%', '50%'],
    },
    angleAxis: {
      type: 'value',
      min: 0,
      max: stacked ? rowValues.reduce((sum, value) => sum + value, 0) || 1 : max,
      show: false,
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
  if (!ctx.centerValue && !ctx.centerLabel) return [];

  const children: OptionRecord[] = [];
  const hasBoth = !!ctx.centerValue && !!ctx.centerLabel;

  if (ctx.centerValue) {
    children.push({
      type: 'text',
      x: 0,
      y: hasBoth ? -12 : 0,
      style: {
        text: ctx.centerValue,
        fill: ctx.chrome.foreground,
        fontSize: 28,
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
      y: hasBoth ? 14 : 0,
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
  if (!ctx.tooltip) return undefined;

  const colors: Record<string, string> = {};
  for (const entry of legendEntries) {
    colors[entry.name] = entry.color;
  }

  const context: ZardChartTooltipContext = { ...ctx.tooltip, config: ctx.config, colors };

  return {
    trigger: ctx.tooltip.trigger,
    axisPointer: { type: 'line', lineStyle: { color: ctx.chrome.border, width: 1 } },
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
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
        name,
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
  if (override === undefined) return base;

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
    aria: { enabled: ctx.accessibility },
    color: legendEntries.map(entry => entry.color),
    textStyle: { fontFamily: 'inherit' },
  };

  if (isCartesian) {
    const categories = ctx.data.map(row => String(row[ctx.xAxisKey ?? ''] ?? ''));
    Object.assign(option, buildAxes(ctx, definitions, categories));
    option['grid'] = {
      left: 0,
      right: 0,
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
  if (tooltip) option['tooltip'] = tooltip;

  // The legend stays hidden — `z-chart-legend` renders the shadcn markup — but it must be
  // declared so `dispatchAction({ type: 'legendToggleSelect' })` has something to act on.
  if (ctx.hasLegend) {
    option['legend'] = { show: false, data: legendEntries.map(entry => entry.name) };
  }

  const centerText = buildCenterText(ctx);
  if (centerText.length > 0) {
    option['graphic'] = [{ type: 'group', left: 'center', top: 'center', children: centerText }];
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

  if (ctx.brush) {
    option['brush'] = { toolbox: ['rect', 'polygon', 'clear'], xAxisIndex: 0 };
  }

  if (ctx.toolbox) {
    option['toolbox'] = {
      right: 0,
      top: 0,
      iconStyle: { borderColor: ctx.chrome.mutedForeground },
      feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} },
    };
  }

  return option as EChartsOption;
}
```

```angular-ts
import type { EChartsOption } from 'echarts';

/** The slice of an ECharts instance the server renderer uses. */
interface ZardEchartsSsrInstance {
  setOption(option: EChartsOption): void;
  renderToSVGString(): string;
  dispose(): void;
}

/** The slice of `echarts/core` the server renderer uses. */
export interface ZardEchartsSsrApi {
  init(
    dom: null,
    theme: null,
    opts: { renderer: 'svg'; ssr: true; width: number; height: number },
  ): ZardEchartsSsrInstance;
}

/**
 * Lets the server-rendered SVG scale with its container. ECharts stamps the fixed pixel
 * size it was initialised with, so it is swapped for a `viewBox`.
 */
function makeResponsive(svg: string, width: number, height: number): string {
  return svg.replace(/^<svg([^>]*)>/, (_match, attributes: string) => {
    const cleaned = attributes.replace(/\s(?:width|height)="[^"]*"/g, '');
    return `<svg${cleaned} width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">`;
  });
}

/**
 * Renders the chart to an SVG string on the server. The browser replaces it with the real
 * chart as soon as the ngx-echarts directive initialises, which is why the host carries
 * `ngSkipHydration`. Returns `null` when anything goes wrong, so the caller can fall back
 * to a client-only chart instead of breaking the prerender.
 */
export function renderChartToSvg(
  api: ZardEchartsSsrApi | null | undefined,
  option: EChartsOption,
  width: number,
  height: number,
): string | null {
  if (!api || typeof api.init !== 'function') return null;

  let instance: ZardEchartsSsrInstance | undefined;

  try {
    instance = api.init(null, null, { renderer: 'svg', ssr: true, width, height });
    instance.setOption(option);
    return makeResponsive(instance.renderToSVGString(), width, height);
  } catch (error) {
    console.warn('[z-chart] server-side rendering failed; the chart will render on the client only.', error);
    return null;
  } finally {
    instance?.dispose();
  }
}
```

```angular-ts
import { booleanAttribute, ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardChartTooltipIndicator, ZardChartTooltipTrigger } from './chart.types';

/**
 * Declares the tooltip the parent `z-chart` should build.
 *
 * ECharts is config-driven: there is a single `<div>` and a single option object, so this
 * component renders nothing. `z-chart` reads it through `contentChild` and turns it into
 * `tooltip.formatter`.
 */
@Component({
  selector: 'z-chart-tooltip',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'hidden' },
  exportAs: 'zChartTooltip',
})
export class ZardChartTooltipComponent {
  readonly class = input<ClassValue>('');
  readonly zIndicator = input<ZardChartTooltipIndicator>('dot');
  readonly zHideLabel = input(false, { transform: booleanAttribute });
  readonly zHideIndicator = input(false, { transform: booleanAttribute });
  readonly zLabelKey = input<string>();
  readonly zNameKey = input<string>();
  readonly zLabelFormatter = input<(value: string) => string>();
  readonly zValueFormatter = input<(value: number, name: string) => string>();
  readonly zTrigger = input<ZardChartTooltipTrigger>('axis');
  readonly zLabelClass = input<ClassValue>('');
}
```

```angular-ts
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
```

```angular-ts
import { ZardChartLegendComponent } from '@/shared/components/chart/chart-legend.component';
import { ZardChartTooltipComponent } from '@/shared/components/chart/chart-tooltip.component';
import { ZardChartComponent } from '@/shared/components/chart/chart.component';

export const ZardChartImports = [ZardChartComponent, ZardChartTooltipComponent, ZardChartLegendComponent] as const;
```

```angular-ts
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
```

```angular-ts
export * from '@/shared/components/chart/chart.component';
export * from '@/shared/components/chart/chart-legend.component';
export * from '@/shared/components/chart/chart-tooltip.component';
export * from '@/shared/components/chart/chart-tooltip.formatter';
export * from '@/shared/components/chart/chart-colors.util';
export * from '@/shared/components/chart/chart-option.builder';
export * from '@/shared/components/chart/chart-echarts.provider';
export * from '@/shared/components/chart/chart-echarts.registry';
export * from '@/shared/components/chart/chart-context';
export * from '@/shared/components/chart/chart-ssr.util';
export * from '@/shared/components/chart/chart.types';
export * from '@/shared/components/chart/chart.variants';
export * from '@/shared/components/chart/chart.imports';
```

### Register

```angular-ts
import { ApplicationConfig } from '@angular/core';
import { provideZardCharts } from '@/shared/components/chart/chart-echarts.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZardCharts(),
  ],
};
```

## Usage

```angular-ts
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
```

```angular-html
<z-chart
  [zConfig]="chartConfig"
  [zData]="chartData"
  zType="bar"
  [zSeries]="['desktop', 'mobile']"
  zXAxisKey="month"
  class="h-[250px] w-full"
>
  <z-chart-tooltip zIndicator="dot" />
  <z-chart-legend />
</z-chart>
```

## Examples

### Chart Config

The chart config holds everything about the chart that is not the data itself — labels, colors and icons — keyed by data key.

```angular-ts
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

// The config is decoupled from the data. It maps every data key to how it should be
// presented — label, color and (optionally) an icon rendered by the legend.
export const chartConfig: ZardChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
    icon: 'lucideMonitor',
  },
  mobile: {
    label: 'Mobile',
    // `theme` wins over `color` and lets each mode pick its own value.
    theme: { light: 'var(--chart-2)', dark: 'var(--chart-5)' },
  },
};
```

### Theming

Colors are declared as CSS variables and resolved to computed values before ECharts sees them, so the chart follows the theme automatically.

```css
/* Recommended: declare the palette once, as CSS variables, and let every chart pick it up.
   The chart resolves `var(--token)` to a computed value before handing it to ECharts and
   re-resolves it whenever the theme changes. */
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}

/* Hex, rgb(), hsl() and oklch() literals are accepted too — anywhere a color is expected. */
```

### Height

The container must resolve to a real height. `z-chart` defaults to `aspect-video`, and any explicit height wins over it.

```angular-html
<!-- The container must resolve to a real height. Without one, ECharts initialises at
     zero pixels and nothing is drawn. `z-chart` defaults to `aspect-video`, so this is
     only a problem when you override the aspect ratio without giving a height. -->
<z-chart class="h-[250px] w-full" ...>...</z-chart>
<z-chart class="aspect-square h-[250px]" ...>...</z-chart>
```

### Tree Shaking

ECharts is registered through `provideZardCharts()` and imported lazily, so it never reaches the initial bundle. Trim the registry to what you actually render.

```angular-ts
import { BarChart, GaugeChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  AriaComponent,
  BrushComponent,
  DatasetComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

// Drop what you do not use — every entry removed here leaves the bundle.
// Two must stay: LegendComponent (the HTML legend dispatches `legendToggleSelect`
// through it) and SVGRenderer (the server renders through renderToSVGString()).
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  PolarComponent,
  GraphicComponent,
  ToolboxComponent,
  BrushComponent,
  AriaComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  SVGRenderer,
]);

export const zardEcharts = echarts;
```

```angular-ts
import { provideEchartsCore } from 'ngx-echarts';

// The registry above is imported lazily, so roughly a megabyte of ECharts stays out of
// your application's initial bundle: it is fetched the first time a chart is created.
export const provideZardCharts = () =>
  provideEchartsCore({ echarts: () => import('./chart-echarts.registry').then(module => module.zardEcharts) });
```

### Bar Multiple

Pass more than one data key to `zSeries` to draw them side by side.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Multiple" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarMultipleComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop', 'mobile'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Bar Stacked

Use `zStacked` to stack every series on the same axis.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Stacked" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          zStacked
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarStackedComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop', 'mobile'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Bar Horizontal

Use `zHorizontal` to swap the category and value axes.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Horizontal" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          zHorizontal
          [zXAxis]="false"
          zGrid="vertical"
          zYAxis
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarHorizontalComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Bar Label

Use `zLabel` to print the value on every data point — the `LabelList` equivalent.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Label" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          zLabel
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarLabelComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Bar Interactive

Series are plain inputs, so a `signal` is all it takes to make the chart interactive.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, ZardButtonComponent],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Interactive" />
        <z-card-description zDescription="Showing total visitors for the last 30 days" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series()"
          zXAxisKey="date"
          [zXAxisFormatter]="shortDate"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="gap-2">
        @for (option of options; track option.key) {
          <button
            z-button
            type="button"
            [zType]="active() === option.key ? 'default' : 'outline'"
            zSize="sm"
            (click)="select(option.key)"
          >
            {{ option.label }} · {{ total(option.key) }}
          </button>
        }
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarInteractiveComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { date: '2024-06-01', desktop: 178, mobile: 200 },
    { date: '2024-06-02', desktop: 470, mobile: 410 },
    { date: '2024-06-03', desktop: 103, mobile: 160 },
    { date: '2024-06-04', desktop: 439, mobile: 380 },
    { date: '2024-06-05', desktop: 88, mobile: 140 },
    { date: '2024-06-06', desktop: 294, mobile: 250 },
    { date: '2024-06-07', desktop: 323, mobile: 370 },
    { date: '2024-06-08', desktop: 385, mobile: 320 },
    { date: '2024-06-09', desktop: 438, mobile: 480 },
    { date: '2024-06-10', desktop: 155, mobile: 200 },
    { date: '2024-06-11', desktop: 92, mobile: 150 },
    { date: '2024-06-12', desktop: 492, mobile: 420 },
    { date: '2024-06-13', desktop: 81, mobile: 130 },
    { date: '2024-06-14', desktop: 426, mobile: 380 },
    { date: '2024-06-15', desktop: 307, mobile: 350 },
    { date: '2024-06-16', desktop: 371, mobile: 310 },
    { date: '2024-06-17', desktop: 475, mobile: 520 },
    { date: '2024-06-18', desktop: 107, mobile: 170 },
    { date: '2024-06-19', desktop: 341, mobile: 290 },
    { date: '2024-06-20', desktop: 408, mobile: 450 },
    { date: '2024-06-21', desktop: 169, mobile: 210 },
    { date: '2024-06-22', desktop: 317, mobile: 270 },
    { date: '2024-06-23', desktop: 480, mobile: 530 },
    { date: '2024-06-24', desktop: 132, mobile: 180 },
    { date: '2024-06-25', desktop: 141, mobile: 190 },
    { date: '2024-06-26', desktop: 434, mobile: 380 },
    { date: '2024-06-27', desktop: 448, mobile: 490 },
    { date: '2024-06-28', desktop: 149, mobile: 200 },
    { date: '2024-06-29', desktop: 103, mobile: 160 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
  ];

  protected readonly options = [
    { key: 'desktop', label: 'Desktop' },
    { key: 'mobile', label: 'Mobile' },
  ];

  protected readonly active = signal('desktop');

  protected readonly series = computed(() => [this.active()]);

  protected readonly shortDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  protected total(key: string): string {
    const sum = this.chartData.reduce((acc, row) => acc + (key === 'desktop' ? row.desktop : row.mobile), 0);
    return sum.toLocaleString();
  }

  protected select(key: string): void {
    this.active.set(key);
  }
}
```

### Area Default

Use `zType="area"` and set `smooth` on the series for shadcn's natural curve.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Area Chart" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="area"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartAreaDefaultComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', smooth: true }];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Area Stacked

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Area Chart - Stacked" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="area"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          zStacked
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dot" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartAreaStackedComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [
    { dataKey: 'mobile', smooth: true },
    { dataKey: 'desktop', smooth: true },
  ];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Area Gradient

Use `zGradient` to fill the band with a vertical gradient instead of a flat tint.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Area Chart - Gradient" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="area"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          zStacked
          zGradient
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dot" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartAreaGradientComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [
    { dataKey: 'mobile', smooth: true },
    { dataKey: 'desktop', smooth: true },
  ];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Line Default

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Line Chart" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartLineDefaultComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', smooth: true }];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Line Dots

Set `showSymbol` on the series to draw a dot on every data point.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Line Chart - Dots" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartLineDotsComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', smooth: true, showSymbol: true }];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Line Step

Set `step` to `'start'`, `'middle'` or `'end'` for a stepped line.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Line Chart - Step" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartLineStepComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', step: 'middle' }];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Pie Label

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Label" />
        <z-card-description zDescription="Visitors by browser over the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zLabel
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartPieLabelComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'other', visitors: 90 },
  ];

  protected readonly series = ['visitors'];
}
```

### Pie Donut Text

Use `zInnerRadius` for the donut and `zCenterValue` / `zCenterLabel` for the text in the middle.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Donut with Text" />
        <z-card-description zDescription="Visitors by browser over the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="60%"
          zCenterValue="925"
          zCenterLabel="Visitors"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartPieDonutTextComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'other', visitors: 90 },
  ];

  protected readonly series = ['visitors'];
}
```

### Radar Default

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Radar Chart" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="radar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="month"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartRadarDefaultComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop'];
}
```

### Radial Simple

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Radial Chart" />
        <z-card-description zDescription="Visitors by browser over the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="radial"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="30%"
          zOuterRadius="95%"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartRadialSimpleComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'other', visitors: 90 },
  ];

  protected readonly series = ['visitors'];
}
```

### Tooltip Indicators

The tooltip ships the same three indicator shapes as shadcn/ui: `dot`, `line` and `dashed`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartTooltipIndicator } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Tooltip Indicators" />
        <z-card-description zDescription="The three indicator shapes, side by side" />
      </z-card-header>
      <z-card-content>
        <div class="grid gap-6 md:grid-cols-3">
          @for (indicator of indicators; track indicator) {
            <z-chart
              zType="bar"
              [zConfig]="chartConfig"
              [zData]="chartData"
              [zSeries]="series"
              zXAxisKey="month"
              [zXAxisFormatter]="shortMonth"
              class="h-[180px] w-full"
            >
              <z-chart-tooltip [zIndicator]="indicator" />
            </z-chart>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartTooltipIndicatorsComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop', 'mobile'];

  protected readonly indicators: ZardChartTooltipIndicator[] = ['dot', 'line', 'dashed'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
```

### Echarts Extras

ECharts features Recharts has no counterpart for are opt-in, so the default chart stays visually identical to shadcn/ui.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="ECharts Extras - Data Zoom" />
        <z-card-description zDescription="Opt-in ECharts features Recharts has no counterpart for" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="date"
          [zXAxisFormatter]="shortDate"
          zDataZoom
          zToolbox
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dot" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartEchartsDatazoomComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { date: '2024-06-01', desktop: 178, mobile: 200 },
    { date: '2024-06-02', desktop: 470, mobile: 410 },
    { date: '2024-06-03', desktop: 103, mobile: 160 },
    { date: '2024-06-04', desktop: 439, mobile: 380 },
    { date: '2024-06-05', desktop: 88, mobile: 140 },
    { date: '2024-06-06', desktop: 294, mobile: 250 },
    { date: '2024-06-07', desktop: 323, mobile: 370 },
    { date: '2024-06-08', desktop: 385, mobile: 320 },
    { date: '2024-06-09', desktop: 438, mobile: 480 },
    { date: '2024-06-10', desktop: 155, mobile: 200 },
    { date: '2024-06-11', desktop: 92, mobile: 150 },
    { date: '2024-06-12', desktop: 492, mobile: 420 },
    { date: '2024-06-13', desktop: 81, mobile: 130 },
    { date: '2024-06-14', desktop: 426, mobile: 380 },
    { date: '2024-06-15', desktop: 307, mobile: 350 },
    { date: '2024-06-16', desktop: 371, mobile: 310 },
    { date: '2024-06-17', desktop: 475, mobile: 520 },
    { date: '2024-06-18', desktop: 107, mobile: 170 },
    { date: '2024-06-19', desktop: 341, mobile: 290 },
    { date: '2024-06-20', desktop: 408, mobile: 450 },
    { date: '2024-06-21', desktop: 169, mobile: 210 },
    { date: '2024-06-22', desktop: 317, mobile: 270 },
    { date: '2024-06-23', desktop: 480, mobile: 530 },
    { date: '2024-06-24', desktop: 132, mobile: 180 },
    { date: '2024-06-25', desktop: 141, mobile: 190 },
    { date: '2024-06-26', desktop: 434, mobile: 380 },
    { date: '2024-06-27', desktop: 448, mobile: 490 },
    { date: '2024-06-28', desktop: 149, mobile: 200 },
    { date: '2024-06-29', desktop: 103, mobile: 160 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
  ];

  protected readonly series: ZardChartSeries[] = [
    { dataKey: 'desktop', smooth: true },
    { dataKey: 'mobile', smooth: true },
  ];

  protected readonly shortDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

### Escape Hatch

Anything the inputs do not cover is one `[zOption]` away — it is deep-merged over the option.

```angular-ts
import type { ZardChartOptionOverride } from '@/shared/components/chart/chart.types';

// `[zOption]` is deep-merged over the generated option and always wins, so any ECharts
// feature is one property away. Arrays merge index by index: the object below patches
// the first series instead of replacing the whole list.
export const override: ZardChartOptionOverride = {
  series: [{ label: { position: 'insideLeft', color: '#fff', formatter: '{b}' } }],
  xAxis: { axisLabel: { rotate: 45 } },
};
```

### Limitations

Every known divergence between this component and shadcn/ui Charts, and how it was worked around.

```text
Where ECharts and Recharts disagree, the chart delivers the closest equivalent. Every
known divergence from shadcn/ui is listed here.

1. minTickGap — Recharts drops ticks whose gap falls below a pixel threshold. ECharts has
   no numeric equivalent, so the chart sets `axisLabel.hideOverlap = true`. Labels stop
   colliding, but you cannot tune the threshold.

2. Curve interpolation — Recharts distinguishes `natural`, `monotone` and `basis`.
   ECharts has a single `smooth` flag, so all three map to `smooth: true`. Pass a number
   between 0 and 1 to `ZardChartSeries.smooth` for finer control.

3. stackOffset="expand" — ECharts has no stack normalisation. `zStackOffset="expand"`
   normalises the rows to 0-1 before they reach ECharts, and the value axis is clamped to
   [0, 1]; format it with `[zYAxisFormatter]`.

4. Rounded stacked bars — only the outermost bar of a stack is rounded, matching Recharts.
   On negative bars ECharts still rounds the top corners rather than the outward end.

5. Radial charts — Recharts' RadialBarChart has no single ECharts counterpart. Two paths
   are exposed through `zRadialVariant`: `'bar'` (polar bars, best for simple, label,
   grid and stacked layouts) and `'gauge'` (best for shape and centred-text layouts).

6. Native legend — the ECharts legend cannot reproduce the shadcn markup, so the option
   keeps `legend: { show: false }` and `z-chart-legend` renders real HTML instead. The
   legend component must stay registered for series toggling to work.

7. Donut centre text — shadcn nests a `<Label content={…} />` inside `<Pie>`. ECharts has
   no such slot, so `zCenterValue` and `zCenterLabel` draw `graphic` text nodes instead.
   They are plain text: rich inline markup is not supported.

8. Tooltip cursor — shadcn passes `cursor={false}` on most charts. ECharts always draws an
   `axisPointer` for axis-triggered tooltips; it is styled with the `--border` token to
   stay unobtrusive. Set `[zOption]="{ tooltip: { axisPointer: { type: 'none' } } }"` to
   remove it.

9. Radar radius axis — Recharts draws `<PolarRadiusAxis>` on a single spoke. ECharts has no
   per-spoke option and repeats the scale on every axis, so a low `splitNumber` is needed to
   keep it readable.

10. `[zOption]` colors — the escape hatch is swept for `var(--token)` references and they are
    resolved before ECharts sees them, exactly like the colors the component generates itself.
    ECharts cannot parse `var()` and would silently paint black otherwise.

11. Server-side rendering — the server paints a static SVG through `renderToSVGString()`
   and the host carries `ngSkipHydration`, so the browser replaces it with the live chart.
   Colors cannot be read from the DOM on the server, so the SVG uses the light palette
   and the browser corrects it on hydration. Set `[zSsrWidth]` and `[zSsrHeight]` to match
   your layout; the SVG scales through a `viewBox`.
```

## API Reference

### z-chart

A chart container built on Apache ECharts through ngx-echarts.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zConfig]` | Labels, colors and icons per data key | `ZardChartConfig` | `{}` |
| `[zData]` | The rows to plot | `Record<string, unknown>[]` | `[]` |
| `[zType]` | Default type of every series | `'area' \| 'bar' \| 'line' \| 'pie' \| 'radar' \| 'radial'` | `'bar'` |
| `[zSeries]` | Series to render, either as data keys or fully described | `string[] \| ZardChartSeries[]` | `[]` |
| `[zXAxisKey]` | Key used for the category axis | `string` | `-` |
| `[zNameKey]` | Key naming each slice or segment on pie, radar and radial charts. Falls back to zXAxisKey | `string` | `-` |
| `[zStacked]` | Stacks every series together | `boolean` | `false` |
| `[zStackOffset]` | 'expand' normalises the stack to 0-1, the Recharts stackOffset equivalent | `'none' \| 'expand'` | `'none'` |
| `[zHorizontal]` | Swaps the category and value axes | `boolean` | `false` |
| `[zGrid]` | Grid lines to draw, by direction. Equivalent to CartesianGrid | `boolean \| 'horizontal' \| 'vertical'` | `'horizontal'` |
| `[zXAxis]` | Shows the category axis labels | `boolean` | `true` |
| `[zYAxis]` | Shows the value axis labels | `boolean` | `false` |
| `[zXAxisFormatter]` | Formats every category tick. Equivalent to tickFormatter | `(value: string) => string` | `-` |
| `[zYAxisFormatter]` | Formats every value tick | `(value: number) => string` | `-` |
| `[zInnerRadius]` | Inner radius of pie, donut and radial charts | `string \| number` | `-` |
| `[zOuterRadius]` | Outer radius of pie, donut, radar and radial charts | `string \| number` | `-` |
| `[zRadialVariant]` | How a radial chart is drawn: polar bars or a gauge | `'bar' \| 'gauge'` | `'bar'` |
| `[zRadarShape]` | Shape of the radar grid. Equivalent to PolarGrid gridType | `'polygon' \| 'circle'` | `'polygon'` |
| `[zStartAngle]` | Start angle of pie and radial charts | `number` | `-` |
| `[zEndAngle]` | End angle of pie and radial charts | `number` | `-` |
| `[zPadAngle]` | Gap between pie slices, in degrees | `number` | `0` |
| `[zGradient]` | Fills area series with a vertical gradient instead of a flat tint | `boolean` | `false` |
| `[zLabel]` | Prints the value on every data point. Equivalent to LabelList | `boolean` | `false` |
| `[zCenterValue]` | Big text in the middle of a donut or radial chart | `string` | `-` |
| `[zCenterLabel]` | Caption under zCenterValue | `string` | `-` |
| `[zAccessibility]` | Enables ECharts' aria description plus role and aria-label on the canvas | `boolean` | `true` |
| `[zAnimation]` | Animates the chart on data changes | `boolean` | `true` |
| `[zDataZoom]` | ECharts extra, opt-in: adds inside and slider zooming | `boolean` | `false` |
| `[zBrush]` | ECharts extra, opt-in: adds the brush selection toolbox | `boolean` | `false` |
| `[zToolbox]` | ECharts extra, opt-in: adds the zoom, restore and export toolbox | `boolean` | `false` |
| `[zRenderer]` | ECharts renderer | `'canvas' \| 'svg'` | `'canvas'` |
| `[zSsrWidth]` | Width, in pixels, of the SVG rendered on the server | `number` | `600` |
| `[zSsrHeight]` | Height, in pixels, of the SVG rendered on the server | `number` | `300` |
| `[zOption]` | Escape hatch deep-merged over the generated option, always winning | `EChartsOption` | `{}` |
| `(zChartInit)` | Emits the ECharts instance once created | `EChartsType` | `-` |
| `(zChartClick)` | Emitted when a data item is clicked | `ECElementEvent` | `-` |
| `(zLegendSelectChanged)` | Emitted when ECharts' legend selection changes | `unknown` | `-` |
| `(zDataZoomChange)` | Emitted while the data zoom moves | `unknown` | `-` |

### z-chart-tooltip

Declares the tooltip the parent chart should build. Renders no DOM of its own.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes on the tooltip container | `ClassValue` | `''` |
| `[zIndicator]` | Shape of the color indicator on each row | `'dot' \| 'line' \| 'dashed'` | `'dot'` |
| `[zHideLabel]` | Hides the tooltip heading | `boolean` | `false` |
| `[zHideIndicator]` | Hides the color indicator | `boolean` | `false` |
| `[zLabelKey]` | Config key used for the heading | `string` | `-` |
| `[zNameKey]` | Config key used for each row name | `string` | `-` |
| `[zLabelFormatter]` | Formats the heading | `(value: string) => string` | `-` |
| `[zValueFormatter]` | Formats every value | `(value: number, name: string) => string` | `-` |
| `[zTrigger]` | 'axis' groups every series of a category, 'item' shows the hovered item only | `'axis' \| 'item'` | `'axis'` |
| `[zLabelClass]` | Additional CSS classes on the heading | `ClassValue` | `''` |

### z-chart-legend

Renders the shadcn legend markup below (or above) the chart and toggles series on click.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zNameKey]` | Config key used for each entry name | `string` | `-` |
| `[zVerticalAlign]` | Places the legend above or below the chart | `'top' \| 'bottom'` | `'bottom'` |

---

[Open in browser](https://zardui.com/docs/components/chart)
