import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Custom Label" />
        <z-card-description zDescription="January - June 2024" />
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
          zGrid="vertical"
          [zOption]="insideLabel"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartBarCustomLabelComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', label: true, radius: 4 }];

  /**
   * Two readings per bar — the month inside, the value outside — and ECharts allows one label per
   * series, so the month rides a second, invisible bar laid exactly over the first.
   */
  protected readonly insideLabel = {
    series: [
      { label: { position: 'right', distance: 8, color: 'var(--foreground)', fontSize: 12, formatter: '{c}' } },
      {
        type: 'bar',
        barGap: '-100%',
        silent: true,
        itemStyle: { color: 'transparent' },
        data: this.chartData.map(row => row.desktop),
        label: {
          show: true,
          position: 'insideLeft',
          distance: 8,
          color: 'var(--background)',
          fontSize: 12,
          formatter: (params: { dataIndex: number }) => this.chartData[params.dataIndex].month,
        },
      },
    ],
  } as unknown as ZardChartOptionOverride;
}
