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
        <z-card-title zTitle="Bar Chart - Negative" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxis]="false"
          zLabel
          [zOption]="monthLabels"
          class="w-full"
        >
          <z-chart-tooltip zHideLabel zHideIndicator />
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
export class ZardDemoChartBarNegativeComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors', color: 'var(--chart-1)' },
  };

  /** Losses get the second color and hang their label under the bar instead of over it. */
  private readonly negative = { fill: 'var(--chart-2)', label: { position: 'bottom' } };

  protected readonly chartData = [
    { month: 'January', visitors: 186, fill: 'var(--chart-1)' },
    { month: 'February', visitors: 205, fill: 'var(--chart-1)' },
    { month: 'March', visitors: -207, ...this.negative },
    { month: 'April', visitors: 173, fill: 'var(--chart-1)' },
    { month: 'May', visitors: -209, ...this.negative },
    { month: 'June', visitors: 214, fill: 'var(--chart-1)' },
  ];

  protected readonly series = ['visitors'];

  /** The month name rides the bar, in the bar's own color, instead of sitting on an axis. */
  protected readonly monthLabels: ZardChartOptionOverride = {
    series: [{ label: { formatter: '{b}', color: 'inherit', fontSize: 12 } }],
  };
}
