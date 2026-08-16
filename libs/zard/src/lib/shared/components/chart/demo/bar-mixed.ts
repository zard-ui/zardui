import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, NgIcon],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Bar Chart - Mixed" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="browser"
          [zXAxisFormatter]="browserLabel"
          zHorizontal
          [zXAxis]="false"
          zYAxis
          [zGrid]="false"
          class="w-full"
        >
          <z-chart-tooltip zIndicator="line" zHideLabel />
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
export class ZardDemoChartBarMixedComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275, fill: 'var(--chart-1)' },
    { browser: 'safari', visitors: 200, fill: 'var(--chart-2)' },
    { browser: 'firefox', visitors: 187, fill: 'var(--chart-3)' },
    { browser: 'edge', visitors: 173, fill: 'var(--chart-4)' },
    { browser: 'other', visitors: 90, fill: 'var(--chart-5)' },
  ];

  protected readonly series = ['visitors'];

  protected readonly browserLabel = (value: string) => this.chartConfig[value]?.label ?? value;
}
