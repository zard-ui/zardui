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
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  PendingTasks,
  PLATFORM_ID,
  signal,
  untracked,
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

/**
 * `numberAttribute` answers `NaN` for anything it cannot read — `undefined`, `null`, or a
 * valueless attribute — and ECharts draws nothing at all once a `NaN` reaches an angle. An
 * unreadable value means "not set", which is what the builder already has a default for.
 */
function optionalNumberAttribute(value: unknown): number | undefined {
  const parsed = numberAttribute(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Same guard, for the inputs that must always end up with a number. */
function numberAttributeOr(fallback: number): (value: unknown) => number {
  return value => numberAttribute(value, fallback);
}

/** The canvas is measured on every resize; only a real change should redraw the chart. */
function sameSize(a: { width: number; height: number }, b: { width: number; height: number }): boolean {
  return a.width === b.width && a.height === b.height;
}

@Component({
  selector: 'z-chart',
  imports: [NgxEchartsDirective],
  template: `
    @if (ssrSvg(); as svg) {
      <div [class]="canvasClasses()" [attr.role]="hostRole()" [attr.aria-label]="ariaLabel()" [innerHTML]="svg"></div>
    } @else if (onScreen()) {
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
    'data-slot': 'chart',
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly pendingTasks = inject(PendingTasks);

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
  readonly zTrack = input(true, { transform: booleanAttribute });
  /** Radial only: writes each category's name along its own ring, like Recharts' `<LabelList>`. */
  readonly zRadialLabel = input(false, { transform: booleanAttribute });
  /**
   * Waits for the chart to scroll into view before drawing it, so its entry animation plays
   * where someone can see it. Turn off to draw as soon as the component is created.
   */
  readonly zLazyRender = input(true, { transform: booleanAttribute });
  readonly zRadarShape = input<ZardChartRadarShape>('polygon');
  readonly zRadarRadialLines = input(true, { transform: booleanAttribute });
  readonly zStartAngle = input<number | undefined>(undefined, { transform: optionalNumberAttribute });
  readonly zEndAngle = input<number | undefined>(undefined, { transform: optionalNumberAttribute });
  readonly zPadAngle = input(0, { transform: numberAttributeOr(0) });
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
  readonly zSsrWidth = input(600, { transform: numberAttributeOr(600) });
  readonly zSsrHeight = input(300, { transform: numberAttributeOr(300) });
  readonly zOption = input<ZardChartOptionOverride>({});

  readonly zChartInit = output<EChartsType>();
  readonly zChartClick = output<ECElementEvent>();
  readonly zLegendSelectChanged = output<unknown>();
  readonly zDataZoomChange = output<unknown>();

  private readonly tooltipRef = contentChild(ZardChartTooltipComponent);
  private readonly legendRef = contentChild(ZardChartLegendComponent);

  private readonly chartInstance = signal<EChartsType | null>(null);
  /** Bars growing out of the axis is movement; someone who asked for less of it gets none. */
  private readonly reducedMotion = signal(false);
  /**
   * The drawing surface, watched so anything positioned in pixels follows a resize. Compared by
   * value: a new object on every observer callback would rebuild the option, and ngx-echarts
   * re-applies it with `notMerge`, which replays the entry animation and clears the legend
   * selection the HTML legend is holding.
   */
  private readonly canvasSize = signal({ width: 0, height: 0 }, { equal: sameSize });
  private readonly coarsePointer = signal(false);
  /** Flips once, the first time the chart is scrolled into view. */
  private readonly seen = signal(false);
  /** Bumped one frame after a theme switch, once the `.dark` class is on the document. */
  private readonly colorRevision = signal(0);

  readonly hiddenSeries = signal<ReadonlySet<string>>(new Set<string>());

  constructor() {
    this.watchMotionPreference();
    this.watchPointerType();
    this.watchCanvasSize();
    this.watchVisibility();
    this.renderOnServer();
    this.restoreHiddenSeries();

    if (this.isBrowser) {
      effect(() => {
        this.darkMode.themeMode();
        // The `.dark` class lands on <html> in a separate effect, so the computed colors are
        // only trustworthy on the next frame.
        this.scheduleColorRefresh();
      });
    }
  }

  /** The chart inherits the page's typeface, so the arc labels have to measure with it too. */
  private hostFontFamily(): string {
    if (!this.isBrowser || typeof globalThis.getComputedStyle !== 'function') {
      return 'sans-serif';
    }

    try {
      return globalThis.getComputedStyle(this.elementRef.nativeElement as HTMLElement).fontFamily || 'sans-serif';
    } catch {
      return 'sans-serif';
    }
  }

  private watchCanvasSize(): void {
    if (!this.isBrowser || typeof globalThis.ResizeObserver !== 'function') {
      return;
    }

    const host = this.elementRef.nativeElement as HTMLElement;
    const observer = new globalThis.ResizeObserver(() =>
      this.canvasSize.set({ width: host.clientWidth, height: host.clientHeight }),
    );
    observer.observe(host);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  // The live chart is a browser affair: on the server the SVG below is all there is, and
  // instantiating the ngx-echarts directive there would ask for a ResizeObserver that is absent.
  protected readonly onScreen = computed(() => this.isBrowser && (this.seen() || !this.zLazyRender()));

  private watchVisibility(): void {
    const host = this.elementRef.nativeElement as HTMLElement;

    if (!this.isBrowser || typeof globalThis.IntersectionObserver !== 'function') {
      this.seen.set(true);
      return;
    }

    const observer = new globalThis.IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) {
          return;
        }
        this.seen.set(true);
        observer.disconnect();
      },
      // A sliver on screen is enough: the chart should be drawing as it comes up, not after.
      { threshold: 0.1 },
    );

    observer.observe(host);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private watchPointerType(): void {
    this.watchMedia('(pointer: coarse)', matches => this.coarsePointer.set(matches));
  }

  private watchMotionPreference(): void {
    this.watchMedia('(prefers-reduced-motion: reduce)', matches => this.reducedMotion.set(matches));
  }

  private watchMedia(query: string, apply: (matches: boolean) => void): void {
    if (!this.isBrowser || typeof globalThis.matchMedia !== 'function') {
      return;
    }

    const media = globalThis.matchMedia(query);
    apply(media.matches);

    const listener = (event: MediaQueryListEvent) => apply(event.matches);
    media.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => media.removeEventListener('change', listener));
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
    if (!tooltip) {
      return null;
    }

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
      cursor: tooltip.zCursor(),
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
      track: this.zTrack(),
      radialLabel: this.zRadialLabel(),
      size: this.canvasSize(),
      fontFamily: this.hostFontFamily(),
      coarsePointer: this.coarsePointer(),
      radarShape: this.zRadarShape(),
      radarRadialLines: this.zRadarRadialLines(),
      startAngle: this.zStartAngle(),
      endAngle: this.zEndAngle(),
      padAngle: this.zPadAngle(),
      gradient: this.zGradient(),
      label: this.zLabel(),
      centerValue: this.zCenterValue(),
      centerLabel: this.zCenterLabel(),
      accessibility: this.zAccessibility(),
      animation: this.zAnimation() && !this.reducedMotion(),
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

  /** The static picture the server paints. Always null in the browser. */
  protected readonly ssrSvg = signal<SafeHtml | null>(null);

  /**
   * Paints the server-side SVG.
   *
   * The engine is imported here, and only here, so that the browser bundle never carries it on
   * the component's account — `provideZardCharts()` is what loads it on the client, lazily.
   * Angular waits on the pending task before serialising the page.
   */
  private renderOnServer(): void {
    if (this.isBrowser) {
      return;
    }

    this.pendingTasks.run(async () => {
      const { zardEcharts } = await import('./chart-echarts.registry');
      const api = zardEcharts as unknown as ZardEchartsSsrApi;
      const svg = renderChartToSvg(api, this.option(), this.zSsrWidth(), this.zSsrHeight());
      this.ssrSvg.set(svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null);
    });
  }

  protected readonly hostRole = computed(() => (this.zAccessibility() ? 'img' : null));

  protected readonly ariaLabel = computed(() => {
    if (!this.zAccessibility()) {
      return null;
    }

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
    this.showDefaultTooltip(instance);
    this.zChartInit.emit(instance);
  }

  /**
   * Puts the toggled-off series back after a fresh option is applied.
   *
   * `ngx-echarts` hands every `[options]` change to `setOption(option, true)`, and a `notMerge`
   * update drops the legend selection — a theme switch would bring a hidden series back on screen
   * while its legend entry still reads `aria-pressed="false"`. This runs after the DOM is written,
   * so the directive has already applied the option, and it only tracks `option()`: the toggle
   * itself is dispatched by `toggleSeries`, and re-running here would be a second, wasted redraw.
   */
  private restoreHiddenSeries(): void {
    afterRenderEffect(() => {
      this.option();

      const instance = untracked(() => this.chartInstance());
      const hidden = untracked(() => this.hiddenSeries());
      if (!instance || hidden.size === 0) {
        return;
      }

      for (const name of hidden) {
        instance.dispatchAction({ type: 'legendUnSelect', name });
      }
    });
  }

  /** `z-chart-tooltip[zDefaultIndex]` opens the tooltip on that point without a pointer. */
  private showDefaultTooltip(instance: EChartsType): void {
    const dataIndex = this.tooltipRef()?.zDefaultIndex();
    if (dataIndex === undefined || Number.isNaN(dataIndex)) {
      return;
    }

    // Cleared on destroy: the chart can be torn down in the same tick it was created — a route
    // change, a category switch — and ECharts throws when an action reaches a disposed instance.
    const timer = setTimeout(() => instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex }));
    this.destroyRef.onDestroy(() => clearTimeout(timer));
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

export const chartLegendSwatchVariants = cva('size-2 shrink-0 rounded-[2px]');
```

```angular-ts
/**
 * Labels that ride a radial bar's ring.
 *
 * Recharts draws these with an SVG `<textPath>` on a circular arc, so every glyph sits on the
 * ring and leans with it. Canvas has no such thing, and ECharts' own polar label turns the whole
 * word to face the centre — a straight line of text across a curve, whose ends fall inside the
 * band. Placing one glyph at a time along the arc is the canvas equivalent.
 */

/** Where the text starts, past the beginning of the bar. Recharts' `<LabelList offset>`. */
const START_OFFSET_DEGREES = 5;

export interface ZardArcLabelGeometry {
  /** Centre of the polar system, in canvas pixels. */
  cx: number;
  cy: number;
  /** Radius of each ring, outermost last, matching the order of `texts`. */
  radii: readonly number[];
  /** Where the bars begin, in ECharts degrees: 0 is three o'clock, positive counter-clockwise. */
  startAngle: number;
  /** Whether the bars sweep towards a larger angle. */
  ascending: boolean;
  font: string;
  fontSize: number;
  fill: string;
}

type TextElement = Record<string, unknown>;

let ruler: CanvasRenderingContext2D | null | undefined;

function measureContext(): CanvasRenderingContext2D | null {
  if (ruler !== undefined) {
    return ruler;
  }

  try {
    ruler = globalThis.document?.createElement('canvas').getContext('2d') ?? null;
  } catch {
    ruler = null;
  }

  return ruler;
}

/** Lays one label along one ring, a glyph at a time. */
function glyphsOf(text: string, radius: number, geometry: ZardArcLabelGeometry): TextElement[] {
  const context = measureContext();
  if (!context || radius <= 0) {
    return [];
  }

  context.font = geometry.font;
  const sign = geometry.ascending ? 1 : -1;
  const characters = [...text];

  let travelled = (START_OFFSET_DEGREES * Math.PI * radius) / 180;

  return characters.map(character => {
    const { width } = context.measureText(character);
    const angle = geometry.startAngle + ((sign * (travelled + width / 2)) / radius) * (180 / Math.PI);
    const radians = (angle * Math.PI) / 180;
    travelled += width;

    // The tangent, pointing the way the text reads.
    const tangentX = -Math.sin(radians) * sign;
    const tangentY = -Math.cos(radians) * sign;

    return {
      type: 'text',
      x: geometry.cx + Math.cos(radians) * radius,
      y: geometry.cy - Math.sin(radians) * radius,
      rotation: -Math.atan2(tangentY, tangentX),
      z: 100,
      silent: true,
      style: {
        text: character,
        fill: geometry.fill,
        font: geometry.font,
        align: 'center',
        verticalAlign: 'middle',
      },
    };
  });
}

/** Every glyph of every label, ready to hand to ECharts as `graphic` elements. */
export function buildArcLabels(texts: readonly string[], geometry: ZardArcLabelGeometry): TextElement[] {
  return texts.flatMap((text, index) => glyphsOf(text, geometry.radii[index] ?? 0, geometry));
}

/** ECharts sizes a polar radius against half the shorter side; percentages resolve the same way. */
export function resolveRadius(value: string | number | undefined, base: number, fallback: number): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    const percent = Number.parseFloat(value);
    return Number.isFinite(percent) ? (percent / 100) * base : fallback;
  }
  return fallback;
}
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
  '--chart-1': '#8ec5ff',
  '--chart-2': '#2b7fff',
  '--chart-3': '#155dfc',
  '--chart-4': '#1447e6',
  '--chart-5': '#193cb8',
  '--foreground': '#0a0a0a',
  '--muted-foreground': '#737373',
};

let normalizer: CanvasRenderingContext2D | null | undefined;
const normalizedColors = new Map<string, string>();

function normalizerContext(): CanvasRenderingContext2D | null {
  if (normalizer !== undefined) {
    return normalizer;
  }

  try {
    const canvas = globalThis.document?.createElement('canvas');
    if (canvas) {
      canvas.width = canvas.height = 1;
    }
    normalizer = canvas?.getContext('2d', { willReadFrequently: true }) ?? null;
  } catch {
    normalizer = null;
  }

  return normalizer;
}

/**
 * Rewrites a CSS colour into sRGB.
 *
 * ECharts parses colours itself to derive the hover and blur shades of a series, and its parser
 * predates `oklch()` — which is what every shadcn theme token is written in. It paints the
 * untouched chart fine, because the browser resolves the string, but the moment a tooltip
 * highlights a point every unparsed colour comes back transparent and the series vanishes.
 * Painting one pixel and reading it back converts anything the browser understands.
 */
export function toCanvasColor(value: string): string {
  const raw = (value ?? '').trim();
  if (!raw || raw.startsWith('#') || raw.startsWith('rgb')) {
    return raw;
  }

  const cached = normalizedColors.get(raw);
  if (cached !== undefined) {
    return cached;
  }

  const context = normalizerContext();
  if (!context) {
    return raw;
  }

  context.clearRect(0, 0, 1, 1);
  // An unparseable colour leaves `fillStyle` on the transparent sentinel, painting nothing.
  context.fillStyle = 'rgba(0, 0, 0, 0)';
  context.fillStyle = raw;
  context.fillRect(0, 0, 1, 1);

  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  const resolved =
    alpha === 0
      ? raw
      : alpha === 255
        ? `rgb(${red}, ${green}, ${blue})`
        : `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;

  normalizedColors.set(raw, resolved);
  return resolved;
}

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

function readCssColor(host: HTMLElement | null | undefined, value: string, depth: number): string {
  const raw = (value ?? '').trim();
  if (!raw || depth >= MAX_VAR_DEPTH) {
    return raw;
  }

  const match = VAR_PATTERN.exec(raw);
  if (!match) {
    return raw;
  }

  const [, token, fallback] = match;
  const computed = readCssVariable(host, token);
  if (computed) {
    return readCssColor(host, computed, depth + 1);
  }
  if (fallback) {
    return readCssColor(host, fallback, depth + 1);
  }

  return raw;
}

/**
 * Resolves a CSS color that may be a `var(--token)` reference into a literal value
 * ECharts can consume. Falls back to the var()'s own fallback, then to the raw input.
 */
export function resolveCssColor(host: HTMLElement | null | undefined, value: string, depth = 0): string {
  return toCanvasColor(readCssColor(host, value, depth));
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
  return toCanvasColor(applyAlpha(color, alpha));
}

function applyAlpha(color: string, alpha: number): string {
  const raw = (color ?? '').trim();
  if (!raw) {
    return raw;
  }

  const clamped = Math.min(1, Math.max(0, alpha));

  const hex = HEX_PATTERN.exec(raw);
  if (hex) {
    return hexWithAlpha(hex[1], clamped);
  }

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
    if (!declared) {
      continue;
    }

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
          <ng-icon [name]="entry.icon" class="size-3" />
        } @else {
          <span [class]="swatchClasses()" [style.background-color]="entry.color"></span>
        }
        {{ entry.label }}
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'chart-legend', '[class]': 'classes()' },
  exportAs: 'zChartLegend',
})
export class ZardChartLegendComponent {
  private readonly chart = inject(ZARD_CHART, { optional: true });

  readonly class = input<ClassValue>('');
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
  if (!api || typeof api.init !== 'function') {
    return null;
  }

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
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';

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
  host: { 'data-slot': 'chart-tooltip', class: 'hidden' },
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
  /**
   * Draws the axis pointer under the tooltip — a line on curves, a band on bars.
   * Off by default, like shadcn's `<ChartTooltip cursor={false} />`.
   */
  readonly zCursor = input(false, { transform: booleanAttribute });
  /** Opens the tooltip on this data index as soon as the chart draws, like shadcn's `defaultIndex`. */
  readonly zDefaultIndex = input<number | undefined>(undefined, { transform: numberAttribute });
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
```

```angular-ts
export * from './chart.component';
export * from './chart-legend.component';
export * from './chart-tooltip.component';
export * from './chart-tooltip.formatter';
export * from './chart-colors.util';
export * from './chart-option.builder';
export * from './chart-echarts.provider';
// `chart-echarts.registry` is deliberately absent: it calls `echarts.use(...)` at module scope,
// so re-exporting it here would pull the whole engine into anything that touches this barrel.
// `provideZardCharts()` imports it on demand, and the server renderer does the same.
export * from './chart-context';
export * from './chart-ssr.util';
export * from './chart.types';
export * from './chart.variants';
export * from './chart.imports';
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
:root,
.dark {
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
}

/* Hex, rgb(), hsl() and oklch() literals are accepted too — anywhere a color is expected. */
```

### Height

The container must resolve to a real height, or ECharts initialises at zero pixels and draws nothing. `z-chart` handles that on its own with `aspect-video`; pass a height class only when you want a different shape, and note that a height without an aspect ratio needs a width too.

```angular-html
<z-chart zType="bar" [zData]="chartData" [zSeries]="series" />

<z-chart class="h-[250px] w-full" zType="bar" [zData]="chartData" />

<z-chart class="mx-auto aspect-square h-[250px]" zType="pie" [zData]="chartData" />
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Multiple" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="dashed" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Stacked" />
        <z-card-description zDescription="January - June 2024" />
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
          class="w-full"
        >
          <z-chart-tooltip zIndicator="dashed" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Horizontal" />
        <z-card-description zDescription="January - June 2024" />
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
          zGrid="vertical"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="dashed" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Label" />
        <z-card-description zDescription="January - June 2024" />
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
          class="w-full"
        >
          <z-chart-tooltip zIndicator="dashed" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full py-0">
      <z-card-header class="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div class="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <z-card-title zTitle="Bar Chart - Interactive" />
          <z-card-description zDescription="Showing total visitors for the last 3 months" />
        </div>
        <div class="flex">
          @for (option of options; track option.key) {
            <button
              type="button"
              [attr.data-active]="active() === option.key"
              [attr.aria-pressed]="active() === option.key"
              class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              (click)="select(option.key)"
            >
              <span class="text-muted-foreground text-xs">{{ option.label }}</span>
              <span class="text-lg leading-none font-bold sm:text-3xl">{{ totals()[option.key] }}</span>
            </button>
          }
        </div>
      </z-card-header>
      <z-card-content class="px-2 sm:p-6">
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series()"
          zXAxisKey="date"
          [zXAxisFormatter]="shortDate"
          class="aspect-auto h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dot" zNameKey="views" class="w-[150px]" [zLabelFormatter]="longDate" zCursor />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarInteractiveComponent {
  protected readonly chartConfig: ZardChartConfig = {
    views: { label: 'Page Views' },
    desktop: { label: 'Desktop', color: 'var(--chart-2)' },
    mobile: { label: 'Mobile', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { date: '2024-04-01', desktop: 222, mobile: 150 },
    { date: '2024-04-02', desktop: 97, mobile: 180 },
    { date: '2024-04-03', desktop: 167, mobile: 120 },
    { date: '2024-04-04', desktop: 242, mobile: 260 },
    { date: '2024-04-05', desktop: 373, mobile: 290 },
    { date: '2024-04-06', desktop: 301, mobile: 340 },
    { date: '2024-04-07', desktop: 245, mobile: 180 },
    { date: '2024-04-08', desktop: 409, mobile: 320 },
    { date: '2024-04-09', desktop: 59, mobile: 110 },
    { date: '2024-04-10', desktop: 261, mobile: 190 },
    { date: '2024-04-11', desktop: 327, mobile: 350 },
    { date: '2024-04-12', desktop: 292, mobile: 210 },
    { date: '2024-04-13', desktop: 342, mobile: 380 },
    { date: '2024-04-14', desktop: 137, mobile: 220 },
    { date: '2024-04-15', desktop: 120, mobile: 170 },
    { date: '2024-04-16', desktop: 138, mobile: 190 },
    { date: '2024-04-17', desktop: 446, mobile: 360 },
    { date: '2024-04-18', desktop: 364, mobile: 410 },
    { date: '2024-04-19', desktop: 243, mobile: 180 },
    { date: '2024-04-20', desktop: 89, mobile: 150 },
    { date: '2024-04-21', desktop: 137, mobile: 200 },
    { date: '2024-04-22', desktop: 224, mobile: 170 },
    { date: '2024-04-23', desktop: 138, mobile: 230 },
    { date: '2024-04-24', desktop: 387, mobile: 290 },
    { date: '2024-04-25', desktop: 215, mobile: 250 },
    { date: '2024-04-26', desktop: 75, mobile: 130 },
    { date: '2024-04-27', desktop: 383, mobile: 420 },
    { date: '2024-04-28', desktop: 122, mobile: 180 },
    { date: '2024-04-29', desktop: 315, mobile: 240 },
    { date: '2024-04-30', desktop: 454, mobile: 380 },
    { date: '2024-05-01', desktop: 165, mobile: 220 },
    { date: '2024-05-02', desktop: 293, mobile: 310 },
    { date: '2024-05-03', desktop: 247, mobile: 190 },
    { date: '2024-05-04', desktop: 385, mobile: 420 },
    { date: '2024-05-05', desktop: 481, mobile: 390 },
    { date: '2024-05-06', desktop: 498, mobile: 520 },
    { date: '2024-05-07', desktop: 388, mobile: 300 },
    { date: '2024-05-08', desktop: 149, mobile: 210 },
    { date: '2024-05-09', desktop: 227, mobile: 180 },
    { date: '2024-05-10', desktop: 293, mobile: 330 },
    { date: '2024-05-11', desktop: 335, mobile: 270 },
    { date: '2024-05-12', desktop: 197, mobile: 240 },
    { date: '2024-05-13', desktop: 197, mobile: 160 },
    { date: '2024-05-14', desktop: 448, mobile: 490 },
    { date: '2024-05-15', desktop: 473, mobile: 380 },
    { date: '2024-05-16', desktop: 338, mobile: 400 },
    { date: '2024-05-17', desktop: 499, mobile: 420 },
    { date: '2024-05-18', desktop: 315, mobile: 350 },
    { date: '2024-05-19', desktop: 235, mobile: 180 },
    { date: '2024-05-20', desktop: 177, mobile: 230 },
    { date: '2024-05-21', desktop: 82, mobile: 140 },
    { date: '2024-05-22', desktop: 81, mobile: 120 },
    { date: '2024-05-23', desktop: 252, mobile: 290 },
    { date: '2024-05-24', desktop: 294, mobile: 220 },
    { date: '2024-05-25', desktop: 201, mobile: 250 },
    { date: '2024-05-26', desktop: 213, mobile: 170 },
    { date: '2024-05-27', desktop: 420, mobile: 460 },
    { date: '2024-05-28', desktop: 233, mobile: 190 },
    { date: '2024-05-29', desktop: 78, mobile: 130 },
    { date: '2024-05-30', desktop: 340, mobile: 280 },
    { date: '2024-05-31', desktop: 178, mobile: 230 },
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

  protected readonly totals = computed<Record<string, string>>(() => ({
    desktop: this.sum('desktop'),
    mobile: this.sum('mobile'),
  }));

  protected readonly series = computed<ZardChartSeries[]>(() => [{ dataKey: this.active() }]);

  protected readonly shortDate = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  protected readonly longDate = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  protected select(key: string): void {
    this.active.set(key);
  }

  private sum(key: 'desktop' | 'mobile'): string {
    return this.chartData.reduce((total, row) => total + row[key], 0).toLocaleString();
  }
}
```

### Area Default

Use `zType="area"` and set `smooth` on the series for shadcn's natural curve.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
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
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">January - June 2024</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
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
          class="w-full"
        >
          <z-chart-tooltip zIndicator="dot" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">January - June 2024</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
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
          class="w-full"
        >
          <z-chart-tooltip zIndicator="dot" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">January - June 2024</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Line Chart" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Line Chart - Dots" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Line Chart - Step" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Label" />
        <z-card-description zDescription="January - June 2024" />
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
      <z-card-footer class="flex-col gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Donut with Text" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="48%"
          zCenterValue="925"
          zCenterLabel="Visitors"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
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
      <z-card-footer class="flex-col gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">January - June 2024</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Radial Chart" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="radial"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="24%"
          zOuterRadius="88%"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
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
            <div class="flex flex-col gap-2">
              <p class="text-muted-foreground text-xs">zIndicator="{{ indicator }}"</p>
              <z-chart
                zType="bar"
                [zConfig]="chartConfig"
                [zData]="chartData"
                [zSeries]="series"
                zXAxisKey="month"
                [zXAxisFormatter]="shortMonth"
                class="h-[180px] w-full"
              >
                <z-chart-tooltip [zIndicator]="indicator" [zDefaultIndex]="1" />
              </z-chart>
            </div>
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

### Opt In features

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
          class="w-full"
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
    new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

Where ECharts and Recharts disagree, the chart delivers the closest equivalent. These are the differences worth knowing about.

- **Curve interpolation** — Recharts distinguishes `natural`, `monotone` and `basis`; ECharts has a single `smooth` flag, so all three map to it. Pass a number between 0 and 1 to a series' `smooth` for finer control.
- **Stack normalisation** — ECharts has none, so `zStackOffset="expand"` normalises the rows to 0-1 before they reach it and clamps the value axis. Format the ticks with `[zYAxisFormatter]`.
- **Tick spacing** — Recharts drops ticks whose gap falls below a pixel threshold. The chart sets `axisLabel.hideOverlap` instead: labels stop colliding, but the threshold is not tunable.
- **Legend** — the ECharts legend cannot reproduce the shadcn markup, so `z-chart-legend` renders real HTML. The native legend stays registered but hidden, because it is what toggles a series.
- **Centre text and radial labels** — Recharts nests SVG inside the chart for both. Here they are drawn as `graphic` text, so `zCenterValue` and `zCenterLabel` are plain strings, and `zRadialLabel` lays a ring name out one glyph at a time.
- **Rounded stacked bars** — only the outermost bar of a stack is rounded, matching Recharts. On negative bars ECharts still rounds the top corners rather than the outward end.
- **Server-side rendering** — the server paints a static SVG and the browser swaps in the live chart on hydration. It cannot read CSS variables, so the SVG uses the light palette; set `[zSsrWidth]` and `[zSsrHeight]` to match your layout.

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
| `[zXAxis]` | Shows the category axis labels, whichever side `zHorizontal` puts them on | `boolean` | `true` |
| `[zYAxis]` | Shows the value axis labels, whichever side `zHorizontal` puts them on | `boolean` | `false` |
| `[zXAxisFormatter]` | Formats every category tick. Equivalent to tickFormatter | `(value: string) => string` | `-` |
| `[zYAxisFormatter]` | Formats every value tick | `(value: number) => string` | `-` |
| `[zInnerRadius]` | Inner radius of pie, donut and radial charts | `string \| number` | `-` |
| `[zOuterRadius]` | Outer radius of pie, donut, radar and radial charts | `string \| number` | `-` |
| `[zRadialVariant]` | How a radial chart is drawn: polar bars or a gauge | `'bar' \| 'gauge'` | `'bar'` |
| `[zTrack]` | Radial only: the muted ring drawn behind each bar. Equivalent to RadialBar background | `boolean` | `true` |
| `[zRadialLabel]` | Radial only: writes each category's name along its own ring. Equivalent to LabelList | `boolean` | `false` |
| `[zRadarRadialLines]` | Radar only: the spokes running from the centre to each indicator | `boolean` | `true` |
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
| `[zLazyRender]` | Waits for the chart to scroll into view before drawing it, so the entry animation plays where it can be seen | `boolean` | `true` |
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
| `[zCursor]` | Draws the axis pointer under the tooltip: a line on curves, a band on bars | `boolean` | `false` |
| `[zDefaultIndex]` | Opens the tooltip on this data index as soon as the chart draws | `number` | `-` |
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
| `[zVerticalAlign]` | Places the legend above or below the chart | `'top' \| 'bottom'` | `'bottom'` |

---

[Open in browser](https://zardui.com/docs/components/chart)
