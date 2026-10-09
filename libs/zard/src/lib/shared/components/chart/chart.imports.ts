export { ZardChartLegendComponent } from './chart-legend.component';
export { ZardChartTooltipComponent } from './chart-tooltip.component';
export { ZardChartComponent } from './chart.component';

import { ZardChartLegendComponent } from './chart-legend.component';
import { ZardChartTooltipComponent } from './chart-tooltip.component';
import { ZardChartComponent } from './chart.component';

export const ZardChartImports = [ZardChartComponent, ZardChartTooltipComponent, ZardChartLegendComponent] as const;
