import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartTooltipIndicator } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Tooltip Indicators" />
        <z-card-description zDescription="The three indicator shapes, side by side" />
      </z-card-header>
      <z-card-content>
        <div class="grid gap-6 md:grid-cols-3">
          @for (indicator of indicators; track indicator) {
            <z-chart
              zType="bar"
              [zConfig]="chartConfig"
              [zData]="chartData"
              [zSeries]="series"
              zXAxisKey="month"
              [zXAxisFormatter]="shortMonth"
              class="h-[180px] w-full"
            >
              <z-chart-tooltip [zIndicator]="indicator" />
            </z-chart>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartTooltipIndicatorsComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop', 'mobile'];

  protected readonly indicators: ZardChartTooltipIndicator[] = ['dot', 'line', 'dashed'];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
