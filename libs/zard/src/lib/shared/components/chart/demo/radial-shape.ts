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
        <z-card-title zTitle="Radial Chart - Shape" />
        <z-card-description zDescription="January - June 2024" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="radial"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="52%"
          zOuterRadius="76%"
          [zStartAngle]="0"
          [zEndAngle]="100"
          [zOption]="backdrop"
          zCenterValue="1,260"
          zCenterLabel="Visitors"
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
export class ZardDemoChartRadialShapeComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [{ browser: 'safari', visitors: 1260 }];

  protected readonly series = ['visitors'];

  /** The two discs shadcn paints with `first:fill-muted last:fill-background`. */
  private readonly disc = (radius: string, color: string) => ({
    type: 'pie',
    radius: ['0%', radius],
    center: ['50%', '50%'],
    data: [{ value: 1 }],
    itemStyle: { color },
    label: { show: false },
    labelLine: { show: false },
    silent: true,
    animation: false,
    z: 0,
  });

  protected readonly backdrop = {
    series: [{}, this.disc('69%', 'var(--muted)'), this.disc('59%', 'var(--background)')],
  } as unknown as ZardChartOptionOverride;
}
