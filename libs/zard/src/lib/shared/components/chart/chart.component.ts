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
