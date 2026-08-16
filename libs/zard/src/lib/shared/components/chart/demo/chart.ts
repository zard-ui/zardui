import { CHART_DEMO_AREA_DEFAULT } from '@generated/components/chart/demo/area-default';
import { CHART_DEMO_AREA_GRADIENT } from '@generated/components/chart/demo/area-gradient';
import { CHART_DEMO_AREA_STACKED } from '@generated/components/chart/demo/area-stacked';
import { CHART_DEMO_BAR_HORIZONTAL } from '@generated/components/chart/demo/bar-horizontal';
import { CHART_DEMO_BAR_INTERACTIVE } from '@generated/components/chart/demo/bar-interactive';
import { CHART_DEMO_BAR_LABEL } from '@generated/components/chart/demo/bar-label';
import { CHART_DEMO_BAR_MULTIPLE } from '@generated/components/chart/demo/bar-multiple';
import { CHART_DEMO_BAR_STACKED } from '@generated/components/chart/demo/bar-stacked';
import { CHART_DEMO_DEFAULT } from '@generated/components/chart/demo/default';
import { CHART_DEMO_ECHARTS_DATAZOOM } from '@generated/components/chart/demo/echarts-datazoom';
import { CHART_DEMO_LINE_DEFAULT } from '@generated/components/chart/demo/line-default';
import { CHART_DEMO_LINE_DOTS } from '@generated/components/chart/demo/line-dots';
import { CHART_DEMO_LINE_STEP } from '@generated/components/chart/demo/line-step';
import { CHART_DEMO_PIE_DONUT_TEXT } from '@generated/components/chart/demo/pie-donut-text';
import { CHART_DEMO_PIE_LABEL } from '@generated/components/chart/demo/pie-label';
import { CHART_DEMO_RADAR_DEFAULT } from '@generated/components/chart/demo/radar-default';
import { CHART_DEMO_RADIAL_SIMPLE } from '@generated/components/chart/demo/radial-simple';
import { CHART_DEMO_TOOLTIP_INDICATORS } from '@generated/components/chart/demo/tooltip-indicators';
import {
  CHART_SNIPPET_CHART_CONFIG,
  CHART_SNIPPET_ESCAPE_HATCH,
  CHART_SNIPPET_HEIGHT,
  CHART_SNIPPET_LAZY_PROVIDER,
  CHART_SNIPPET_THEMING,
  CHART_SNIPPET_TREE_SHAKING,
} from '@generated/components/chart/snippets';
import { CHART_CLI_ADD } from '@generated/installation/cli/add-chart';
import { CHART_MANUAL_CODE } from '@generated/installation/manual/chart';
import { CHART_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-chart';
import { CHART_REGISTER } from '@generated/installation/register/register-chart';
import { CHART_USAGE_CODE, CHART_USAGE_IMPORT } from '@generated/usage/chart';

import { ZardDemoChartAreaDefaultComponent } from '@/shared/components/chart/demo/area-default';
import { ZardDemoChartAreaGradientComponent } from '@/shared/components/chart/demo/area-gradient';
import { ZardDemoChartAreaStackedComponent } from '@/shared/components/chart/demo/area-stacked';
import { ZardDemoChartBarHorizontalComponent } from '@/shared/components/chart/demo/bar-horizontal';
import { ZardDemoChartBarInteractiveComponent } from '@/shared/components/chart/demo/bar-interactive';
import { ZardDemoChartBarLabelComponent } from '@/shared/components/chart/demo/bar-label';
import { ZardDemoChartBarMultipleComponent } from '@/shared/components/chart/demo/bar-multiple';
import { ZardDemoChartBarStackedComponent } from '@/shared/components/chart/demo/bar-stacked';
import { ZardDemoChartDefaultComponent } from '@/shared/components/chart/demo/default';
import { ZardDemoChartEchartsDatazoomComponent } from '@/shared/components/chart/demo/echarts-datazoom';
import { ZardDemoChartLineDefaultComponent } from '@/shared/components/chart/demo/line-default';
import { ZardDemoChartLineDotsComponent } from '@/shared/components/chart/demo/line-dots';
import { ZardDemoChartLineStepComponent } from '@/shared/components/chart/demo/line-step';
import { ZardDemoChartPieDonutTextComponent } from '@/shared/components/chart/demo/pie-donut-text';
import { ZardDemoChartPieLabelComponent } from '@/shared/components/chart/demo/pie-label';
import { ZardDemoChartRadarDefaultComponent } from '@/shared/components/chart/demo/radar-default';
import { ZardDemoChartRadialSimpleComponent } from '@/shared/components/chart/demo/radial-simple';
import { ZardDemoChartTooltipIndicatorsComponent } from '@/shared/components/chart/demo/tooltip-indicators';

import { CHART_API } from '../doc/api';

export const CHART = {
  api: CHART_API,
  componentName: 'chart',
  componentType: 'chart',
  description: 'Beautiful charts built with Apache ECharts. Copy and paste into your apps.',
  about: {
    description: 'The chart is built on Apache ECharts, wired into Angular through ngx-echarts.',
    link: { label: 'Apache ECharts', href: 'https://echarts.apache.org/' },
  },
  installData: {
    cliAdd: CHART_CLI_ADD,
    manualCode: CHART_MANUAL_CODE,
    manualDeps: CHART_MANUAL_INSTALL_DEPS,
    register: CHART_REGISTER,
  },
  usage: { importBlock: CHART_USAGE_IMPORT, codeBlock: CHART_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoChartDefaultComponent,
    column: false,
    codeData: CHART_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'chart-config',
      description:
        'The chart config holds everything about the chart that is not the data itself — labels, colors and icons — keyed by data key.',
      codeData: CHART_SNIPPET_CHART_CONFIG,
    },
    {
      name: 'theming',
      description:
        'Colors are declared as CSS variables and resolved to computed values before ECharts sees them, so the chart follows the theme automatically.',
      codeData: CHART_SNIPPET_THEMING,
    },
    {
      name: 'height',
      description:
        'The container must resolve to a real height, or ECharts initialises at zero pixels and draws nothing. `z-chart` handles that on its own with `aspect-video`; pass a height class only when you want a different shape, and note that a height without an aspect ratio needs a width too.',
      codeData: CHART_SNIPPET_HEIGHT,
    },
    {
      name: 'tree-shaking',
      description:
        'ECharts is registered through `provideZardCharts()` and imported lazily, so it never reaches the initial bundle. Trim the registry to what you actually render.',
      codeData: CHART_SNIPPET_TREE_SHAKING,
      codeAfter: [{ codeData: CHART_SNIPPET_LAZY_PROVIDER }],
    },
    {
      name: 'bar-multiple',
      description: 'Pass more than one data key to `zSeries` to draw them side by side.',
      component: ZardDemoChartBarMultipleComponent,
      codeData: CHART_DEMO_BAR_MULTIPLE,
    },
    {
      name: 'bar-stacked',
      description: 'Use `zStacked` to stack every series on the same axis.',
      component: ZardDemoChartBarStackedComponent,
      codeData: CHART_DEMO_BAR_STACKED,
    },
    {
      name: 'bar-horizontal',
      description: 'Use `zHorizontal` to swap the category and value axes.',
      component: ZardDemoChartBarHorizontalComponent,
      codeData: CHART_DEMO_BAR_HORIZONTAL,
    },
    {
      name: 'bar-label',
      description: 'Use `zLabel` to print the value on every data point — the `LabelList` equivalent.',
      component: ZardDemoChartBarLabelComponent,
      codeData: CHART_DEMO_BAR_LABEL,
    },
    {
      name: 'bar-interactive',
      description: 'Series are plain inputs, so a `signal` is all it takes to make the chart interactive.',
      component: ZardDemoChartBarInteractiveComponent,
      codeData: CHART_DEMO_BAR_INTERACTIVE,
      previewHeight: '30rem',
    },
    {
      name: 'area-default',
      description: 'Use `zType="area"` and set `smooth` on the series for shadcn\'s natural curve.',
      component: ZardDemoChartAreaDefaultComponent,
      codeData: CHART_DEMO_AREA_DEFAULT,
    },
    {
      name: 'area-stacked',
      component: ZardDemoChartAreaStackedComponent,
      codeData: CHART_DEMO_AREA_STACKED,
    },
    {
      name: 'area-gradient',
      description: 'Use `zGradient` to fill the band with a vertical gradient instead of a flat tint.',
      component: ZardDemoChartAreaGradientComponent,
      codeData: CHART_DEMO_AREA_GRADIENT,
    },
    {
      name: 'line-default',
      component: ZardDemoChartLineDefaultComponent,
      codeData: CHART_DEMO_LINE_DEFAULT,
    },
    {
      name: 'line-dots',
      description: 'Set `showSymbol` on the series to draw a dot on every data point.',
      component: ZardDemoChartLineDotsComponent,
      codeData: CHART_DEMO_LINE_DOTS,
    },
    {
      name: 'line-step',
      description: "Set `step` to `'start'`, `'middle'` or `'end'` for a stepped line.",
      component: ZardDemoChartLineStepComponent,
      codeData: CHART_DEMO_LINE_STEP,
    },
    {
      name: 'pie-label',
      component: ZardDemoChartPieLabelComponent,
      codeData: CHART_DEMO_PIE_LABEL,
    },
    {
      name: 'pie-donut-text',
      description: 'Use `zInnerRadius` for the donut and `zCenterValue` / `zCenterLabel` for the text in the middle.',
      component: ZardDemoChartPieDonutTextComponent,
      codeData: CHART_DEMO_PIE_DONUT_TEXT,
    },
    {
      name: 'radar-default',
      component: ZardDemoChartRadarDefaultComponent,
      codeData: CHART_DEMO_RADAR_DEFAULT,
    },
    {
      name: 'radial-simple',
      component: ZardDemoChartRadialSimpleComponent,
      codeData: CHART_DEMO_RADIAL_SIMPLE,
    },
    {
      name: 'tooltip-indicators',
      description: 'The tooltip ships the same three indicator shapes as shadcn/ui: `dot`, `line` and `dashed`.',
      component: ZardDemoChartTooltipIndicatorsComponent,
      codeData: CHART_DEMO_TOOLTIP_INDICATORS,
      column: true,
    },
    {
      name: 'opt-in features',
      description:
        'ECharts features Recharts has no counterpart for are opt-in, so the default chart stays visually identical to shadcn/ui.',
      component: ZardDemoChartEchartsDatazoomComponent,
      codeData: CHART_DEMO_ECHARTS_DATAZOOM,
    },
    {
      name: 'escape-hatch',
      description: 'Anything the inputs do not cover is one `[zOption]` away — it is deep-merged over the option.',
      codeData: CHART_SNIPPET_ESCAPE_HATCH,
    },
    {
      name: 'limitations',
      description: [
        'Where ECharts and Recharts disagree, the chart delivers the closest equivalent. These are the differences worth knowing about.',
        '',
        "- **Curve interpolation** — Recharts distinguishes `natural`, `monotone` and `basis`; ECharts has a single `smooth` flag, so all three map to it. Pass a number between 0 and 1 to a series' `smooth` for finer control.",
        `- **Stack normalisation** — ECharts has none, so \`zStackOffset="expand"\` normalises the rows to 0-1 before they reach it and clamps the value axis. Format the ticks with \`[zYAxisFormatter]\`.`,
        '- **Tick spacing** — Recharts drops ticks whose gap falls below a pixel threshold. The chart sets `axisLabel.hideOverlap` instead: labels stop colliding, but the threshold is not tunable.',
        '- **Legend** — the ECharts legend cannot reproduce the shadcn markup, so `z-chart-legend` renders real HTML. The native legend stays registered but hidden, because it is what toggles a series.',
        '- **Centre text and radial labels** — Recharts nests SVG inside the chart for both. Here they are drawn as `graphic` text, so `zCenterValue` and `zCenterLabel` are plain strings, and `zRadialLabel` lays a ring name out one glyph at a time.',
        '- **Rounded stacked bars** — only the outermost bar of a stack is rounded, matching Recharts. On negative bars ECharts still rounds the top corners rather than the outward end.',
        '- **Server-side rendering** — the server paints a static SVG and the browser swaps in the live chart on hydration. It cannot read CSS variables, so the SVG uses the light palette; set `[zSsrWidth]` and `[zSsrHeight]` to match your layout.',
      ].join('\n'),
    },
  ],
};
