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
<z-chart zType="bar" [zData]="chartData" [zSeries]="series" />

<z-chart class="h-[250px] w-full" zType="bar" [zData]="chartData" />

<z-chart class="mx-auto aspect-square h-[250px]" zType="pie" [zData]="chartData" />
```
