import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Negative" />
        <z-card-description zDescription="Showing the visitor delta for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarNegativeComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', visitors: 186 },
    { month: 'February', visitors: 305 },
    { month: 'March', visitors: -237 },
    { month: 'April', visitors: 73 },
    { month: 'May', visitors: -209 },
    { month: 'June', visitors: 214 },
  ];

  protected readonly series = ['visitors'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
