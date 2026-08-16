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
