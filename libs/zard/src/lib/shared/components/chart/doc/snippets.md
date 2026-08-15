# Chart snippets

Illustrative code fragments used as code-only examples on the chart docs page.
Each fenced block is exported as `CHART_SNIPPET_<ID>` via the snippet generator.

```angular-ts id="chart-config" title="chart.config.ts" copyButton
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

```css id="theming" title="styles.css" copyButton
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

```angular-ts id="tree-shaking" title="chart-echarts.registry.ts" copyButton showLineNumbers
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

```angular-ts id="lazy-provider" title="chart-echarts.provider.ts" copyButton
import { provideEchartsCore } from 'ngx-echarts';

// The registry above is imported lazily, so roughly a megabyte of ECharts stays out of
// your application's initial bundle: it is fetched the first time a chart is created.
export const provideZardCharts = () =>
  provideEchartsCore({ echarts: () => import('./chart-echarts.registry').then(module => module.zardEcharts) });
```

```angular-ts id="escape-hatch" title="escape-hatch.ts" copyButton
import type { ZardChartOptionOverride } from '@/shared/components/chart/chart.types';

// `[zOption]` is deep-merged over the generated option and always wins, so any ECharts
// feature is one property away. Arrays merge index by index: the object below patches
// the first series instead of replacing the whole list.
export const override: ZardChartOptionOverride = {
  series: [{ label: { position: 'insideLeft', color: '#fff', formatter: '{b}' } }],
  xAxis: { axisLabel: { rotate: 45 } },
};
```

```angular-html id="height" title="height.html" copyButton
<!-- The container must resolve to a real height. Without one, ECharts initialises at
     zero pixels and nothing is drawn. `z-chart` defaults to `aspect-video`, so this is
     only a problem when you override the aspect ratio without giving a height. -->
<z-chart class="h-[250px] w-full" ...>...</z-chart>
<z-chart class="aspect-square h-[250px]" ...>...</z-chart>
```

```text id="limitations" title="Limitations" copyButton
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
