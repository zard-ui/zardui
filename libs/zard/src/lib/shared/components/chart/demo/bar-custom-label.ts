import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Custom Label" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          zHorizontal
          [zXAxis]="false"
          [zGrid]="false"
          [zOption]="insideLabel"
          class="h-[250px] w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarCustomLabelComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', label: true }];

  /** ECharts escape hatch: move the value label inside the bar and print the month next to it. */
  protected readonly insideLabel: ZardChartOptionOverride = {
    series: [{ label: { position: 'insideLeft', color: '#fff', formatter: '{b}' } }],
  };
}
