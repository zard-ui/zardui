import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Tooltip - Custom label" />
        <z-card-description zDescription="Tooltip with custom label from zConfig." />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="date"
          [zXAxisFormatter]="weekday"
          zStacked
          class="w-full"
        >
          <z-chart-tooltip zLabelKey="activities" zIndicator="line" [zDefaultIndex]="1" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartTooltipLabelCustomComponent {
  protected readonly chartConfig: ZardChartConfig = {
    activities: { label: 'Activities' },
    running: { label: 'Running', color: 'var(--chart-1)' },
    swimming: { label: 'Swimming', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { date: '2024-07-15', running: 450, swimming: 300 },
    { date: '2024-07-16', running: 380, swimming: 420 },
    { date: '2024-07-17', running: 520, swimming: 120 },
    { date: '2024-07-18', running: 140, swimming: 550 },
    { date: '2024-07-19', running: 600, swimming: 350 },
    { date: '2024-07-20', running: 480, swimming: 400 },
  ];

  protected readonly series: ZardChartSeries[] = [
    { dataKey: 'running', radius: [0, 0, 4, 4] },
    { dataKey: 'swimming', radius: [4, 4, 0, 0] },
  ];

  protected readonly weekday = (value: string) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' });
}
