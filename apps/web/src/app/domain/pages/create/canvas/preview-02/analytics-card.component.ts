import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardChartImports } from '@zard/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride, ZardChartSeries } from '@zard/components/chart/chart.types';

const CHART_DATA = [
  { month: 'January', visitors: 186 },
  { month: 'February', visitors: 305 },
  { month: 'March', visitors: 237 },
  { month: 'April', visitors: 73 },
  { month: 'May', visitors: 209 },
  { month: 'June', visitors: 214 },
];

const CHART_CONFIG: ZardChartConfig = {
  visitors: { label: 'Visitors', color: 'var(--chart-1)' },
};

const SERIES: ZardChartSeries[] = [{ dataKey: 'visitors', smooth: false, fillOpacity: 0.4 }];

// recharts' `margin={{ left: 0, right: 0 }}`: the area runs edge to edge.
const OPTION: ZardChartOptionOverride = { grid: { left: 0, right: 0 } };

@Component({
  selector: 'z-preview-02-analytics-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardCardImports, ZardChartImports],
  host: { class: 'block' },
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-sm data-[size=sm]:pb-0">
      <z-card-header>
        <z-card-title zTitle="Analytics" />
        <ng-template #visitors>
          418.2K Visitors
          <z-badge>+10%</z-badge>
        </ng-template>
        <z-card-description [zDescription]="visitors" />
        <z-card-action>
          <button type="button" z-button zType="outline" zSize="sm">View Analytics</button>
        </z-card-action>
      </z-card-header>
      <z-chart
        zType="area"
        [zConfig]="config"
        [zData]="data"
        [zSeries]="series"
        zXAxisKey="month"
        [zXAxis]="false"
        [zGrid]="false"
        [zOption]="option"
        class="aspect-[1/0.35]"
      >
        <z-chart-tooltip zIndicator="line" zHideLabel [zDefaultIndex]="2" />
      </z-chart>
    </z-card>
  `,
})
export class Preview02AnalyticsCardComponent {
  protected readonly config = CHART_CONFIG;
  protected readonly data = CHART_DATA;
  protected readonly series = SERIES;
  protected readonly option = OPTION;
}
