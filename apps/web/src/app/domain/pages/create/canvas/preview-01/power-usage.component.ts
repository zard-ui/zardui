import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';
import { ZardChartImports, type ZardChartConfig, type ZardChartOptionOverride } from '@zard/components/chart';
import { ZardProgressComponent } from '@zard/components/progress';
import { ZardSeparatorComponent } from '@zard/components/separator';

import { injectRoundedBars } from './rounded-bars';

const CHART_DATA = [
  { hour: '6a', usage: 1.2 },
  { hour: '8a', usage: 2.8 },
  { hour: '10a', usage: 3.1 },
  { hour: '12p', usage: 2.4 },
  { hour: '2p', usage: 3.4 },
  { hour: '4p', usage: 2.9 },
  { hour: '6p', usage: 3.8 },
  { hour: '8p', usage: 3.2 },
] as const;

const CHART_CONFIG: ZardChartConfig = {
  usage: { label: 'Usage (kW)', color: 'var(--chart-2)' },
};

const CHART_OPTION: ZardChartOptionOverride = {
  grid: { left: 0, right: 0, top: 4, bottom: 0 },
  xAxis: { axisLabel: { margin: 6 } },
};

@Component({
  selector: 'z-preview-01-power-usage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardChartImports, ZardProgressComponent, ZardSeparatorComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Power Usage" />
        <z-card-description zDescription="Whole Home" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <z-chart
          zType="bar"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series()"
          zXAxisKey="hour"
          [zGrid]="false"
          [zOption]="option"
          class="h-[140px] w-full"
        >
          <z-chart-tooltip zHideLabel />
        </z-chart>
        <z-separator />
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-0.5">
            <span class="text-muted-foreground text-sm">Currently Using</span>
            <span class="text-lg font-semibold tabular-nums">3.4 kW</span>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-muted-foreground text-sm">Solar Gen</span>
            <span class="text-chart-1 text-lg font-semibold tabular-nums">+1.2 kW</span>
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col items-start gap-1">
        <span class="text-muted-foreground text-sm">Battery Level</span>
        <div class="flex w-full items-center gap-2">
          <z-progress [value]="85" class="flex-1" />
          <span class="text-sm font-medium tabular-nums">85%</span>
        </div>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01PowerUsageComponent {
  private readonly rounded = injectRoundedBars();

  protected readonly data = CHART_DATA;
  protected readonly config = CHART_CONFIG;
  protected readonly option = CHART_OPTION;
  protected readonly series = computed(() => [{ dataKey: 'usage', radius: this.rounded() ? [4, 4, 0, 0] : 0 }]);
}
