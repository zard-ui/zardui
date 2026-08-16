import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Stacked" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="month"
          zOuterRadius="48%"
          [zOption]="outerRing"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="h-4 w-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideTrendingUp })],
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
    { month: 'April', desktop: 173, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop'];

  /** ECharts escape hatch: a second ring for the mobile split, around the desktop one. */
  protected readonly outerRing: ZardChartOptionOverride = {
    series: [
      {},
      {
        type: 'pie',
        radius: ['56%', '72%'],
        center: ['50%', '50%'],
        startAngle: 0,
        clockwise: false,
        label: { show: false },
        data: this.chartData.map((row, index) => ({
          name: row.month,
          value: row.mobile,
          itemStyle: { color: `var(--chart-${(index % 5) + 1})` },
        })),
      },
    ],
  };
}
