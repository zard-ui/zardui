import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';
import { ZardChartImports, type ZardChartConfig, type ZardChartSeries } from '@zard/components/chart';
import { ZardSeparatorComponent } from '@zard/components/separator';

const CHART_DATA = [
  { name: 'saved', value: 24000 },
  { name: 'remaining', value: 6000 },
] as const;

const CHART_CONFIG: ZardChartConfig = {
  saved: { label: 'Saved', color: 'var(--chart-2)' },
  remaining: { label: 'Remaining', color: 'var(--chart-1)' },
};

const CHART_SERIES: ZardChartSeries[] = [{ dataKey: 'value', strokeWidth: 0 }];

@Component({
  selector: 'z-preview-01-savings-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardChartImports, ZardSeparatorComponent],
  template: `
    <z-card>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series"
          zNameKey="name"
          [zInnerRadius]="70"
          [zOuterRadius]="95"
          zStartAngle="90"
          zEndAngle="-270"
          zCenterValue="$24,000"
          zCenterLabel="80% of $30,000"
          class="mx-auto aspect-square max-h-[220px]"
        >
          <z-chart-tooltip zTrigger="item" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col gap-0">
        <div class="flex w-full items-center justify-between py-3">
          <span class="text-muted-foreground text-sm">Projected Finish</span>
          <span class="text-sm font-semibold">October 2024</span>
        </div>
        <z-separator />
        <div class="flex w-full items-center justify-between py-3">
          <span class="text-muted-foreground text-sm">Monthly Average</span>
          <span class="text-sm font-semibold tabular-nums">$1,250</span>
        </div>
        <z-separator />
        <div class="flex w-full items-center justify-between py-3">
          <span class="text-muted-foreground text-sm">Top Contributor</span>
          <span class="text-sm font-semibold">Auto-Transfer</span>
        </div>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01SavingsProgressComponent {
  protected readonly data = CHART_DATA;
  protected readonly config = CHART_CONFIG;
  protected readonly series = CHART_SERIES;
}
