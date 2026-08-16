import type { Type } from '@angular/core';

import { CHART_DEMO_AREA_AXES } from '@generated/components/chart/demo/area-axes';
import { CHART_DEMO_AREA_DEFAULT } from '@generated/components/chart/demo/area-default';
import { CHART_DEMO_AREA_GRADIENT } from '@generated/components/chart/demo/area-gradient';
import { CHART_DEMO_AREA_ICONS } from '@generated/components/chart/demo/area-icons';
import { CHART_DEMO_AREA_INTERACTIVE } from '@generated/components/chart/demo/area-interactive';
import { CHART_DEMO_AREA_LEGEND } from '@generated/components/chart/demo/area-legend';
import { CHART_DEMO_AREA_LINEAR } from '@generated/components/chart/demo/area-linear';
import { CHART_DEMO_AREA_STACKED } from '@generated/components/chart/demo/area-stacked';
import { CHART_DEMO_AREA_STACKED_EXPAND } from '@generated/components/chart/demo/area-stacked-expand';
import { CHART_DEMO_AREA_STEP } from '@generated/components/chart/demo/area-step';
import { CHART_DEMO_BAR_ACTIVE } from '@generated/components/chart/demo/bar-active';
import { CHART_DEMO_BAR_CUSTOM_LABEL } from '@generated/components/chart/demo/bar-custom-label';
import { CHART_DEMO_BAR_DEFAULT } from '@generated/components/chart/demo/bar-default';
import { CHART_DEMO_BAR_HORIZONTAL } from '@generated/components/chart/demo/bar-horizontal';
import { CHART_DEMO_BAR_INTERACTIVE } from '@generated/components/chart/demo/bar-interactive';
import { CHART_DEMO_BAR_LABEL } from '@generated/components/chart/demo/bar-label';
import { CHART_DEMO_BAR_MIXED } from '@generated/components/chart/demo/bar-mixed';
import { CHART_DEMO_BAR_MULTIPLE } from '@generated/components/chart/demo/bar-multiple';
import { CHART_DEMO_BAR_NEGATIVE } from '@generated/components/chart/demo/bar-negative';
import { CHART_DEMO_BAR_STACKED } from '@generated/components/chart/demo/bar-stacked';
import { CHART_DEMO_BAR_STACKED_LEGEND } from '@generated/components/chart/demo/bar-stacked-legend';
import { CHART_DEMO_LINE_DEFAULT } from '@generated/components/chart/demo/line-default';
import { CHART_DEMO_LINE_DOTS } from '@generated/components/chart/demo/line-dots';
import { CHART_DEMO_LINE_DOTS_COLORS } from '@generated/components/chart/demo/line-dots-colors';
import { CHART_DEMO_LINE_DOTS_CUSTOM } from '@generated/components/chart/demo/line-dots-custom';
import { CHART_DEMO_LINE_INTERACTIVE } from '@generated/components/chart/demo/line-interactive';
import { CHART_DEMO_LINE_LABEL } from '@generated/components/chart/demo/line-label';
import { CHART_DEMO_LINE_LABEL_CUSTOM } from '@generated/components/chart/demo/line-label-custom';
import { CHART_DEMO_LINE_LINEAR } from '@generated/components/chart/demo/line-linear';
import { CHART_DEMO_LINE_MULTIPLE } from '@generated/components/chart/demo/line-multiple';
import { CHART_DEMO_LINE_STEP } from '@generated/components/chart/demo/line-step';
import { CHART_DEMO_PIE_DONUT } from '@generated/components/chart/demo/pie-donut';
import { CHART_DEMO_PIE_DONUT_ACTIVE } from '@generated/components/chart/demo/pie-donut-active';
import { CHART_DEMO_PIE_DONUT_TEXT } from '@generated/components/chart/demo/pie-donut-text';
import { CHART_DEMO_PIE_INTERACTIVE } from '@generated/components/chart/demo/pie-interactive';
import { CHART_DEMO_PIE_LABEL } from '@generated/components/chart/demo/pie-label';
import { CHART_DEMO_PIE_LABEL_CUSTOM } from '@generated/components/chart/demo/pie-label-custom';
import { CHART_DEMO_PIE_LABEL_LIST } from '@generated/components/chart/demo/pie-label-list';
import { CHART_DEMO_PIE_LEGEND } from '@generated/components/chart/demo/pie-legend';
import { CHART_DEMO_PIE_SEPARATOR_NONE } from '@generated/components/chart/demo/pie-separator-none';
import { CHART_DEMO_PIE_SIMPLE } from '@generated/components/chart/demo/pie-simple';
import { CHART_DEMO_PIE_STACKED } from '@generated/components/chart/demo/pie-stacked';
import { CHART_DEMO_RADAR_DEFAULT } from '@generated/components/chart/demo/radar-default';
import { CHART_DEMO_RADAR_DOTS } from '@generated/components/chart/demo/radar-dots';
import { CHART_DEMO_RADAR_GRID_CIRCLE } from '@generated/components/chart/demo/radar-grid-circle';
import { CHART_DEMO_RADAR_GRID_CIRCLE_FILLED } from '@generated/components/chart/demo/radar-grid-circle-filled';
import { CHART_DEMO_RADAR_GRID_CIRCLE_NO_LINES } from '@generated/components/chart/demo/radar-grid-circle-no-lines';
import { CHART_DEMO_RADAR_GRID_CUSTOM } from '@generated/components/chart/demo/radar-grid-custom';
import { CHART_DEMO_RADAR_GRID_FILL } from '@generated/components/chart/demo/radar-grid-fill';
import { CHART_DEMO_RADAR_GRID_NONE } from '@generated/components/chart/demo/radar-grid-none';
import { CHART_DEMO_RADAR_LABEL_CUSTOM } from '@generated/components/chart/demo/radar-label-custom';
import { CHART_DEMO_RADAR_LEGEND } from '@generated/components/chart/demo/radar-legend';
import { CHART_DEMO_RADAR_LINES_ONLY } from '@generated/components/chart/demo/radar-lines-only';
import { CHART_DEMO_RADAR_MULTIPLE } from '@generated/components/chart/demo/radar-multiple';
import { CHART_DEMO_RADAR_RADIUS_AXIS } from '@generated/components/chart/demo/radar-radius-axis';
import { CHART_DEMO_RADIAL_GRID } from '@generated/components/chart/demo/radial-grid';
import { CHART_DEMO_RADIAL_LABEL } from '@generated/components/chart/demo/radial-label';
import { CHART_DEMO_RADIAL_SHAPE } from '@generated/components/chart/demo/radial-shape';
import { CHART_DEMO_RADIAL_SIMPLE } from '@generated/components/chart/demo/radial-simple';
import { CHART_DEMO_RADIAL_STACKED } from '@generated/components/chart/demo/radial-stacked';
import { CHART_DEMO_RADIAL_TEXT } from '@generated/components/chart/demo/radial-text';
import { CHART_DEMO_TOOLTIP_ADVANCED } from '@generated/components/chart/demo/tooltip-advanced';
import { CHART_DEMO_TOOLTIP_DEFAULT } from '@generated/components/chart/demo/tooltip-default';
import { CHART_DEMO_TOOLTIP_FORMATTER } from '@generated/components/chart/demo/tooltip-formatter';
import { CHART_DEMO_TOOLTIP_ICONS } from '@generated/components/chart/demo/tooltip-icons';
import { CHART_DEMO_TOOLTIP_INDICATOR_LINE } from '@generated/components/chart/demo/tooltip-indicator-line';
import { CHART_DEMO_TOOLTIP_INDICATOR_NONE } from '@generated/components/chart/demo/tooltip-indicator-none';
import { CHART_DEMO_TOOLTIP_LABEL_CUSTOM } from '@generated/components/chart/demo/tooltip-label-custom';
import { CHART_DEMO_TOOLTIP_LABEL_FORMATTER } from '@generated/components/chart/demo/tooltip-label-formatter';
import { CHART_DEMO_TOOLTIP_LABEL_NONE } from '@generated/components/chart/demo/tooltip-label-none';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoChartAreaAxesComponent } from '@zard/components/chart/demo/area-axes';
import { ZardDemoChartAreaDefaultComponent } from '@zard/components/chart/demo/area-default';
import { ZardDemoChartAreaGradientComponent } from '@zard/components/chart/demo/area-gradient';
import { ZardDemoChartAreaIconsComponent } from '@zard/components/chart/demo/area-icons';
import { ZardDemoChartAreaInteractiveComponent } from '@zard/components/chart/demo/area-interactive';
import { ZardDemoChartAreaLegendComponent } from '@zard/components/chart/demo/area-legend';
import { ZardDemoChartAreaLinearComponent } from '@zard/components/chart/demo/area-linear';
import { ZardDemoChartAreaStackedComponent } from '@zard/components/chart/demo/area-stacked';
import { ZardDemoChartAreaStackedExpandComponent } from '@zard/components/chart/demo/area-stacked-expand';
import { ZardDemoChartAreaStepComponent } from '@zard/components/chart/demo/area-step';
import { ZardDemoChartBarActiveComponent } from '@zard/components/chart/demo/bar-active';
import { ZardDemoChartBarCustomLabelComponent } from '@zard/components/chart/demo/bar-custom-label';
import { ZardDemoChartBarDefaultComponent } from '@zard/components/chart/demo/bar-default';
import { ZardDemoChartBarHorizontalComponent } from '@zard/components/chart/demo/bar-horizontal';
import { ZardDemoChartBarInteractiveComponent } from '@zard/components/chart/demo/bar-interactive';
import { ZardDemoChartBarLabelComponent } from '@zard/components/chart/demo/bar-label';
import { ZardDemoChartBarMixedComponent } from '@zard/components/chart/demo/bar-mixed';
import { ZardDemoChartBarMultipleComponent } from '@zard/components/chart/demo/bar-multiple';
import { ZardDemoChartBarNegativeComponent } from '@zard/components/chart/demo/bar-negative';
import { ZardDemoChartBarStackedComponent } from '@zard/components/chart/demo/bar-stacked';
import { ZardDemoChartBarStackedLegendComponent } from '@zard/components/chart/demo/bar-stacked-legend';
import { ZardDemoChartLineDefaultComponent } from '@zard/components/chart/demo/line-default';
import { ZardDemoChartLineDotsComponent } from '@zard/components/chart/demo/line-dots';
import { ZardDemoChartLineDotsColorsComponent } from '@zard/components/chart/demo/line-dots-colors';
import { ZardDemoChartLineDotsCustomComponent } from '@zard/components/chart/demo/line-dots-custom';
import { ZardDemoChartLineInteractiveComponent } from '@zard/components/chart/demo/line-interactive';
import { ZardDemoChartLineLabelComponent } from '@zard/components/chart/demo/line-label';
import { ZardDemoChartLineLabelCustomComponent } from '@zard/components/chart/demo/line-label-custom';
import { ZardDemoChartLineLinearComponent } from '@zard/components/chart/demo/line-linear';
import { ZardDemoChartLineMultipleComponent } from '@zard/components/chart/demo/line-multiple';
import { ZardDemoChartLineStepComponent } from '@zard/components/chart/demo/line-step';
import { ZardDemoChartPieDonutComponent } from '@zard/components/chart/demo/pie-donut';
import { ZardDemoChartPieDonutActiveComponent } from '@zard/components/chart/demo/pie-donut-active';
import { ZardDemoChartPieDonutTextComponent } from '@zard/components/chart/demo/pie-donut-text';
import { ZardDemoChartPieInteractiveComponent } from '@zard/components/chart/demo/pie-interactive';
import { ZardDemoChartPieLabelComponent } from '@zard/components/chart/demo/pie-label';
import { ZardDemoChartPieLabelCustomComponent } from '@zard/components/chart/demo/pie-label-custom';
import { ZardDemoChartPieLabelListComponent } from '@zard/components/chart/demo/pie-label-list';
import { ZardDemoChartPieLegendComponent } from '@zard/components/chart/demo/pie-legend';
import { ZardDemoChartPieSeparatorNoneComponent } from '@zard/components/chart/demo/pie-separator-none';
import { ZardDemoChartPieSimpleComponent } from '@zard/components/chart/demo/pie-simple';
import { ZardDemoChartPieStackedComponent } from '@zard/components/chart/demo/pie-stacked';
import { ZardDemoChartRadarDefaultComponent } from '@zard/components/chart/demo/radar-default';
import { ZardDemoChartRadarDotsComponent } from '@zard/components/chart/demo/radar-dots';
import { ZardDemoChartRadarGridCircleComponent } from '@zard/components/chart/demo/radar-grid-circle';
import { ZardDemoChartRadarGridCircleFilledComponent } from '@zard/components/chart/demo/radar-grid-circle-filled';
import { ZardDemoChartRadarGridCircleNoLinesComponent } from '@zard/components/chart/demo/radar-grid-circle-no-lines';
import { ZardDemoChartRadarGridCustomComponent } from '@zard/components/chart/demo/radar-grid-custom';
import { ZardDemoChartRadarGridFillComponent } from '@zard/components/chart/demo/radar-grid-fill';
import { ZardDemoChartRadarGridNoneComponent } from '@zard/components/chart/demo/radar-grid-none';
import { ZardDemoChartRadarLabelCustomComponent } from '@zard/components/chart/demo/radar-label-custom';
import { ZardDemoChartRadarLegendComponent } from '@zard/components/chart/demo/radar-legend';
import { ZardDemoChartRadarLinesOnlyComponent } from '@zard/components/chart/demo/radar-lines-only';
import { ZardDemoChartRadarMultipleComponent } from '@zard/components/chart/demo/radar-multiple';
import { ZardDemoChartRadarRadiusAxisComponent } from '@zard/components/chart/demo/radar-radius-axis';
import { ZardDemoChartRadialGridComponent } from '@zard/components/chart/demo/radial-grid';
import { ZardDemoChartRadialLabelComponent } from '@zard/components/chart/demo/radial-label';
import { ZardDemoChartRadialShapeComponent } from '@zard/components/chart/demo/radial-shape';
import { ZardDemoChartRadialSimpleComponent } from '@zard/components/chart/demo/radial-simple';
import { ZardDemoChartRadialStackedComponent } from '@zard/components/chart/demo/radial-stacked';
import { ZardDemoChartRadialTextComponent } from '@zard/components/chart/demo/radial-text';
import { ZardDemoChartTooltipAdvancedComponent } from '@zard/components/chart/demo/tooltip-advanced';
import { ZardDemoChartTooltipDefaultComponent } from '@zard/components/chart/demo/tooltip-default';
import { ZardDemoChartTooltipFormatterComponent } from '@zard/components/chart/demo/tooltip-formatter';
import { ZardDemoChartTooltipIconsComponent } from '@zard/components/chart/demo/tooltip-icons';
import { ZardDemoChartTooltipIndicatorLineComponent } from '@zard/components/chart/demo/tooltip-indicator-line';
import { ZardDemoChartTooltipIndicatorNoneComponent } from '@zard/components/chart/demo/tooltip-indicator-none';
import { ZardDemoChartTooltipLabelCustomComponent } from '@zard/components/chart/demo/tooltip-label-custom';
import { ZardDemoChartTooltipLabelFormatterComponent } from '@zard/components/chart/demo/tooltip-label-formatter';
import { ZardDemoChartTooltipLabelNoneComponent } from '@zard/components/chart/demo/tooltip-label-none';

import type { ChartCategory } from '../services/charts.service';

/** One copy-pasteable example on the /charts gallery. */
export interface ChartExample {
  /** Matches the demo file name, e.g. `area-stacked`. */
  id: string;
  title: string;
  component: Type<unknown>;
  codeData: CodeBlockData;
  /** Spans every grid column, the way shadcn leads a category with its interactive chart. */
  fullWidth?: boolean;
}

/**
 * Every gallery example, grouped by category. The components and their highlighted code
 * come from the same source as the docs page — `libs/zard/…/chart/demo` — so the two
 * never drift apart.
 */
export const CHARTS_REGISTRY: Record<ChartCategory, ChartExample[]> = {
  area: [
    {
      id: 'area-interactive',
      title: 'Interactive',
      component: ZardDemoChartAreaInteractiveComponent,
      codeData: CHART_DEMO_AREA_INTERACTIVE,
      fullWidth: true,
    },
    {
      id: 'area-default',
      title: 'Default',
      component: ZardDemoChartAreaDefaultComponent,
      codeData: CHART_DEMO_AREA_DEFAULT,
    },
    {
      id: 'area-linear',
      title: 'Linear',
      component: ZardDemoChartAreaLinearComponent,
      codeData: CHART_DEMO_AREA_LINEAR,
    },
    { id: 'area-step', title: 'Step', component: ZardDemoChartAreaStepComponent, codeData: CHART_DEMO_AREA_STEP },
    {
      id: 'area-legend',
      title: 'Legend',
      component: ZardDemoChartAreaLegendComponent,
      codeData: CHART_DEMO_AREA_LEGEND,
    },
    {
      id: 'area-stacked',
      title: 'Stacked',
      component: ZardDemoChartAreaStackedComponent,
      codeData: CHART_DEMO_AREA_STACKED,
    },
    {
      id: 'area-stacked-expand',
      title: 'Stacked Expand',
      component: ZardDemoChartAreaStackedExpandComponent,
      codeData: CHART_DEMO_AREA_STACKED_EXPAND,
    },
    { id: 'area-icons', title: 'Icons', component: ZardDemoChartAreaIconsComponent, codeData: CHART_DEMO_AREA_ICONS },
    {
      id: 'area-gradient',
      title: 'Gradient',
      component: ZardDemoChartAreaGradientComponent,
      codeData: CHART_DEMO_AREA_GRADIENT,
    },
    { id: 'area-axes', title: 'Axes', component: ZardDemoChartAreaAxesComponent, codeData: CHART_DEMO_AREA_AXES },
  ],
  bar: [
    {
      id: 'bar-interactive',
      title: 'Interactive',
      component: ZardDemoChartBarInteractiveComponent,
      codeData: CHART_DEMO_BAR_INTERACTIVE,
      fullWidth: true,
    },
    {
      id: 'bar-default',
      title: 'Default',
      component: ZardDemoChartBarDefaultComponent,
      codeData: CHART_DEMO_BAR_DEFAULT,
    },
    {
      id: 'bar-horizontal',
      title: 'Horizontal',
      component: ZardDemoChartBarHorizontalComponent,
      codeData: CHART_DEMO_BAR_HORIZONTAL,
    },
    {
      id: 'bar-multiple',
      title: 'Multiple',
      component: ZardDemoChartBarMultipleComponent,
      codeData: CHART_DEMO_BAR_MULTIPLE,
    },
    {
      id: 'bar-stacked-legend',
      title: 'Stacked Legend',
      component: ZardDemoChartBarStackedLegendComponent,
      codeData: CHART_DEMO_BAR_STACKED_LEGEND,
    },
    { id: 'bar-label', title: 'Label', component: ZardDemoChartBarLabelComponent, codeData: CHART_DEMO_BAR_LABEL },
    {
      id: 'bar-custom-label',
      title: 'Custom Label',
      component: ZardDemoChartBarCustomLabelComponent,
      codeData: CHART_DEMO_BAR_CUSTOM_LABEL,
    },
    { id: 'bar-mixed', title: 'Mixed', component: ZardDemoChartBarMixedComponent, codeData: CHART_DEMO_BAR_MIXED },
    { id: 'bar-active', title: 'Active', component: ZardDemoChartBarActiveComponent, codeData: CHART_DEMO_BAR_ACTIVE },
    {
      id: 'bar-negative',
      title: 'Negative',
      component: ZardDemoChartBarNegativeComponent,
      codeData: CHART_DEMO_BAR_NEGATIVE,
    },
    {
      id: 'bar-stacked',
      title: 'Stacked',
      component: ZardDemoChartBarStackedComponent,
      codeData: CHART_DEMO_BAR_STACKED,
    },
  ],
  line: [
    {
      id: 'line-interactive',
      title: 'Interactive',
      component: ZardDemoChartLineInteractiveComponent,
      codeData: CHART_DEMO_LINE_INTERACTIVE,
      fullWidth: true,
    },
    {
      id: 'line-default',
      title: 'Default',
      component: ZardDemoChartLineDefaultComponent,
      codeData: CHART_DEMO_LINE_DEFAULT,
    },
    {
      id: 'line-linear',
      title: 'Linear',
      component: ZardDemoChartLineLinearComponent,
      codeData: CHART_DEMO_LINE_LINEAR,
    },
    { id: 'line-step', title: 'Step', component: ZardDemoChartLineStepComponent, codeData: CHART_DEMO_LINE_STEP },
    {
      id: 'line-multiple',
      title: 'Multiple',
      component: ZardDemoChartLineMultipleComponent,
      codeData: CHART_DEMO_LINE_MULTIPLE,
    },
    { id: 'line-dots', title: 'Dots', component: ZardDemoChartLineDotsComponent, codeData: CHART_DEMO_LINE_DOTS },
    {
      id: 'line-dots-custom',
      title: 'Dots Custom',
      component: ZardDemoChartLineDotsCustomComponent,
      codeData: CHART_DEMO_LINE_DOTS_CUSTOM,
    },
    {
      id: 'line-dots-colors',
      title: 'Dots Colors',
      component: ZardDemoChartLineDotsColorsComponent,
      codeData: CHART_DEMO_LINE_DOTS_COLORS,
    },
    { id: 'line-label', title: 'Label', component: ZardDemoChartLineLabelComponent, codeData: CHART_DEMO_LINE_LABEL },
    {
      id: 'line-label-custom',
      title: 'Label Custom',
      component: ZardDemoChartLineLabelCustomComponent,
      codeData: CHART_DEMO_LINE_LABEL_CUSTOM,
    },
  ],
  pie: [
    { id: 'pie-simple', title: 'Simple', component: ZardDemoChartPieSimpleComponent, codeData: CHART_DEMO_PIE_SIMPLE },
    {
      id: 'pie-separator-none',
      title: 'Separator None',
      component: ZardDemoChartPieSeparatorNoneComponent,
      codeData: CHART_DEMO_PIE_SEPARATOR_NONE,
    },
    { id: 'pie-label', title: 'Label', component: ZardDemoChartPieLabelComponent, codeData: CHART_DEMO_PIE_LABEL },
    {
      id: 'pie-label-custom',
      title: 'Label Custom',
      component: ZardDemoChartPieLabelCustomComponent,
      codeData: CHART_DEMO_PIE_LABEL_CUSTOM,
    },
    {
      id: 'pie-label-list',
      title: 'Label List',
      component: ZardDemoChartPieLabelListComponent,
      codeData: CHART_DEMO_PIE_LABEL_LIST,
    },
    { id: 'pie-legend', title: 'Legend', component: ZardDemoChartPieLegendComponent, codeData: CHART_DEMO_PIE_LEGEND },
    { id: 'pie-donut', title: 'Donut', component: ZardDemoChartPieDonutComponent, codeData: CHART_DEMO_PIE_DONUT },
    {
      id: 'pie-donut-active',
      title: 'Donut Active',
      component: ZardDemoChartPieDonutActiveComponent,
      codeData: CHART_DEMO_PIE_DONUT_ACTIVE,
    },
    {
      id: 'pie-donut-text',
      title: 'Donut Text',
      component: ZardDemoChartPieDonutTextComponent,
      codeData: CHART_DEMO_PIE_DONUT_TEXT,
    },
    {
      id: 'pie-stacked',
      title: 'Stacked',
      component: ZardDemoChartPieStackedComponent,
      codeData: CHART_DEMO_PIE_STACKED,
    },
    {
      id: 'pie-interactive',
      title: 'Interactive',
      component: ZardDemoChartPieInteractiveComponent,
      codeData: CHART_DEMO_PIE_INTERACTIVE,
    },
  ],
  radar: [
    {
      id: 'radar-default',
      title: 'Default',
      component: ZardDemoChartRadarDefaultComponent,
      codeData: CHART_DEMO_RADAR_DEFAULT,
    },
    { id: 'radar-dots', title: 'Dots', component: ZardDemoChartRadarDotsComponent, codeData: CHART_DEMO_RADAR_DOTS },
    {
      id: 'radar-lines-only',
      title: 'Lines Only',
      component: ZardDemoChartRadarLinesOnlyComponent,
      codeData: CHART_DEMO_RADAR_LINES_ONLY,
    },
    {
      id: 'radar-label-custom',
      title: 'Label Custom',
      component: ZardDemoChartRadarLabelCustomComponent,
      codeData: CHART_DEMO_RADAR_LABEL_CUSTOM,
    },
    {
      id: 'radar-grid-custom',
      title: 'Grid Custom',
      component: ZardDemoChartRadarGridCustomComponent,
      codeData: CHART_DEMO_RADAR_GRID_CUSTOM,
    },
    {
      id: 'radar-grid-none',
      title: 'Grid None',
      component: ZardDemoChartRadarGridNoneComponent,
      codeData: CHART_DEMO_RADAR_GRID_NONE,
    },
    {
      id: 'radar-grid-circle',
      title: 'Grid Circle',
      component: ZardDemoChartRadarGridCircleComponent,
      codeData: CHART_DEMO_RADAR_GRID_CIRCLE,
    },
    {
      id: 'radar-grid-circle-no-lines',
      title: 'Grid Circle No Lines',
      component: ZardDemoChartRadarGridCircleNoLinesComponent,
      codeData: CHART_DEMO_RADAR_GRID_CIRCLE_NO_LINES,
    },
    {
      id: 'radar-grid-circle-filled',
      title: 'Grid Circle Filled',
      component: ZardDemoChartRadarGridCircleFilledComponent,
      codeData: CHART_DEMO_RADAR_GRID_CIRCLE_FILLED,
    },
    {
      id: 'radar-grid-fill',
      title: 'Grid Filled',
      component: ZardDemoChartRadarGridFillComponent,
      codeData: CHART_DEMO_RADAR_GRID_FILL,
    },
    {
      id: 'radar-multiple',
      title: 'Multiple',
      component: ZardDemoChartRadarMultipleComponent,
      codeData: CHART_DEMO_RADAR_MULTIPLE,
    },
    {
      id: 'radar-legend',
      title: 'Legend',
      component: ZardDemoChartRadarLegendComponent,
      codeData: CHART_DEMO_RADAR_LEGEND,
    },
    {
      id: 'radar-radius-axis',
      title: 'Radius Axis',
      component: ZardDemoChartRadarRadiusAxisComponent,
      codeData: CHART_DEMO_RADAR_RADIUS_AXIS,
    },
  ],
  radial: [
    {
      id: 'radial-simple',
      title: 'Simple',
      component: ZardDemoChartRadialSimpleComponent,
      codeData: CHART_DEMO_RADIAL_SIMPLE,
    },
    {
      id: 'radial-label',
      title: 'Label',
      component: ZardDemoChartRadialLabelComponent,
      codeData: CHART_DEMO_RADIAL_LABEL,
    },
    { id: 'radial-grid', title: 'Grid', component: ZardDemoChartRadialGridComponent, codeData: CHART_DEMO_RADIAL_GRID },
    { id: 'radial-text', title: 'Text', component: ZardDemoChartRadialTextComponent, codeData: CHART_DEMO_RADIAL_TEXT },
    {
      id: 'radial-shape',
      title: 'Shape',
      component: ZardDemoChartRadialShapeComponent,
      codeData: CHART_DEMO_RADIAL_SHAPE,
    },
    {
      id: 'radial-stacked',
      title: 'Stacked',
      component: ZardDemoChartRadialStackedComponent,
      codeData: CHART_DEMO_RADIAL_STACKED,
    },
  ],
  tooltip: [
    {
      id: 'tooltip-default',
      title: 'Default',
      component: ZardDemoChartTooltipDefaultComponent,
      codeData: CHART_DEMO_TOOLTIP_DEFAULT,
    },
    {
      id: 'tooltip-indicator-line',
      title: 'Line Indicator',
      component: ZardDemoChartTooltipIndicatorLineComponent,
      codeData: CHART_DEMO_TOOLTIP_INDICATOR_LINE,
    },
    {
      id: 'tooltip-indicator-none',
      title: 'No Indicator',
      component: ZardDemoChartTooltipIndicatorNoneComponent,
      codeData: CHART_DEMO_TOOLTIP_INDICATOR_NONE,
    },
    {
      id: 'tooltip-label-custom',
      title: 'Custom Label',
      component: ZardDemoChartTooltipLabelCustomComponent,
      codeData: CHART_DEMO_TOOLTIP_LABEL_CUSTOM,
    },
    {
      id: 'tooltip-label-formatter',
      title: 'Label Formatter',
      component: ZardDemoChartTooltipLabelFormatterComponent,
      codeData: CHART_DEMO_TOOLTIP_LABEL_FORMATTER,
    },
    {
      id: 'tooltip-label-none',
      title: 'No Label',
      component: ZardDemoChartTooltipLabelNoneComponent,
      codeData: CHART_DEMO_TOOLTIP_LABEL_NONE,
    },
    {
      id: 'tooltip-formatter',
      title: 'Formatter',
      component: ZardDemoChartTooltipFormatterComponent,
      codeData: CHART_DEMO_TOOLTIP_FORMATTER,
    },
    {
      id: 'tooltip-icons',
      title: 'Icons',
      component: ZardDemoChartTooltipIconsComponent,
      codeData: CHART_DEMO_TOOLTIP_ICONS,
    },
    {
      id: 'tooltip-advanced',
      title: 'Advanced',
      component: ZardDemoChartTooltipAdvancedComponent,
      codeData: CHART_DEMO_TOOLTIP_ADVANCED,
    },
  ],
};
