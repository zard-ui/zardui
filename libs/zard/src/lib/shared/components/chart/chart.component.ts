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
