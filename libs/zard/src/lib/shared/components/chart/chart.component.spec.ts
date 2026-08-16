import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import type { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

import { EDarkModes, ZardDarkMode } from '@/shared/services/dark-mode';

import { paletteColor, resolveChartColors, resolveCssColor, withAlpha } from './chart-colors.util';
import { ZardChartLegendComponent } from './chart-legend.component';
import { buildChartOption, deepMerge, normalizeSeries, type ZardChartBuildContext } from './chart-option.builder';
import { ZardChartTooltipComponent } from './chart-tooltip.component';
import { buildTooltipHtml, type ZardChartTooltipContext } from './chart-tooltip.formatter';
import { ZardChartComponent } from './chart.component';
import type { ZardChartConfig } from './chart.types';

/** ECharts never runs for real here: happy-dom has no canvas. */
const mockChartInstance = {
  setOption: jest.fn(),
  dispatchAction: jest.fn(),
  resize: jest.fn(),
  dispose: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  getDom: jest.fn(),
  isDisposed: jest.fn().mockReturnValue(false),
  renderToSVGString: jest.fn(() => '<svg></svg>'),
};

const mockEcharts = { init: jest.fn(() => mockChartInstance) };

// Self-contained on purpose: the factory runs while `chart.component.ts` is being imported,
// before the constants above are initialised.
jest.mock('./chart-echarts.registry', () => ({
  zardEcharts: {
    init: () => ({
      setOption: () => undefined,
      renderToSVGString: () => '<svg width="600" height="300"></svg>',
      dispose: () => undefined,
    }),
  },
}));

const SHARED_PROVIDERS = [{ provide: NGX_ECHARTS_CONFIG, useValue: { echarts: mockEcharts } }];

const CHART_DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
];

const CHART_CONFIG: ZardChartConfig = {
  desktop: { label: 'Desktop', color: '#111111' },
  mobile: { label: 'Mobile', color: '#222222' },
};

class ResizeObserverStub {
  observe(): void {
    /* no-op */
  }

  unobserve(): void {
    /* no-op */
  }

  disconnect(): void {
    /* no-op */
  }
}

function context(overrides: Partial<ZardChartBuildContext> = {}): ZardChartBuildContext {
  return {
    type: 'bar',
    data: CHART_DATA,
    config: CHART_CONFIG,
    series: ['desktop', 'mobile'],
    xAxisKey: 'month',
    stacked: false,
    stackOffset: 'none',
    horizontal: false,
    grid: 'horizontal',
    xAxis: true,
    yAxis: false,
    radialVariant: 'bar',
    track: true,
    radialLabel: false,
    size: { width: 0, height: 0 },
    fontFamily: 'sans-serif',
    coarsePointer: false,
    radarShape: 'polygon',
    radarRadialLines: true,
    padAngle: 0,
    gradient: false,
    label: false,
    accessibility: true,
    animation: true,
    dataZoom: false,
    brush: false,
    toolbox: false,
    colors: { desktop: '#111111', mobile: '#222222' },
    chrome: {
      background: '#ffffff',
      border: '#e5e5e5',
      foreground: '#0a0a0a',
      mutedForeground: '#737373',
    },
    tooltip: null,
    hasLegend: false,
    resolveColor: (value: string) => value,
    ...overrides,
  };
}

function tooltipContext(overrides: Partial<ZardChartTooltipContext> = {}): ZardChartTooltipContext {
  return {
    indicator: 'dot',
    trigger: 'axis',
    hideLabel: false,
    hideIndicator: false,
    class: '',
    labelClass: '',
    config: CHART_CONFIG,
    colors: { Desktop: '#111111', Mobile: '#222222' },
    ...overrides,
  };
}

// ECharts options are deeply dynamic; the assertions below walk arbitrary nested keys.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionRecord = Record<string, any>;

function seriesOf(option: EChartsOption): OptionRecord[] {
  return (option as OptionRecord)['series'] as OptionRecord[];
}

/** Reaches the protected `option` computed the template binds to. */
function optionOf(chart: ZardChartComponent): EChartsOption {
  return (chart as unknown as { option: () => EChartsOption }).option();
}

@Component({
  imports: [ZardChartComponent, ZardChartTooltipComponent, ZardChartLegendComponent],
  template: `
    <z-chart [zConfig]="config" [zData]="data" zType="bar" [zSeries]="series" zXAxisKey="month" class="h-[250px]">
      <z-chart-tooltip zIndicator="dot" />
      <z-chart-legend />
    </z-chart>
  `,
})
class ChartHostComponent {
  readonly config = CHART_CONFIG;
  readonly data = CHART_DATA;
  readonly series = ['desktop', 'mobile'];
}

describe('ZardChartComponent', () => {
  beforeAll(() => {
    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('creates successfully and applies the host classes', async () => {
    const { container } = await render(ChartHostComponent, { providers: SHARED_PROVIDERS });

    const host = container.querySelector('z-chart');
    expect(host).toBeTruthy();
    expect(host?.className).toContain('flex');
    expect(host?.className).toContain('h-[250px]');
    expect(host?.getAttribute('ngskiphydration')).toBe('true');
  });

  it('renders one legend item per series, with the configured color', async () => {
    await render(ChartHostComponent, { providers: SHARED_PROVIDERS });

    const desktop = screen.getByRole('button', { name: /desktop/i });
    const mobile = screen.getByRole('button', { name: /mobile/i });

    expect(desktop).toBeVisible();
    expect(mobile).toBeVisible();
    expect(desktop.querySelector('span')?.getAttribute('style')).toContain('#111111');
    expect(mobile.querySelector('span')?.getAttribute('style')).toContain('#222222');
  });

  it('toggles a series through the legend and reflects it on aria-pressed', async () => {
    const { fixture } = await render(ChartHostComponent, { providers: SHARED_PROVIDERS });
    const chart = fixture.debugElement.children[0].componentInstance as ZardChartComponent;

    const desktop = screen.getByRole('button', { name: /desktop/i });
    expect(desktop.getAttribute('aria-pressed')).toBe('true');

    chart.toggleSeries('Desktop');
    fixture.detectChanges();

    expect(screen.getByRole('button', { name: /desktop/i }).getAttribute('aria-pressed')).toBe('false');
    expect(chart.hiddenSeries().has('Desktop')).toBe(true);
  });

  it('rebuilds the option when the theme changes', async () => {
    const themedConfig: ZardChartConfig = {
      desktop: { label: 'Desktop', theme: { light: '#111111', dark: '#eeeeee' } },
    };

    @Component({
      imports: [ZardChartComponent],
      template: `
        <z-chart [zConfig]="config" [zData]="data" [zSeries]="series" zXAxisKey="month" />
      `,
    })
    class ThemedHostComponent {
      readonly config = themedConfig;
      readonly data = CHART_DATA;
      readonly series = ['desktop'];
    }

    const { fixture } = await render(ThemedHostComponent, { providers: SHARED_PROVIDERS });
    const chart = fixture.debugElement.children[0].componentInstance as ZardChartComponent;

    expect((optionOf(chart) as OptionRecord)['color']).toEqual(['#111111']);

    fixture.debugElement.injector.get(ZardDarkMode).toggleTheme(EDarkModes.DARK);
    fixture.detectChanges();

    expect((optionOf(chart) as OptionRecord)['color']).toEqual(['#eeeeee']);
  });
});

describe('chart-colors.util', () => {
  it('resolves a var() reference through the computed style', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.style.setProperty('--brand', '#abcdef');

    expect(resolveCssColor(host, 'var(--brand)')).toBe('#abcdef');

    host.remove();
  });

  it('falls back to the var() fallback when the token is unset', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    expect(resolveCssColor(host, 'var(--missing, #123456)')).toBe('#123456');

    host.remove();
  });

  it('returns the input untouched when nothing resolves', () => {
    expect(resolveCssColor(null, 'var(--missing)')).toBe('var(--missing)');
    expect(resolveCssColor(null, '#ff0000')).toBe('#ff0000');
    expect(resolveCssColor(null, '')).toBe('');
  });

  it('applies alpha to oklch through the native slash syntax', () => {
    expect(withAlpha('oklch(0.646 0.222 41.116)', 0.8)).toBe('oklch(0.646 0.222 41.116 / 0.8)');
    expect(withAlpha('oklch(0.5 0.1 200 / 0.4)', 0.1)).toBe('oklch(0.5 0.1 200 / 0.1)');
  });

  it('applies alpha to hex and hsl', () => {
    expect(withAlpha('#2563eb', 1)).toBe('#2563ebff');
    expect(withAlpha('#abc', 0)).toBe('#aabbcc00');
    expect(withAlpha('hsl(220 98% 61%)', 0.5)).toBe('hsl(220 98% 61% / 0.5)');
    expect(withAlpha('hsl(220, 98%, 61%)', 0.5)).toBe('hsla(220, 98%, 61%, 0.5)');
  });

  it('falls back to color-mix for colors with no alpha syntax', () => {
    expect(withAlpha('rebeccapurple', 0.25)).toBe('color-mix(in oklab, rebeccapurple 25%, transparent)');
  });

  it('cycles the default palette across the five chart tokens', () => {
    expect(paletteColor(0)).toBe('var(--chart-1)');
    expect(paletteColor(4)).toBe('var(--chart-5)');
    expect(paletteColor(5)).toBe('var(--chart-1)');
  });

  it('prefers the per-theme color over the flat one', () => {
    const config: ZardChartConfig = {
      desktop: { color: '#111111', theme: { light: '#aaaaaa', dark: '#bbbbbb' } },
      mobile: { color: '#222222' },
    };

    expect(resolveChartColors(null, config, false)).toEqual({ desktop: '#aaaaaa', mobile: '#222222' });
    expect(resolveChartColors(null, config, true)).toEqual({ desktop: '#bbbbbb', mobile: '#222222' });
  });
});

describe('chart-option.builder', () => {
  it('accepts both the shorthand and the descriptive series form', () => {
    expect(normalizeSeries(['desktop'])).toEqual([{ dataKey: 'desktop' }]);
    expect(normalizeSeries([{ dataKey: 'desktop', smooth: true }])).toEqual([{ dataKey: 'desktop', smooth: true }]);
    expect(normalizeSeries(undefined)).toEqual([]);
  });

  it('builds bar series with rounded tops and the configured colors', () => {
    const series = seriesOf(buildChartOption(context()));

    expect(series).toHaveLength(2);
    expect(series[0]['type']).toBe('bar');
    expect(series[0]['name']).toBe('Desktop');
    expect(series[0]['data']).toEqual([186, 305]);
    expect(series[0]['itemStyle']).toEqual({ color: '#111111', borderRadius: [4, 4, 0, 0] });
  });

  it('builds line and area series, with the area fill only on area', () => {
    const line = seriesOf(buildChartOption(context({ type: 'line' })));
    expect(line[0]['type']).toBe('line');
    expect(line[0]['areaStyle']).toBeUndefined();

    const area = seriesOf(buildChartOption(context({ type: 'area' })));
    expect(area[0]['type']).toBe('line');
    expect(area[0]['areaStyle']).toEqual({ color: '#111111', opacity: 0.4 });
  });

  it('turns the area fill into a gradient when zGradient is on', () => {
    const area = seriesOf(buildChartOption(context({ type: 'area', gradient: true })));
    const fill = area[0]['areaStyle'] as OptionRecord;

    expect((fill['color'] as OptionRecord)['type']).toBe('linear');
    expect((fill['color'] as OptionRecord)['colorStops']).toEqual([
      { offset: 0, color: '#111111cc' },
      { offset: 1, color: '#1111111a' },
    ]);
  });

  it('binds the tooltip to the click alone on a touch pointer', () => {
    const tooltip = {
      indicator: 'dot',
      trigger: 'axis',
      hideLabel: false,
      hideIndicator: false,
      class: '',
      labelClass: '',
      cursor: false,
    } as ZardChartBuildContext['tooltip'];

    const withMouse = buildChartOption(context({ tooltip })) as OptionRecord;
    const withTouch = buildChartOption(context({ tooltip, coarsePointer: true })) as OptionRecord;

    expect(withMouse['tooltip'].triggerOn).toBe('mousemove|click');
    // A tap is a hover that ends at once, so hover would show the tooltip and hide it again.
    expect(withTouch['tooltip'].triggerOn).toBe('click');
  });

  it('builds a pie series with one slice per row', () => {
    const option = buildChartOption(
      context({
        type: 'pie',
        series: ['visitors'],
        nameKey: 'browser',
        data: [
          { browser: 'chrome', visitors: 275 },
          { browser: 'safari', visitors: 200 },
        ],
        config: { chrome: { label: 'Chrome', color: '#111111' }, safari: { label: 'Safari', color: '#222222' } },
        colors: { chrome: '#111111', safari: '#222222' },
      }),
    );
    const [series] = seriesOf(option);

    expect(series['type']).toBe('pie');
    // Slices are named by their configured label, so labels read "Chrome", not "chrome".
    expect(series['data']).toEqual([
      { name: 'Chrome', value: 275, itemStyle: { color: '#111111' } },
      { name: 'Safari', value: 200, itemStyle: { color: '#222222' } },
    ]);
  });

  it('builds a radar with one indicator per row', () => {
    const option = buildChartOption(context({ type: 'radar', nameKey: 'month' })) as OptionRecord;

    expect((option['radar'] as OptionRecord)['indicator']).toEqual([{ name: 'January' }, { name: 'February' }]);
    expect(seriesOf(option as EChartsOption)[0]['type']).toBe('radar');
  });

  it('builds radial charts as polar bars or as a gauge', () => {
    const bars = buildChartOption(context({ type: 'radial', series: ['desktop'], nameKey: 'month' })) as OptionRecord;
    expect(bars['polar']).toBeDefined();
    expect(seriesOf(bars as EChartsOption)[0]['coordinateSystem']).toBe('polar');

    const gauge = buildChartOption(
      context({ type: 'radial', radialVariant: 'gauge', series: ['desktop'], nameKey: 'month' }),
    );
    expect(seriesOf(gauge)[0]['type']).toBe('gauge');
  });

  it('stacks every series when zStacked is set, rounding only the top of the stack', () => {
    const series = seriesOf(buildChartOption(context({ stacked: true })));

    expect(series[0]['stack']).toBe('zard-stack');
    expect(series[1]['stack']).toBe('zard-stack');
    expect((series[0]['itemStyle'] as OptionRecord)['borderRadius']).toBe(0);
    expect((series[1]['itemStyle'] as OptionRecord)['borderRadius']).toEqual([4, 4, 0, 0]);
  });

  it('normalises the rows to 0-1 for stackOffset="expand"', () => {
    const series = seriesOf(buildChartOption(context({ stacked: true, stackOffset: 'expand' })));

    expect(series[0]['data']).toEqual([186 / 266, 305 / 505]);
    expect(series[1]['data']).toEqual([80 / 266, 200 / 505]);
  });

  it('maps zGrid="horizontal" to the Y axis split lines only', () => {
    const option = buildChartOption(context({ grid: 'horizontal' })) as OptionRecord;

    expect(((option['yAxis'] as OptionRecord)['splitLine'] as OptionRecord)['show']).toBe(true);
    expect(((option['xAxis'] as OptionRecord)['splitLine'] as OptionRecord)['show']).toBe(false);
  });

  it('maps zGrid="vertical" and zGrid=false the other way round', () => {
    const vertical = buildChartOption(context({ grid: 'vertical' })) as OptionRecord;
    expect(((vertical['xAxis'] as OptionRecord)['splitLine'] as OptionRecord)['show']).toBe(true);
    expect(((vertical['yAxis'] as OptionRecord)['splitLine'] as OptionRecord)['show']).toBe(false);

    const none = buildChartOption(context({ grid: false })) as OptionRecord;
    expect(((none['xAxis'] as OptionRecord)['splitLine'] as OptionRecord)['show']).toBe(false);
    expect(((none['yAxis'] as OptionRecord)['splitLine'] as OptionRecord)['show']).toBe(false);
  });

  it('swaps the axes and inverts the categories when horizontal', () => {
    const option = buildChartOption(context({ horizontal: true })) as OptionRecord;

    expect((option['xAxis'] as OptionRecord)['type']).toBe('value');
    expect((option['yAxis'] as OptionRecord)['type']).toBe('category');
    expect((option['yAxis'] as OptionRecord)['inverse']).toBe(true);
  });

  it('keeps zXAxis on the category axis and zYAxis on the value axis when horizontal', () => {
    const option = buildChartOption(context({ horizontal: true, xAxis: true, yAxis: false })) as OptionRecord;

    // The categories moved to Y, and `zXAxis` follows them there — it names what it shows,
    // not where it sits, the same pairing `[zXAxisFormatter]` already had.
    const category = option['yAxis'] as OptionRecord;
    const value = option['xAxis'] as OptionRecord;

    expect((category['axisLabel'] as OptionRecord)['show']).toBe(true);
    expect((value['axisLabel'] as OptionRecord)['show']).toBe(false);
  });

  it('keeps the ring labels when the radial chart also carries centre text', () => {
    // The arc labels are laid out a glyph at a time against a canvas ruler, which happy-dom
    // does not provide; without one there would be no label to lose.
    const ruler = {
      font: '',
      measureText: () => ({ width: 6 }),
      clearRect: () => undefined,
      fillRect: () => undefined,
      getImageData: () => ({ data: [0, 0, 0, 0] }),
    };
    const getContext = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(ruler as unknown as CanvasRenderingContext2D);

    const option = buildChartOption(
      context({
        type: 'radial',
        series: ['desktop'],
        nameKey: 'month',
        radialLabel: true,
        size: { width: 300, height: 300 },
        centerValue: '491',
      }),
    ) as OptionRecord;

    const graphic = option['graphic'] as OptionRecord[];
    // The arc glyphs come first, the centred group is appended — neither replaces the other.
    expect(graphic.length).toBeGreaterThan(1);
    expect(graphic[graphic.length - 1]['type']).toBe('group');
    expect(graphic.some(node => node['type'] === 'text')).toBe(true);

    getContext.mockRestore();
  });

  it('opens the toolbox with a brush feature so zBrush is reachable', () => {
    const option = buildChartOption(context({ brush: true })) as OptionRecord;
    const feature = (option['toolbox'] as OptionRecord)['feature'] as OptionRecord;

    expect(option['brush']).toBeDefined();
    expect(feature['brush']).toBeDefined();
    // Asking for a brush alone does not drag the rest of the toolbox in.
    expect(feature['saveAsImage']).toBeUndefined();
  });

  it('declares a hidden legend so legendToggleSelect has something to act on', () => {
    const withLegend = buildChartOption(context({ hasLegend: true })) as OptionRecord;
    expect(withLegend['legend']).toEqual({ show: false, data: ['Desktop', 'Mobile'] });

    expect((buildChartOption(context()) as OptionRecord)['legend']).toBeUndefined();
  });

  it('deep-merges the zOption escape hatch over the generated option', () => {
    const generated = buildChartOption(context());
    const merged = deepMerge(generated, { series: [{ itemStyle: { color: '#ff0000' } }] }) as OptionRecord;
    const series = merged['series'] as OptionRecord[];

    expect((series[0]['itemStyle'] as OptionRecord)['color']).toBe('#ff0000');
    // Untouched keys survive, and so does the series the override never mentions.
    expect((series[0]['itemStyle'] as OptionRecord)['borderRadius']).toEqual([4, 4, 0, 0]);
    expect((series[1]['itemStyle'] as OptionRecord)['color']).toBe('#222222');
  });
});

describe('chart-tooltip.formatter', () => {
  const params = [
    { axisValue: 'January', seriesName: 'Desktop', value: 186, color: '#111111' },
    { axisValue: 'January', seriesName: 'Mobile', value: 80, color: '#222222' },
  ];

  it('prints the label, every name and every value', () => {
    const html = buildTooltipHtml(params, tooltipContext());

    expect(html).toContain('January');
    expect(html).toContain('Desktop');
    expect(html).toContain('Mobile');
    expect(html).toContain('186');
    expect(html).toContain('80');
    expect(html).toContain('tabular-nums');
  });

  it('renders each indicator variant with its own classes', () => {
    expect(buildTooltipHtml(params, tooltipContext({ indicator: 'dot' }))).toContain('h-2.5 w-2.5');
    expect(buildTooltipHtml(params, tooltipContext({ indicator: 'line' }))).toContain('w-1');
    expect(buildTooltipHtml(params, tooltipContext({ indicator: 'dashed' }))).toContain('border-dashed');
  });

  it('carries the series color through the indicator custom properties', () => {
    const html = buildTooltipHtml(params, tooltipContext());

    expect(html).toContain('--color-bg: #111111');
    expect(html).toContain('--color-border: #111111');
  });

  it('drops the heading with zHideLabel and the swatch with zHideIndicator', () => {
    expect(buildTooltipHtml(params, tooltipContext({ hideLabel: true }))).not.toContain('January');

    const noIndicator = buildTooltipHtml(params, tooltipContext({ hideIndicator: true }));
    expect(noIndicator).not.toContain('--color-bg');
    expect(noIndicator).toContain('Desktop');
  });

  it('nests the label inside the row for a single non-dot item, like shadcn does', () => {
    const single = [params[0]];

    expect(buildTooltipHtml(single, tooltipContext({ indicator: 'line' }))).toContain('items-end');
    expect(buildTooltipHtml(single, tooltipContext({ indicator: 'dot' }))).toContain('items-center');
  });

  it('escapes data before it reaches innerHTML', () => {
    const html = buildTooltipHtml(
      [{ axisValue: '<img src=x onerror=alert(1)>', seriesName: 'Desktop', value: 1 }],
      tooltipContext(),
    );

    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });

  it('applies the value formatter when one is declared', () => {
    const html = buildTooltipHtml(params, tooltipContext({ valueFormatter: value => `${value} visits` }));

    expect(html).toContain('186 visits');
  });

  it('reads a radar param as one row per indicator', () => {
    // A radar arrives as a single param holding the whole web; taking one number off the array
    // would print the same value at every vertex.
    const html = buildTooltipHtml([{ seriesName: 'Desktop', value: [186, 305] }], {
      ...tooltipContext({ trigger: 'item' }),
      indicators: ['January', 'February'],
    });

    expect(html).toContain('January');
    expect(html).toContain('186');
    expect(html).toContain('February');
    expect(html).toContain('305');
    // The series it belongs to heads the tooltip.
    expect(html).toContain('Desktop');
  });
});
