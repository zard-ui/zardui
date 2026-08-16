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
        <z-card-title zTitle="Line Chart - Custom Dots" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          [zOption]="customDots"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
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
export class ZardDemoChartLineDotsCustomComponent {
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

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', smooth: true, showSymbol: true }];

  /**
   * shadcn draws lucide's `git-commit-vertical` at every point: a hollow circle with a tick
   * above and below. The circle is the series' own symbol; the ticks ride along as mark points,
   * which stay out of the tooltip.
   */
  protected readonly customDots = {
    series: [
      {
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: 'var(--background)', borderColor: 'var(--chart-1)', borderWidth: 2 },
        markPoint: {
          symbol: 'path://M11,3 H13 V9 H11 Z M11,15 H13 V21 H11 Z',
          symbolSize: [2, 18],
          silent: true,
          label: { show: false },
          itemStyle: { color: 'var(--chart-1)' },
          data: this.chartData.map((row, index) => ({ coord: [index, row.desktop] })),
        },
      },
    ],
  } as unknown as ZardChartOptionOverride;

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
