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
        <z-card-title zTitle="Pie Chart - Donut Active" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="48%"
          [zPadAngle]="3"
          [zOption]="activeSlice"
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
export class ZardDemoChartPieDonutActiveComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'other', visitors: 90 },
  ];

  protected readonly series = ['visitors'];

  /**
   * ECharts sizes a pie per series, not per slice, so the highlighted browser — shadcn's
   * `activeIndex` — is a second pie holding only that slice, drawn wider over the first.
   */
  protected readonly activeSlice: ZardChartOptionOverride = {
    series: [
      {},
      {
        type: 'pie',
        radius: ['48%', '88%'],
        center: ['50%', '50%'],
        startAngle: 0,
        clockwise: false,
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        padAngle: 3,
        data: this.chartData.map((row, index) => ({
          value: row.visitors,
          name: row.browser,
          itemStyle: index === 0 ? { color: 'var(--chart-1)' } : { color: 'transparent' },
        })),
      },
    ],
  } as unknown as ZardChartOptionOverride;
}
