import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardChartImports } from '@zard/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride, ZardChartSeries } from '@zard/components/chart/chart.types';

const SLEEP_CHART_DATA = [
  { hour: '10pm', deep: 0, light: 30, rem: 0 },
  { hour: '11pm', deep: 20, light: 10, rem: 0 },
  { hour: '12am', deep: 40, light: 0, rem: 10 },
  { hour: '1am', deep: 30, light: 5, rem: 15 },
  { hour: '2am', deep: 10, light: 20, rem: 30 },
  { hour: '3am', deep: 25, light: 10, rem: 20 },
  { hour: '4am', deep: 15, light: 25, rem: 10 },
  { hour: '5am', deep: 5, light: 35, rem: 15 },
  { hour: '6am', deep: 0, light: 20, rem: 25 },
];

const SLEEP_CHART_CONFIG: ZardChartConfig = {
  deep: { label: 'Deep', color: 'var(--chart-1)' },
  light: { label: 'Light', color: 'var(--chart-2)' },
  rem: { label: 'REM', color: 'var(--chart-3)' },
};

const SLEEP_SERIES: ZardChartSeries[] = [
  { dataKey: 'deep', stack: 'a', radius: 0 },
  { dataKey: 'light', stack: 'a', radius: 0 },
  { dataKey: 'rem', stack: 'a', radius: [2, 2, 0, 0] },
];

// recharts' `barSize={16}` and a zero margin.
const SLEEP_OPTION: ZardChartOptionOverride = {
  grid: { left: 0, right: 0, top: 0, bottom: 0 },
  series: [{ barWidth: 16 }, { barWidth: 16 }, { barWidth: 16 }],
};

const STATS = [
  { label: 'Deep', value: '2h 10m' },
  { label: 'Light', value: '3h 48m' },
  { label: 'REM', value: '1h 26m' },
  { label: 'Score', value: '84' },
] as const;

@Component({
  selector: 'z-preview-02-sleep-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardCardImports, ZardChartImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Sleep Report" />
        <z-card-description zDescription="Last night · 7h 24m" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-3">
        <z-chart
          zType="bar"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series"
          zXAxisKey="hour"
          [zXAxis]="false"
          [zGrid]="false"
          [zOption]="option"
          class="h-32 w-full"
        />

        <div class="grid grid-cols-4 gap-2">
          @for (stat of stats; track stat.label) {
            <div class="text-center">
              <div class="text-sm font-medium tabular-nums">{{ stat.value }}</div>
              <div class="text-muted-foreground text-xs">{{ stat.label }}</div>
            </div>
          }
        </div>
      </z-card-content>
      <z-card-footer>
        <z-badge zType="outline">Good</z-badge>
        <button type="button" z-button zType="outline" zSize="sm" class="ml-auto">Details</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02SleepReportComponent {
  protected readonly config = SLEEP_CHART_CONFIG;
  protected readonly data = SLEEP_CHART_DATA;
  protected readonly series = SLEEP_SERIES;
  protected readonly option = SLEEP_OPTION;
  protected readonly stats = STATS;
}
