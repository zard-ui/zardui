import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Stacked" />
        <z-card-description zDescription="Desktop and mobile visitors side by side" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="month"
          zOuterRadius="55%"
          [zOption]="outerRing"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartPieStackedComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
  ];

  protected readonly series = ['desktop'];

  /** ECharts escape hatch: a second ring for the mobile split, around the desktop one. */
  protected readonly outerRing: ZardChartOptionOverride = {
    series: [
      {},
      {
        type: 'pie',
        radius: ['65%', '85%'],
        center: ['50%', '50%'],
        label: { show: false },
        itemStyle: { borderColor: 'var(--background)', borderWidth: 2 },
        data: [
          { name: 'January', value: 80 },
          { name: 'February', value: 200 },
          { name: 'March', value: 120 },
        ],
      },
    ],
  };
}
