import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardChartImports } from '@zard/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride, ZardChartSeries } from '@zard/components/chart/chart.types';

const AREA_CHART_DATA = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const AREA_CHART_CONFIG: ZardChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
};

const LATEST = AREA_CHART_DATA[AREA_CHART_DATA.length - 1]?.desktop ?? 0;
const PREVIOUS = AREA_CHART_DATA[AREA_CHART_DATA.length - 2]?.desktop ?? LATEST;
const TREND_PERCENT = PREVIOUS === 0 ? 0 : Math.round(((LATEST - PREVIOUS) / PREVIOUS) * 100);

const SERIES: ZardChartSeries[] = [{ dataKey: 'desktop', smooth: true, fillOpacity: 0.15, strokeWidth: 2 }];

// recharts' `margin={{ left: 0, right: 0, top: 6, bottom: 0 }}`.
const OPTION: ZardChartOptionOverride = { grid: { left: 0, right: 0, top: 6, bottom: 0 } };

@Component({
  selector: 'z-preview-02-visitors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardCardImports, ZardChartImports],
  host: { class: 'block' },
  template: `
    <z-card class="pb-0">
      <z-card-header>
        <z-card-title zTitle="Visitors" />
        <z-card-description zDescription="Last 6 months " />
        <z-card-action>
          <z-badge [zType]="trendPercent >= 0 ? 'secondary' : 'destructive'">{{ trend }} vs last month</z-badge>
        </z-card-action>
      </z-card-header>
      <z-card-content class="px-0">
        <z-chart
          zType="area"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          [zXAxis]="false"
          [zGrid]="false"
          [zOption]="option"
          class="h-48 w-full"
        >
          <z-chart-tooltip zIndicator="line" />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02VisitorsComponent {
  protected readonly config = AREA_CHART_CONFIG;
  protected readonly data = AREA_CHART_DATA;
  protected readonly series = SERIES;
  protected readonly option = OPTION;
  protected readonly trendPercent = TREND_PERCENT;
  protected readonly trend = `${TREND_PERCENT > 0 ? '+' : ''}${TREND_PERCENT}%`;

  protected readonly shortMonth = (value: string) => String(value).slice(0, 3);
}
