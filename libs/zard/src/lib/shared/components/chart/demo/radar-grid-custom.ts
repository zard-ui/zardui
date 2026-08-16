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
        <z-card-title zTitle="Radar Chart - Grid Custom" />
        <z-card-description zDescription="Showing total visitors for the last 6 months" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="radar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="month"
          [zRadarRadialLines]="false"
          [zOption]="singleRing"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col gap-2 bg-transparent px-4 pt-0 pb-4 text-sm">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <ng-icon name="lucideTrendingUp" class="size-4" />
        </div>
        <div class="text-muted-foreground leading-none">January - June 2024</div>
      </z-card-footer>
    </z-card>
  `,
  providers: [provideIcons({ lucideTrendingUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartRadarGridCustomComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 273 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'desktop', fillOpacity: 0.6 }];

  /** A single outer ring instead of the default ladder of split lines. */
  protected readonly singleRing: ZardChartOptionOverride = { radar: { splitNumber: 1 } };
}
