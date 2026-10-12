import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import {
  ZardChartImports,
  type ZardChartConfig,
  type ZardChartOptionOverride,
  type ZardChartSeries,
} from '@zard/components/chart';

const ACTIVITY_DATA = [
  { month: 'Jan', amount: 40 },
  { month: 'Feb', amount: 55 },
  { month: 'Mar', amount: 35 },
  { month: 'Apr', amount: 60 },
  { month: 'May', amount: 45 },
  { month: 'Jun', amount: 50 },
  { month: 'Jul', amount: 65 },
  { month: 'Aug', amount: 40 },
  { month: 'Sep', amount: 55 },
  { month: 'Oct', amount: 70 },
  { month: 'Nov', amount: 45 },
  { month: 'Dec', amount: 80 },
] as const;

const CHART_CONFIG: ZardChartConfig = {
  amount: { label: 'Activity', color: 'var(--chart-2)' },
};

const CHART_SERIES: ZardChartSeries[] = [{ dataKey: 'amount', radius: [3, 3, 0, 0] }];

const CHART_OPTION: ZardChartOptionOverride = {
  grid: { left: 0, right: 0, top: 4, bottom: 0 },
  xAxis: { axisLabel: { margin: 4, fontSize: 10, interval: 0, hideOverlap: false } },
};

@Component({
  selector: 'z-preview-01-card-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardChartImports, ZardBadgeComponent, ZardButtonComponent],
  template: `
    <div class="grid grid-cols-2 gap-3">
      <z-card>
        <z-card-content>
          <z-card-description zDescription="Card Balance" />
          <z-card-title class="text-2xl tabular-nums" zTitle="US$12.94" />
          <z-card-description class="tabular-nums" zDescription="US$11,337.06 Available" />
        </z-card-content>
      </z-card>
      <z-card class="flex flex-col justify-between">
        <z-card-content class="flex flex-1 flex-col justify-between">
          <div class="flex flex-col gap-1">
            <z-card-description zDescription="Payment Due" />
            <z-card-title class="text-2xl" zTitle="1 Apr" />
          </div>
          <button type="button" z-button zType="outline" zSize="sm" class="mt-3 w-full">Pay Early</button>
        </z-card-content>
      </z-card>
      <z-card class="col-span-2">
        <z-card-content class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <z-card-description zDescription="Yearly Activity" />
            <z-badge zType="secondary">+US$0.25 Daily Cash</z-badge>
          </div>
          <z-chart
            zType="bar"
            [zConfig]="config"
            [zData]="data"
            [zSeries]="series"
            zXAxisKey="month"
            [zXAxisFormatter]="initial"
            [zGrid]="false"
            [zOption]="option"
            class="h-20 w-full"
          >
            <z-chart-tooltip zHideLabel />
          </z-chart>
        </z-card-content>
      </z-card>
    </div>
  `,
})
export class Preview01CardOverviewComponent {
  protected readonly data = ACTIVITY_DATA;
  protected readonly config = CHART_CONFIG;
  protected readonly series = CHART_SERIES;
  protected readonly option = CHART_OPTION;
  protected readonly initial = (value: string) => value.slice(0, 1);
}
