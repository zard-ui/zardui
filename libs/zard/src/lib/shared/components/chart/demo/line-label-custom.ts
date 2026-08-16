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
        <z-card-title zTitle="Line Chart - Custom Label" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="line"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="browser"
          [zXAxis]="false"
          zLabel
          [zOption]="customLabel"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" zNameKey="visitors" zHideLabel />
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
export class ZardDemoChartLineLabelCustomComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors', color: 'var(--chart-2)' },
    chrome: { label: 'Chrome' },
    safari: { label: 'Safari' },
    firefox: { label: 'Firefox' },
    edge: { label: 'Edge' },
    other: { label: 'Other' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'other', visitors: 90 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'visitors', smooth: true, showSymbol: true }];

  /** The browser's label, not its reading, rides above each point. */
  protected readonly customLabel: ZardChartOptionOverride = {
    series: [
      {
        label: {
          formatter: (params: { name: string }) => this.chartConfig[params.name]?.label ?? params.name,
          distance: 12,
          color: 'var(--foreground)',
          fontSize: 12,
        },
      },
    ],
  };
}
