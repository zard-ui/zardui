import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardChartImports } from '@zard/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@zard/components/chart/chart.types';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';

const PIE_CHART_DATA = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 287 },
  { browser: 'edge', visitors: 173 },
];

const PIE_CHART_CONFIG: ZardChartConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
};

const TOTAL_VISITORS = PIE_CHART_DATA.reduce((sum, item) => sum + item.visitors, 0);
const TOP_BROWSER = PIE_CHART_DATA.reduce((max, item) => (item.visitors > max.visitors ? item : max));
const TOP_BROWSER_SHARE = Math.round((TOP_BROWSER.visitors / TOTAL_VISITORS) * 100);
const TOP_BROWSER_LABEL = PIE_CHART_CONFIG[TOP_BROWSER.browser]?.label ?? 'Top';

@Component({
  selector: 'z-preview-02-pie-chart-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardCardImports, ZardChartImports, ZardProgressComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header class="pb-0">
        <z-card-title zTitle="Browser Share" />
        <z-card-description zDescription="January - June 2026" />
        <z-card-action>
          <z-badge zType="outline">{{ topBrowserLabel }}</z-badge>
        </z-card-action>
      </z-card-header>
      <z-card-content class="pt-0">
        <z-chart
          zType="pie"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series"
          zNameKey="browser"
          [zInnerRadius]="50"
          [zCenterValue]="totalVisitors"
          zCenterLabel="Visitors"
          class="mx-auto aspect-square max-h-[190px]"
        >
          <z-chart-tooltip zTrigger="item" zHideLabel />
          <z-chart-legend class="translate-y-2" />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-col items-stretch gap-2">
        <div class="flex items-center text-xs">
          <span class="font-medium">{{ topBrowserLabel }}</span>
          <span class="text-muted-foreground ml-auto tabular-nums">{{ topBrowserShare }}%</span>
        </div>
        <z-progress
          [value]="topBrowserShare"
          class="**:data-[slot=progress-indicator]:bg-chart-3"
          [attr.aria-label]="topBrowserLabel + ' share'"
        />
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02PieChartCardComponent {
  protected readonly config = PIE_CHART_CONFIG;
  protected readonly data = PIE_CHART_DATA;
  protected readonly series: ZardChartSeries[] = [{ dataKey: 'visitors', strokeWidth: 5 }];
  protected readonly totalVisitors = TOTAL_VISITORS.toLocaleString('en-US');
  protected readonly topBrowserLabel = TOP_BROWSER_LABEL;
  protected readonly topBrowserShare = TOP_BROWSER_SHARE;
}
