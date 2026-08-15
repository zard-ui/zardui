import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Radial Chart - Stacked" />
        <z-card-description zDescription="Desktop and mobile visitors for January" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="radial"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="month"
          zInnerRadius="60%"
          zOuterRadius="95%"
          [zStartAngle]="180"
          [zEndAngle]="0"
          zCenterValue="1,830"
          zCenterLabel="Visitors"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartRadialStackedComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [{ month: 'january', desktop: 1260, mobile: 570 }];

  protected readonly series = ['desktop', 'mobile'];
}
